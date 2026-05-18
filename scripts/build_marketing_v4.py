#!/usr/bin/env python3
"""
Sunnah Umrah — Marketing v4
6 NEW videos using 23 freshly-captured real app screens.
Theme: "the mistake pilgrims make → here's how the app fixes it"
Every spoken line is paired with the screen it describes — sync is mathematical.
"""

import asyncio
import os
import shutil
import subprocess
import sys
from pathlib import Path

from dotenv import load_dotenv
from emergentintegrations.llm.openai import OpenAITextToSpeech
from PIL import Image, ImageDraw, ImageFilter, ImageFont

load_dotenv("/app/backend/.env")

ROOT       = Path("/app/frontend/public/marketing")
VIDEOS_DIR = ROOT / "videos"
HERO_DIR   = ROOT / "hero"
TMP_DIR    = Path("/app/.build_tmp_v4")
SHOTS      = Path("/app/screenshots/captured")

for d in (VIDEOS_DIR, HERO_DIR, TMP_DIR):
    d.mkdir(parents=True, exist_ok=True)

F_BOLD = "/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf"
F_REG  = "/usr/share/fonts/truetype/liberation/LiberationSans-Regular.ttf"
F_AR   = "/usr/share/fonts/truetype/noto/NotoNaskhArabic-Bold.ttf"

def font(p, s): return ImageFont.truetype(p, s)

def has_arabic(s):
    return any('\u0600' <= ch <= '\u06FF' or '\u0750' <= ch <= '\u077F' for ch in s)

BG_TOP, BG_BOT = (248, 246, 240), (235, 229, 214)
INK            = (28, 29, 27)
INK_SOFT       = (92, 93, 88)
GOLD           = (179, 136, 77)
GOLD_DARK      = (139, 106, 31)
WHITE          = (255, 255, 255)

VOICE_MODEL = "tts-1-hd"
VOICE_NAME  = "onyx"
VOICE_SPEED = 0.95

