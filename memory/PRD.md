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

## Implemented (Feb 2026 — latest session)
- **Tour mode — the whole Umrah on one page, step by step (15 steps):**
  - Intro · 4 simple steps overview card
  - Ihram: Miqāt boundary scene, Niyyah with Arabic speech bubble, Talbiyah (group walking with arrow)
  - Entering Masjid al-Haram (right-foot illustration with mosque arch)
  - Tawaf: start at Black Stone (figure with raised right hand, Kaaba labeled), animated top-down Tawaf map with **inline 0–7 lap counter** (tap + each time you pass the Black Stone, "Next" disabled until 7/7), Yemeni Corner du'a, Maqam Ibrahim (figure in sujood), Zamzam
  - Sa'i: Safa start, On-hill takbir (figure with arms raised on triangle hill), animated Safa↔Marwah corridor with **inline 0–7 trip counter**
  - Halq/Taqsir scissors illustration; Done celebration with glowing Kaaba
- Each step: illustrated SVG scene + plain instruction + exact Sunnah du'a (with Arabic TTS button) + optional Sunnah tip
- Progress saved per-step + per-lap/trip in localStorage; pilgrim can close the app and resume on the exact step
- Replaced bottom nav: Home(Tour) · Plan · Lost · Group · Chat. Old /tawaf, /sai, /guide redirect to /tour.
- Removed: video-based tour, photo-based scenes, separate Tawaf & Sa'i counter pages.

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
- Add Qibla compass page (use device orientation + computed bearing to Kaaba)
- Add Adhan times API integration
- Add ability to share progress with companions / pilgrim group
