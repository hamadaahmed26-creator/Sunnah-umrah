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

## Implemented (May 2, 2026 — sixth session, part 4) — Helping-someone-else pronouns + direct booking CTAs
- **Pronoun fix when user picks "I'm helping someone else"** in onboarding.
  All subsequent questions and labels now correctly switch from "you/your/I"
  to "they/their" everywhere they refer to the pilgrim:
  - Step 1: "How will **they** travel?" / "With **their** spouse" / "**They** need accessibility help"
  - Step 2: "How well do **they** know the steps?" / "**They** know what they're doing" / "**They** know a little" / "**They** don't know anything yet"
  - Step 3: "Have **they** booked **their** trip?"
  - Home empty state: "When will **they** go?" + "Already booked — add **their** date"
  - Trip-prompt advice (`lib/userProfile.tripPrompt`): "Their final days — help them prepare iḥrām and pack" / "Get them an iḥrām" / "Confirm their visa & hotel" / "Book their hotel & flights" etc.
  Critical for the "spouse / parent / child planning for a loved one" use case
  the user repeatedly emphasised.
- **Home empty-state booking CTAs are now direct** (per user feedback "should
  take you straight to umrah packages and also option for flights and hotels").
  The "Browse trips → /plan intermediary" has been removed. The empty-state
  card now exposes two prominent, side-by-side buttons:
    • **Packages** (gold gradient) → `/packages` (all-inclusive)
    • **Hotels & flights** (green gradient) → `/hotels` (DIY)
  with a subtle text link below for "Already booked — add my/their date".
  One fewer tap to convert; no decision fatigue from the chooser screen.
- SW cache → `umrah-v1.36.0`.

## Implemented (May 2, 2026 — sixth session, part 3) — Pre-launch audit + back buttons + Arabic mode fix
- **Final back-button sweep before Sunday Capacitor build.** Added consistent
  `← Back` link to the 5 remaining secondary pages: Chat, Group, Qibla,
  Ramadan, Shop. All 17 secondary pages now have a uniform back button
  pattern (`Link to="/"` with `ArrowLeft` icon + RTL rotation in Arabic).
  New data-testids: `chat-back`, `group-back`, `qibla-back`, `ramadan-back`,
  `shop-back`. Verified by testing agent — 17/17 pages return to Home.
- **Critical Arabic-mode bug FIXED in `Home.jsx` QuickTile + `Plan.jsx` Tag.**
  Both components used `<span class="lang-en">EN</span><span class="lang-ar
  hidden">AR</span>` markup that relied on a CSS toggle that was never wired
  up. Result: Arabic users saw English-only labels on the 6 Home tiles
  ("Stay together", "Ask", "Qibla", "I'm lost", "Ziyārah", "Quiz") and the 3
  Plan tags ("Hotels", "Flights", "eSIM"). Switched to `isAr ? ar : en`
  conditional rendering — same pattern used everywhere else in the app.
  Verified visually in Arabic mode: tiles now correctly show ابقَ معًا /
  اسأل / القبلة / أنا تائه / الزّيارة / الاختبار with no English leak.
- SW cache → `umrah-v1.35.0`. Backend 9/9 pytest pass. No launch blockers.

## Implemented (May 2, 2026 — sixth session, part 2) — Daily reminder + Quick Duʿāʾ + adaptive home + shop reframe
- **NEW: Today's Reminder card** on Home — rotating Sunnah hadith/duʿāʾ that
  changes once per UTC day, cycling through 30 ṣaḥīḥ entries from Bukhārī /
  Muslim / al-Albānī. Designed to convert a one-off Umrah app into a daily
  habit. File: `frontend/src/lib/dailyReminders.js`.
- **NEW: Quick Duʿāʾ floating sheet** (`frontend/src/components/QuickDuas.jsx`).
  Heart-shaped FAB bottom-right opens a slide-up sheet with 5 most-needed
  authentic duʿāʾs: Sayyid al-Istighfār, entering masjid, travel, anxiety/worry,
  evening adhkār. Each shows Arabic + transliteration + meaning + source.
  Hidden on focus pages (`/tour`, `/chat`, `/quiz`, `/qibla`, `/places/*`).
- **Home adapts to first-time vs returning users.** If `umrah_tawaf_count > 0`
  or `umrah_sai_count > 0` the **Tools** grid renders first (the user is
  actively using the app). Otherwise **How will you travel?** renders first
  (the user is still planning).
- **Shop reframed for clarity.** Page hero is now *"Pack what you'll need —
  before you fly"* with a yellow Zamzam-reality tip ("free 5L bottle at Jeddah
  airport — can't be sold/shipped"). Souvenir badge changed from "Bring back
  as a gift" → "Sunnah daily essentials" (more accurate — these ship from
  Amazon UK, they're not flown back from Saudi). Zamzam carrier title and
  description rewritten to make the empty-container distinction unambiguous.
- SW cache → `umrah-v1.20.0`.
- **Sadaqah completely removed from frontend** (per user decision to avoid Apple App Store
  review risk under Guideline 3.2.1(vii) / 4.5.4 — "donations to developer" trigger IAP /
  rejection unless 100% pass-through to a named approved nonprofit). Removed from Home,
  WelcomeSheet, Privacy policy, sitemap. `/sadaqah` and `/sadaqah/success` now `Navigate`
  redirect to `/`. Page components (`Sadaqah.jsx`, `SadaqahSuccess.jsx`) and backend
  Stripe routes left in place for easy re-enable when re-architected as charity-passthrough.
- **NEW: `/about` Sources & methodology page** — required for App Store approval of
  religious apps. Cites: Bukhārī, Muslim, Bulūgh al-Marām, Ḥiṣn al-Muslim, Manāsik
  al-Albānī, Riyāḍ aṣ-Ṣāliḥīn, Tafsīr as-Saʿdī. Names Salafī scholars consulted
  (Ibn Bāz, al-ʿUthaymīn, al-Albānī, Ibn Jibrīn). Includes religious-accuracy
  disclaimer (app is a guide, not a fatwā; AI assistant ≠ muftī). Linked from Home
  footer.
- **Home dashboard refined** — "Family" card → "Stay Together" with subtitle
  *"Don't lose anyone in the crowd"*. New 2-card "How will you travel?" section
  cleanly separates 🧳 *Umrah packages (all-inclusive)* from 🛫 *Hotels & flights (DIY)*.
  Old 3-tile booking row removed.
- SW cache → `umrah-v1.19.0`. Sitemap updated.

## Implemented (Feb 26, 2026 — corner-accurate photos)
- **Tawaf — angle-specific Ka'bah photos:** the 4 micro-steps inside `TawafFlow.jsx` now show locally-hosted, hyper-realistic photos of the EXACT corner / face the pilgrim is at (① Black Stone with pilgrims touching the silver frame, ② wide tawaf walking view, ③ Rukn al-Yamani with pilgrims touching, ④ Yemeni→Black Stone stretch).
- **Sa'i — scene-specific photos:** `SaiFlow.jsx` migrated from external Wikimedia hotlinks to local files (Mount Safa, Mount Marwah, Mas'a corridor, green-marker run zone).
- **Offline-safe asset pipeline:** all 8 step photos saved under `/app/frontend/public/images/{kaaba,sai}/` and added to the service worker's APP_SHELL precache list (`umrah-v1.2.0`). No CORS / 429 / 404 risk inside the Haram.

