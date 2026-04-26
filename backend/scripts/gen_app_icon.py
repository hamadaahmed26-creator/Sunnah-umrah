"""Generate a 1024x1024 master app icon for the Sunnah Umrah app.

The icon is then auto-resized to all required sizes by capacitor-assets.
"""
import asyncio
import base64
import os
from pathlib import Path

from dotenv import load_dotenv
from emergentintegrations.llm.chat import LlmChat, UserMessage

load_dotenv("/app/backend/.env")
API_KEY = os.environ["EMERGENT_LLM_KEY"]

OUT = Path("/app/frontend/resources/icon.png")
OUT.parent.mkdir(parents=True, exist_ok=True)

PROMPT = (
    "Square 1024x1024 flat MINIMALIST app icon. Subject: a single solid "
    "matte BLACK 3D cube floating slightly above the centre of the frame, "
    "shown in 3/4 isometric perspective with two faces visible. Around the "
    "upper third of the cube is a SINGLE FLAT SMOOTH UNTEXTURED GOLD METAL "
    "RING — completely BLANK like a polished gold wedding band, with NO "
    "engraving, NO calligraphy, NO writing, NO Arabic, NO patterns, NO "
    "ornamentation. Just smooth uniform gold colour like a plain ribbon. "
    "Background: warm pale cream (#F8F6F0) with a soft circular brass-gold "
    "(#B3884D) glow halo behind the cube. Vector-clean edges. NO text "
    "anywhere. NO inscriptions. NO marks. NO people. NO shadows on floor. "
    "Apple iOS minimalism, recognisable at 20px."
)


async def main():
    chat = (
        LlmChat(api_key=API_KEY, session_id="kaaba-icon", system_message="You are an icon designer.")
        .with_model("gemini", "gemini-3-pro-image-preview")
        .with_params(modalities=["image", "text"])
    )
    text, images = await chat.send_message_multimodal_response(UserMessage(text=PROMPT))
    if not images:
        raise SystemExit(f"No image. text={text[:200]}")
    raw = base64.b64decode(images[0]["data"])
    OUT.write_bytes(raw)
    print(f"OK {OUT}: {len(raw)} bytes  mime={images[0]['mime_type']}")


asyncio.run(main())