# ── 6 storyboards ──────────────────────────────────────────────────────
# (line_to_speak, screenshot_key, on-screen headline (≤ 3 short lines))
STORY = {
    "01_the-tools": {
        "title": "7 hidden tools inside Sunnah Umrah",
        "segments": [
            ("Most people open an Umrah app, see one big button, and miss everything else.",
             "home_en",     "MISTAKE\nYou're missing\nthe tools"),
            ("Sunnah Umrah has seven tools built for the real problems pilgrims hit.",
             "home_en",     "7 TOOLS\nFor real\npilgrim problems"),
            ("Walk to Ḥaram — step by step directions from your hotel to the Mataf.",
             "walk_haram",  "Walk to Ḥaram\nHotel → Mataf"),
            ("Stay Together — a six-letter code your family joins. Quiet map. No login.",
             "group",       "Stay Together\nOne code\nWhole family"),
            ("Ask — fiqh and Umrah questions, answered with sources.",
             "chat",        "Ask\nFiqh +\nUmrah Q&A"),
            ("Qibla — direction to the Kaʿbah, anywhere on Earth.",
             "qibla",       "Qibla\nAnywhere\non Earth"),
            ("I'm Lost — your nearest gate, by GPS, in three taps.",
             "lost",        "I'm Lost\nNearest gate\nby GPS"),
            ("Ziyārah — twenty-six sacred places to visit, mapped.",
             "places",      "Ziyārah\n26 places\nmapped"),
            ("And a Quiz — to test what you actually know before you fly.",
             "quiz",        "Quiz\nTest what\nyou know"),
            ("Seven tools. All free. iOS now.",
             "home_en",     "7 TOOLS · FREE\niOS · Link in bio"),
        ],
    },

    "02_begin-my-umrah": {
        "title": "Press Next 15 times — the whole Umrah, step by step",
        "segments": [
            ("The mistake? Pilgrims read about Umrah from a book, then panic at the moment.",
             "tour_step01", "MISTAKE\nLearning Umrah\nfrom a book"),
            ("Tap 'Begin my Umrah' — and the app walks you through, one step at a time.",
             "tour_step01", "Tap Begin\nMy Umrah"),
            ("Step 2 of 15. Before Iḥrām — prepare yourself.",
             "tour_step02", "Step 2 / 15\nBefore Iḥrām\nPrepare yourself"),
            ("Step 4. Make your niyyah. Recite the Talbiyah.",
             "tour_step04", "Step 4 / 15\nNiyyah +\nTalbiyah"),
            ("Step 6. Enter the Masjid — right foot first, with the dua of entering.",
             "tour_step06", "Step 6 / 15\nEnter the\nMasjid"),
            ("Step 8. Begin Tawaf — seven laps. Counter built in.",
             "tour_step08", "Step 8 / 15\nTawaf\n7 laps · counter"),
            ("Step 10. After Tawaf — two raka'at at Maqām Ibrāhīm. Then Zamzam.",
             "tour_step10", "Step 10 / 15\nMaqām\n+ Zamzam"),
            ("Step 12. Saʿī between Ṣafā and Marwah. Seven trips. Counter built in.",
             "tour_step12", "Step 12 / 15\nSaʿī\n7 trips · counter"),
            ("Step 15. Done. Taqabbal-Allāhu minkum.",
             "tour_step15", "Step 15 / 15\nDone.\nTaqabbal Allah."),
            ("Fifteen steps. Every one cited. Free on iOS.",
             "tour_step01", "15 STEPS · CITED\nFree · iOS"),
        ],
    },

    "03_switch-to-arabic": {
        "title": "Switch the whole app to Arabic in one tap",
        "segments": [
            ("Half the pilgrims at the Mataf don't read English. Most apps don't translate.",
             "home_en",        "MISTAKE\nEnglish-only\napps"),
            ("Sunnah Umrah — tap one button, top right of any screen.",
             "tour_step02",    "Tap AR\ntoggle\ntop-right"),
            ("The whole app switches to Arabic. Home. Tools. Duas.",
             "home_ar",        "Full app\nin Arabic"),
            ("And the entire 15-step Tour — every word, fully translated.",
             "tour_step02_ar", "Tour\nFully\ntranslated"),
            ("English or Arabic. Same Sunnah. Free on iOS.",
             "home_ar",        "EN · AR\nFree · iOS"),
        ],
    },

    "04_get-ready": {
        "title": "The 18-item Get Ready for Umrah checklist",
        "segments": [
            ("The mistake everyone makes — book the Umrah ticket, panic at the airport.",
             "home_en",          "MISTAKE\nBook first\nPanic later"),
            ("Tap 'Get Ready for Umrah'.",
             "home_en",          "Tap\nGet Ready\nfor Umrah"),
            ("Eighteen-item checklist. Passport. Visa. Flights. Ihrām. Vaccinations.",
             "checklist_top",    "18 items\nEvery one\nchecked"),
            ("Tap 'I have this' — green tick. Tap 'I don't have this' — the app sends you where to get it.",
             "checklist_top",    "Don't have it?\nApp shows you\nwhere to get it"),
            ("Scroll down — accommodation, religious preparation, what to pack.",
             "checklist_mid",    "Accommodation\nReligious prep\nPacking"),
            ("Tick everything. You're ready. Free on iOS.",
             "checklist_bottom", "0% → 100%\nReady.\nFree · iOS"),
        ],
    },

    "05_terms": {
        "title": "Iḥrām · Niyyah · Talbiyah — the words finally explained",
        "segments": [
            ("Iḥrām. Niyyah. Talbiyah. Miqāt. Tawaf. Saʿī. Halq.",
             "tour_step02",   "Iḥrām\nNiyyah\nTalbiyah"),
            ("You hear these words a hundred times during Umrah.",
             "tour_step04",   "100 words\nYou'll hear\nin Makkah"),
            ("Most pilgrims nod and pretend they understand. Don't.",
             "tour_step02",   "MISTAKE\nNodding\nwithout knowing"),
            ("Tap 'Terms' at the top of any Tour step.",
             "tour_step02",   "Tap Terms\ntop of screen"),
            ("Ten essential Arabic terms. Definition. Pronunciation. Root meaning.",
             "tour_glossary", "10 terms\nMeaning +\nPronunciation"),
            ("Tap 'Learn' on any one — see exactly where it comes from. Free on iOS.",
             "tour_glossary", "Tap Learn\nSourced.\nFree · iOS"),
        ],
    },

    "06_lost-in-makkah": {
        "title": "When your group loses each other in the Mataf",
        "segments": [
            ("Maghrib at the Mataf. Two million people. Your phone has no signal.",
             "home_en",  "MISTAKE\nPhones don't\nwork in Mataf"),
            ("Your mother is gone. Your wife is gone. You can't shout over the adhan.",
             "group",    "Family\nlost in the\ncrowd"),
            ("Sunnah Umrah's Stay Together. One six-letter code. Everyone joins.",
             "group",    "One code\nEveryone\njoins"),
            ("A quiet map shows you each other — even with no internet.",
             "group",    "Quiet map\nOffline\nbuilt-in"),
            ("And if you're truly lost — tap 'I'm Lost'. Nearest gate by GPS.",
             "lost",     "I'm Lost\nNearest gate\nby GPS"),
            ("Free. iOS. Link in bio.",
             "home_en",  "FREE · iOS\nLink in bio"),
        ],
    },
}

