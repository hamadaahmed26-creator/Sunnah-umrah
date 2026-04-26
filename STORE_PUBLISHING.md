# Publishing Sunnah Umrah to the App Store & Play Store

You own this app 100%. Emergent does not claim any IP. Below is the complete
checklist to ship it under your own developer name on both stores.

---

## 0 · What's already done in the repo

* ✅ **Capacitor 7 wired in** (`/app/frontend/capacitor.config.ts`)
  * App ID: `com.sunnahumrah.app`
  * App name: `Sunnah Umrah`
  * Splash & status bar pre-configured (warm sand background `#F8F6F0`)
* ✅ **Android project generated** at `/app/frontend/android/`
* ⏳ **iOS project NOT generated** — the `cap add ios` step needs CocoaPods and macOS, so you'll run it on a Mac (one command — see Step 4).

---

## 1 · One-time accounts you'll need

| Store | Cost | Notes |
|---|---|---|
| **Apple Developer** | $99 / year | Sign up at https://developer.apple.com/programs/ — needs an Apple ID + government photo ID. ~24h verification. |
| **Google Play Console** | $25 one-time | Sign up at https://play.google.com/console — verification within minutes. |
| **Mac with Xcode** (iOS only) | Free | Required to build the `.ipa`. If you don't own one: rent in the cloud at MacInCloud (~$30/month) or Codemagic CI (free tier). Android works fine from any OS. |

---

## 2 · Deploy your backend to a stable production URL

The current `frontend/.env` points at the Emergent **preview** URL — that URL
will change. Before publishing, you need a stable production backend.

**Option A — Deploy on Emergent (easiest):**
1. In the Emergent chat, type "Deploy this app" (or use the Deploy button in the side panel).
2. Emergent will give you a permanent URL like `https://sunnah-umrah.emergent.host`.
3. Copy that URL.

**Option B — Self-host:** Render, Railway, Fly.io, or your own VPS.
Just make sure:
* Backend exposes `/api/*` routes
* MongoDB is reachable from the backend
* CORS allows the bundled-app `capacitor://localhost` origin

---

## 3 · Configure the production build

```bash
cd /app/frontend
cp .env.production.example .env.production
# Edit .env.production:
#   REACT_APP_BACKEND_URL=https://YOUR-PRODUCTION-BACKEND-URL
```

Then build:

```bash
yarn cap:sync          # = yarn build && cap sync
```

This:
1. Builds React with the **production** `REACT_APP_BACKEND_URL` baked in
2. Syncs the build into the native Android / iOS shells

**Re-run `yarn cap:sync` every time you make code changes.**

---

## 4 · Add the iOS platform (do this once on a Mac)

```bash
cd /app/frontend
yarn cap:add:ios
yarn cap:sync
yarn cap:open:ios       # opens Xcode
```

In Xcode:
* Select the project root → Signing & Capabilities → set your Apple Team
* Set Display Name to `Sunnah Umrah`, Bundle ID to `com.sunnahumrah.app`
* Plug in an iPhone → press ▶ to test
* Product → Archive → Distribute → App Store Connect

---

## 5 · Open Android Studio (any OS)

```bash
cd /app/frontend
yarn cap:open:android
```

In Android Studio:
* Build → Generate Signed Bundle / APK → **Android App Bundle**
* Create a new keystore (KEEP THIS FILE FOREVER — losing it means you can never update your app)
* Build → drops a `.aab` file
* Upload that `.aab` to Play Console → Production track

---

## 6 · App icons (1024 × 1024 source)

The current PWA icon is at `/app/frontend/public/icon.svg` (the gold diamond
on charcoal). To generate all required sizes from a single 1024×1024 PNG:

```bash
# Save your master icon as /app/frontend/resources/icon.png (1024×1024)
# Save your splash screen as /app/frontend/resources/splash.png (2732×2732)
yarn add -D @capacitor/assets
npx capacitor-assets generate --iconBackgroundColor '#F8F6F0' --splashBackgroundColor '#F8F6F0'
yarn cap:sync
```

