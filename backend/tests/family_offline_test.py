"""From backend: python -m unittest discover -s tests -p family_offline_test.py -v

Uses mongomock-motor for Mongo query semantics and HTTPX ASGITransport in memory.
No network listener, API keys, payment processor or Mongo service is required.
"""
from datetime import datetime, timedelta, timezone
from unittest import IsolatedAsyncioTestCase

from fastapi import FastAPI
from httpx import ASGITransport, AsyncClient
from mongomock_motor import AsyncMongoMockClient

from routes.families import MAX_MEMBERS, family_router


class FamilyTests(IsolatedAsyncioTestCase):
    async def asyncSetUp(self):
        self.db = AsyncMongoMockClient().test
        self.groups = self.db.family_checkins_v2
        app = FastAPI()
        app.include_router(family_router(self.groups, lambda request: None), prefix="/api")
        self.client = AsyncClient(transport=ASGITransport(app=app), base_url="http://test")
        self.path = "/api/families"
        result = await self.client.post(self.path, json={"name": "Owner"})
        self.assertEqual(result.status_code, 200, result.text)
        self.owner = result.json()
        self.group = self.path + "/" + self.owner["code"]

    async def asyncTearDown(self):
        await self.client.aclose()

    def auth(self, session):
        return {"Authorization": "Bearer " + session["token"]}

    async def join(self, invite=None):
        return await self.client.post(self.path + "/join", json={
            "code": self.owner["code"], "invite": invite or self.owner["invite"], "name": "Relative",
        })

    async def test_private_roster_and_explicit_checkin(self):
        result = await self.join()
        self.assertEqual(result.status_code, 200, result.text)
        member = result.json()
        self.assertNotIn("invite", member)
        update = await self.client.put(self.group + "/checkin", json={"status": "meeting_point"}, headers=self.auth(member))
        self.assertEqual(update.status_code, 200)
        roster = await self.client.get(self.group, headers=self.auth(self.owner))
        self.assertIn("no-store", roster.headers["cache-control"])
        records = roster.json()["members"]
        self.assertEqual([(m["name"], m["status"], m["self"]) for m in records], [
            ("Owner", None, True), ("Relative", "meeting_point", False),
        ])
        for m in records:
            self.assertEqual(set(m), {"name", "status", "self", "updated_at"})
        stored = str(await self.groups.find_one({}))
        for token in (self.owner["token"], self.owner["invite"], member["token"]):
            self.assertNotIn(token, stored)

    async def test_guards_identity_and_coordinates(self):
        self.assertEqual((await self.client.get(self.group)).status_code, 401)
        self.assertEqual((await self.client.get(self.group, headers=self.auth({"token": self.owner["invite"]}))).status_code, 404)
        for extra in ({"lat": 0, "lng": 0}, {"user_id": "other"}):
            result = await self.client.put(self.group + "/checkin", headers=self.auth(self.owner),
                                           json={"status": "together", **extra})
            self.assertEqual(result.status_code, 422)
        self.assertEqual((await self.client.post(self.path + "/join", json={"code": self.owner["code"], "name": "New"})).status_code, 422)

    async def test_rotation_leave_and_retry(self):
        member = (await self.join()).json()
        self.assertEqual((await self.client.post(self.group + "/invite", headers=self.auth(member))).status_code, 404)
        new = (await self.client.post(self.group + "/invite", headers=self.auth(self.owner))).json()["invite"]
        self.assertEqual((await self.join()).status_code, 404)
        for _ in range(2):
            self.assertEqual((await self.client.delete(self.group + "/me", headers=self.auth(member))).status_code, 200)
        self.assertEqual((await self.groups.find_one({}))["available"], MAX_MEMBERS - 1)
        self.assertEqual((await self.client.get(self.group, headers=self.auth(member))).status_code, 404)
        self.assertEqual((await self.join(new)).status_code, 200)
        await self.client.delete(self.group + "/me", headers=self.auth(self.owner))
        self.assertEqual((await self.join(new)).status_code, 404)

    async def test_group_expiry_blocks_read_and_write_before_ttl_cleanup(self):
        await self.groups.update_one({}, {"$set": {"expires_at": datetime.now(timezone.utc) - timedelta(seconds=1)}})
        self.assertEqual((await self.client.get(self.group, headers=self.auth(self.owner))).status_code, 404)
        self.assertEqual((await self.client.put(self.group + "/checkin", headers=self.auth(self.owner), json={"status": "together"})).status_code, 404)
        self.assertEqual((await self.join()).status_code, 404)

    async def test_capacity_and_cross_group_isolation(self):
        new = (await self.client.post(self.path, json={"name": "Another owner"})).json()
        self.assertEqual((await self.client.get(self.group, headers=self.auth(new))).status_code, 404)
        for _ in range(MAX_MEMBERS - 1):
            self.assertEqual((await self.join()).status_code, 200)
        self.assertEqual((await self.join()).status_code, 404)
