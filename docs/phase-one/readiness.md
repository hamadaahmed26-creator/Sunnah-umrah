# Phase One · private web preview

**Decision, 20 November 2026.** Ready for owner usability testing. Production release is blocked. The hosted artifact consists exclusively of the files in frontend/public/companion. It contains no runtime account keys, database, production API, affiliate tracker, Adhan scheduler, generative chat, or location collection. The existing app identity and Codemagic configuration have not been edited.

## Reproducible checks

From the repository root run Node 24: `node --test docs/phase-one/test-*`, then `python -m py_compile backend/server.py`. Five automated cases cover single-source audio controls, permission and decoding failures, stale playback promises, offline retrieval including both MP3 range requests, and rejection of an incomplete cache install. The service-worker tests simulate the cache and missing network. See audio.md for the independent decoding procedure.

Serve frontend/public/companion on localhost or HTTPS. In the browser, open Live Umrah, advance to Tawaf, add one circuit, subtract one, record seven and reload. Expect 7/7, disabled increment and enabled Continue. Walk through Sa’i, record seven and check that the finish reads Marwah. Advance to hair cutting and mark Finish. These steps passed in desktop Chrome against the locally served isolated build. The deployed owner-only URL returned the expected ChatGPT sign-in gate. Physical Safari and authenticated remote offline re-entry remain open.

## What to check on iPhone

Use Safari with the ChatGPT owner account. Try English and Arabic, Easy mode, spoken control instructions, a wrong practice answer and its correction. Switch between live and practice to check their independent counters. Pause at a known count and reopen the same address. After the offline-ready message appears, enable Airplane Mode with Wi-Fi off and reload. Internet access is required for citations, authentication if requested by the host, and Yesim checkout. Storage is per browser and device. Removing browser data removes preview progress.

## Release gates

- Qualified scholar sign-off for the exact bilingual wording, Arabic editorial review and clearance for human-recited audio. Navigation recordings are synthetic practical prompts. No dua recording has been approved.
- Test VoiceOver, zoom, blocked storage, low connectivity, audio interruption, lock/sleep, offline restart and update on actual iPhones. Field-test separately with elderly and first-time pilgrims.
- The approved-account Saudi affiliate link, attribution and supported checkout regions require partner evidence. No purchase was made. Flights, hotels, shopping, packages and partnerships require provider/account verification before visibility.
- Existing family-location, progress API authorization, retention, Adhan scheduling and GPS guidance remain release blockers for the legacy full application. The isolated guide never calls those systems. Qibla heading handling and native watch cleanup received partial branch repairs only. The existing production backend and vendor dashboards require a separately controlled cutover.
- Old in-browser progress keys are read on first use on the same origin. Original keys are retained. Validate representative older installations and ambiguous intermediate legacy steps before rollout.
- Review legacy marketing and privacy text, ancillary pages, all legacy instruction/translation assets, repository tests, the full React/Capacitor build and the native application before any public cutover. This isolated website milestone does not certify the legacy shipped application.

See bugs.md for the baseline register, commercial.md for partner and competitor verification and audio.md for the audio provenance findings.

Additional Chrome checks passed for the first incorrect practice response keeping Continue disabled, the correct response enabling progress, pause surviving a reload at Miqat, changing the current stage to Arabic and filtering Arabic help to the wheelchair topic with كرسي.
