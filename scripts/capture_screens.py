#!/usr/bin/env python3
"""
Capture all the app screenshots we need for the new marketing videos.
Visits the live preview URL, sets localStorage to reach specific tour steps
and language, then screenshots each viewport.

Run:  python3 scripts/capture_screens.py
Output: /app/screenshots/captured/<name>.png  (414 x 896, mobile portrait)
"""

import asyncio
from pathlib import Path

from playwright.async_api import async_playwright

BASE = "https://islamic-journey-19.preview.emergentagent.com"
OUT  = Path("/app/screenshots/captured")
OUT.mkdir(parents=True, exist_ok=True)

# (filename, path, lang, tour_step, scroll_y_after_load, extra_click_testid)
SHOTS = [
    # English app
    ("home_en",          "/",          "en", 0,  0,    None),
    ("checklist_top",    "/checklist", "en", 0,  0,    None),
    ("checklist_mid",    "/checklist", "en", 0,  900,  None),
    ("checklist_bottom", "/checklist", "en", 0,  1900, None),
    ("walk_haram",       "/walk-haram","en", 0,  0,    None),
    ("group",            "/group",     "en", 0,  0,    None),
    ("chat",             "/chat",      "en", 0,  0,    None),
    ("qibla",            "/qibla",     "en", 0,  0,    None),
    ("lost",             "/lost",      "en", 0,  0,    None),
    ("places",           "/places",    "en", 0,  0,    None),
    ("quiz",             "/quiz",      "en", 0,  0,    None),
    ("faq",              "/faq",       "en", 0,  0,    None),
    # Tour steps (umrah_tour_step is 0-indexed; the app labels them 1/15..15/15)
    ("tour_step01",      "/tour",      "en", 0,  0,    None),
    ("tour_step02",      "/tour",      "en", 1,  0,    None),
    ("tour_step04",      "/tour",      "en", 3,  0,    None),
    ("tour_step06",      "/tour",      "en", 5,  0,    None),
    ("tour_step08",      "/tour",      "en", 7,  0,    None),
    ("tour_step10",      "/tour",      "en", 9,  0,    None),
    ("tour_step12",      "/tour",      "en", 11, 0,    None),
    ("tour_step15",      "/tour",      "en", 14, 0,    None),
    # Glossary bottom-sheet (Terms button)
    ("tour_glossary",    "/tour",      "en", 1,  0,    "tour-glossary"),
    # Arabic
    ("home_ar",          "/",          "ar", 0,  0,    None),
    ("tour_step02_ar",   "/tour",      "ar", 1,  0,    None),
]

VIEWPORT = {"width": 414, "height": 896}  # iPhone-ish portrait

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        ctx = await browser.new_context(
            viewport=VIEWPORT,
            device_scale_factor=3,        # 3x = retina-quality PNG (1242 x 2688)
            is_mobile=True,
            has_touch=True,
            user_agent="Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) "
                       "AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1",
        )

        # Prime localStorage on a blank page first
        page = await ctx.new_page()
        await page.goto(BASE + "/", wait_until="domcontentloaded")

        for name, path, lang, step, scroll_y, click_id in SHOTS:
            try:
                # Set state in localStorage BEFORE navigating to the route
                await page.evaluate(
                    """([lang, step]) => {
                        localStorage.setItem('umrah_lang', lang);
                        localStorage.setItem('umrah_tour_step', String(step));
                    }""",
                    [lang, step],
                )
                await page.goto(BASE + path, wait_until="networkidle", timeout=30000)
                await page.wait_for_timeout(1200)

                if scroll_y:
                    await page.evaluate(f"window.scrollTo(0, {scroll_y})")
                    await page.wait_for_timeout(700)

                if click_id:
                    try:
                        await page.click(f'[data-testid="{click_id}"]', timeout=4000)
                        await page.wait_for_timeout(900)
                    except Exception as e:
                        print(f"  ! click {click_id} failed: {e}")

                out = OUT / f"{name}.png"
                await page.screenshot(path=str(out), full_page=False, type="png")
                print(f"  ✓ {name}.png  ({path}, step={step}, lang={lang})")
            except Exception as e:
                print(f"  ✗ {name} FAILED: {e}")

        await browser.close()
    print("\nDone →", OUT)

if __name__ == "__main__":
    asyncio.run(main())
