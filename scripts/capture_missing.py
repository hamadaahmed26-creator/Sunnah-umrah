#!/usr/bin/env python3
"""Capture the missing screens — home scrolled to tools, and tour steps 3,5,7,9,11,13,14."""
import asyncio
from pathlib import Path
from playwright.async_api import async_playwright

BASE = "https://islamic-journey-19.preview.emergentagent.com"
OUT  = Path("/app/screenshots/captured")
OUT.mkdir(parents=True, exist_ok=True)

# (filename, path, lang, tour_step, scroll_y_after_load)
SHOTS = [
    ("home_tools",   "/",     "en", 0, 1100),    # scroll past hero so tools list is visible
    ("home_tools2",  "/",     "en", 0, 1500),    # deeper into tools / today's reminder
    ("tour_step03",  "/tour", "en", 2,  0),
    ("tour_step05",  "/tour", "en", 4,  0),
    ("tour_step07",  "/tour", "en", 6,  0),
    ("tour_step09",  "/tour", "en", 8,  0),
    ("tour_step11",  "/tour", "en", 10, 0),
    ("tour_step13",  "/tour", "en", 12, 0),
    ("tour_step14",  "/tour", "en", 13, 0),
]

VIEWPORT = {"width": 414, "height": 896}

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        ctx = await browser.new_context(
            viewport=VIEWPORT, device_scale_factor=3, is_mobile=True, has_touch=True,
            user_agent="Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) "
                       "AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1",
        )
        page = await ctx.new_page()
        await page.goto(BASE + "/", wait_until="domcontentloaded")

        for name, path, lang, step, scroll_y in SHOTS:
            await page.evaluate(
                """([lang, step]) => {
                    localStorage.setItem('umrah_lang', lang);
                    localStorage.setItem('umrah_tour_step', String(step));
                }""", [lang, step])
            await page.goto(BASE + path, wait_until="networkidle", timeout=30000)
            await page.wait_for_timeout(1200)
            if scroll_y:
                await page.evaluate(f"window.scrollTo(0, {scroll_y})")
                await page.wait_for_timeout(700)
            out = OUT / f"{name}.png"
            await page.screenshot(path=str(out), full_page=False, type="png")
            print(f"  ✓ {name}.png (step={step})")

        await browser.close()

if __name__ == "__main__":
    asyncio.run(main())