def shot(key): return SHOTS / f"{key}.png"

# ── compositing ────────────────────────────────────────────────────────
def gradient(w, h, top, bot):
    img = Image.new("RGB", (w, h), top)
    px = img.load()
    for y in range(h):
        t = y / max(1, h - 1)
        c = tuple(int(top[i] + (bot[i] - top[i]) * t) for i in range(3))
        for x in range(w):
            px[x, y] = c
    return img

def draw_block(draw, text, fnt, fill, cx, top, gap=10):
    y = top
    for line in text.split("\n"):
        bb = draw.textbbox((0, 0), line, font=fnt)
        w, h = bb[2] - bb[0], bb[3] - bb[1]
        draw.text((cx - w // 2, y), line, font=fnt, fill=fill)
        y += h + gap
    return y

def phone_mockup(screenshot: Image.Image, target_h: int) -> Image.Image:
    sw, sh = screenshot.size
    scale = target_h / sh
    new_w = int(sw * scale)
    inner = screenshot.resize((new_w, target_h), Image.LANCZOS)
    bezel, radius = 14, 60
    W, H = new_w + bezel * 2, target_h + bezel * 2
    canvas = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    bl = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    ImageDraw.Draw(bl).rounded_rectangle((0, 0, W, H), radius=radius, fill=(20, 21, 19, 255))
    canvas.alpha_composite(bl)
    mask = Image.new("L", (new_w, target_h), 0)
    ImageDraw.Draw(mask).rounded_rectangle((0, 0, new_w, target_h),
                                           radius=radius - bezel - 4, fill=255)
    canvas.paste(inner, (bezel, bezel), mask)
    shadow = Image.new("RGBA", (W + 60, H + 60), (0, 0, 0, 0))
    ImageDraw.Draw(shadow).rounded_rectangle((30, 40, W + 30, H + 40),
                                             radius=radius, fill=(0, 0, 0, 90))
    shadow = shadow.filter(ImageFilter.GaussianBlur(18))
    shadow.alpha_composite(canvas, (30, 30))
    return shadow

def render_frame(shot_key, headline, footer="FREE · iOS · LINK IN BIO"):
    W, H = 1080, 1920
    bg = gradient(W, H, BG_TOP, BG_BOT).convert("RGBA")
    d  = ImageDraw.Draw(bg)
    f_brand = font(F_BOLD, 36)
    f_tag   = font(F_REG,  26)
    f_head  = font(F_BOLD, 64)
    f_foot  = font(F_BOLD, 34)

    # brand
    d.text((W // 2 - 220, 70), "SUNNAH UMRAH", font=f_brand, fill=INK)
    d.rectangle((W // 2 - 90, 120, W // 2 + 90, 124), fill=GOLD)
    d.text((W // 2 - 230, 140), "the calm Umrah companion", font=f_tag, fill=INK_SOFT)

    # headline
    draw_block(d, headline, f_head, INK, W // 2, 210, gap=12)

    # phone — bigger than v3 so the actual app screen is the hero
    s = Image.open(shot(shot_key)).convert("RGB")
    phone = phone_mockup(s, target_h=1080)
    px = (W - phone.size[0]) // 2
    py = H - phone.size[1] - 200
    bg.alpha_composite(phone, (px, py))

    out = bg.convert("RGB")
    dd  = ImageDraw.Draw(out)
    bb  = dd.textbbox((0, 0), footer, font=f_foot)
    fw, pad_x, pad_y = bb[2] - bb[0], 36, 18
    pw, ph = fw + pad_x * 2, 70
    px2 = (W - pw) // 2
    py2 = H - 130
    dd.rounded_rectangle((px2, py2, px2 + pw, py2 + ph),
                         radius=ph // 2, fill=INK)
    dd.text((px2 + pad_x, py2 + pad_y - 4), footer, font=f_foot, fill=WHITE)
    return out

# ── ffmpeg ─────────────────────────────────────────────────────────────
def run(cmd):
    r = subprocess.run(cmd, capture_output=True, text=True)
    if r.returncode:
        sys.stderr.write(f"\nCMD FAIL: {' '.join(cmd)}\n{r.stderr[-1000:]}\n")
        raise SystemExit(1)

def probe(p):
    r = subprocess.run(
        ["ffprobe", "-v", "error", "-show_entries", "format=duration",
         "-of", "default=noprint_wrappers=1:nokey=1", str(p)],
        capture_output=True, text=True)
    return float(r.stdout.strip() or "0")

# ── TTS ────────────────────────────────────────────────────────────────
async def tts(text, out, client):
    audio = await client.generate_speech(
        text=text, model=VOICE_MODEL, voice=VOICE_NAME,
        speed=VOICE_SPEED, response_format="mp3")
    out.write_bytes(audio)

# ── per-video build ────────────────────────────────────────────────────
async def build(slug_id, data, client):
    print(f"\n▶ {slug_id}  {data['title']}")
    wd = TMP_DIR / slug_id
    if wd.exists(): shutil.rmtree(wd)
    wd.mkdir(parents=True)

    seg_mp4s, seg_mp3s = [], []
    for i, (line, shot_key, headline) in enumerate(data["segments"], 1):
        mp3 = wd / f"s{i:02d}.mp3"
        png = wd / f"s{i:02d}.png"
        mp4 = wd / f"s{i:02d}.mp4"
        padded = wd / f"s{i:02d}_p.mp3"

        await tts(line, mp3, client)
        dur = probe(mp3)
        print(f"   · seg {i}: {dur:5.2f}s → {shot_key:18s} | {headline.split(chr(10))[0][:30]}")

        render_frame(shot_key, headline).save(png, "PNG")

        run(["ffmpeg", "-y", "-i", str(mp3),
             "-af", "apad=pad_dur=0.35",
             "-c:a", "libmp3lame", "-q:a", "4", str(padded)])
        run(["ffmpeg", "-y",
             "-loop", "1", "-i", str(png),
             "-i", str(padded),
             "-c:v", "libx264", "-tune", "stillimage", "-pix_fmt", "yuv420p",
             "-r", "30",
             "-c:a", "aac", "-b:a", "160k",
             "-shortest", "-movflags", "+faststart", str(mp4)])
        seg_mp4s.append(mp4); seg_mp3s.append(padded)

    # concat
    cl = wd / "list.txt"
    cl.write_text("".join(f"file '{p}'\n" for p in seg_mp4s))
    final = VIDEOS_DIR / f"{slug_id}.mp4"
    run(["ffmpeg", "-y", "-f", "concat", "-safe", "0", "-i", str(cl),
         "-c:v", "libx264", "-pix_fmt", "yuv420p", "-r", "30",
         "-c:a", "aac", "-b:a", "160k", "-movflags", "+faststart", str(final)])

    ml = wd / "mp3list.txt"
    ml.write_text("".join(f"file '{p}'\n" for p in seg_mp3s))
    finalmp3 = VIDEOS_DIR / f"{slug_id}.mp3"
    run(["ffmpeg", "-y", "-f", "concat", "-safe", "0", "-i", str(ml),
         "-c:a", "libmp3lame", "-q:a", "4", str(finalmp3)])

    print(f"   ✓ {slug_id}.mp4 — {probe(final):.1f}s")

# ── main ───────────────────────────────────────────────────────────────
async def main():
    only = set(sys.argv[1:])
    key = os.getenv("EMERGENT_LLM_KEY")
    if not key: sys.exit("EMERGENT_LLM_KEY missing")
    client = OpenAITextToSpeech(api_key=key)

    # NOTE: do not auto-wipe — we rebuild in-place and only overwrite by name
    targets = [s for s in STORY if (not only or s in only)]
    print(f"Building {len(targets)} videos · {VOICE_NAME} · {VOICE_MODEL}")

    for slug in targets:
        await build(slug, STORY[slug], client)

    shutil.rmtree(TMP_DIR, ignore_errors=True)
    print("\n✅ DONE")

if __name__ == "__main__":
    asyncio.run(main())
