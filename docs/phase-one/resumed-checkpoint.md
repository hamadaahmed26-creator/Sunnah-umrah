# Owner review · 20 November 2026

Preview: https://sunnah-umrah-pilgrim-preview.tastygrebe11.chatgpt.site/

Development branch: development/pilgrim-companion-20261120. GitHub source write failed (403). Use the bundled commits and RESTORE.txt. The hosting repository serves only frontend/public/companion. Legacy React and Python changes are source-only. The preview deployment succeeded and requires owner sign-in.

## Changes in the private preview

The Live Tawaf and Sa’i screens keep the counter, correction and pause controls together. Completing seven enables Continue. Arabic, pronunciation, meaning, recording availability and sources can be opened at the relevant moment. Completed journeys are archived locally before restarting. The city timetable displays its reported time zone. Qibla gives a bearing from true north using a requested location. Makkah Live loads the official Saudi Quran TV player on demand and includes its official channel fallback. Saudi Quran Radio is separately identified as a Riyadh broadcast and opens at the broadcaster.

## Reproducible checks

From the repository root run:

    node --test docs/phase-one/test-*
    node docs/phase-one/recordings/test-register.mjs . frontend/public/companion/audio.js
    node frontend/scripts/build-language-review.mjs

Fourteen automated tests passed. The recording audit passed hash checks for all 19 local audio assets and checked the full 37-entry inventory. The audio harness uses simulated media events. The offline worker tests use a simulated cache and disabled fetch. A full browser test is included as docs/phase-one/browser-journey.cjs. This session's local Chromium process could not open its required socket. That new end-to-end test has no recorded pass.

Saudi Quran TV video IsJTAdC3-Jw returned owner @SaudiQuranTv, isLive=true and playableInEmbed=true. This does not establish picture or sound on the private host or on physical iPhones. If the broadcaster rotates the ID, the official channel link remains available.

## Open release work

- Qualified scholarly approval, native-language approval and rights-cleared exact human audio for each recitation are outstanding. See the religious and audio registers. Audio review/listen.html is an offline review sample with attribution, outside the pilgrim build.
- Arabic and English are enabled in the preview. Eight private UI catalogues and sixty-four draft dua meanings are available in the source for review. Complete translated stages, help, pronunciation, peripheral screens and language-by-language testing remain open. Missing sections in localhost review use the source-language text.
- Family check-ins use expiring invitations and member credentials in the development backend. Full group migration, authorized optional location sharing, and live integration need further work. Foreground Adhan scheduling and the Lost screen have source changes awaiting full build, permission and field testing.
- The Saudi eSIM button opens Yesim directly. Commission attribution, commercial checkout evidence, hotels, flights and the optional shop still require verification.
- Acceptance on actual iPhones, offline return through the private host, accessibility with VoiceOver, sound interruptions and the production migration remain outstanding. There has been no public website cutover or native release.