This auto-generates every required size for both iOS (29×29 to 1024×1024) and Android (mdpi to xxxhdpi).

---

## 7 · Store listing assets (you'll need to prepare these once)

### App Store
* App icon — 1024×1024 PNG, no transparency, no rounded corners (Apple rounds them)
* Screenshots — at minimum: 6.7" iPhone (1290×2796) and 6.5" iPad. 3-10 per device.
* Promotional text (170 chars), description (4000 chars), keywords (100 chars)
* Privacy policy URL (REQUIRED — see Step 8)
* Support URL
* Category: **Reference** (suggested) or **Lifestyle**
* Age rating: 4+

### Play Store
* App icon — 512×512 PNG
* Feature graphic — 1024×500 PNG
* Screenshots — 2-8 phone screenshots (16:9 or 9:16)
* Short description (80 chars), full description (4000 chars)
* Privacy policy URL (REQUIRED)
* Category: **Books & Reference** or **Lifestyle**
* Content rating: Everyone

---

## 8 · Privacy policy (legally required)

Both stores reject apps without one. Sunnah Umrah collects very little, so
yours can be short. Use a free generator:
* https://app-privacy-policy-generator.firebaseapp.com/
* https://www.termsfeed.com/privacy-policy-generator/

**What to declare:**
* GPS location → used **only on-device** to find the nearest Bāb (gate); never sent to a server beyond computing the nearest gate response (no storage)
* Group code feature → stores the user's chosen display name, tawaf/sai count, and approximate location (only when they share with their group)
* AI chat (Claude Sonnet 4.5) → questions are sent to Anthropic via Emergent; no PII required
* No ads, no analytics tracking, no third-party SDKs that profile users

Host the policy at `https://yourwebsite.com/privacy` (or use a free GitHub
Pages site). Both stores require the URL during submission.

---

## 9 · App description copy (drop-in starter)

> **Sunnah Umrah · Step-by-Step**
>
> Perform ʿUmrah with confidence — even if it's your first time. Sunnah Umrah
> walks you through every ritual, lap by lap, with authentic Sunnah du'as in
> Arabic + transliteration + English, and crystal-clear step-by-step
> instructions.
>
> ✦ Lap-by-lap Tawaf and Saʿi — never lose count again
> ✦ Hyper-realistic photos of every corner of the Ka'bah, exactly where you
>   are during each lap
> ✦ "I'm lost" GPS gate finder — never panic in the Ḥaram crowds
> ✦ Ask the Companion — AI-powered Q&A grounded in the Sunnah
> ✦ Ziyārah guide — 26 historic sites in Makkah, the Mīqāts, and Madīnah
> ✦ Fully bilingual (English + Arabic, RTL)
> ✦ Works offline inside the Ḥaram
>
> May Allah accept your ʿUmrah — taqabbalAllāhu minnā wa minkum.

**Keywords (App Store):** umrah, hajj, mecca, makkah, sunnah, dua, qibla, prayer, tawaf, sai, ziyarah, kaaba

---

## 10 · Submission timeline expectations

| | First submission | Updates |
|---|---|---|
| **Apple** | 24-72 hours typical | 24h |
| **Google** | 1-7 days first time, then ~24h | 24h |

Apple is stricter — read https://developer.apple.com/app-store/review/guidelines/
before submitting. Common rejection reasons:
* Missing privacy policy
* App "doesn't do enough" (yours does — Tawaf/Saʿi flow + AI chat is plenty)
* Crashes on first launch (test on a real device first)

---

## Quick reference — every command you'll need

```bash
# After any code change, rebuild & sync to native shells
cd /app/frontend && yarn cap:sync

# Open Android in Android Studio (any OS)
yarn cap:open:android

# Open iOS in Xcode (Mac only — first run: yarn cap:add:ios)
yarn cap:open:ios

# Re-generate icons & splashes from master images
npx capacitor-assets generate
```

Good luck — and may Allah make this a means of benefit for every pilgrim who uses it. 🤲
