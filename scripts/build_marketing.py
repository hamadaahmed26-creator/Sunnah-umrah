#!/usr/bin/env python3
"""
Sunnah Umrah — Marketing asset generator v3
─────────────────────────────────────────────
Generates 10 vertical (1080x1920) marketing videos for TikTok/Reels
with:
  * Onyx MALE voiceover via OpenAI TTS (Emergent LLM key)
  * Multi-segment storyboards so EACH spoken line is paired
    with a DIFFERENT app screenshot (audio↔video sync)
  * 3 hero image sizes per video (9:16, 4:5, 1:1) — each
    composition distinct (different screenshot + different headline)

Re-runnable. Cleans temp files on success.
"""

import asyncio
import os
import shutil
import subprocess
import sys
import textwrap
from pathlib import Path

from dotenv import load_dotenv
from emergentintegrations.llm.openai import OpenAITextToSpeech
from PIL import Image, ImageDraw, ImageFilter, ImageFont

load_dotenv("/app/backend/.env")

# ── paths ───────────────────────────────────────────────────────────────
ROOT       = Path("/app/frontend/public/marketing")
VIDEOS_DIR = ROOT / "videos"
HERO_DIR   = ROOT / "hero"
TMP_DIR    = Path("/app/.build_tmp")
SHOTS      = Path("/app/screenshots")

for d in (VIDEOS_DIR, HERO_DIR, TMP_DIR):
    d.mkdir(parents=True, exist_ok=True)

# ── fonts ───────────────────────────────────────────────────────────────
F_BOLD = "/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf"
F_REG  = "/usr/share/fonts/truetype/liberation/LiberationSans-Regular.ttf"
F_SER  = "/usr/share/fonts/truetype/liberation/LiberationSerif-Bold.ttf"

def font(path, size):
    return ImageFont.truetype(path, size)

# ── brand palette ──────────────────────────────────────────────────────
BG_TOP    = (248, 246, 240)   # cream
BG_BOT    = (235, 229, 214)   # darker cream
INK       = (28, 29, 27)
INK_SOFT  = (92, 93, 88)
GOLD      = (179, 136, 77)
GOLD_DARK = (139, 106, 31)
WHITE     = (255, 255, 255)

# ── voice config ───────────────────────────────────────────────────────
VOICE_MODEL = "tts-1-hd"
VOICE_NAME  = "onyx"          # deep male
VOICE_SPEED = 0.95            # slightly slow & considered

# ── storyboards ────────────────────────────────────────────────────────
# Each video = list of (line_to_speak, screenshot_key, on-screen-headline)
# screenshot_key: home | tour | qibla | group | faq | checklist
# headline: short text overlaid on the frame (≤ ~30 chars per line)

