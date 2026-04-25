"""Backend regression tests for Umrah Companion API.
Covers /api/chat, /api/gates*, /api/group/*, /api/progress.
"""
import os
import pytest
import requests

BASE_URL = os.environ.get("REACT_APP_BACKEND_URL", "https://umrah-step-by-step.preview.emergentagent.com").rstrip("/")
API = f"{BASE_URL}/api"


@pytest.fixture(scope="module")
def s():
    sess = requests.Session()
    sess.headers.update({"Content-Type": "application/json"})
    return sess


# --- Health ---
def test_root(s):
    r = s.get(f"{API}/")
    assert r.status_code == 200
    assert r.json().get("status") == "ok"


# --- Gates ---
def test_list_gates(s):
    r = s.get(f"{API}/gates")
    assert r.status_code == 200
    data = r.json()
    assert isinstance(data, list) and len(data) >= 10
    assert {"id", "name_en", "name_ar", "lat", "lng"}.issubset(data[0].keys())


def test_nearest_gate(s):
    # Mecca city center-ish coords
    r = s.post(f"{API}/gates/nearest", json={"lat": 21.4225, "lng": 39.8262})
    assert r.status_code == 200
    data = r.json()
    assert "gate" in data and "distance_km" in data and "bearing_deg" in data
    assert data["gate"]["id"] in [g["id"] for g in s.get(f"{API}/gates").json()]
    assert isinstance(data["others"], list)


def test_nearest_gate_invalid(s):
    r = s.post(f"{API}/gates/nearest", json={"lat": "x"})
    assert r.status_code in (400, 422)


# --- Chat (Claude Sonnet via Emergent) ---
def test_chat_reply(s):
    payload = {
        "session_id": "TEST_pytest_session_1",
        "message": "In one short sentence: what is Tawaf?",
        "language": "en",
    }
    r = s.post(f"{API}/chat", json=payload, timeout=60)
    assert r.status_code == 200, r.text
    data = r.json()
    assert data["session_id"] == payload["session_id"]
    assert isinstance(data["reply"], str) and len(data["reply"].strip()) > 0


def test_chat_history_no_objectid(s):
    # ensure GET messages excludes _id
    r = s.get(f"{API}/chat/TEST_pytest_session_1/messages")
    assert r.status_code == 200
    msgs = r.json()
    assert isinstance(msgs, list) and len(msgs) >= 2
    for m in msgs:
        assert "_id" not in m
        assert m["role"] in ("user", "assistant")


# --- Progress ---
def test_progress_upsert_and_get(s):
    uid = "TEST_pytest_user"
    r = s.put(f"{API}/progress", json={"user_id": uid, "step": "tawaf", "tawaf_count": 3})
    assert r.status_code == 200
    g = s.get(f"{API}/progress/{uid}")
    assert g.status_code == 200
    body = g.json()
    assert body["step"] == "tawaf"
    assert body["tawaf_count"] == 3


# --- Group ---
def test_group_create_join_checkin_get(s):
    c = s.post(f"{API}/group/create")
    assert c.status_code == 200
    code = c.json()["code"]
    assert len(code) == 6

    j = s.post(f"{API}/group/join", json={"code": code})
    assert j.status_code == 200

    chk = s.put(
        f"{API}/group/{code}/checkin",
        json={"user_id": "TEST_u1", "name": "TEST_Ali", "tawaf_count": 2, "sai_count": 0},
    )
    assert chk.status_code == 200

    g = s.get(f"{API}/group/{code}")
    assert g.status_code == 200
    body = g.json()
    assert body["code"] == code
    assert any(m.get("user_id") == "TEST_u1" for m in body["members"])


def test_group_join_unknown(s):
    r = s.post(f"{API}/group/join", json={"code": "NOPE99"})
    assert r.status_code == 404
