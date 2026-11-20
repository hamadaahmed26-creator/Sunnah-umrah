from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
import math
from pathlib import Path
from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime, timezone

from emergentintegrations.payments.stripe.checkout import (
    StripeCheckout,
    CheckoutSessionRequest,
)
from fastapi import Request

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

STRIPE_API_KEY = os.environ.get('STRIPE_API_KEY', '')

# Fixed Sadaqah amounts (USD). Backend-controlled to prevent price tampering.
# Custom amount is also allowed via the "custom" key — frontend passes the chosen
# amount and we clamp it to a min/max range here on the server.
SADAQAH_PACKAGES = {
    "small":  3.00,
    "medium": 7.00,
    "large":  20.00,
}
SADAQAH_CUSTOM_MIN = 1.00
SADAQAH_CUSTOM_MAX = 1000.00

# Static gate data — Masjid al-Haram main gates (King Abdul Aziz / Bab numbers)
# Coordinates approximate; sourced from public OSM/Saudi Hajj sources.
GATES = [
    {"id": 1,  "name_en": "King Abdulaziz Gate (Bab al-Malik Abdulaziz)", "name_ar": "باب الملك عبد العزيز", "number": "1",   "lat": 21.42155, "lng": 39.82490},
    {"id": 2,  "name_en": "Bab al-Salam (Gate of Peace)",               "name_ar": "باب السلام",         "number": "24",  "lat": 21.42283, "lng": 39.82697},
    {"id": 3,  "name_en": "Bab al-Fath (Gate of Victory)",              "name_ar": "باب الفتح",          "number": "45",  "lat": 21.42376, "lng": 39.82584},
    {"id": 4,  "name_en": "Bab Umrah",                                  "name_ar": "باب العمرة",         "number": "62",  "lat": 21.42350, "lng": 39.82420},
    {"id": 5,  "name_en": "King Fahd Gate (Bab al-Malik Fahd)",         "name_ar": "باب الملك فهد",      "number": "79",  "lat": 21.42235, "lng": 39.82340},
    {"id": 6,  "name_en": "Bab al-Umm Hani",                            "name_ar": "باب أم هانئ",        "number": "94",  "lat": 21.42105, "lng": 39.82340},
    {"id": 7,  "name_en": "Bab Ajyad",                                  "name_ar": "باب أجياد",          "number": "5",   "lat": 21.42080, "lng": 39.82570},
    {"id": 8,  "name_en": "Bab al-Safa",                                "name_ar": "باب الصفا",          "number": "11",  "lat": 21.42135, "lng": 39.82660},
    {"id": 9,  "name_en": "Bab Bani Shaybah",                           "name_ar": "باب بني شيبة",       "number": "23",  "lat": 21.42235, "lng": 39.82665},
    {"id": 10, "name_en": "Bab al-Marwah",                              "name_ar": "باب المروة",         "number": "67",  "lat": 21.42350, "lng": 39.82390},
    {"id": 11, "name_en": "Bab al-Qarara",                              "name_ar": "باب القرارة",        "number": "37",  "lat": 21.42345, "lng": 39.82710},
    {"id": 12, "name_en": "Bab al-Nabi",                                "name_ar": "باب النبي",          "number": "20",  "lat": 21.42255, "lng": 39.82720},
]


def haversine_km(lat1, lng1, lat2, lng2):
    R = 6371.0
    p1, p2 = math.radians(lat1), math.radians(lat2)
    dp = math.radians(lat2 - lat1)
    dl = math.radians(lng2 - lng1)
    a = math.sin(dp / 2) ** 2 + math.cos(p1) * math.cos(p2) * math.sin(dl / 2) ** 2
    return 2 * R * math.asin(math.sqrt(a))


def bearing_deg(lat1, lng1, lat2, lng2):
    p1, p2 = math.radians(lat1), math.radians(lat2)
    dl = math.radians(lng2 - lng1)
    y = math.sin(dl) * math.cos(p2)
    x = math.cos(p1) * math.sin(p2) - math.sin(p1) * math.cos(p2) * math.cos(dl)
    return (math.degrees(math.atan2(y, x)) + 360) % 360


# Create the main app without a prefix
app = FastAPI(title="Umrah Companion API")
api_router = APIRouter(prefix="/api")

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


# ---------- Rate limiting ----------
# Simple in-memory rate limiter — keeps a tiny LLM-cost guardrail without
# requiring redis. Resets on backend restart, which is fine for our scale.
import time
from routes.families import family_router
from collections import defaultdict, deque

