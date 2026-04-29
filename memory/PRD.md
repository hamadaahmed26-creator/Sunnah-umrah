# Sunnah Umrah — PRD

## Original Problem Statement
> "A ummrah app that helps people do ummrah according to the sunnah step by step,
> And also chat is it possible we can't create a system where the app locates your exact location or which gate in Mecca and guides you if your lost"

## User Choices (Feb 2026)
- Core: Step-by-step Umrah guide, Tawaf & Sa'i counters, Location-aware gate guidance
- Location feature: GPS-based nearest gate finder for Masjid al-Haram (Bab #s)
- AI chat: Claude Sonnet 4.5 via Emergent Universal LLM Key
- Languages: English + Arabic (with RTL)
- Design: Calm & spiritual (warm sand bg, brass-gold accent, Kaaba charcoal)

## User Personas
1. First-time pilgrim — needs step-by-step guidance with authentic duas
2. Returning pilgrim — uses counters during Tawaf/Sa'i for accurate ibadah
3. Lost pilgrim — has wandered out of Masjid al-Haram and needs nearest gate fast

## Architecture
- **Backend**: FastAPI + MongoDB (motor). Routes under /api.
- **LLM**: emergentintegrations LlmChat → Claude Sonnet 4.5 (`claude-sonnet-4-5-20250929`).
- **Frontend**: React + Tailwind + shadcn/ui + framer-motion + lucide-react. SPA with React Router.
- **i18n**: Custom dictionary (i18n.js) + `dir=rtl` toggle on `<html>`.

## Implemented (Feb 26, 2026 — corner-accurate photos)
- **Tawaf — angle-specific Ka'bah photos:** the 4 micro-steps inside `TawafFlow.jsx` now show locally-hosted, hyper-realistic photos of the EXACT corner / face the pilgrim is at (① Black Stone with pilgrims touching the silver frame, ② wide tawaf walking view, ③ Rukn al-Yamani with pilgrims touching, ④ Yemeni→Black Stone stretch).
- **Sa'i — scene-specific photos:** `SaiFlow.jsx` migrated from external Wikimedia hotlinks to local files (Mount Safa, Mount Marwah, Mas'a corridor, green-marker run zone).
- **Offline-safe asset pipeline:** all 8 step photos saved under `/app/frontend/public/images/{kaaba,sai}/` and added to the service worker's APP_SHELL precache list (`umrah-v1.2.0`). No CORS / 429 / 404 risk inside the Haram.