STORY = {
    "01_three-mistakes": {
        "title": "3 mistakes everyone makes on their first Umrah",
        "segments": [
            ("Three mistakes almost every first-time pilgrim makes on Umrah.",
             "home",  "3 MISTAKES\nFIRST-TIME\nPILGRIMS MAKE"),
            ("Mistake one. Reading long invocations at the Black Stone "
             "that are not from the Sunnah. The Prophet, peace be upon him, "
             "only said: Bismillah, Allahu Akbar.",
             "tour",  "Mistake 1\nMade-up duas\nat the Black Stone"),
            ("Mistake two. Restarting Tawaf when your wudū breaks. "
             "You don't restart. You resume from the lap you were on.",
             "faq",   "Mistake 2\nRestarting Tawaf\nafter wudū breaks"),
            ("Mistake three. Following the crowd instead of the Sunnah. "
             "Every step in Sunnah Umrah is cited — Bukhari, Muslim, "
             "Hisn al-Muslim. Free on iOS.",
             "tour",  "Mistake 3\nFollowing\nthe crowd"),
            ("Sunnah Umrah. Free. iOS now. Link in bio.",
             "home",  "FREE\nNo ads · iOS\nLink in bio"),
        ],
    },

    "02_stay-together": {
        "title": "Why your group always loses each other",
        "segments": [
            ("If you've been in the Mataf at Maghrib, you know — "
             "phones don't work. You can't shout. "
             "And your family becomes a needle in two million haystacks.",
             "home",  "PHONES DON'T\nWORK IN\nTHE MATAF"),
            ("Sunnah Umrah's Stay Together. One six-letter code. "
             "Everyone in your group joins. A quiet map shows you each other.",
             "group", "ONE CODE.\nWHOLE GROUP.\nSTAY TOGETHER."),
            ("No login. No tracking. Auto-deletes when you're done. "
             "Free on iOS. Link in bio.",
             "group", "No login · No tracking\nAuto-deletes\nFree · iOS"),
        ],
    },

    "03_before-you-fly": {
        "title": "Watch this 30 sec before you fly for Umrah",
        "segments": [
            ("If you've booked your Umrah ticket — save this.",
             "home",  "BEFORE\nYOU FLY\nFOR UMRAH"),
            ("Most first-time pilgrims learn these things at the Miqāt, "
             "when it's already too late.",
             "checklist", "Don't wait\nuntil the Miqāt\nto find out"),
            ("Sunnah Umrah's pre-flight checklist walks you through every "
             "ihrām, niyyah and dua before you board the plane.",
             "checklist", "PRE-FLIGHT\nCHECKLIST\nbuilt for you"),
            ("Free. iOS. Link in bio.",
             "home",  "FREE\niOS now\nLink in bio"),
        ],
    },

    "04_black-stone-dua": {
        "title": "The dua most pilgrims forget at the Black Stone",
        "segments": [
            ("The dua most pilgrims forget at the Black Stone.",
             "home",  "THE DUA\nAT THE\nBLACK STONE"),
            ("Bismillah. Allahu Akbar. That's it. Authentic. Sahih al-Bukhari.",
             "tour",  "Bismillāh,\nAllāhu Akbar.\n— Bukhārī"),
            ("Every other long invocation people read on signs at the "
             "corner — not from the Sunnah. Every dua in Sunnah Umrah "
             "is cited. Free on iOS.",
             "faq",   "Every dua\ncited.\nFree · iOS"),
        ],
    },

    "05_sourced-only": {
        "title": "Sunnah-only · every dua sourced",
        "segments": [
            ("Why I made another Umrah app.",
             "home",  "WHY ANOTHER\nUMRAH APP?"),
            ("Because folk practices keep getting mixed with the Sunnah, "
             "and pilgrims can't tell which is which.",
             "tour",  "Folk practices\nmixed with\nthe Sunnah"),
            ("So I built one where every word has a source. "
             "Bukhari. Muslim. Hisn al-Muslim. The manāsik works of "
             "Shaykh al-Albani, rahimahullah.",
             "tour",  "Bukhārī · Muslim\nḤiṣn · Albānī\nEVERY WORD CITED"),
            ("Open the app. Tap any dua. See the hadith number. "
             "Free on iOS.",
             "faq",   "Tap any dua →\nSee the\nhadith number"),
        ],
    },

    "06_wudu-broken": {
        "title": "What to do if wudū breaks during Tawaf",
        "segments": [
            ("Your wudū broke during Tawaf. What do you do?",
             "home",  "WUDŪ BROKE\nDURING\nTAWAF?"),
            ("Don't panic. Leave the Mataf. Make wudū. Come back. "
             "Resume from the lap you were on. You don't restart. "
             "Shaykh Ibn Bāz, rahimahullah.",
             "faq",   "Resume —\ndon't restart.\n— Ibn Bāz"),
            ("The FAQ inside Sunnah Umrah has the cited answer, "
             "plus fifty more pilgrim questions. Free on iOS.",
             "faq",   "50+ pilgrim Qs\nfully cited\nFree · iOS"),
        ],
    },

    "07_no-ads": {
        "title": "Free · No ads · No tracking",
        "segments": [
            ("No ads.",
             "home",  "NO ADS."),
            ("No tracking. No advertising ID. No analytics. "
             "No account required.",
             "home",  "NO TRACKING.\nNO ANALYTICS.\nNO LOGIN."),
            ("We collect almost nothing. Because your Umrah is between "
             "you and Allah. Not us.",
             "tour",  "Your Umrah is\nbetween you\nand Allah."),
            ("Sunnah Umrah. Free on iOS. Link in bio.",
             "home",  "FREE\niOS\nLink in bio"),
        ],
    },

    "08_five-features": {
        "title": "5 features your Umrah app should have",
        "segments": [
            ("Five features your Umrah app should have. Most don't.",
             "home",  "5 FEATURES\nYOUR UMRAH APP\nSHOULD HAVE"),
            ("One. A step-by-step Tour with cited sources.",
             "tour",  "① Step-by-step\nTour\nwith sources"),
            ("Two. Tawaf and Sa'i counters that work in the crowd.",
             "tour",  "② Tawaf + Saʿī\ncounters\nfor the crowd"),
            ("Three. I'm Lost — nearest gate by GPS, and Qibla wherever you are.",
             "qibla", "③ I'm Lost\n+ Qibla\nanywhere"),
            ("Four. A group code to find your family when phones don't work.",
             "group", "④ Group code\nfind family\nin the crowd"),
            ("Five. Hisn al-Muslim, fully organised. "
             "All five inside Sunnah Umrah. Free on iOS.",
             "faq",   "⑤ Ḥiṣn al-Muslim\norganised\nFree · iOS"),
        ],
    },

    "09_first-tawaf": {
        "title": "Your first Tawaf, explained in 30 seconds",
        "segments": [
            ("Your first Tawaf, explained in thirty seconds. Save this.",
             "home",  "YOUR FIRST\nTAWAF · 30 SEC"),
            ("Enter from any gate. Walk to the Mataf. Find the Black Stone corner.",
             "tour",  "1 → Enter\n2 → Mataf\n3 → Black Stone"),
            ("Face it. Right hand up. Say: Bismillah, Allahu Akbar.",
             "tour",  "Face it.\nHand up.\n\"Bismillāh, Allāhu Akbar\""),
            ("Walk to your right. Seven laps. Two rakaʿat at Maqām Ibrāhīm. "
             "Then drink Zamzam.",
             "qibla", "7 laps\n2 rakʿah\nMaqām → Zamzam"),
            ("Every step with its source, inside Sunnah Umrah. Free on iOS.",
             "home",  "Every step\nfully cited.\nFree · iOS"),
        ],
    },

    "10_for-my-mother": {
        "title": "The only Umrah app I'd give my mother",
        "segments": [
            ("I built this for my mother.",
             "home",  "I BUILT\nTHIS FOR\nMY MOTHER."),
            ("She wanted to perform Umrah. The apps she could find were "
             "full of ads and made-up duas.",
             "tour",  "She wanted Umrah.\nApps were full\nof ads."),
            ("So I built one. Free. No ads. Every word cited. Step by step.",
             "checklist", "Free.\nNo ads.\nEvery word cited."),
            ("For her. For yours. iOS now. Android coming soon.",
             "home",  "For her.\nFor yours.\niOS · Android soon"),
        ],
    },
}

