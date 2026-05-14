# Sunnah Umrah — App Store Deployment PRD

## Original Problem Statement
Deploy the existing full-stack Sunnah Umrah app (React + FastAPI + MongoDB, with Capacitor 7 mobile wrapper) to the Apple App Store **without owning a Mac**. Solution: use Codemagic cloud CI/CD to handle iOS builds, code signing, and App Store Connect submissions.

## Tech Stack
- **Frontend**: React (in `/app/frontend`)
- **Backend**: FastAPI (in `/app/backend`)
- **Database**: MongoDB
- **Mobile**: Capacitor 7 with native iOS project at `/app/frontend/ios`
- **CI/CD**: Codemagic (Mac M2 cloud VMs, Xcode latest)
- **Apple Account**: Hamada Ahmed (Team ID: D59QBAUF9K)
- **App Store Connect App ID**: 6769159262
- **Bundle ID**: com.sunnahumrah.app
- **Production URL**: https://sunnahumrah.app
- **Preview URL**: https://islamic-journey-19.preview.emergentagent.com

## Status: ✅ SUBMITTED TO APPLE FOR REVIEW (2026-02-14)

### What's Been Implemented

#### Feb 2026 — iOS Deployment Pipeline (COMPLETE ✅)
- Capacitor iOS project, icons, splash screens, Info.plist
- `codemagic.yaml`:
  - Production backend URL injected via `.env.production.local` at build time
  - `openssl genrsa` + `--certificate-key` for self-managed signing cert
  - DEVELOPMENT_TEAM=D59QBAUF9K baked into project.pbxproj
  - `--ipa-directory` override so IPA lands where Codemagic publisher expects
  - Bundle version auto-bumps via max(apple_latest+1, codemagic_build+10)
  - Pods build phases patched with `alwaysOutOfDate=1` to prevent Xcode 16+ loop
  - Xcode `latest` (26.x) required by Apple Feb 2026 onward
- Build #23 (1.0/23) uploaded to TestFlight + installed on user's iPhone for QA
- iOS-specific bug fixes (caught via TestFlight QA):
  - `@capacitor/geolocation` plugin installed; new `lib/geolocation.js` wrapper
  - Walk-to-Haram: removed auto-trigger, added explicit "Find my way" button
  - Lost: same wrapper, friendly errors instead of blank when permission denied
  - Group: production backend URL fix, surface backend error to user
  - FAQ: removed framer-motion `height:auto` animation that crashed iOS WebView

#### Public pages
- `/privacy` (existed)
- `/support` (new): contact, 48hr SLA, 4 troubleshooting cards, self-serve links
- Settings sidebar links to both
- All emails standardised to Hamada.ahmed26@hotmail.com

#### App Store metadata
- Description (cleaned of ﷺ and & which Apple parser dislikes)
- Keywords, Promo Text, Copyright, Support/Marketing URLs
- iPhone 6.5" screenshots: 6 (pre-rendered via Playwright at 1242x2688)
- iPad 13" screenshots: 6 (2064x2752, served via /appstore/ipad.html gallery)
- App Information: Subtitle, Category=Reference, Content Rights=No, EULA standard, DSA=Not a trader
- App Privacy: Privacy URL + Coarse Location + Other User Content (App Functionality only, no tracking)
- Age Rating: 4+
- Pricing: Free (GBP base)
- Build #23 attached, Reviewer Notes proactively answer common Apple questions
- Submitted to App Review on 2026-02-14 08:40 UK time

## Prioritized Backlog

### P0 — Waiting on Apple (24-72h)
- Apple sends email to Hamada.ahmed26@hotmail.com:
  - Approved → click "Release this version" → live in 30 min
  - Rejected → fix small metadata/binary issue, resubmit

### P1 — Post-launch
- Android Play Store pipeline (no Mac, $25 one-time)
- Crash reporting (Sentry)
- Landing page for sunnahumrah.app marketing site
- Analytics (Plausible/Umami — privacy-friendly)

## Key Files
- `/app/codemagic.yaml`
- `/app/frontend/ios/App/App.xcodeproj/project.pbxproj` (DEVELOPMENT_TEAM)
- `/app/frontend/ios/App/App/Info.plist`
- `/app/frontend/src/lib/geolocation.js` (Capacitor + web wrapper)
- `/app/frontend/src/pages/Support.jsx`
- `/app/frontend/public/appstore/` (6 iPhone PNGs, 6 iPad PNGs, ipad.html gallery)

## Critical Context for Next Agent
- User: Hamada Ahmed, UK, iPhone-primary, sometimes uses laptop
- Apple submission is OUT OF OUR HANDS for 24-72h
- DO NOT touch certificates (cert with proper private key now exists at Apple)
- Codemagic Build #23 is the submitted one; never use `xcode: latest` reversed to 16 (Apple now requires Xcode 26+)
- If rejection: fix is usually 1 line of reviewer-notes text or 1 metadata field
- If approved: user just clicks "Release this version" in App Store Connect, no code action needed

## Lessons from this build cycle
- iOS Capacitor builds MUST use production backend URL, not preview
- Always install on TestFlight + click around before submitting (caught 4 bugs)
- App Store screenshots must hide PWA install banner + audio overlays
- Universal apps need iPad screenshots too (TARGETED_DEVICE_FAMILY="1,2")
- Codemagic's `BUILD_NUMBER` should be combined with Apple's `get-latest-app-store-build-number` for bulletproof version bump
