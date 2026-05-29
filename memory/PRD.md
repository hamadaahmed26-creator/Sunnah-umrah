# Sunnah Umrah — App Store Deployment PRD

## Original Problem Statement
Deploy the existing full-stack Sunnah Umrah app (React + FastAPI + MongoDB, with Capacitor 7 mobile wrapper) to BOTH the Apple App Store and Google Play Store **without owning a Mac**. Solution: use Codemagic cloud CI/CD.

## Tech Stack
- **Frontend**: React (in `/app/frontend`)
- **Backend**: FastAPI (in `/app/backend`)
- **Database**: MongoDB
- **Mobile**: Capacitor 7 — iOS at `/app/frontend/ios`, Android at `/app/frontend/android`
- **CI/CD**: Codemagic
- **Apple Team ID**: D59QBAUF9K | App Store Connect App ID: 6769159262 | Bundle ID: com.sunnahumrah.app
- **Production URL**: https://sunnahumrah.app
- **User email**: Hamada.ahmed26@hotmail.com
- **Codemagic ASC integration name**: `Codemagic` (Key ID: 6QS4FVVAG8)

## Marketing Assets (2026-02-15 — v7 final, audio sync fixed, iOS + Android framing)

### Pipeline (`/app/scripts/build_marketing_v4.py`)
- 23 source screenshots in `/app/screenshots/captured/` (captured via Playwright from live preview app)
- Voice: OpenAI TTS `tts-1-hd`, voice `onyx` (deep male), speed 0.95 — via Emergent LLM key
- Per-segment build: TTS each line → measure exact duration → render PNG → `ffmpeg -loop 1 -t <dur>` to enforce exact per-segment frame count
- Audio concat: ffmpeg `concat` FILTER (not demuxer) → clean AAC stream whose frame count matches wall time (demuxer reported phantom +5–7s tails in v5/v6)
- Final mux: stream-copy video + stream-copy audio (no re-encoding)
- Sync delta across all 6 videos: ±0.04 sec audio vs video stream

### 6 final videos (in `/app/frontend/public/marketing/videos/`)
- 01 The Tools (38s) — Walk to Ḥaram → Stay Together → Ask → Qibla → I'm Lost → Ziyārah → Quiz
- 02 Every step guided (51s) — 13 segments through whole Umrah, NO step numbers spoken (per user feedback)
- 03 Switch to Arabic (20s) — toggle + Arabic home + Arabic tour
- 04 Get Ready (24s) — checklist top + mid + bottom scrolls
- 05 Terms / Glossary (22s) — Tour Terms button → Glossary bottom-sheet
- 06 Lost in Makkah (23s) — Stay Together + I'm Lost

### 12 hero images (in `/app/frontend/public/marketing/hero/`)
- 1080×1350 Instagram-feed format, every one a different app screen + different headline:
  01_tools · 02_walk-haram · 03_stay-together · 04_ask · 05_qibla · 06_lost · 07_ziyarah · 08_quiz · 09_every-step · 10_glossary · 11_checklist · 12_arabic

### CTA framing
- Every voiceover, headline, footer pill, and caption says **"iOS + Android"** (not iOS only) — user is finalising Android Play Store deployment separately
- Dashboard URL: `https://islamic-journey-19.preview.emergentagent.com/marketing/index.html`
- Banner: "Launch Kit · v7 (no silent tails · iOS + Android)"
- Cache-buster `?v=7` on every asset link

## TravelPayouts / Aviasales LIVE flights API (2026-02-29)
- API token + marker stored in `/app/backend/.env` only (NEVER frontend)
- Backend proxy at `/app/backend/routes/flights.py`:
  - `GET /api/flights/cheapest?destination=JED|MED` → single cheapest fare for home banner (30 min server cache)
  - `GET /api/flights/search?destination=...&limit=15` → list of fares
- Every `book_url` embeds `marker=525646` + `sub_id` (home-banner vs flights-page) for commission attribution + click-source tracking
- Frontend:
  - `/app/frontend/src/components/FlightsTeaser.jsx` — live "Cheapest flights this week" banner on home
  - `/app/frontend/src/pages/Flights.jsx` — dedicated page with JED/MED toggle (`/flights` route)
- Home.jsx **reordered** (Feb 2026): Welcome → Step-by-step → Travel & more (FlightsTeaser + Packages + Hotels & flights + When to go + Pre-trip shop) → Get Ready checklist → Tools → Reminder → HaramLive → PrayerTimes → Sources footer
- Hotels: kept existing affiliate redirect (TravelPayouts shut Hotellook API on 20 Oct 2025 — auto-redirects to Booking.com, marker still tracks)

## Status