# Hero image override — each video gets a DISTINCT primary screenshot
# + DISTINCT headline so the 30 hero PNGs look visually varied
HERO_PRIMARY = {
    "01_three-mistakes":  ("tour",      "3 MISTAKES\nfirst-time pilgrims make"),
    "02_stay-together":   ("group",     "ONE CODE\nwhole group\nstays together"),
    "03_before-you-fly":  ("checklist", "BEFORE YOU FLY\npre-flight checklist"),
    "04_black-stone-dua": ("tour",      "ONE DUA\nat the Black Stone"),
    "05_sourced-only":    ("faq",       "EVERY WORD CITED\nBukhārī · Muslim · Albānī"),
    "06_wudu-broken":     ("faq",       "WUDŪ BROKE?\nDon't restart Tawaf"),
    "07_no-ads":          ("home",      "NO ADS · NO TRACKING\nyour Umrah, yours"),
    "08_five-features":   ("qibla",     "5 FEATURES\nQibla anywhere"),
    "09_first-tawaf":     ("tour",      "FIRST TAWAF\nin 30 seconds"),
    "10_for-my-mother":   ("home",      "BUILT FOR\nMY MOTHER"),
}

# ── helpers ────────────────────────────────────────────────────────────
def shot_path(key: str) -> Path:
    return SHOTS / f"{ {'home':'01_home','tour':'02_tour','qibla':'03_qibla','group':'04_group','faq':'05_faq','checklist':'06_checklist'}[key] }.png"