## Implemented (May 1, 2026 — fifth session) — Home dashboard + Marketplace Layer 1
- **NEW: `/` (default Home dashboard)** — replaces Tour as the landing page. Warm cream-to-gold gradient hero with subtle Islamic geometric pattern overlay + small Ka'bah glyph; "Continue / Start" CTA that auto-detects in-progress Tawaf/Sa'i state from localStorage; Ramadan banner; 3 priority cards (Plan / Family / Ask); 6-tile tools grid (Qibla, I'm lost, Ziyārah, Quiz, Ramadan, Shop with NEW badge); 3-tile booking row (Hotels / Packages / eSIM); Sadaqah CTA card. Bottom nav HIDDEN on home only — tiles do the navigation.
- **NEW: `/shop` Affiliate marketplace (Layer 1)** — 6 categories × ~15 hand-curated products: Ihram & travel kit (Ihram set, miswak, Zamzam carrier, prayer mat, rihla bag), Islamic books (Hisn al-Muslim, Bulūgh al-Marām, Manāsik al-Albānī, Riyāḍ aṣ-Ṣāliḥīn, Tafsīr as-Saʿdī), Halal food kit (Sidr honey, Ajwa dates, olive oil, black seed), Hotels (Booking.com), Flights (London→Jeddah, London→Madinah via Skyscanner), Saudi eSIM (Airalo).
  - Mix display: physical products show price ("From £22.99"), travel/eSIM does not (just "Browse")
  - "CURATED" gold badge on every item (trust signal)
  - Affiliate disclosure footer (Amazon UK / Booking / Airalo / Skyscanner — required by FTC + Amazon TOS)
  - Tag system: `REACT_APP_AMAZON_TAG`, `REACT_APP_AIRALO_REF`, `REACT_APP_SKYSCANNER_TAG` — links work without tags (no commission), commission lands once tags are filled
- **Mīqāt entries enriched** — every Mīqāt now has a soft maroon "WHY ENTER IḤRĀM HERE" callout above the description, explaining in plain language *exactly* who must use that Mīqāt (e.g. "If you fly from Egypt or the Levant... declare niyyah on the plane ~1h before landing" for al-Juḥfah). Critical for first-time pilgrims.
- **NEW: `/app/AFFILIATE_SIGNUPS.md`** — kid-level step-by-step signup guides for Amazon Associates UK (instant, free, ~10 min) and Travelpayouts → Skyscanner (free, 2-7 day approval). Includes Amazon's banned behaviours, 180-day rule, and projected earnings (~£150/month with 1k users).
- SW cache → `umrah-v1.17.0`. Sitemap updated with `/shop`.

## Implemented (May 1, 2026 — fourth session) — Quiz + Ramadan reminders
- **NEW: `/quiz` Umrah knowledge quiz**
  - 30+ vetted questions sourced from Sahih al-Bukhari, Sahih Muslim, Hisn al-Muslim, Bulugh al-Maram, Manasik al-Albani
  - 5 categories (Ihram, Tawaf, Sa'i, Halq/Taqsīr, General) × 3 difficulties (Beginner, Intermediate, Advanced)
  - 10 questions per round, randomised; immediate feedback with Sunnah-source citation under each answer
  - Persistent best-score in localStorage; native share-button (`I scored 8/10 on Sunnah Umrah quiz!`)
  - Bilingual (EN+AR), 100% offline, no backend cost
  - File: `/app/frontend/src/lib/quiz.js` (questions data, owner must review before launch)
- **NEW: `/ramadan` Ramadan reminders**
  - Pre-Ramadan countdown (`Ramadan begins in N days, in shāʾa Allāh`) — auto-detects current Hijri year from `RAMADAN_GREGORIAN_START` lookup table
  - During Ramadan: live Iftar countdown (h:m:s) using Aladhan API for Makkah Maghrib + daily Sunnah-grounded reminder card
  - 30 daily reminders (welcome, sahūr du'a, hadith of generosity, Tarāwīḥ, last 10 nights, Laylatu-l-Qadr, zakāt al-fiṭr, etc.) sourced from Bukhari/Muslim
  - Browse-all 5×6 grid; previous/next navigation between days
  - Bilingual (EN+AR)
  - File: `/app/frontend/src/lib/ramadan.js` (content + Hijri-Greg conversion table)
- **Plan page**: 3 new cards added — Qibla compass, Umrah quiz, Ramadan reminders
- Sitemap updated with `/quiz`, `/ramadan`
- SW cache → `umrah-v1.15.0`

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
