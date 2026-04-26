"""Generate hyper-realistic dignified photos for the Ziyārah section.

Saves outputs to /app/frontend/public/images/places/{slug}.jpg.
Skips slugs that already have a file so we can re-run for failures.
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

OUT_DIR = Path("/app/frontend/public/images/places")
OUT_DIR.mkdir(parents=True, exist_ok=True)

STYLE = (
    "Hyper-realistic professional photograph, soft warm daylight, sharp focus, "
    "natural colours, cinematic depth of field, no text overlays, no logos, no "
    "watermarks, no AI artefacts, dignified and reverent atmosphere. Shot on "
    "Sony A7R IV, 35mm, f/4."
)

PROMPTS = {
    # ─── MAKKAH ────────────────────────────────────────────────
    "jabal-al-nur":
        "A wide reverent photograph of Jabal al-Nūr (Mountain of Light) near "
        "Makkah, Saudi Arabia. The dramatic rocky mountain peak rises against "
        "a golden late-afternoon sky, with the small stone shelter at its "
        "summit visible. Steep stone steps wind up the side. Desert haze in "
        "the background. " + STYLE,
    "jabal-thawr":
        "A photograph of Jabal Thawr (Mount Thawr) near Makkah — a rugged "
        "rocky mountain in the Saudi desert. Brown-grey weathered rock, the "
        "famous Cave of Thawr opening visible high on the slope. Soft "
        "afternoon light, no people. " + STYLE,
    "jabal-arafat":
        "A wide photograph of Mount Arafat (Jabal al-Raḥmah) — a small grey "
        "rocky hill rising from the vast plain of Arafat near Makkah. White "
        "stone pillar at the summit. Surrounding plain dotted with low desert "
        "vegetation. Golden hour light, dignified and serene. " + STYLE,
    "mina":
        "A wide aerial photograph of Minā near Makkah — the famous valley "
        "completely covered in tens of thousands of identical white "
        "fire-resistant tents arranged in neat grids, with mountain ridges "
        "in the background. Daylight, no chaos. " + STYLE,
    "muzdalifah":
        "A photograph of the open plain of Muzdalifah between Arafat and "
        "Minā at twilight, with a distant mosque (Masjid al-Mashʿar al-Ḥarām) "
        "lit up in the dusk. Clear desert sky transitioning from blue to "
        "amber. Ground covered in small pebbles. Mountains in the background. "
        + STYLE,
    "masjid-jinn":
        "A photograph of Masjid al-Jinn in Makkah — a small dignified mosque "
        "with white walls, a slender minaret, and a green dome, set against "
        "the surrounding modern Makkah cityscape. Clean architecture, soft "
        "daylight. " + STYLE,
    "masjid-khayf":
        "A photograph of Masjid al-Khayf in Minā, Saudi Arabia — a vast "
        "rectangular mosque complex with multiple white minarets and a green "
        "dome, surrounded by the white tents of Minā. Bright daylight, "
        "mountain backdrop. " + STYLE,
    "abu-qubays":
        "A photograph of Jabal Abū Qubays — a craggy rocky mountain east of "
        "Makkah. Rugged stone slopes rising into a clear sky, with the modern "
        "Makkah skyline visible in the distance. Warm sunset light. " + STYLE,
    "mawlid-nabi":
        "A photograph of the Makkah Public Library building — a stately "
        "sand-coloured Saudi-style stone building with arched windows, marking "
        "the historical site where the Prophet Muhammad ﷺ was born. Clean "
        "architecture, soft daylight, no people. " + STYLE,
    "masjid-aisha":
        "A photograph of Masjid Aisha (Masjid at-Tan'eem) in Makkah — a large "
        "modern white-marble mosque with multiple slender minarets and a "
        "central green dome, surrounded by date palms. Clear blue desert sky, "
        "soft daylight. " + STYLE,

    # ─── MĪQĀTS ─────────────────────────────────────────────────
    "miqat-dhul-hulayfah":
        "A photograph of Masjid Dhul-Ḥulayfah / Abyār ʿAlī near Madīnah, "
        "Saudi Arabia — a large beautiful traditional mosque with sand-coloured "
        "stone walls, multiple slender minarets, and a green dome. Date palms "
        "around the courtyard. Soft daylight. " + STYLE,
    "miqat-juhfah":
        "A photograph of the Mīqāt mosque at Rābigh, Saudi Arabia — a "
        "modern white-marble mosque with a green dome and twin minarets, set "
        "near the Red Sea coast. Palm trees, blue sky, calm. " + STYLE,
    "miqat-qarn-manazil":
        "A photograph of the Mīqāt mosque at as-Sayl al-Kabīr (Qarn al-Manāzil) "
        "on the Tā'if road, Saudi Arabia — a modern Saudi-style mosque with "
        "white walls, a tall single minaret, and a green dome, set against "
        "rugged mountains. Daylight. " + STYLE,
    "miqat-yalamlam":
        "A photograph of the Mīqāt mosque at Yalamlam (as-Saʿdiyyah) south of "
        "Makkah — a modest desert mosque with sand-coloured walls and a "
        "single minaret, set in a wide valley with low mountains in the "
        "distance. " + STYLE,
    "miqat-dhat-irq":
        "A photograph of the Mīqāt at Dhāt ʿIrq north-east of Makkah — a "
        "small simple desert mosque with a single minaret in an open arid "
        "landscape, mountains on the horizon. Late afternoon light. " + STYLE,
    "miqat-tan-eem":
        "A photograph of Masjid Aisha at Tan'eem — a large modern white-marble "
        "mosque with multiple minarets and a green dome, with a wide courtyard "
        "where pilgrims in white iḥrām can be seen at a respectful distance. "
        + STYLE,

    # ─── MADĪNAH ────────────────────────────────────────────────
    "masjid-nabawi":
        "An iconic photograph of Masjid an-Nabawī in Madīnah — the magnificent "
        "Prophet's Mosque with its world-famous emerald-green dome, multiple "
        "slender minarets, and the white retractable umbrellas in the "
        "courtyard, all under a clear blue sky. Wide reverent daylight shot. "
        + STYLE,
    "rawdah":
        "A photograph of the interior of Masjid an-Nabawī showing the "
        "distinctive green-and-gold carpeted area of the Rawḍah ash-Sharīfah, "
        "with elegant white columns, hanging chandeliers, and a glimpse of "
        "the brass screen of the Prophet ﷺ's chamber in the background. "
        "Soft warm light, dignified. " + STYLE,
    "quba":
        "A photograph of Masjid Qubā' in Madīnah — a beautiful white modern "
        "mosque with four slender minarets and multiple small white domes, "
        "set against a clear blue sky. Wide courtyard, palm trees. Daylight. "
        + STYLE,
    "qiblatayn":
        "A photograph of Masjid al-Qiblatayn in Madīnah — a clean white "
        "modern mosque with twin minarets and two domes (representing the "
        "two qiblahs), set against a blue sky. Soft daylight. " + STYLE,
    "uhud":
        "A wide photograph of Mount Uḥud near Madīnah — a long rugged red-"
        "brown rocky ridge rising from the desert plain, with the modern "
        "Madīnah skyline visible in the distance. Golden hour light, "
        "atmospheric and reverent. " + STYLE,
    "sabaa-masajid":
        "A photograph of one of the historic Seven Mosques (Sabʿ Masājid) on "
        "the western edge of Madīnah — a small old stone mosque with a single "
        "minaret and a small dome, with rocky terrain around. Warm afternoon "
        "light. " + STYLE,
    "al-baqi":
        "A respectful wide photograph from a distance showing the historic "
        "al-Baqīʿ area in Madīnah — a flat open expanse with a perimeter "
        "stone wall, palm trees lining the boundary, and the iconic green "
        "dome and minarets of Masjid an-Nabawī rising in the background "
        "against a clear sky. Soft golden-hour daylight, calm and reverent. "
        + STYLE,
    "ghamamah":
        "A photograph of Masjid al-Ghamāmah in Madīnah — a beautiful "
        "Ottoman-era stone mosque with a central dome and several smaller "
        "domes flanked by two slender minarets, sand-coloured walls. Daylight. "
        + STYLE,
    "abu-bakr-umar-ali":
        "A photograph of one of the small historic mosques (e.g. Masjid Abī "
        "Bakr) in Madīnah near the Prophet's Mosque — a modest stone mosque "
        "with a single small minaret and a humble dome, sand-coloured walls. "
        "Soft daylight. " + STYLE,
    "madinah-dates":
        "A photograph of a date farm in Madīnah — rows of tall date palms "
        "heavy with fresh dates, with a traditional wooden basket of dark "
        "ʿAjwa dates in the foreground. Warm afternoon light, no people. "
        + STYLE,
}

MODEL = "gemini-3-pro-image-preview"


async def gen_one(slug: str, prompt: str, force: bool = False) -> bool:
    out = OUT_DIR / f"{slug}.jpg"
    if out.exists() and not force:
        print(f"[skip] {slug} (exists, {out.stat().st_size} bytes)")
        return True
    chat = (
        LlmChat(api_key=API_KEY, session_id=f"place-{slug}", system_message="You are an image generator.")
        .with_model("gemini", MODEL)
        .with_params(modalities=["image", "text"])
    )
    msg = UserMessage(text=prompt)
    text, images = await chat.send_message_multimodal_response(msg)
    if not images:
        print(f"[FAIL] {slug}: no image. text={text[:100]}")
        return False
    raw = base64.b64decode(images[0]["data"])
    out.write_bytes(raw)
    print(f"[OK]   {slug}: {len(raw)} bytes")
    return True


async def main():
    only = set(sys.argv[1:])  # optional: pass slugs to regenerate
    results = []
    for slug, prompt in PROMPTS.items():
        if only and slug not in only:
            continue
        try:
            ok = await gen_one(slug, prompt, force=bool(only))
        except Exception as e:
            print(f"[ERR]  {slug}: {e}")
            ok = False
        results.append((slug, ok))
    failed = [s for s, ok in results if not ok]
    print(f"\nDone. {len(results) - len(failed)}/{len(results)} ok. Failed: {failed}")
    sys.exit(0 if not failed else 1)


if __name__ == "__main__":
    asyncio.run(main())
