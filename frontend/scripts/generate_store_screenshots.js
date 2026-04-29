#!/usr/bin/env node
/**
 * App Store / Play Store screenshot generator for Sunnah Umrah.
 *
 * Generates a clean set of in-app screenshots using realistic-but-fake mock
 * content (Ahmed, Sara, group code "MAKKAH"), at the exact dimensions Apple
 * and Google require:
 *
 *   • iPhone 6.7" (1290 × 2796) — required by Apple
 *   • Android Phone (1080 × 2400) — recommended by Google
 *
 * Usage:
 *   yarn screenshots
 *
 * Output: /app/store_screenshots/
 *
 * Pre-flight: the dev server (or production deploy) must be running.
 * Defaults to REACT_APP_BACKEND_URL from .env, falls back to localhost:3000.
 */
const { chromium, devices } = require("playwright");
const fs = require("fs");
const path = require("path");

const BASE = (() => {
  try {
    const env = fs.readFileSync(path.join(__dirname, "..", ".env"), "utf8");
    const m = env.match(/REACT_APP_BACKEND_URL=(.+)/);
    if (m) return m[1].trim();
  } catch (_) {}
  return "http://localhost:3000";
})();

const OUT = path.join(__dirname, "..", "..", "store_screenshots");
fs.mkdirSync(OUT, { recursive: true });

// Apple iPhone 6.7" (15 Pro Max) — required for App Store
const IPHONE = { width: 1290 / 3, height: 2796 / 3, deviceScaleFactor: 3 };
// Android phone — Pixel 7 Pro spec
const ANDROID = { width: 1080 / 2.625, height: 2400 / 2.625, deviceScaleFactor: 2.625 };

/** Pre-seed localStorage with a realistic mock state so screens look "alive". */
const mockInit = () => {
  // Group state
  localStorage.setItem("umrah_user_name", "Ahmed");
  localStorage.setItem("umrah_user_id", "u_demo_ahmed");
  localStorage.setItem("umrah_group_code", "MAKKAH");
  localStorage.setItem("umrah_group_share_loc", "0");
  // Tour progress
  localStorage.setItem("umrah_tawaf_count", "3");
  localStorage.setItem("umrah_sai_count", "0");
  localStorage.setItem("umrah_step", "tawaf");
  // Welcome dismissed
  localStorage.setItem("umrah_welcome_seen", "1");
};

const SHOTS = [
  { name: "01-tour-home", url: "/tour", caption: "Step-by-step Umrah, the Sunnah way." },
  { name: "02-tawaf-lap", url: "/tour", caption: "Lap-by-lap Tawaf with authentic du'as.", scrollTo: "#tawaf-flow" },
  { name: "03-qibla", url: "/qibla", caption: "Qibla compass, anywhere in the world." },
  { name: "04-plan", url: "/plan", caption: "Prayer times for Makkah, eSIM & hotels in one place." },
  { name: "05-group", url: "/group", caption: "Stay together with your family — safely." },
  { name: "06-lost", url: "/lost", caption: "Lost in the crowd? Find your nearest gate." },
  { name: "07-places", url: "/places", caption: "26 historic Ziyārah sites in Makkah & Madīnah." },
  { name: "08-chat", url: "/chat", caption: "Ask anything — AI grounded in the Sunnah." },
];

async function run(deviceName, viewport) {
  const browser = await chromium.launch();
  const ctx = await browser.newContext({
    viewport: { width: Math.round(viewport.width), height: Math.round(viewport.height) },
    deviceScaleFactor: viewport.deviceScaleFactor,
    isMobile: true,
    hasTouch: true,
    userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1",
  });
  await ctx.addInitScript(mockInit);

  const page = await ctx.newPage();
  for (const shot of SHOTS) {
    console.log(`[${deviceName}] ${shot.name}`);
    await page.goto(`${BASE}${shot.url}`, { waitUntil: "networkidle", timeout: 30000 });
    await page.waitForTimeout(1200);
    const filePath = path.join(OUT, `${deviceName}-${shot.name}.png`);
    await page.screenshot({ path: filePath, fullPage: false });
  }

  await browser.close();
}

(async () => {
  console.log(`Backend: ${BASE}\nOutput: ${OUT}\n`);
  await run("ios", IPHONE);
  await run("android", ANDROID);
  console.log("\n✅ Done. Screenshots saved to /app/store_screenshots/");
  console.log(
    "Captions for App Store / Play Store listing:\n" +
      SHOTS.map((s, i) => `  ${i + 1}. ${s.caption}`).join("\n")
  );
})();