def vertical_gradient(w, h, top, bot):
    img = Image.new("RGB", (w, h), top)
    px = img.load()
    for y in range(h):
        t = y / max(1, h - 1)
        r = int(top[0] + (bot[0] - top[0]) * t)
        g = int(top[1] + (bot[1] - top[1]) * t)
        b = int(top[2] + (bot[2] - top[2]) * t)
        for x in range(w):
            px[x, y] = (r, g, b)
    return img

def draw_centered_block(draw, text, font_obj, fill, cx, top, line_gap=10, max_width=None):
    """Draw multi-line text block centered horizontally, returns bottom y."""
    lines = text.split("\n")
    y = top
    for line in lines:
        bbox = draw.textbbox((0, 0), line, font=font_obj)
        w = bbox[2] - bbox[0]
        h = bbox[3] - bbox[1]
        draw.text((cx - w // 2, y), line, font=font_obj, fill=fill)
        y += h + line_gap
    return y

def phone_mockup(screenshot: Image.Image, target_h: int) -> Image.Image:
    """Wrap an app screenshot in a thin rounded-rect 'phone' bezel.
    Returns RGBA image scaled so its height == target_h."""
    sw, sh = screenshot.size
    scale = target_h / sh
    new_w = int(sw * scale)
    inner = screenshot.resize((new_w, target_h), Image.LANCZOS)

    bezel = 14
    radius = 60
    W = new_w + bezel * 2
    H = target_h + bezel * 2
    canvas = Image.new("RGBA", (W, H), (0, 0, 0, 0))

    # bezel (dark)
    bez_layer = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    bd = ImageDraw.Draw(bez_layer)
    bd.rounded_rectangle((0, 0, W, H), radius=radius, fill=(20, 21, 19, 255))
    canvas.alpha_composite(bez_layer)

    # mask the screenshot to inner rounded rect
    mask = Image.new("L", (new_w, target_h), 0)
    md = ImageDraw.Draw(mask)
    md.rounded_rectangle((0, 0, new_w, target_h), radius=radius - bezel - 4, fill=255)
    canvas.paste(inner, (bezel, bezel), mask)

    # soft drop shadow
    shadow = Image.new("RGBA", (W + 60, H + 60), (0, 0, 0, 0))
    sd = ImageDraw.Draw(shadow)
    sd.rounded_rectangle((30, 40, W + 30, H + 40), radius=radius, fill=(0, 0, 0, 90))
    shadow = shadow.filter(ImageFilter.GaussianBlur(18))
    shadow.alpha_composite(canvas, (30, 30))
    return shadow

def render_video_frame(width: int, height: int, screenshot_key: str, headline: str, footer: str) -> Image.Image:
    """1080x1920 portrait frame."""
    bg = vertical_gradient(width, height, BG_TOP, BG_BOT)
    draw = ImageDraw.Draw(bg)

    # top brand strip
    f_brand = font(F_BOLD, 36)
    f_tag   = font(F_REG, 26)
    f_head  = font(F_BOLD, 84)
    f_foot  = font(F_BOLD, 34)

    draw.text((width // 2 - 220, 90), "SUNNAH UMRAH", font=f_brand, fill=INK)
    # gold underline
    draw.rectangle((width // 2 - 90, 140, width // 2 + 90, 144), fill=GOLD)
    draw.text((width // 2 - 230, 160), "the calm Umrah companion", font=f_tag, fill=INK_SOFT)

    # headline — wrap by lines provided in storyboard
    head_top = 250
    draw_centered_block(draw, headline, f_head, INK, width // 2, head_top, line_gap=14)

    # phone mockup with screenshot
    shot = Image.open(shot_path(screenshot_key)).convert("RGB")
    phone = phone_mockup(shot, target_h=950)
    px = (width - phone.size[0]) // 2
    py = height - phone.size[1] - 200
    bg_rgba = bg.convert("RGBA")
    bg_rgba.alpha_composite(phone, (px, py))

    # footer pill
    out = bg_rgba.convert("RGB")
    fd = ImageDraw.Draw(out)
    bbox = fd.textbbox((0, 0), footer, font=f_foot)
    fw = bbox[2] - bbox[0]
    pad_x, pad_y = 36, 18
    pill_w = fw + pad_x * 2
    pill_h = 70
    pill_x = (width - pill_w) // 2
    pill_y = height - 130
    fd.rounded_rectangle((pill_x, pill_y, pill_x + pill_w, pill_y + pill_h),
                         radius=pill_h // 2, fill=INK)
    fd.text((pill_x + pad_x, pill_y + pad_y - 4), footer, font=f_foot, fill=WHITE)
    return out

def render_hero(size_label: str, screenshot_key: str, headline: str, video_no: str) -> Image.Image:
    """size_label: '9x16' (1080x1920) | '4x5' (1080x1350) | '1x1' (1080x1080)"""
    dims = {"9x16": (1080, 1920), "4x5": (1080, 1350), "1x1": (1080, 1080)}
    W, H = dims[size_label]
    bg = vertical_gradient(W, H, BG_TOP, BG_BOT)
    draw = ImageDraw.Draw(bg)

    f_brand = font(F_BOLD, 32)
    f_num   = font(F_BOLD, 26)
    f_head  = font(F_BOLD, 76 if size_label == "9x16" else 64)
    f_foot  = font(F_BOLD, 30)

    # top: small video number tag + brand
    draw.text((60, 60), f"VIDEO {video_no}", font=f_num, fill=GOLD_DARK)
    bb = draw.textbbox((0, 0), "SUNNAH UMRAH", font=f_brand)
    draw.text((W - (bb[2] - bb[0]) - 60, 58), "SUNNAH UMRAH", font=f_brand, fill=INK)

    # headline
    head_top = 160 if size_label != "1x1" else 110
    draw_centered_block(draw, headline, f_head, INK, W // 2, head_top, line_gap=12)

    # phone scaled to size
    phone_h = {"9x16": 1100, "4x5": 780, "1x1": 640}[size_label]
    shot = Image.open(shot_path(screenshot_key)).convert("RGB")
    phone = phone_mockup(shot, target_h=phone_h)
    bg_rgba = bg.convert("RGBA")
    px = (W - phone.size[0]) // 2
    py = H - phone.size[1] - (160 if size_label != "1x1" else 90)
    bg_rgba.alpha_composite(phone, (px, py))

    out = bg_rgba.convert("RGB")
    fd = ImageDraw.Draw(out)
    foot = "FREE · iOS · LINK IN BIO"
    bbox = fd.textbbox((0, 0), foot, font=f_foot)
    fw = bbox[2] - bbox[0]
    pad_x, pad_y = 30, 16
    pill_w = fw + pad_x * 2
    pill_h = 64
    pill_x = (W - pill_w) // 2
    pill_y = H - 100
    fd.rounded_rectangle((pill_x, pill_y, pill_x + pill_w, pill_y + pill_h),
                         radius=pill_h // 2, fill=INK)
    fd.text((pill_x + pad_x, pill_y + pad_y - 2), foot, font=f_foot, fill=WHITE)
    return out

# ── ffmpeg helpers ─────────────────────────────────────────────────────
def run(cmd, **kw):
    r = subprocess.run(cmd, capture_output=True, text=True, **kw)
    if r.returncode != 0:
        sys.stderr.write(f"\nCMD FAILED: {' '.join(cmd)}\nSTDERR:\n{r.stderr[-1200:]}\n")
        raise SystemExit(1)
    return r

def probe_duration(path: Path) -> float:
    r = subprocess.run(
        ["ffprobe", "-v", "error", "-show_entries", "format=duration",
         "-of", "default=noprint_wrappers=1:nokey=1", str(path)],
        capture_output=True, text=True,
    )
    return float(r.stdout.strip() or "0")

# ── TTS ────────────────────────────────────────────────────────────────
async def tts(text: str, out_path: Path, tts_client):
    audio = await tts_client.generate_speech(
        text=text,
        model=VOICE_MODEL,
        voice=VOICE_NAME,
        speed=VOICE_SPEED,
        response_format="mp3",
    )
    out_path.write_bytes(audio)

# ── per-video pipeline ─────────────────────────────────────────────────
async def build_video(slug_id: str, data: dict, tts_client):
    print(f"\n▶ {slug_id}  ({data['title']})")
    workdir = TMP_DIR / slug_id
    if workdir.exists():
        shutil.rmtree(workdir)
    workdir.mkdir(parents=True)

    seg_mp4s = []
    seg_mp3s = []

    for i, (line, shot_key, headline) in enumerate(data["segments"], start=1):
        seg_mp3 = workdir / f"seg_{i:02d}.mp3"
        seg_png = workdir / f"seg_{i:02d}.png"
        seg_mp4 = workdir / f"seg_{i:02d}.mp4"

        # 1) generate voice for this line
        await tts(line, seg_mp3, tts_client)
        dur = probe_duration(seg_mp3)
        # add small breath padding (0.35s) after each line for natural pacing
        dur_with_tail = dur + 0.35
        print(f"   · seg {i}: {dur:.2f}s  → {shot_key}  | {headline[:40]}")

        # 2) build the frame for this segment
        footer = "FREE · iOS · LINK IN BIO"
        frame = render_video_frame(1080, 1920, shot_key, headline, footer)
        frame.save(seg_png, "PNG")

        # 3) build the segment video (still image + audio, padded tail)
        # Pad MP3 with silence so total length == dur_with_tail
        seg_mp3_padded = workdir / f"seg_{i:02d}_padded.mp3"
        run([
            "ffmpeg", "-y",
            "-i", str(seg_mp3),
            "-af", f"apad=pad_dur=0.35",
            "-c:a", "libmp3lame", "-q:a", "4",
            str(seg_mp3_padded),
        ])
        run([
            "ffmpeg", "-y",
            "-loop", "1", "-i", str(seg_png),
            "-i", str(seg_mp3_padded),
            "-c:v", "libx264", "-tune", "stillimage", "-pix_fmt", "yuv420p",
            "-r", "30",
            "-c:a", "aac", "-b:a", "160k",
            "-shortest",
            "-movflags", "+faststart",
            str(seg_mp4),
        ])
        seg_mp4s.append(seg_mp4)
        seg_mp3s.append(seg_mp3_padded)

    # 4) concat segments → final video
    concat_list = workdir / "list.txt"
    concat_list.write_text("".join(f"file '{p}'\n" for p in seg_mp4s))
    final_mp4 = VIDEOS_DIR / f"{slug_id}.mp4"
    run([
        "ffmpeg", "-y",
        "-f", "concat", "-safe", "0",
        "-i", str(concat_list),
        "-c:v", "libx264", "-pix_fmt", "yuv420p",
        "-r", "30",
        "-c:a", "aac", "-b:a", "160k",
        "-movflags", "+faststart",
        str(final_mp4),
    ])

    # 5) concat MP3s → final voiceover
    mp3_list = workdir / "mp3_list.txt"
    mp3_list.write_text("".join(f"file '{p}'\n" for p in seg_mp3s))
    final_mp3 = VIDEOS_DIR / f"{slug_id}.mp3"
    run([
        "ffmpeg", "-y",
        "-f", "concat", "-safe", "0",
        "-i", str(mp3_list),
        "-c:a", "libmp3lame", "-q:a", "4",
        str(final_mp3),
    ])

    total = probe_duration(final_mp4)
    print(f"   ✓ {slug_id}.mp4 — {total:.1f}s")

def build_hero(slug_id: str):
    shot_key, headline = HERO_PRIMARY[slug_id]
    video_no = slug_id.split("_")[0]
    for size in ("9x16", "4x5", "1x1"):
        img = render_hero(size, shot_key, headline, video_no)
        out = HERO_DIR / f"{slug_id}_{size}.png"
        img.save(out, "PNG", optimize=True)
    print(f"   ✓ hero {slug_id} (3 sizes — screenshot:{shot_key})")

# ── main ───────────────────────────────────────────────────────────────
async def main():
    only = set(sys.argv[1:])    # optional filter, e.g.  python build_marketing.py 01_three-mistakes
    key = os.getenv("EMERGENT_LLM_KEY")
    if not key:
        sys.exit("EMERGENT_LLM_KEY not loaded — check /app/backend/.env")
    tts_client = OpenAITextToSpeech(api_key=key)

    targets = [s for s in STORY if (not only or s in only)]
    print(f"Building {len(targets)} videos · voice={VOICE_NAME} · model={VOICE_MODEL}")

    for slug in targets:
        await build_video(slug, STORY[slug], tts_client)
        build_hero(slug)

    # cleanup tmp
    shutil.rmtree(TMP_DIR, ignore_errors=True)
    print("\n✅ DONE — /app/frontend/public/marketing/{videos,hero}")

if __name__ == "__main__":
    asyncio.run(main())
