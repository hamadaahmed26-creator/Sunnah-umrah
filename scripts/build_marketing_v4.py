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
    "00_everything": {
        "title": "Everything inside Sunnah Umrah — in 60 seconds",
        "segments": [
            # HOOK
            ("Imagine your whole Umrah, guided. In one app. Free.",
             "home_en",         "ONE APP\nWHOLE UMRAH\nFREE"),

            # THE PROBLEM
            ("Most pilgrims arrive in Makkah confused — phones don't work, "
             "duas are made up, and apps are full of ads.",
             "home_en",         "MOST PILGRIMS\narrive\nCONFUSED"),

            # CITED FROM THE SUNNAH
            ("Sunnah Umrah fixes that. Every step. Every dua. Cited.",
             "tour_step01",     "EVERY STEP\nEVERY DUA\nCITED"),

            # GET READY
            ("Before you fly — an 18-item checklist. Passport. Visa. Iḥrām. "
             "Don't have something? It sends you where to get it.",
             "checklist_top",   "BEFORE YOU FLY\n18-item\nchecklist"),

            # 15-STEP TOUR
            ("From the moment you make Iḥrām...",
             "tour_step02",     "STEP BY STEP\nbegins"),
            ("...to your Niyyah and Talbiyah...",
             "tour_step04",     "Niyyah\n+ Talbiyah"),
            ("...to entering the Masjid...",
             "tour_step06",     "Enter\nthe Masjid"),
            ("...to seven laps of Tawaf with the counter built in...",
             "tour_step08",     "Tawaf\n7 laps\ncounter built in"),
            ("...to Maqām Ibrāhīm and drinking Zamzam...",
             "tour_step10",     "Maqām\n+ Zamzam"),
            ("...to Saʿī between Ṣafā and Marwah...",
             "tour_step13",     "Saʿī\n7 trips"),
            ("...to your Halq. Every page in your hand.",
             "tour_step15",     "Halq\nUmrah\ncomplete"),

            # GLOSSARY
            ("Don't know what Iḥrām or Talbiyah means? Tap Terms — ten "
             "essential Arabic words, defined and pronounced.",
             "tour_glossary",   "10 ARABIC TERMS\ndefined\n+ pronounced"),

            # TOOLS
            ("Then come the tools.",
             "home_tools",      "THE TOOLS"),
            ("Walk to Ḥaram — turn-by-turn from your hotel.",
             "walk_haram",      "Walk to Ḥaram\nhotel → Mataf"),
            ("Stay Together — one six-letter code your whole family joins.",
             "group",           "Stay Together\n1 code · 1 family"),
            ("Ask — fiqh questions answered with sources.",
             "chat",             "Ask\nfiqh + Q&A\ncited"),
            ("Qibla — direction to the Kaʿbah, anywhere on Earth.",
             "qibla",           "Qibla\nanywhere"),
            ("I'm Lost — nearest gate by GPS in three taps.",
             "lost",            "I'm Lost\nnearest gate\n3 taps"),
            ("Ziyārah — twenty-six sacred places, mapped.",
             "places",          "Ziyārah\n26 places\nmapped"),
            ("Quiz — test what you actually know before you fly.",
             "quiz",            "Quiz\ntest yourself"),

            # ARABIC
            ("And one tap flips the entire app into Arabic.",
             "home_ar",         "EN ↔ AR\none tap"),

            # CLOSE
            ("No ads. No tracking. No login. Built for one Ummah.",
             "home_en",         "NO ADS · NO TRACKING\nNO LOGIN"),
            ("Sunnah Umrah. Free. iOS and Android. Link in bio.",
             "home_en",         "SUNNAH UMRAH\nFREE\niOS + Android"),
        ],
    },

    "01_the-tools": {
        "title": "7 hidden tools inside Sunnah Umrah",
        "segments": [
            ("Most people open an Umrah app, see one big button, and miss everything else.",
             "home_en",     "MISTAKE\nYou're missing\nthe tools"),
            ("Scroll past the start button — and you find seven tools.",
             "home_tools",  "Scroll down\n→ Your Tools"),
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
            ("Seven tools. All free. iOS and Android.",
             "home_tools",  "7 TOOLS · FREE\niOS + Android\nLink in bio"),
        ],
    },

    "02_begin-my-umrah": {
        "title": "Every single step, guided in your pocket",
        "segments": [
            ("Most pilgrims try to memorise Umrah from a book — and panic at the moment.",
             "tour_step01", "MISTAKE\nMemorising\nfrom a book"),
            ("Tap one button — and the app guides you, screen by screen, from start to finish.",
             "tour_step01", "Tap once\nGuided\nscreen by screen"),
            ("It walks you through preparing for Iḥrām.",
             "tour_step02", "Preparing\nfor Iḥrām"),
            ("Through changing clothes at the Mīqāt.",
             "tour_step03", "At the\nMīqāt"),
            ("Through making your niyyah and reciting the Talbiyah.",
             "tour_step04", "Niyyah\n+ Talbiyah"),
            ("Through entering the Masjid the way the Prophet, peace be upon him, did.",
             "tour_step06", "Enter\nthe Masjid"),
            ("Through your first lap of Tawaf at the Black Stone.",
             "tour_step07", "Black Stone\nBegin Tawaf"),
            ("Through seven laps around the Kaʿbah — with a counter built in so you don't lose track.",
             "tour_step08", "Seven laps\nCounter\nbuilt in"),
            ("Through two rakaʿah at Maqām Ibrāhīm. Through drinking Zamzam.",
             "tour_step10", "Maqām\n+ Zamzam"),
            ("Through Saʿī — seven trips between Ṣafā and Marwah.",
             "tour_step13", "Saʿī\nSeven trips"),
            ("Through Halq — shaving or trimming the hair.",
             "tour_step14", "Halq\nor Taqṣīr"),
            ("Until your Umrah is complete. Taqabbal-Allāhu minkum.",
             "tour_step15", "Done.\nTaqabbal\nAllah."),
            ("Every page cited from the Sunnah. Free on iOS and Android.",
             "tour_step01", "Cited\nfrom the Sunnah\nFree · iOS + Android"),
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
            ("English or Arabic. Same Sunnah. Free on iOS and Android.",
             "home_ar",        "EN · AR\nFree · iOS + Android"),
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
            ("Tick everything. You're ready. Free on iOS and Android.",
             "checklist_bottom", "0% → 100%\nReady.\nFree · iOS + Android"),
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
            ("Tap 'Learn' on any one — see exactly where it comes from. Free on iOS and Android.",
             "tour_glossary", "Tap Learn\nSourced.\nFree · iOS + Android"),
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
            ("Free. iOS and Android. Link in bio.",
             "home_en",  "FREE · iOS + Android\nLink in bio"),
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

def render_frame(shot_key, headline, footer="FREE · iOS + ANDROID · LINK IN BIO"):
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

# ── per-video build (single-pass concat, sync-by-construction) ────────
async def build(slug_id, data, client):
    print(f"\n▶ {slug_id}  {data['title']}")
    wd = TMP_DIR / slug_id
    if wd.exists(): shutil.rmtree(wd)
    wd.mkdir(parents=True)

    # Phase 1 — TTS every line, measure exact duration, render the frame,
    # AND build a per-segment silent video of EXACT duration using -t.
    # (concat-demuxer "duration" directives drop frames when durations don't
    # land on 30 fps boundaries — building per-segment MP4s with -t makes
    # libx264 emit the exact number of frames we asked for.)
    seg_mp3s = []           # list[(Path, float)]
    seg_silent_mp4s = []    # list[Path]
    for i, (line, shot_key, headline) in enumerate(data["segments"], 1):
        mp3 = wd / f"s{i:02d}.mp3"
        png = wd / f"s{i:02d}.png"
        smp4 = wd / f"s{i:02d}.silent.mp4"
        await tts(line, mp3, client)
        dur = probe(mp3)
        render_frame(shot_key, headline).save(png, "PNG")
        run(["ffmpeg", "-y",
             "-loop", "1", "-framerate", "30", "-i", str(png),
             "-t", f"{dur:.3f}",
             "-pix_fmt", "yuv420p",
             "-c:v", "libx264", "-tune", "stillimage",
             "-r", "30",
             "-vf", "fps=30",
             str(smp4)])
        seg_mp3s.append((mp3, dur))
        seg_silent_mp4s.append(smp4)
        print(f"   · seg {i:02d}: {dur:5.2f}s → {shot_key:18s} | {headline.splitlines()[0][:30]}")

    # Phase 2 — concat audio segments into one clean AAC track via filter
    n = len(seg_mp3s)
    inputs = []
    for p, _ in seg_mp3s:
        inputs += ["-i", str(p)]
    filter_complex = "".join(f"[{i}:a]" for i in range(n)) + f"concat=n={n}:v=0:a=1[a]"
    big_aac = wd / "all.m4a"
    run(["ffmpeg", "-y", *inputs,
         "-filter_complex", filter_complex,
         "-map", "[a]",
         "-c:a", "aac", "-b:a", "160k",
         str(big_aac)])
    audio_total = probe(big_aac)

    # Phase 3 — concat the silent per-segment MP4s into one silent video
    vlist = wd / "video.txt"
    vlist.write_text("".join(f"file '{p}'\n" for p in seg_silent_mp4s))
    silent_mp4 = wd / "silent.mp4"
    run(["ffmpeg", "-y",
         "-f", "concat", "-safe", "0", "-i", str(vlist),
         "-c:v", "copy",
         str(silent_mp4)])
    video_total = probe(silent_mp4)
    print(f"   · audio={audio_total:.2f}s   video={video_total:.2f}s   delta={video_total-audio_total:+.2f}s")

    # Phase 4 — mux silent video + concat audio
    final = VIDEOS_DIR / f"{slug_id}.mp4"
    run(["ffmpeg", "-y",
         "-i", str(silent_mp4),
         "-i", str(big_aac),
         "-map", "0:v:0", "-map", "1:a:0",
         "-c:v", "copy",
         "-c:a", "copy",
         "-movflags", "+faststart",
         str(final)])

    # also publish the standalone voiceover MP3 (re-encode from the clean AAC)
    finalmp3 = VIDEOS_DIR / f"{slug_id}.mp3"
    run(["ffmpeg", "-y", "-i", str(big_aac),
         "-c:a", "libmp3lame", "-q:a", "4", str(finalmp3)])
    print(f"   ✓ {slug_id}.mp4 — {probe(final):.1f}s")

# ── HEROES — 12 distinct 4:5 Instagram-feed images ─────────────────────
# Each entry: (slug, screenshot_key, headline_top, headline_bottom)
HEROES = [
    ("01_tools",       "home_tools",     "7 TOOLS",          "hidden inside the app"),
    ("02_walk-haram",  "walk_haram",     "WALK TO ḤARAM",    "step-by-step from your hotel"),
    ("03_stay-together","group",         "STAY TOGETHER",    "one code · whole family"),
    ("04_ask",         "chat",           "ASK",              "fiqh + Umrah Q&A · cited"),
    ("05_qibla",       "qibla",          "QIBLA",            "anywhere on Earth"),
    ("06_lost",        "lost",           "I'M LOST",         "nearest gate · by GPS"),
    ("07_ziyarah",     "places",         "ZIYĀRAH",          "26 sacred places mapped"),
    ("08_quiz",        "quiz",           "TEST YOURSELF",    "before you fly"),
    ("09_every-step",  "tour_step01",    "EVERY STEP",       "guided in your pocket"),
    ("10_glossary",    "tour_glossary",  "ARABIC TERMS",     "10 words · finally explained"),
    ("11_checklist",   "checklist_top",  "GET READY",        "18-item Umrah checklist"),
    ("12_arabic",      "home_ar",        "EN ↔ AR",          "one tap · same Sunnah"),
]

def render_hero(shot_key: str, top_line: str, bottom_line: str) -> Image.Image:
    """1080×1350 Instagram-feed (4:5) hero."""
    W, H = 1080, 1350
    bg = gradient(W, H, BG_TOP, BG_BOT).convert("RGBA")
    d  = ImageDraw.Draw(bg)

    f_brand = font(F_BOLD, 32)
    f_top   = font(F_BOLD, 74)
    f_bot   = font(F_REG,  30)
    f_foot  = font(F_BOLD, 30)

    # mini brand strip
    d.text((50, 50), "SUNNAH UMRAH", font=f_brand, fill=INK)
    d.rectangle((50, 92, 220, 96), fill=GOLD)

    # top headline (bold, big)
    bb = d.textbbox((0, 0), top_line, font=f_top)
    tw = bb[2] - bb[0]
    d.text(((W - tw) // 2, 130), top_line, font=f_top, fill=INK)

    # bottom line (subtitle, soft)
    bb = d.textbbox((0, 0), bottom_line, font=f_bot)
    sw = bb[2] - bb[0]
    d.text(((W - sw) // 2, 230), bottom_line, font=f_bot, fill=INK_SOFT)

    # phone with screenshot
    s = Image.open(shot(shot_key)).convert("RGB")
    phone = phone_mockup(s, target_h=800)
    px = (W - phone.size[0]) // 2
    py = H - phone.size[1] - 130
    bg.alpha_composite(phone, (px, py))

    out = bg.convert("RGB")
    dd  = ImageDraw.Draw(out)
    foot = "FREE · iOS + ANDROID · LINK IN BIO"
    bb  = dd.textbbox((0, 0), foot, font=f_foot)
    fw, pad_x, pad_y = bb[2] - bb[0], 32, 16
    pw, ph = fw + pad_x * 2, 62
    px2 = (W - pw) // 2
    py2 = H - 85
    dd.rounded_rectangle((px2, py2, px2 + pw, py2 + ph),
                         radius=ph // 2, fill=INK)
    dd.text((px2 + pad_x, py2 + pad_y - 2), foot, font=f_foot, fill=WHITE)
    return out

def build_all_heroes():
    print(f"\n▶ Building {len(HEROES)} hero images")
    for slug, key, top, bot in HEROES:
        out = HERO_DIR / f"{slug}.png"
        render_hero(key, top, bot).save(out, "PNG", optimize=True)
        print(f"   ✓ {slug}.png  ({key})")

# ── main ───────────────────────────────────────────────────────────────
async def main():
    only = set(sys.argv[1:])
    build_heroes_flag = "--heroes" in only
    only.discard("--heroes")
    key = os.getenv("EMERGENT_LLM_KEY")
    if not key: sys.exit("EMERGENT_LLM_KEY missing")
    client = OpenAITextToSpeech(api_key=key)

    # NOTE: do not auto-wipe — we rebuild in-place and only overwrite by name
    targets = [s for s in STORY if (not only or s in only)]
    if targets:
        print(f"Building {len(targets)} videos · {VOICE_NAME} · {VOICE_MODEL}")
        for slug in targets:
            await build(slug, STORY[slug], client)

    if build_heroes_flag or not targets:
        build_all_heroes()

    shutil.rmtree(TMP_DIR, ignore_errors=True)
    print("\n✅ DONE")

if __name__ == "__main__":
    asyncio.run(main())
