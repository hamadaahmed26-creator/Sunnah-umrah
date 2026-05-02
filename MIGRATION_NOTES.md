# Sunnah Umrah — PWA → React Native (Expo) Migration Notes

> **Read this file first.** It tells the Mobile agent exactly what to migrate,
> what's already portable, and what to rewrite. The goal is to land in the
> iOS App Store and Google Play with the **same religious content, audio,
> images, and backend** — only the UI layer becomes React Native.

---

## 0. App at a glance

A step-by-step ʿUmrah companion built strictly on Salafi sources
(Bukhārī, Muslim, al-Albānī, Ibn Bāz, al-ʿUthaymīn). Bilingual EN/AR
(RTL aware). Stack: **React 19 PWA + FastAPI + MongoDB + Claude Sonnet 4.5
via Emergent Universal LLM Key + OpenAI TTS Onyx (Arabic du'ās)**.

User personas:
1. **Going** — planning Umrah soon
2. **Helping** — booking for spouse / parent / child
3. **In Makkah** — currently performing
4. **Learning** — wants knowledge
5. **Completed** — wants daily reminders

---

## 1. The migration mantra

> Keep the **content layer** byte-for-byte. Rebuild the **view layer** in
> React Native. Reuse the **backend** as-is.

If you find yourself rewriting a `.js` data file from `frontend/src/lib/`,
**stop** — it's pure data and copies over verbatim.

---

## 2. What ports 100% (DO NOT REWRITE — copy verbatim)

### 2.1 Backend (`/backend`)
Reuse as-is. No changes needed.
- `backend/server.py` — FastAPI, all `/api/*` routes
- `backend/requirements.txt`
- `backend/.env` — keep `MONGO_URL`, `DB_NAME`, `EMERGENT_LLM_KEY`, `STRIPE_API_KEY`
- API endpoints (all under `/api`):
  - `GET  /api/gates`              → list of 12 Haram gates
  - `POST /api/gates/nearest`      → body `{lat, lng}` → nearest Bab
  - `POST /api/chat`               → Claude Sonnet 4.5 fiqh chat
  - `GET  /api/chat/{session_id}/messages`
  - `PUT  /api/progress`           → upsert Tawaf/Saʿi/step
  - `GET  /api/progress/{user_id}`
  - `POST /api/group/create`
  - `POST /api/group/join`
  - `PUT  /api/group/{code}/checkin`
  - `GET  /api/group/{code}`
  - `POST /api/sadaqah/checkout`   *(Stripe — currently disabled in UI; safe to leave)*
  - `POST /api/webhook/stripe`

### 2.2 Religious content (`frontend/src/lib/`) — pure JS data, ZERO DOM use
Each of these is a plain export of arrays/objects. Drop into the Expo
project's `/lib` directory unchanged:
- `tourSteps.js` — **15-step Umrah guide.** Salafi-vetted. NEVER edit
  without a verified scholarly source. Every step has Arabic + transliteration
  + EN + source citation.
- `places.js` — 26 Ziyārah locations
- `quiz.js` — 30+ vetted MCQs across 5 categories × 3 difficulties
- `ramadan.js` — 30 daily reminders + Hijri↔Greg conversion table
- `dailyReminders.js` — 30 ṣaḥīḥ daily reminders
- `shop.js` — 6 categories of curated affiliate products
- `i18n.js` — EN/AR dictionary, `useT(lang)` helper
- `geo.js` — haversine, bearing, compass, distance formatter

### 2.3 Static assets — copy under `assets/`
- `frontend/public/audio/duas/*.mp3` (9 Onyx Arabic recitations) → `assets/audio/duas/`
- `frontend/public/audio/adhan-makkah.mp3` → `assets/audio/`
- `frontend/public/images/kaaba/*.jpg` (4 Tawaf scenes) → `assets/images/kaaba/`
- `frontend/public/images/sai/*.jpg`   (4 Saʿi scenes)  → `assets/images/sai/`
- `frontend/public/promo/*.mp4` (2 promo videos) → marketing only, don't bundle
- `frontend/public/manifest.json`, `sw.js` — DROP. Expo handles offline differently.

### 2.4 Lib files that touch `localStorage` / `navigator` (port the LOGIC, swap the storage API)
These are still mostly portable — only the storage call swaps:
- `adhanScheduler.js` — replace `localStorage` → `AsyncStorage`
- `prayerPreferences.js` — replace `localStorage` → `AsyncStorage`
- `userProfile.js` — replace `localStorage` → `AsyncStorage`
- `locationErrors.js` — keep all logic; `navigator.userAgent` →
  `Platform.OS` from `react-native`. The error codes from
  `expo-location` map cleanly to the existing `code 1/2/3` switch.

---

## 3. What needs rewriting (UI layer only)

### 3.1 DOM → React Native primitives
| Web (current)             | React Native equivalent                          |
| ------------------------- | ------------------------------------------------ |
| `<div>`                   | `<View>`                                         |
| `<span>`, `<p>`, `<h1>`   | `<Text>`                                         |
| `<button>`                | `<Pressable>` or `<TouchableOpacity>`            |
| `<input>`, `<textarea>`   | `<TextInput>`                                    |
| `<a href>`, `react-router-dom` | `@react-navigation/native` + `@react-navigation/native-stack` |
| `<img src>`               | `<Image source={require(...)} />`                |
| `<audio>`                 | `expo-av` `Audio.Sound`                          |
| `<video>`                 | `expo-av` `Video`                                |
| `framer-motion`           | `react-native-reanimated` + `moti`               |
| `lucide-react`            | `lucide-react-native`                            |
| Tailwind classes          | `StyleSheet.create` OR `nativewind` (recommended — keeps the `className` API) |
| `localStorage`            | `@react-native-async-storage/async-storage`      |
| `navigator.geolocation`   | `expo-location`                                  |
| `navigator.share`         | `expo-sharing`                                   |
| `navigator.clipboard`     | `expo-clipboard`                                 |
| `react-leaflet` + Leaflet | `react-native-maps`                              |
| OSRM walking route        | Same OSRM HTTPS endpoint — works fine in fetch   |
| Service Worker / PWA      | Expo Updates (OTA) + offline assets via Expo file system |

### 3.2 Page-by-page rewrite list (`frontend/src/pages/`)
Migrate each `.jsx` to a React Native screen. Same data, same layout intent,
RN primitives. Suggested screen tree:

```
RootStack
├── Home               (was pages/Home.jsx)
├── Tour               (was pages/Tour.jsx)         → uses tourSteps.js
│   ├── TawafFlow      (was components/TawafFlow.jsx)
│   └── SaiFlow        (was components/SaiFlow.jsx)
├── Lost               (was pages/Lost.jsx)         → uses /api/gates/nearest
├── WalkHaram          (was pages/WalkHaram.jsx)
├── Group              (was pages/Group.jsx)        → uses /api/group/*
├── Chat               (was pages/Chat.jsx)         → uses /api/chat
├── Qibla              (was pages/Qibla.jsx)        → expo-sensors Magnetometer
├── Quiz               (was pages/Quiz.jsx)         → uses quiz.js
├── Ramadan            (was pages/Ramadan.jsx)      → uses ramadan.js
├── Places / PlaceDetail (was pages/Places.jsx, PlaceDetail.jsx)
├── Hotels / Packages  (affiliate links — open in browser via Linking.openURL)
├── Shop               (affiliate marketplace — same)
├── Settings           (was pages/Settings.jsx)     → AsyncStorage prefs
├── Privacy / About    (long text screens)
├── BestMonths
├── Accessibility
├── Plan
└── Sadaqah / SadaqahSuccess  (currently disabled — leave routes hidden)
```

### 3.3 Components (`frontend/src/components/`)
- `Layout.jsx` — replace with React Navigation header + bottom tab bar
- `OnboardingSheet.jsx` — port to a modal screen
- `WalkRouteMap.jsx` — replace Leaflet with `react-native-maps` + same OSRM fetch
- `HaramLive.jsx` — replace HTML5 `<audio>` with `expo-av` `Audio.Sound`
- `QuickDuas.jsx` — port FAB pattern to a floating Pressable
- `TawafFlow.jsx`, `SaiFlow.jsx` — RN `View` + `Image` rewrite, same logic
- `RitualMaps.jsx`, `TourScene.jsx`, `GroupRadar.jsx` — SVG via
  `react-native-svg` (already supported by Expo)
- `AskHelper.jsx` — bottom sheet via `@gorhom/bottom-sheet`
- `InstallPrompt.jsx`, `WelcomeSheet.jsx` — DELETE (PWA-only concepts)
- `ui/*` (shadcn/Radix) — DROP. Use:
  - `react-native-paper` OR
  - Tamagui OR
  - Hand-rolled with NativeWind

---

## 4. Environment variables

| Web (`.env`)                  | Expo (`.env` + `app.config.js`)              |
| ----------------------------- | -------------------------------------------- |
| `REACT_APP_BACKEND_URL`       | `EXPO_PUBLIC_BACKEND_URL`                    |
| `REACT_APP_AMAZON_TAG`        | `EXPO_PUBLIC_AMAZON_TAG`                     |
| `REACT_APP_BOOKING_PID`       | `EXPO_PUBLIC_BOOKING_PID`                    |
| `REACT_APP_AIRALO_REF`        | `EXPO_PUBLIC_AIRALO_REF`                     |
| `REACT_APP_SKYSCANNER_TAG`    | `EXPO_PUBLIC_SKYSCANNER_TAG`                 |

Backend `.env` (`MONGO_URL`, `DB_NAME`, `EMERGENT_LLM_KEY`, `STRIPE_API_KEY`)
stays unchanged.

---

## 5. Native permissions (already documented — see `/app/IOS_INFO_PLIST.md`)

Add to `app.config.js`:
```js
ios: {
  infoPlist: {
    NSLocationWhenInUseUsageDescription:
      "Sunnah Umrah uses your location to find the nearest gate of Masjid al-Ḥaram and to show prayer times for your city.",
    NSMicrophoneUsageDescription: undefined, // not used
  },
},
android: {
  permissions: [
    "ACCESS_FINE_LOCATION",
    "ACCESS_COARSE_LOCATION",
    "ACCESS_NETWORK_STATE",
    "INTERNET",
  ],
},
```

---

## 6. Salafi religious accuracy — DO NOT EDIT

The following are 100% locked. Do not paraphrase, summarise, or "improve":
- All `tourSteps.js` Arabic du'ās, transliterations, English meanings, and source citations
- The Iḥrām entry-point clarification (Talbiyah, NOT putting on the cloth)
- The Ḥijr Ismāʿīl warning during Ṭawāf
- All quiz answer explanations and citations
- The hadith/du'ā wording in `dailyReminders.js`
- The "Sources & methodology" `/about` page

If the migration LLM ever feels tempted to "rewrite for clarity" — **don't**.
Salafi-vetted text is the entire premise of the app.

---

## 7. Suggested first prompt to the Mobile agent

> *"I've migrated my Sunnah Umrah PWA repo into this session. Read
> `MIGRATION_NOTES.md` at the repo root before making any changes.*
>
> *Stack target: Expo (managed workflow), React Native, NativeWind for
> styling, React Navigation, expo-av for audio, expo-location for GPS,
> react-native-maps for the Walk-to-Haram and Lost flows, AsyncStorage
> for prefs/profile, and the existing FastAPI backend reused unchanged
> at `EXPO_PUBLIC_BACKEND_URL`.*
>
> *Migrate page-by-page in this order:*
>   *1. Home (the dashboard)*
>   *2. Tour (uses tourSteps.js — DO NOT edit content)*
>   *3. Lost + WalkHaram (uses /api/gates/nearest + react-native-maps)*
>   *4. Group, Chat, Qibla, Quiz, Ramadan, Places*
>   *5. Settings, About, Privacy, the rest*
>
> *Reuse every file in /lib verbatim — they're pure data. Reuse all
> /public/audio/duas/*.mp3 and /public/images/* by copying into /assets.
> The 9 Arabic du'ā recordings, all Ka'bah & Saʿi photos, and all
> religious texts are non-negotiable and locked.*
>
> *Bilingual EN/AR with RTL is a hard requirement. Set `I18nManager.forceRTL`
> when language === 'ar' and reload.*
>
> *When done, give me an EAS Build ready iOS .ipa and Android .aab."*

---

## 8. Pre-migration sanity checks (already done in this repo)

- ✅ All 22 pages routable
- ✅ Backend `/api/*` 9/9 pytest pass
- ✅ Lint clean on every modified file
- ✅ Frontend testing agent: 33/33 assertions pass (iteration_5.json)
- ✅ Audio files cached + working (Onyx TTS for 9 Arabic du'ās)
- ✅ Religious accuracy reviewed against user-supplied Salafi PDFs
- ✅ 5 personas dynamically reshape Home
- ✅ In-app Leaflet maps working (will become `react-native-maps`)

---

## 9. What to ASK the user before touching code (Mobile agent)

1. App icon + splash screen — did the user already provide one?
   (The web `/public/manifest.json` references a Ka'bah glyph; check if
    they have a 1024×1024 master.)
2. Bundle IDs — `com.sunnahumrah.app` is suggested but **the user must
   confirm**. Used for both iOS and Android.
3. Apple Developer + Google Play Console accounts — does the user
   already have them, or do they need a buying guide?
4. Affiliate tags — user is awaiting Amazon UK / Skyscanner approvals.
   Until tags arrive, links work without commission. Don't block on these.

---

## 10. Files map (quick reference)

```
/app/
├── MIGRATION_NOTES.md                 ← you are here
├── memory/PRD.md                      ← full product history & changelog
├── memory/test_credentials.md         ← (no auth in this app)
├── backend/                           ← REUSE AS-IS in new Mobile session
│   ├── server.py
│   ├── requirements.txt
│   └── .env
└── frontend/
    ├── src/
    │   ├── lib/                       ← COPY VERBATIM (pure JS data)
    │   ├── pages/                     ← Rewrite as RN screens
    │   └── components/                ← Rewrite as RN components
    └── public/
        ├── audio/duas/*.mp3           ← COPY to assets/audio/duas/
        ├── audio/adhan-makkah.mp3     ← COPY to assets/audio/
        ├── images/kaaba/*.jpg         ← COPY to assets/images/kaaba/
        ├── images/sai/*.jpg           ← COPY to assets/images/sai/
        ├── promo/*.mp4                ← marketing only, don't bundle
        └── manifest.json, sw.js       ← DROP (PWA-only)
```

---

**Author's note to the next agent:** the user has spent real money and
real days getting this app to where it is. They're tired but proud. Keep
the religious content sacred. Keep the calm-spiritual aesthetic. Don't
"improve" what isn't broken. Preserve the testids. Ship to the App Store.

— Handoff complete.
