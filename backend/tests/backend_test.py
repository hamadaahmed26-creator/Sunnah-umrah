"""Umrah Companion API backend tests."""
import os
import uuid
import time
import pytest
import requests

BASE_URL = os.environ.get("REACT_APP_BACKEND_URL", "https://umrah-step-by-step.preview.emergentagent.com").rstrip("/")
API = f"{BASE_URL}/api"


@pytest.fixture(scope="module")
def session_id():
    return f"TEST_sess_{uuid.uuid4().hex[:8]}"


# ---------- Health ----------
def test_root_ok():
    r = requests.get(f"{API}/", timeout=20)
    assert r.status_code == 200
    body = r.json()
    assert body.get("status") == "ok"


# ---------- Gates ----------
def test_gates_list():
    r = requests.get(f"{API}/gates", timeout=20)
    assert r.status_code == 200
    gates = r.json()
    assert isinstance(gates, list)
    assert len(gates) == 12
    g = gates[0]
    for key in ("name_en", "name_ar", "number", "lat", "lng"):
        assert key in g, f"missing key {key}"


def test_gates_nearest():
    r = requests.post(f"{API}/gates/nearest", json={"lat": 21.4225, "lng": 39.8262}, timeout=20)
    assert r.status_code == 200
    data = r.json()
    assert "gate" in data
    assert "distance_km" in data
    assert "bearing_deg" in data
    assert "others" in data and isinstance(data["others"], list)
    assert len(data["others"]) == 5
    # gate sub-fields
    for key in ("name_en", "name_ar", "number", "lat", "lng"):
        assert key in data["gate"]
    # distances should be sorted ascending in others
    dists = [o["distance_km"] for o in data["others"]]
    assert dists == sorted(dists)
    # nearest distance <= first of others
    assert data["distance_km"] <= dists[0] + 1e-6


# ---------- Chat (Claude Sonnet 4.5 via emergentintegrations) ----------
def test_chat_en(session_id):
    r = requests.post(
        f"{API}/chat",
        json={"session_id": session_id, "message": "What is the first step of Umrah?", "language": "en"},
        timeout=90,
    )
    assert r.status_code == 200, r.text
    data = r.json()
    assert data["session_id"] == session_id
    assert isinstance(data["reply"], str)
    assert len(data["reply"]) > 10


def test_chat_ar(session_id):
    r = requests.post(
        f"{API}/chat",
        json={"session_id": session_id, "message": "ما هي الخطوة الأولى للعمرة؟", "language": "ar"},
        timeout=90,
    )
    assert r.status_code == 200, r.text
    data = r.json()
    assert isinstance(data["reply"], str)
    assert len(data["reply"]) > 5


def test_chat_history_persisted(session_id):
    # small wait to ensure write
    time.sleep(1)
    r = requests.get(f"{API}/chat/{session_id}/messages", timeout=20)
    assert r.status_code == 200
    msgs = r.json()
    assert isinstance(msgs, list)
    # 2 prior tests inserted 2 user + 2 assistant = 4 messages
    assert len(msgs) >= 4
    # No _id field exposed
    for m in msgs:
        assert "_id" not in m
        assert m["role"] in ("user", "assistant")
        assert "content" in m and m["session_id"] == session_id
    # First message should be user
    assert msgs[0]["role"] == "user"


# ---------- Progress ----------
def test_progress_upsert_and_get():
    uid = f"TEST_u_{uuid.uuid4().hex[:6]}"
    r = requests.put(f"{API}/progress", json={"user_id": uid, "tawaf_count": 3}, timeout=20)
    assert r.status_code == 200
    assert r.json().get("ok") is True

    r2 = requests.get(f"{API}/progress/{uid}", timeout=20)
    assert r2.status_code == 200
    doc = r2.json()
    assert doc["user_id"] == uid
    assert doc["tawaf_count"] == 3
    assert "_id" not in doc

    # update again with sai_count
    r3 = requests.put(f"{API}/progress", json={"user_id": uid, "sai_count": 5, "step": "sai"}, timeout=20)
    assert r3.status_code == 200

    r4 = requests.get(f"{API}/progress/{uid}", timeout=20)
    assert r4.status_code == 200
    doc2 = r4.json()
    assert doc2["sai_count"] == 5
    assert doc2["step"] == "sai"
    # tawaf_count should still be 3 (upsert with $set)
    assert doc2["tawaf_count"] == 3


def test_progress_default_for_new_user():
    uid = f"TEST_new_{uuid.uuid4().hex[:6]}"
    r = requests.get(f"{API}/progress/{uid}", timeout=20)
    assert r.status_code == 200
    doc = r.json()
    assert doc["step"] == "ihram"
    assert doc["tawaf_count"] == 0
    assert doc["sai_count"] == 0
