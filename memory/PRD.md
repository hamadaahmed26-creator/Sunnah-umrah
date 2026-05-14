# Sunnah Umrah — App Store Deployment PRD

## Original Problem Statement
Deploy the existing full-stack Sunnah Umrah app (React + FastAPI + MongoDB, with Capacitor 7 mobile wrapper) to the Apple App Store **without owning a Mac**. Solution: use Codemagic cloud CI/CD to handle iOS builds, code signing, and App Store Connect submissions.

## Tech Stack
- **Frontend**: React (in `/app/frontend`)
- **Backend**: FastAPI (in `/app/backend`)
- **Database**: MongoDB
- **Mobile**: Capacitor 7 with native iOS project at `/app/frontend/ios`
- **CI/CD**: Codemagic (Mac M2 cloud VMs, Xcode 16.0)
- **Apple Account**: Hamada Ahmed (Team ID: D59QBAUF9K)
- **App Store Connect App ID**: 6769159262
- **Bundle ID**: com.sunnahumrah.app

## What's Been Implemented

### Feb 2026 — iOS Deployment Pipeline (COMPLETE ✅)
- Capacitor iOS project added (`npx cap add ios`)
- iOS app icons + splash screens generated
- Info.plist configured (permissions + `ITSAppUsesNonExemptEncryption=false`)
- `codemagic.yaml` created with full ios-release workflow
- Apple Bundle ID `com.sunnahumrah.app` registered
- App Store Connect App record created (ID 6769159262)
- App Store Connect API key generated, uploaded to Codemagic as integration named "Codemagic" (Key ID: 6QS4FVVAG8, Issuer: c57d09c8-bada-4c23-ac1c-c2044d9b6c99)
- DEVELOPMENT_TEAM (D59QBAUF9K) baked into App.xcodeproj/project.pbxproj for Debug + Release configs
- Code signing script uses `openssl genrsa` + `--certificate-key` to create cert with private key
- Xcode pinned to 16.0 (xcode:latest = 26.x caused 2hr framework loop hang)
- Pods build phases patched with `alwaysOutOfDate = 1` to prevent Xcode 16+ loop
- **First successful TestFlight build uploaded** (2m 50s total, App.ipa exported, code signing clean)

## Prioritized Backlog

### P1 — Required before App Store review approval
- **Create `/privacy` and `/support` public pages** in React frontend (Apple mandates these URLs in App Store Connect → App Privacy section)
- **Generate App Store listing screenshots** (1290x2796 for 6.7" iPhone) — at least 3, ideally 6-10
- **Fill App Store Connect metadata**: description, keywords, age rating questionnaire, app category, support URL, privacy URL

### P2 — Nice to have
- Set up TestFlight Internal Testing group (so user can install builds on iPhone)
- Add user to TestFlight as internal tester
- After confirming app works on TestFlight, flip `submit_to_app_store: true` in codemagic.yaml + uncomment `release_type: MANUAL`

### P3 — Future
- Set up Android build pipeline (Google Play Store) — much simpler, no Mac needed
- Add crash reporting (Sentry/Crashlytics)
- Set up production backend environment & domain

## Key Files
- `/app/codemagic.yaml` — CI/CD pipeline (Xcode 16.0, integration "Codemagic")
- `/app/frontend/ios/App/App.xcodeproj/project.pbxproj` — has DEVELOPMENT_TEAM baked in
- `/app/frontend/ios/App/App/Info.plist` — permissions + encryption export compliance
- `/app/APP_STORE_LAUNCH_NO_MAC.md` — user-facing launch guide

## Critical Context for Next Agent
- User works entirely from iPhone + occasionally a laptop (no Mac)
- User's email: Hamada.ahmed26@hotmail.com
- Codemagic integration name MUST stay "Codemagic" (matches what's in codemagic.yaml line 30)
- If signing fails with "You already have a current Distribution certificate" → revoke all certs at developer.apple.com/account/resources/certificates/list and rebuild
- Never use `xcode: latest` — it pulls Xcode 26.x which has CocoaPods/Capacitor incompatibilities
