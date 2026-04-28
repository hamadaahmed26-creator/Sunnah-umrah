from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
import math
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional
import uuid
from datetime import datetime, timezone

from emergentintegrations.llm.chat import LlmChat, UserMessage
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

EMERGENT_LLM_KEY = os.environ.get('EMERGENT_LLM_KEY', '')
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


# ---------- Models ----------
class ChatRequest(BaseModel):
    session_id: str
    message: str
    language: Optional[str] = "en"  # "en" or "ar"


class ChatMessage(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    session_id: str
    role: str  # "user" or "assistant"
    content: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class ChatResponse(BaseModel):
    session_id: str
    reply: str


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


class ProgressUpdate(BaseModel):
    user_id: str
    step: Optional[str] = None  # ihram | tawaf | sai | halq | done
    tawaf_count: Optional[int] = None
    sai_count: Optional[int] = None


class GroupJoinRequest(BaseModel):
    code: str


class GroupCheckin(BaseModel):
    user_id: str
    name: str
    tawaf_count: int = 0
    sai_count: int = 0
    lat: Optional[float] = None
    lng: Optional[float] = None


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


@api_router.post("/chat", response_model=ChatResponse)
async def chat(req: ChatRequest):
    if not EMERGENT_LLM_KEY:
        raise HTTPException(status_code=500, detail="LLM key not configured")

    lang_instr = (
        "Respond primarily in clear Arabic (Modern Standard) using authentic Islamic etiquette. Cite source briefly when applicable."
        if req.language == "ar"
        else "Respond in clear, warm English with brief Arabic transliteration where appropriate."
    )

    system_message = (
        "You are an Umrah & Hajj companion grounded in the Sunnah of Prophet Muhammad ﷺ. "
        "You answer questions about Umrah rituals (Ihram, Tawaf, Sa'i, Halq/Taqsir), duas, fiqh according to the four mainstream Sunni schools, "
        "etiquettes inside Masjid al-Haram and Madinah, and practical pilgrim concerns (lost items, finding gates, health). "
        "Always remind users to consult a qualified scholar for binding rulings. Keep answers concise (3-6 short paragraphs), kind, and structured. "
        f"{lang_instr}"
    )

    try:
        llm = LlmChat(
            api_key=EMERGENT_LLM_KEY,
            session_id=req.session_id,
            system_message=system_message,
        ).with_model("anthropic", "claude-sonnet-4-5-20250929")

        # persist history before-call so LlmChat session memory + DB stay aligned
        # save user msg
        user_doc = ChatMessage(session_id=req.session_id, role="user", content=req.message).model_dump()
        user_doc["timestamp"] = user_doc["timestamp"].isoformat()
        await db.chat_messages.insert_one(user_doc)

        reply = await llm.send_message(UserMessage(text=req.message))

        asst_doc = ChatMessage(session_id=req.session_id, role="assistant", content=reply).model_dump()
        asst_doc["timestamp"] = asst_doc["timestamp"].isoformat()
        await db.chat_messages.insert_one(asst_doc)

        return ChatResponse(session_id=req.session_id, reply=reply)
    except Exception as e:
        logging.exception("chat error")
        raise HTTPException(status_code=500, detail=f"Chat failed: {e}")


@api_router.get("/chat/{session_id}/messages", response_model=List[ChatMessage])
async def get_chat_messages(session_id: str):
    docs = await db.chat_messages.find({"session_id": session_id}, {"_id": 0}).sort("timestamp", 1).to_list(500)
    for d in docs:
        if isinstance(d.get("timestamp"), str):
            d["timestamp"] = datetime.fromisoformat(d["timestamp"])
    return docs


@api_router.put("/progress")
async def update_progress(p: ProgressUpdate):
    doc = {k: v for k, v in p.model_dump().items() if v is not None}
    doc["updated_at"] = datetime.now(timezone.utc).isoformat()
    await db.progress.update_one({"user_id": p.user_id}, {"$set": doc}, upsert=True)
    return {"ok": True}


@api_router.get("/progress/{user_id}")
async def get_progress(user_id: str):
    doc = await db.progress.find_one({"user_id": user_id}, {"_id": 0})
    if not doc:
        return {"user_id": user_id, "step": "ihram", "tawaf_count": 0, "sai_count": 0}
    return doc


# ---------- Group / Family ----------
import random as _random
import string as _string


def _gen_code():
    return "".join(_random.choices(_string.ascii_uppercase + _string.digits, k=6))


def _ago(iso_ts: str) -> str:
    try:
        t = datetime.fromisoformat(iso_ts)
        if t.tzinfo is None:
            t = t.replace(tzinfo=timezone.utc)
        delta = (datetime.now(timezone.utc) - t).total_seconds()
        if delta < 60:
            return "just now"
        if delta < 3600:
            return f"{int(delta // 60)}m ago"
        if delta < 86400:
            return f"{int(delta // 3600)}h ago"
        return f"{int(delta // 86400)}d ago"
    except Exception:
        return ""


@api_router.post("/group/create")
async def group_create():
    for _ in range(8):
        code = _gen_code()
        existing = await db.groups.find_one({"code": code})
        if not existing:
            await db.groups.insert_one({
                "code": code,
                "created_at": datetime.now(timezone.utc).isoformat(),
            })
            return {"code": code}
    raise HTTPException(status_code=500, detail="Could not allocate code")


@api_router.post("/group/join")
async def group_join(req: GroupJoinRequest):
    code = req.code.upper()
    g = await db.groups.find_one({"code": code}, {"_id": 0})
    if not g:
        raise HTTPException(status_code=404, detail="Group not found")
    return {"ok": True, "code": code}


@api_router.put("/group/{code}/checkin")
async def group_checkin(code: str, c: GroupCheckin):
    code = code.upper()
    g = await db.groups.find_one({"code": code})
    if not g:
        raise HTTPException(status_code=404, detail="Group not found")
    doc = {
        "code": code,
        "user_id": c.user_id,
        "name": c.name,
        "tawaf_count": c.tawaf_count,
        "sai_count": c.sai_count,
        "lat": c.lat,
        "lng": c.lng,
        "updated_at": datetime.now(timezone.utc).isoformat(),
    }
    await db.group_members.update_one(
        {"code": code, "user_id": c.user_id}, {"$set": doc}, upsert=True
    )
    return {"ok": True}


@api_router.get("/group/{code}")
async def group_get(code: str):
    code = code.upper()
    g = await db.groups.find_one({"code": code}, {"_id": 0})
    if not g:
        raise HTTPException(status_code=404, detail="Group not found")
    members = await db.group_members.find({"code": code}, {"_id": 0}).to_list(50)
    for m in members:
        m["last_ago"] = _ago(m.get("updated_at", ""))
    members.sort(key=lambda x: x.get("updated_at", ""), reverse=True)
    return {"code": code, "members": members}


# ─── Sadaqah / Donations (Stripe Checkout) ────────────────────────────────
class SadaqahCheckoutRequest(BaseModel):
    package: str  # "small" | "medium" | "large" | "custom"
    custom_amount: Optional[float] = None
    origin_url: str  # window.location.origin from the frontend


def _stripe_for(http_request: Request) -> StripeCheckout:
    if not STRIPE_API_KEY:
        raise HTTPException(status_code=500, detail="Stripe not configured")
    host_url = str(http_request.base_url)
    webhook_url = f"{host_url}api/webhook/stripe"
    return StripeCheckout(api_key=STRIPE_API_KEY, webhook_url=webhook_url)


@api_router.post("/sadaqah/checkout")
async def sadaqah_checkout(body: SadaqahCheckoutRequest, http_request: Request):
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
    stripe_checkout = _stripe_for(http_request)
    status = await stripe_checkout.get_checkout_status(session_id)

    # Only update the DB row once — guards against double-credit on parallel polls.
    txn = await db.payment_transactions.find_one({"session_id": session_id}, {"_id": 0})
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


# Include the router in the main app
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