_RATE_BUCKETS: dict[str, deque] = defaultdict(deque)
_RATE_LIMITS = {
    "chat":          {"max": 30,  "window": 60},   # 30 chat msgs per IP per minute
    "chat_hour":     {"max": 200, "window": 3600}, # 200 / hour
    "group_create":  {"max": 5,   "window": 600},  # 5 group creations per IP / 10 min
    "sadaqah":       {"max": 10,  "window": 600},  # 10 checkout attempts / 10 min
}


def _client_ip(request: Request) -> str:
    fwd = request.headers.get("x-forwarded-for") or request.headers.get("x-real-ip")
    if fwd:
        return fwd.split(",")[0].strip()
    return request.client.host if request.client else "unknown"


def _rate_check(bucket_key: str, ip: str, kind: str):
    """Raises HTTPException 429 if the IP exceeded its allowance for `kind`."""
    cfg = _RATE_LIMITS[kind]
    now = time.time()
    key = f"{kind}:{ip}"
    dq = _RATE_BUCKETS[key]
    # purge expired
    cutoff = now - cfg["window"]
    while dq and dq[0] < cutoff:
        dq.popleft()
    if len(dq) >= cfg["max"]:
        raise HTTPException(
            status_code=429,
            detail=f"Too many requests. Slow down — try again in a minute.",
        )
    dq.append(now)


# ---------- Models ----------
class GateOut(BaseModel):
    id: int
    name_en: str
    name_ar: str
    number: str
    lat: float
    lng: float


class NearestGateRequest(BaseModel):
    lat: float
    lng: float


class NearestGateResponse(BaseModel):
    gate: GateOut
    distance_km: float
    bearing_deg: float
    others: List[dict]


# ---------- Routes ----------
@api_router.get("/")
async def root():
    return {"message": "Umrah Companion API", "status": "ok"}


@api_router.get("/gates", response_model=List[GateOut])
async def list_gates():
    return GATES


@api_router.post("/gates/nearest", response_model=NearestGateResponse)
async def nearest_gate(req: NearestGateRequest):
    distances = []
    for g in GATES:
        d = haversine_km(req.lat, req.lng, g["lat"], g["lng"])
        b = bearing_deg(req.lat, req.lng, g["lat"], g["lng"])
        distances.append({"gate": g, "distance_km": d, "bearing_deg": b})
    distances.sort(key=lambda x: x["distance_km"])
    nearest = distances[0]
    others = [
        {"gate": d["gate"], "distance_km": round(d["distance_km"], 3), "bearing_deg": round(d["bearing_deg"], 1)}
        for d in distances[1:6]
    ]
    return NearestGateResponse(
        gate=GateOut(**nearest["gate"]),
        distance_km=round(nearest["distance_km"], 3),
        bearing_deg=round(nearest["bearing_deg"], 1),
        others=others,
    )


def limit_family_creation(request: Request):
    _rate_check("group_create", request.client.host if request.client else "unknown", "group_create")


# Existing legacy collections are deliberately untouched. Progress is stored on device.
api_router.include_router(family_router(db.family_checkins_v2, limit_family_creation))


@app.on_event("startup")
async def ensure_family_expiry():
    await db.family_checkins_v2.create_index("expires_at", expireAfterSeconds=0)


# ─── Sadaqah / Donations (Stripe Checkout) ────────────────────────────────
class SadaqahCheckoutRequest(BaseModel):
    package: str  # "small" | "medium" | "large" | "custom"
    custom_amount: Optional[float] = Field(None, ge=SADAQAH_CUSTOM_MIN, le=SADAQAH_CUSTOM_MAX)
    origin_url: str  # window.location.origin from the frontend


def _stripe_for(http_request: Request) -> StripeCheckout:
    if not STRIPE_API_KEY:
        raise HTTPException(status_code=500, detail="Stripe not configured")
    host_url = str(http_request.base_url)
    webhook_url = f"{host_url}api/webhook/stripe"
    return StripeCheckout(api_key=STRIPE_API_KEY, webhook_url=webhook_url)


