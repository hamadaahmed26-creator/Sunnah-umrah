# Family and gate acceptance · 20 November 2026

## Private website

Open the private preview on two owner-authorized devices. The invitation controls membership inside the group. It does not grant access to the private host. Use Safari, enter a nickname on each device and use the first phone's invitation on the second phone. Start sharing on each phone separately. Keep the family screen open. The browser obtains coordinates only after permission. No coordinates are seeded.

The home page has separate family and gate cards. The family map shows the last acquired time, the position uncertainty returned by the device, and an estimated distance to a selected relative. The same screen links to walking directions in Apple Maps. Local cartography covers the Haram surroundings. Gate labels are approximate legacy reference points. Multi-floor access, closures and safe pedestrian paths remain unverified.

The map refreshes group updates every five seconds while active. Member credentials are tab-scoped. Invitations are single-use, ten minutes; sessions last four hours. Each fix is encrypted in the browser using a group key exchanged with the invitation. The site backend stores an opaque packet and associated timestamps. Stop clears the local watch and invalidates that member's sharing epoch at the server. Delayed uploads using that epoch are rejected. An offline stop needs connectivity for server deletion. Other online devices can still see the prior point until revocation is received or the point expires. Offline peers keep only a RAM copy for up to five minutes. Closing the tab can remove the membership credential. Expired data is hidden by the application, with database housekeeping on subsequent requests. Background physical deletion guarantees and infrastructure backup retention require provider review.

## Evidence

- Independent local Chrome tabs, Arabic UI: created and joined a group through its one-time invitation, saw the first nickname in the second session, left the group and saw membership update in the first session. A subsequent two-session test used controlled GPS fixes and a simulated disconnection through this Worker and SQLite. The peer became stale, local updates continued, reconnection restored the current distance, and queued stop/leave removed the position from the other session. See test-family-browser-fixture.mjs for reproduction. Physical sensors remain untested.
- Node with SQLite and the same request handler: two credentials, group isolation, single-use invite, readable encrypted update only with the matching group key, timestamp freshness, next update, revocation, delayed write rejection, expiry and leave. Synthetic coordinates in this test only. Run `node --test docs/phase-one/test-*`.
- Confirmed deployed isolated DB binding DB and family_members table. Hosting sign-in remains restricted. Physical-device acceptance and observation on the deployed database remain pending.
- Offline street/building data and 12 approximate gate pins are in the service-worker cache manifest. Last known locations, straight-line distances and bearings do not constitute an offline walking route. Apple Maps may require Internet or a previously downloaded map. GPS does not transport new fixes to another phone.
- For a connectivity fallback, agree a gate number and meeting point ahead of time. A direct voice call or SMS may work when mobile data fails if cellular voice/SMS service is available. No automatic family messages or background tracking were implemented.

## Remaining acceptance checks

| Area | Remaining evidence |
|---|---|
| Two iPhones | Test both directions, real permission prompts, low accuracy, stale and offline state, resume, explicit stop, leave, closed/locked Safari and private-host offline reopening. |
| Gate navigation | Validate mapped locations and current access on site. Field-test outside and inside the Haram with mobility needs. |
| Religious guidance | Qualified human sign-off for the exact Arabic, meanings, fiqh, gender and Ihram instructions and each exceptional case. |
| Human audio | Six licensed recordings from OpenDua cover seven of eight card scripts in whole or in part. Four standalone publisher texts match, three cards need verified excerpts and Miqat lacks a matching recording. Qualified listening, final integration and physical iPhone/offline checks remain outstanding. Use recordings/review/reciter-sheet.html for local comparison. Zero in-app dua audio approvals. |
| Ten languages | English and Arabic in the hosted preview. The /language-review/ page offers all ten. The eight additional languages contain 56 stage instructions and checks, 64 pronunciation guides, 64 meanings and 32 help entries. Additional UI coverage, native linguistic and scholarly review are pending. |
| Worship flows | On-device counter correction, restart, history, zoom, RTL, large text, VoiceOver and offline audio/device interruption. |
| Prayer and Qibla | On-device timezone/notification tests, permission failures, compass calibration and physical heading accuracy. |
| Broadcasting | Private preview includes in-page MP3Quran radio and official Saudi TV player. The radio returned decodable audio and also intermittent upstream errors. Physical Apple devices, actual video playback, regional availability and recovery remain open. |
| Travel | Yesim Saudi plans, Makkah hotel and London–Jeddah flight searches have direct outbound links. Checkout and affiliate tracking remain unverified. Optional shopping and previously vetted commercial integrations need end-to-end testing. |
| Data and release | Security review, operational retention, legacy migration, public-origin isolation, final device acceptance then owner website approval. iOS builds and App Store work follow separate approval. |

## Private review pages

Open /recording-review/ for six original recordings. Browser QA of the packaged site started Talbiyah, switched to the dua between the corners and observed the first player pause. Open /language-review/#practice to choose a review language. Urdu displayed its instructions, choices and review notice, and the browser reported its offline copy ready. The remote deployment succeeded, and the hosted URL required owner sign-in in the test browser. No live authenticated browser playback or physical-device sign-off is claimed.
