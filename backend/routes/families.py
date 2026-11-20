"""Opt-in family check-ins. A group never accepts or stores coordinates."""
from datetime import datetime, timedelta, timezone
from hashlib import sha256
import re
import secrets
from typing import Literal

from fastapi import APIRouter, Header, HTTPException, Request, Response
from pydantic import BaseModel, ConfigDict, Field

LIFETIME = timedelta(days=14)
MAX_MEMBERS = 12


class MemberName(BaseModel):
    model_config = ConfigDict(extra="forbid", str_strip_whitespace=True)
    name: str = Field(min_length=1, max_length=45)


class Invitation(MemberName):
    code: str = Field(pattern=r"^[0-9a-f]{24}$")
    invite: str = Field(pattern=r"^[a-zA-Z0-9_-]{43}$")


class Checkin(BaseModel):
    model_config = ConfigDict(extra="forbid")
    status: Literal["together", "meeting_point", "need_call"]


def digest(token):
    return sha256(token.encode("ascii")).hexdigest()


def member_key(authorization):
    match = re.fullmatch(r"Bearer ([a-zA-Z0-9_-]{43})", authorization or "")
    if not match:
        raise HTTPException(401, "Member credential required")
    return digest(match.group(1))


def active(code):
    return {"_id": code, "expires_at": {"$gt": datetime.now(timezone.utc)}}


def private(response):
    response.headers["Cache-Control"] = "private, no-store"


def new_member(name):
    return {"name": name, "status": None, "updated_at": datetime.now(timezone.utc)}


def family_router(groups, check_creation_limit):
    router = APIRouter(prefix="/families")

    @router.post("")
    async def create(body: MemberName, request: Request, response: Response):
        check_creation_limit(request)
        private(response)
        code = secrets.token_hex(12)
        invite = secrets.token_urlsafe(32)
        token = secrets.token_urlsafe(32)
        key = digest(token)
        await groups.insert_one({
            "_id": code, "invite_hash": digest(invite), "owner": key,
            "expires_at": datetime.now(timezone.utc) + LIFETIME,
            "members": {key: new_member(body.name)}, "available": MAX_MEMBERS - 1,
        })
        return {"code": code, "invite": invite, "token": token}

    @router.post("/join")
    async def join(body: Invitation, response: Response):
        private(response)
        token = secrets.token_urlsafe(32)
        key = digest(token)
        query = {**active(body.code), "invite_hash": digest(body.invite), "available": {"$gt": 0}}
        result = await groups.update_one(query, {
            "$set": {f"members.{key}": new_member(body.name)}, "$inc": {"available": -1},
        })
        if not result.matched_count:
            raise HTTPException(404, "Invitation unavailable")
        return {"code": body.code, "token": token}

    @router.get("/{code}")
    async def roster(code: str, response: Response, authorization: str = Header(default="")):
        private(response)
        key = member_key(authorization)
        group = await groups.find_one({**active(code), f"members.{key}": {"$exists": True}})
        if group is None:
            raise HTTPException(404, "Membership unavailable")
        return {"members": [
            {**member, "self": member_id == key} for member_id, member in group["members"].items()
        ], "expires_at": group["expires_at"]}

    @router.put("/{code}/checkin")
    async def checkin(code: str, body: Checkin, response: Response, authorization: str = Header(default="")):
        private(response)
        field = f"members.{member_key(authorization)}"
        result = await groups.update_one({**active(code), field: {"$exists": True}}, {
            "$set": {f"{field}.status": body.status, f"{field}.updated_at": datetime.now(timezone.utc)},
        })
        if not result.matched_count:
            raise HTTPException(404, "Membership unavailable")
        return {"ok": True}

    @router.post("/{code}/invite")
    async def replace_invite(code: str, response: Response, authorization: str = Header(default="")):
        private(response)
        key = member_key(authorization)
        invite = secrets.token_urlsafe(32)
        result = await groups.update_one({
            **active(code), "owner": key, f"members.{key}": {"$exists": True},
        }, {"$set": {"invite_hash": digest(invite)}})
        if not result.matched_count:
            raise HTTPException(404, "Owner membership unavailable")
        return {"invite": invite}

    @router.delete("/{code}/me")
    async def leave(code: str, response: Response, authorization: str = Header(default="")):
        private(response)
        key = member_key(authorization)
        field = f"members.{key}"
        # Leaving as owner closes the invitation. Remaining members can still check in.
        query = {**active(code), field: {"$exists": True}}
        owner_result = await groups.update_one({**query, "owner": key}, {
            "$unset": {field: "", "invite_hash": "", "owner": ""}, "$inc": {"available": 1},
        })
        if not owner_result.matched_count:
            await groups.update_one(query, {"$unset": {field: ""}, "$inc": {"available": 1}})
        return {"ok": True}

    return router