@api_router.post("/sadaqah/checkout")
async def sadaqah_checkout(body: SadaqahCheckoutRequest, http_request: Request):
    _rate_check("sadaqah", _client_ip(http_request), "sadaqah")
    # Resolve amount on the SERVER — never trust the frontend.
    if body.package in SADAQAH_PACKAGES:
        amount = SADAQAH_PACKAGES[body.package]
    elif body.package == "custom":
        if body.custom_amount is None:
            raise HTTPException(status_code=400, detail="custom_amount required")
        amount = float(body.custom_amount)
        if amount < SADAQAH_CUSTOM_MIN or amount > SADAQAH_CUSTOM_MAX:
            raise HTTPException(
                status_code=400,
                detail=f"Custom amount must be between ${SADAQAH_CUSTOM_MIN:.2f} and ${SADAQAH_CUSTOM_MAX:.2f}",
            )
    else:
        raise HTTPException(status_code=400, detail="Invalid package")

    # Round to 2dp; Stripe accepts float.
    amount = round(amount, 2)

    origin = body.origin_url.rstrip("/")
    success_url = f"{origin}/sadaqah/success?session_id={{CHECKOUT_SESSION_ID}}"
    cancel_url = f"{origin}/sadaqah"

    stripe_checkout = _stripe_for(http_request)
    metadata = {
        "source": "sunnah_umrah_app",
        "purpose": "sadaqah_donation",
        "package": body.package,
    }
    req = CheckoutSessionRequest(
        amount=amount,
        currency="usd",
        success_url=success_url,
        cancel_url=cancel_url,
        metadata=metadata,
    )
    session = await stripe_checkout.create_checkout_session(req)

    # Persist the pending transaction BEFORE redirecting the user to Stripe.
    await db.payment_transactions.insert_one({
        "session_id": session.session_id,
        "amount": amount,
        "currency": "usd",
        "package": body.package,
        "metadata": metadata,
        "status": "initiated",
        "payment_status": "pending",
        "created_at": datetime.now(timezone.utc).isoformat(),
        "updated_at": datetime.now(timezone.utc).isoformat(),
    })

    return {"url": session.url, "session_id": session.session_id}


@api_router.get("/sadaqah/status/{session_id}")
async def sadaqah_status(session_id: str, http_request: Request):
    """Frontend polls this from /sadaqah/success.

    We try to read live status from Stripe first; if the proxy can't find the
    session (test-mode quirk) or any other error happens, we fall back to the
    most recent payment_transactions row for that session_id. The webhook
    keeps that row in sync once the donor actually pays. We always return 200
    so the frontend's polling loop never hard-fails.
    """
    txn = await db.payment_transactions.find_one(
        {"session_id": session_id}, {"_id": 0}
    )
    fallback = {
        "status": (txn or {}).get("status", "open"),
        "payment_status": (txn or {}).get("payment_status", "pending"),
        "amount_total": int(round((txn or {}).get("amount", 0) * 100)),
        "currency": (txn or {}).get("currency", "usd"),
        "source": "db",
    }

    try:
        stripe_checkout = _stripe_for(http_request)
        status = await stripe_checkout.get_checkout_status(session_id)
    except Exception as e:
        logger.info(f"Stripe status retrieve failed for {session_id}: {e} — using DB fallback")
        return fallback

    # Idempotently update the DB only if we're flipping to paid.
    if txn and txn.get("payment_status") != "paid":
        await db.payment_transactions.update_one(
            {"session_id": session_id},
            {"$set": {
                "status": status.status,
                "payment_status": status.payment_status,
                "updated_at": datetime.now(timezone.utc).isoformat(),
            }},
        )
    return {
        "status": status.status,
        "payment_status": status.payment_status,
        "amount_total": status.amount_total,
        "currency": status.currency,
        "source": "stripe",
    }


@api_router.post("/webhook/stripe")
async def stripe_webhook(request: Request):
    body = await request.body()
    sig = request.headers.get("Stripe-Signature", "")
    stripe_checkout = _stripe_for(request)
    try:
        event = await stripe_checkout.handle_webhook(body, sig)
    except Exception as e:
        logger.warning(f"Stripe webhook error: {e}")
        raise HTTPException(status_code=400, detail="Invalid webhook")

    if event and event.session_id:
        txn = await db.payment_transactions.find_one({"session_id": event.session_id}, {"_id": 0})
        if txn and txn.get("payment_status") != "paid":
            await db.payment_transactions.update_one(
                {"session_id": event.session_id},
                {"$set": {
                    "payment_status": event.payment_status,
                    "status": "complete" if event.payment_status == "paid" else event.payment_status,
                    "updated_at": datetime.now(timezone.utc).isoformat(),
                }},
            )
    return {"ok": True}


# ---------- Flights (TravelPayouts / Aviasales) ----------
from routes.flights import router as flights_router  # noqa: E402
api_router.include_router(flights_router)

# Include the main router in the app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