## Implemented (Apr 29, 2026 — third session) — App Store polish + better location UX
- **Improved Qibla location-permission UX**: replaced dead-end "go to settings" with a real "Allow location" CTA + iOS-specific 4-step instructions if previously denied + "Try again" button. Friendly headline "We need your location" with privacy reassurance.
- **NEW: `/privacy` page** — formatted React rendering of `/app/PRIVACY_POLICY.md`, reachable at `https://sunnahumrah.app/privacy`. Required URL for App Store + Play Store submissions. Added to sitemap.
- **Android permissions added** to `AndroidManifest.xml`: `ACCESS_FINE_LOCATION`, `ACCESS_COARSE_LOCATION`, `ACCESS_NETWORK_STATE` for Qibla / Lost / Group features.
- **NEW: `/app/IOS_INFO_PLIST.md`** — exact iOS permission strings to paste into Info.plist after running `cap add ios` on a Mac. Includes Apple App Privacy questionnaire answers.
- **NEW: `/app/frontend/scripts/generate_store_screenshots.js`** — automated screenshot generator using Playwright + realistic mock content (Ahmed, Sara, group code "MAKKAH"). Produces 8 screenshots × 2 device sizes (iPhone 6.7" 1290×2796, Android 1080×2400) with App Store / Play Store-ready captions. Run via `yarn screenshots`.
- **STORE_PUBLISHING.md updated**: privacy policy section now references the live URL; Android permissions documented with Play Console rationale paste-text; screenshot section auto-generated with captions.
- SW cache → `umrah-v1.14.0`.

## Implemented (Apr 29, 2026 — second session)
- **NEW: `/qibla` Qibla compass page**
  - Calculates true bearing from user GPS → Ka'bah (21.4225°N, 39.8262°E) using haversine + bearing
  - Live needle that rotates with device heading (uses `deviceorientationabsolute` + iOS `webkitCompassHeading`)
  - iOS 13+ permission gating: shows "Enable compass" CTA that triggers `DeviceOrientationEvent.requestPermission()`
  - Cardinal letters rotate to true north; "You're facing the Qibla" indicator when ±5° aligned
  - Distance to Makkah readout, figure-8 calibration tip
  - Reachable from `Plan` → "Qibla compass" card
- **eSIM (Airalo) surfaced on Plan page** as its own top-level card under "Plan your trip" — was previously hidden inside `/hotels` only. Deep-links to Airalo's Saudi-Arabia eSIM with `utm_source=sunnahumrah&ref=...` for affiliate tracking.
- **"Walk to them" button** on each member card in `/group` — opens Google Maps walking directions to the member's last shared location (works on iOS Safari + Android Chrome).
- SW cache bumped to `umrah-v1.12.0`.

## Implemented (Apr 29, 2026 — first session) — Live group location sharing
- **"Stay together" now shows where each member actually is**, not just their counts:
  - **Privacy-first opt-in toggle** ("Share my live location") per member, persisted in localStorage. OFF by default.
  - **Privacy banner** appears when toggle is ON: *"Your location is shared only with your group, and never stored long-term."*
  - **Per-member distance + direction** (e.g., "120 m · NE") computed client-side from haversine + bearing.
  - **Radar map** (`GroupRadar.jsx`): SVG-based concentric range rings with members positioned by relative bearing, gold "you" pulse at centre. Auto-scales to farthest member. **No external map tiles** — works on weak Haram signal, fully offline.
  - Stale locations (>5 min old) are auto-stripped from API responses.
  - Toggling sharing OFF actively `$unset`s previously-stored coordinates (privacy-by-default).
  - Live updates every 20 s while sharing is ON; 10 s otherwise.
- Backend (`/api/group/{code}/checkin`): added `share_loc`, `accuracy`, lat/lng bounds; coordinates only persisted on opt-in.
- New helper: `lib/geo.js` — haversine, bearing, 8-point compass, localised distance formatter.
- SW cache bumped to `umrah-v1.10.0`.

## Implemented (Feb 2026 — earlier in this session)
- **Lap-by-lap Tawaf & Sa'i flows** — each lap/trip is now its own screen showing the 4 sub-actions in order:
  - **Tawaf** (per lap): ① At the Black Stone (takbir + audio) → ② Walking (Raml info on laps 1-3) → ③ Yemeni Corner (touch only) → ④ Final stretch with Rabbanā ātinā du'a + audio. Big "Lap N complete" button at the bottom advances to next lap.
  - **Sa'i** (per trip): "Heading to Marwah/Safa" indicator + 4 sub-actions. Trip 1 includes the first-time Safa verse card. Trip 7 special-cases the final Marwah ("no takbir, long heartfelt du'a"). Big "Trip N complete" button.
  - Animated mini-map at top of each lap/trip card. After 7 laps/trips, auto-advances to the next tour step (Maqam Ibrahim, Halq, etc.)
- **PWA polish:** manifest.json, service worker (cache-first shell, network-first /api), iOS home-screen support, install prompt (native on Android, hint on iOS), Ka'bah icon, "Sunnah Umrah — Step by Step" title
- **Tour mode — single page, 15 illustrated steps, walks the whole Umrah:**
  - Intro: 4 tappable section cards (IHRAM/TAWAF/SA'I/HALQ) jump straight to that chapter
  - Ihram: Miqāt boundary, Niyyah with Arabic speech bubble, Talbiyah (group walking)
  - Enter Masjid (right-foot illustration with mosque arch)
  - Tawaf: Black Stone start scene → animated top-down Tawaf map with **inline 0–7 lap counter** (Next button locked until 7/7) → Yemeni Corner → Maqam Ibrahim → Zamzam
  - Sa'i: Safa start with pulsing marker → on-hill takbir → animated Safa↔Marwah corridor with **0–7 trip counter** (Next locked)
  - Halq scissors illustration; Done celebration with glowing Kaaba
- Each step: SVG scene + plain instruction + exact Sunnah du'a (Arabic + transliteration + English with TTS button) + optional Sunnah tip
- **Floating "Ask the Companion"** FAB on every tour step → opens bottom sheet with suggested questions, sends current step as context to Claude Sonnet via `/api/chat`
- Progress saves automatically; bottom-nav controls fixed (Next button no longer overlaps nav)
- Cleanup: deleted old Tawaf/Sai/Guide/Home/Counter pages and visual components; old routes redirect to `/tour`

## Verification
- Backend pytest: **9/9 passed** (chat with Claude Sonnet 4.5, gates, group create/join/checkin, progress upsert)
- Frontend Playwright on iPhone 414×896: **34/35 passed** (one cosmetic testid mismatch already fixed)

## Implemented (earlier in Feb 2026)
- `/api/gates` — 12 main gates of Masjid al-Haram
- `/api/gates/nearest` — haversine + bearing for nearest gate
- `/api/chat` (POST) + `/api/chat/{session_id}/messages` (GET) — Claude 4.5 chat with persistence
- `/api/progress` GET/PUT — tawaf/sai counter & step persistence
- Frontend pages: Home, Guide (6 steps with Arabic dua + transliteration + translation), Tawaf counter, Sa'i counter, Lost (GPS gate finder + compass), Chat (Claude 4.5)
- Bilingual EN/AR with RTL support
- Mobile-first PWA-style layout, fixed bottom-nav (z-index fixed to clear platform badge), Kaaba inspired calm-spiritual aesthetic
- Speech synthesis for Arabic dua playback

## Backlog (P1 / P2)
- P1: Qibla compass + prayer times (Adhan API)
- P1: Daily adhkar (morning/evening) library
- P1: User account / cloud sync of progress (currently localStorage)
- P2: Offline mode (service worker) — important inside Haram (poor signal)
- P2: Indoor positioning when Saudi authorities expose API
- P2: Hajj guide (separate flow)
- P2: Audio recitation for talbiyah from a renowned qari

## Next Tasks
- P1: Surface the existing `/api/gates/nearest` endpoint as an "I'm lost — find my gate" button inside the unified Tour
- P1: Capacitor wrapper for iOS / Android App Store deployment
- P2: Verify Arabic TTS audio plays on iOS Safari inside TawafFlow / SaiFlow
- P2: Smart GPS-based auto-advance of laps (waypoint detection)
- P2: Qibla compass + prayer times (Adhan API)