### ✅ iOS — LIVE ON APP STORE (2026-02-14)
- App URL: https://apps.apple.com/app/sunnah-umrah/id6769159262
- Approved + Released on 2026-02-14
- Build 23 (Version 1.0) live in worldwide App Store
- App Store Connect status: "Ready for Distribution" → propagating

### 🟡 Android — IN PROGRESS
- `/app/frontend/android` directory exists, applicationId=com.sunnahumrah.app, versionCode 1
- `android-release` workflow added to `/app/codemagic.yaml`
- User to action:
  - Sign up at https://play.google.com/console/signup ($25, Individual, 1-3 day ID verify)
  - Generate signing keystore (Codemagic UI does this)
  - Add Google Play service-account JSON to Codemagic integrations

## Prioritized Backlog

### P0 — Next steps RIGHT NOW
1. **Google Play Console signup** (user action, $25 + ID verify, 1-3 days)
2. **Generate Android keystore** in Codemagic (after Play account is verified)
3. **Trigger first Android build** → upload AAB to Play Console
4. **Fill Play Store listing** (description, screenshots, categories, content rating)
5. **Submit Internal Testing → Closed → Production** (Google requires 12-20 testers minimum for new accounts before production release)

### P1 — iOS v1.0.1 update (after Android is shipped, NOT NOW)
- **Bug fix already in code**: PWA install banner ("Install Sunnah Umrah · Tap Share → Add to Home Screen") was showing INSIDE the native iOS app. Fixed in `/app/frontend/src/components/InstallPrompt.jsx` by adding `Capacitor.isNativePlatform()` check on mount. Just needs new Codemagic build + v1.0.1 metadata submission to App Store.
- Reorder iPhone screenshots → put Home as #1 (currently FAQ shows in iMessage previews because it's position 1)

### P1 — Affiliate / monetization (after Android)
- Sign up for US Amazon Associates (covers ~60% of non-UK installs)
- Add country detection in lib/affiliate.js → swap Amazon domain + tag per region
- Consider Booking.com affiliate (better Makkah/Madinah hotel inventory than Hotellook)
- Consider GetYourGuide affiliate (Ziyarah day trips to Quba mosque, Hira, etc.)

### P2 — Growth
- App Preview video (15-30 sec screen capture) → boosts App Store search visibility for new app
- Reply to every review in App Store Connect → boosts algorithm + user trust
- Encourage first ~10 reviews from family/friends (huge ranking impact)
- Localize App Store metadata to Arabic (already supported in-app, just need ASC metadata)
- App Store Connect mobile app for review notifications

### P3 — Future
- Crash reporting (Sentry free tier)
- Privacy-friendly analytics (Plausible/Umami)

## Key Files
- `/app/codemagic.yaml` — both `ios-release` AND `android-release` workflows
- `/app/frontend/ios/App/App.xcodeproj/project.pbxproj` — DEVELOPMENT_TEAM=D59QBAUF9K baked in
- `/app/frontend/android/app/build.gradle` — applicationId=com.sunnahumrah.app
- `/app/frontend/src/lib/geolocation.js` — Capacitor + web geo wrapper
- `/app/frontend/src/components/InstallPrompt.jsx` — has native-app gate (fix pending iOS Build 24)
- `/app/frontend/src/pages/Support.jsx` — public Apple-required Support page
- `/app/frontend/public/appstore/` — 6 iPhone PNGs + 6 iPad PNGs + galleries (index.html, ipad.html)

## Critical Context for Next Agent
- User: Hamada Ahmed, UK, iPhone-primary, sometimes uses laptop
- iOS is LIVE. Don't touch Apple certs.
- For Android: NEVER use `xcode: latest` (only iOS) — Android uses linux_x2 instance type
- Codemagic Android workflow expects 4 encrypted env vars in group `android_keystore`:
  CM_KEYSTORE (base64), CM_KEYSTORE_PASSWORD, CM_KEY_ALIAS, CM_KEY_PASSWORD
- Google Play service-account JSON goes into Codemagic Integrations
- Google now requires identity verification (passport/license) for ALL new dev accounts (since 2024)
- Google requires 12-20 testers minimum for new accounts before production release allowed

## Lessons learned
- Always test on TestFlight + click around before submitting → caught 4 bugs (Walk-to-Haram blank, Lost blank, Group create failed, FAQ crash)
- Bundle version must be monotonically increasing — use max(apple_latest+1, codemagic_build+10)
- PWA install prompts must check Capacitor.isNativePlatform() to avoid showing in native app
- iOS Capacitor builds need production backend URL (not preview) via .env.production.local
- Apple now requires Xcode 26+ (iOS SDK 26+) for App Store uploads since early 2026
