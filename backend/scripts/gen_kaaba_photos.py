"""Generate 4 hyper-realistic Ka'bah photos for the Tawaf step-by-step flow.

Each prompt is engineered to produce a CLEAN, DIGNIFIED, photographic image of
the Ka'bah at the EXACT corner / face the pilgrim is at during a single lap.
No chaotic crowds in front of the structure; the Ka'bah itself is the subject.

Output: /app/frontend/public/images/kaaba/{01..04}-*.jpg
"""
import asyncio
import base64
import os
import sys
from pathlib import Path

from dotenv import load_dotenv
from emergentintegrations.llm.chat import LlmChat, UserMessage

load_dotenv("/app/backend/.env")
API_KEY = os.environ["EMERGENT_LLM_KEY"]

OUT_DIR = Path("/app/frontend/public/images/kaaba")
OUT_DIR.mkdir(parents=True, exist_ok=True)

# Shared visual style — keeps all 4 photos consistent
STYLE = (
    "Hyper-realistic professional photograph, soft warm daylight inside Masjid "
    "al-Haram, gold-and-marble surroundings, sharp focus on the Ka'bah, the "
    "black silk Kiswah cloth with the wide gold band of Quranic calligraphy "
    "(the Hizam) clearly visible, cinematic depth of field, natural colours, "
    "no people obstructing the Ka'bah, no AI artefacts, no text overlays, no "
    "logos. Shot on Sony A7R IV, 35mm, f/4, dignified spiritual atmosphere."
)

PROMPTS = {
    "01-black-stone.jpg": (
        "A clean, reverent close-up photograph of the EASTERN CORNER of the "
        "Ka'bah — the Black Stone (Hajar al-Aswad) corner. The famous polished "
        "silver frame that encases the Black Stone is the focal point, set into "
        "the corner of the Ka'bah at chest height. The stone itself is visible "
        "inside the silver frame as a dark mass. The black Kiswah cloth and the "
        "gold-embroidered band wrap around the corner. A faint glimpse of the "
        "marble floor (Mataf) in the foreground. NO crowd of hands or arms in "
        "front of the stone — just the corner of the Ka'bah, calm and clear. "
        + STYLE
    ),
    "02-walking.jpg": (
        "A photograph taken from the perspective of a single pilgrim walking "
        "anticlockwise around the Ka'bah, with the Ka'bah on the LEFT side of "
        "the frame. The full side wall of the Ka'bah (the long north-eastern "
        "face) is visible — black Kiswah cloth, gold Hizam band of Quranic "
        "calligraphy near the top, marble Shadherwan foundation at the base. "
        "The Maqam Ibrahim's gold-and-glass canopy is visible in the middle "
        "distance to the right. The polished marble Mataf floor stretches away "
        "in front. A few pilgrims in white ihram visible far away, but not "
        "blocking the Ka'bah. " + STYLE
    ),
    "03-yemeni-corner.jpg": (
        "A clean photograph of the SOUTHERN CORNER of the Ka'bah — the Yemeni "
        "Corner (Rukn al-Yamani). Unlike the Black Stone corner there is NO "
        "silver frame here; this is just the bare stone corner of the Ka'bah, "
        "wrapped in the black Kiswah with the gold Hizam band running across "
        "near the top. The corner edge of the Ka'bah is the focal point, taken "
        "at a slight angle so the viewer sees the south-east face on the right "
        "and the south-west face on the left meeting at the corner. The marble "
        "floor of the Mataf in the foreground. Calm, no crowd blocking the "
        "corner. " + STYLE
    ),
    "04-yemeni-to-stone.jpg": (
        "A wide reverent photograph of the SOUTH-EASTERN FACE of the Ka'bah — "
        "the wall stretch BETWEEN the Yemeni Corner (left of frame) and the "
        "Black Stone corner (right of frame). This is the simple side of the "
        "Ka'bah — only the Kiswah cloth and the gold Hizam calligraphy band, "
        "NO door, NO Multazam visible. Both corners are visible at the edges "
        "of the frame. Soft daylight, the polished marble Mataf floor sweeps "
        "across the foreground. This is the stretch where pilgrims recite "
        "Rabbana atina. " + STYLE
    ),
}

MODEL = "gemini-3-pro-image-preview"


async def gen_one(filename: str, prompt: str) -> bool:
    out = OUT_DIR / filename
    chat = (
        LlmChat(api_key=API_KEY, session_id=f"kaaba-{filename}", system_message="You are an image generator.")
        .with_model("gemini", MODEL)
        .with_params(modalities=["image", "text"])
    )
    msg = UserMessage(text=prompt)
    text, images = await chat.send_message_multimodal_response(msg)
    if not images:
        print(f"[FAIL] {filename}: no image returned. text={text[:120]}")
        return False
    img = images[0]
    raw = base64.b64decode(img["data"])
    out.write_bytes(raw)
    print(f"[OK]   {filename}: {len(raw)} bytes  mime={img['mime_type']}")
    return True


async def main():
    results = []
    for fn, prompt in PROMPTS.items():
        try:
            ok = await gen_one(fn, prompt)
        except Exception as e:
            print(f"[ERR]  {fn}: {e}")
            ok = False
        results.append((fn, ok))
    print("\nSummary:")
    for fn, ok in results:
        print(f"  {'✓' if ok else '✗'} {fn}")
    failed = [fn for fn, ok in results if not ok]
    sys.exit(0 if not failed else 1)


if __name__ == "__main__":
    asyncio.run(main())
