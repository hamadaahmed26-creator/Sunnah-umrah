#!/usr/bin/env python3
"""Build circle-safe profile pictures from the real Sunnah Umrah app icon.
Output: 1080x1080 PNGs suitable for TikTok / Instagram avatars (circular crop)."""
from pathlib import Path
from PIL import Image, ImageDraw, ImageFilter

OUT = Path("/app/frontend/public/marketing/hero")
ICON = "/app/frontend/public/icon-512.png"

CREAM_TOP = (248, 246, 240)
CREAM_BOT = (235, 229, 214)
INK       = (28, 29, 27)
GOLD      = (179, 136, 77)

def gradient(w, h, top, bot):
    img = Image.new("RGB", (w, h), top); px = img.load()
    for y in range(h):
        t = y / max(1, h - 1)
        c = tuple(int(top[i] + (bot[i] - top[i]) * t) for i in range(3))
        for x in range(w): px[x, y] = c
    return img

def build(scale_pct, bg_kind, fname):
    """bg_kind: 'cream', 'ink', 'gold'."""
    W = H = 1080
    if bg_kind == "cream":
        bg = gradient(W, H, CREAM_TOP, CREAM_BOT)
    elif bg_kind == "ink":
        bg = Image.new("RGB", (W, H), INK)
        # add subtle radial gold glow
        glow = Image.new("L", (W, H), 0)
        gd = ImageDraw.Draw(glow)
        gd.ellipse((W//2-380, H//2-380, W//2+380, H//2+380), fill=120)
        glow = glow.filter(ImageFilter.GaussianBlur(160))
        gold_layer = Image.new("RGB", (W, H), (100, 70, 25))
        bg.paste(gold_layer, (0, 0), glow)
    else:  # gold
        bg = Image.new("RGB", (W, H), GOLD)

    bg = bg.convert("RGBA")
    # icon
    icon = Image.open(ICON).convert("RGBA")
    target = int(W * scale_pct / 100)
    icon = icon.resize((target, target), Image.LANCZOS)
    # drop shadow
    sh = Image.new("RGBA", (target + 80, target + 80), (0, 0, 0, 0))
    sd = ImageDraw.Draw(sh)
    sd.rounded_rectangle((40, 60, target + 40, target + 60), radius=target // 5, fill=(0, 0, 0, 80))
    sh = sh.filter(ImageFilter.GaussianBlur(24))
    bg.alpha_composite(sh, ((W - sh.size[0]) // 2, (H - sh.size[1]) // 2 + 10))
    # icon centered
    bg.alpha_composite(icon, ((W - target) // 2, (H - target) // 2))
    bg.convert("RGB").save(OUT / fname, "PNG", optimize=True)
    print(f"✓ {fname}")

# Profile pic = icon big & centered. ALL pixels inside a 540-radius circle from center.
# At scale 70 the icon is 756px, fits well inside an 1080 circle (radius 540) with breathing room.
build(72, "cream", "profile_cream.png")
build(70, "ink",   "profile_ink.png")
# extra: a "story / banner" wide cover 1500x500 isn't needed for TikTok/IG avatars — skip.
