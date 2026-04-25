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

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

EMERGENT_LLM_KEY = os.environ.get('EMERGENT_LLM_KEY', '')

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


# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
