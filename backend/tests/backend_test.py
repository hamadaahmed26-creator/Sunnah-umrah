"""Backend regression tests for Umrah Companion API.
Covers /api/chat, /api/gates*, /api/group/*, /api/progress.
"""
import os
import pytest
import requests

BASE_URL = os.environ.get("UMRAH_TEST_BASE_URL", "").rstrip("/")
pytestmark = pytest.mark.skipif(not BASE_URL, reason="Set UMRAH_TEST_BASE_URL to an isolated test backend")
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


@pytest.mark.parametrize("method,path", [
    ("get", "/chat/unused/messages"), ("post", "/chat"),
    ("put", "/progress"), ("get", "/progress/unused"),
    ("get", "/group/unused"), ("post", "/group/create"),
])
def test_retired_routes(s, method, path):
    assert s.request(method, f"{API}{path}").status_code == 404


# --- Sadaqah / Stripe Checkout ---
ORIGIN = BASE_URL


def _assert_stripe_checkout_response(data):
    assert "url" in data and "session_id" in data
    assert isinstance(data["url"], str) and isinstance(data["session_id"], str)
    assert data["url"].startswith("https://checkout.stripe.com/")
    assert data["session_id"].startswith("cs_test_")


def test_sadaqah_checkout_small(s):
    r = s.post(f"{API}/sadaqah/checkout", json={"package": "small", "origin_url": ORIGIN}, timeout=30)
    assert r.status_code == 200, r.text
    data = r.json()
    _assert_stripe_checkout_response(data)
    # store for later test
    pytest.SADAQAH_SMALL_SESSION = data["session_id"]


def test_sadaqah_checkout_medium(s):
    r = s.post(f"{API}/sadaqah/checkout", json={"package": "medium", "origin_url": ORIGIN}, timeout=30)
    assert r.status_code == 200, r.text
    _assert_stripe_checkout_response(r.json())


def test_sadaqah_checkout_large(s):
    r = s.post(f"{API}/sadaqah/checkout", json={"package": "large", "origin_url": ORIGIN}, timeout=30)
    assert r.status_code == 200, r.text
    _assert_stripe_checkout_response(r.json())


def test_sadaqah_checkout_custom_valid(s):
    r = s.post(
        f"{API}/sadaqah/checkout",
        json={"package": "custom", "custom_amount": 15.50, "origin_url": ORIGIN},
        timeout=30,
    )
    assert r.status_code == 200, r.text
    _assert_stripe_checkout_response(r.json())


def test_sadaqah_checkout_custom_below_min_rejected(s):
    r = s.post(
        f"{API}/sadaqah/checkout",
        json={"package": "custom", "custom_amount": 0.50, "origin_url": ORIGIN},
        timeout=15,
    )
    assert r.status_code in (400, 422), r.text


def test_sadaqah_checkout_custom_above_max_rejected(s):
    r = s.post(
        f"{API}/sadaqah/checkout",
        json={"package": "custom", "custom_amount": 1500.00, "origin_url": ORIGIN},
        timeout=15,
    )
    assert r.status_code in (400, 422), r.text


def test_sadaqah_checkout_unknown_package_rejected(s):
    r = s.post(
        f"{API}/sadaqah/checkout",
        json={"package": "huge", "origin_url": ORIGIN},
        timeout=15,
    )
    assert r.status_code == 400, r.text


def test_sadaqah_checkout_custom_missing_amount_rejected(s):
    r = s.post(
        f"{API}/sadaqah/checkout",
        json={"package": "custom", "origin_url": ORIGIN},
        timeout=15,
    )
    assert r.status_code == 400, r.text


def test_sadaqah_status(s):
    sid = getattr(pytest, "SADAQAH_SMALL_SESSION", None)
    if not sid:
        pytest.skip("no session id from earlier test")
    r = s.get(f"{API}/sadaqah/status/{sid}", timeout=30)
    assert r.status_code == 200, r.text
    data = r.json()
    assert "status" in data and "payment_status" in data
    # New session is unpaid
    assert data["payment_status"] in ("unpaid", "no_payment_required", "paid", "pending")


def test_sadaqah_db_row_created(s):
    """Verify the DB row is created with status='initiated', payment_status='pending'.
    We cannot connect to mongo from here without env, so use the status endpoint
    indirectly: the create response gives us a session_id, and we read MongoDB via motor.
    """
    import asyncio
    from motor.motor_asyncio import AsyncIOMotorClient

    mongo_url = os.environ.get("MONGO_URL", "mongodb://localhost:27017")
    db_name = os.environ.get("DB_NAME", "test_database")

    # create a fresh session
    r = s.post(f"{API}/sadaqah/checkout", json={"package": "medium", "origin_url": ORIGIN}, timeout=30)
    assert r.status_code == 200
    sid = r.json()["session_id"]

    async def _check():
        client = AsyncIOMotorClient(mongo_url)
        try:
            doc = await client[db_name].payment_transactions.find_one({"session_id": sid}, {"_id": 0})
            return doc
        finally:
            client.close()

    doc = asyncio.get_event_loop().run_until_complete(_check()) if not asyncio.get_event_loop().is_running() else None
    if doc is None:
        # fallback for environments where loop already running
        doc = asyncio.new_event_loop().run_until_complete(_check())
    assert doc is not None, "payment_transactions row not created"
    assert doc["status"] == "initiated"
    assert doc["payment_status"] == "pending"
    assert doc["amount"] == 7.00
    assert doc["package"] == "medium"
    assert doc["currency"] == "usd"
