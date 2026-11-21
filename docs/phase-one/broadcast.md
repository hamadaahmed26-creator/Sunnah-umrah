# Makkah Live and Qur’an radio · 20 November 2026

The development companion offers three distinct sources on its Makkah Live screen.

| Choice | Source and evidence |
|---|---|
| Watch Masjid al-Haram | Saudi Quran TV’s official channel returned video ID `IsJTAdC3-Jw`, official channel ID `UCos52azQNBgW63_9uDJoPDA`, and true values for the live and embedded-playback flags when checked. The video loads in a YouTube privacy-enhanced iframe after the visitor taps Load. Playback, pause, volume and fullscreen are the broadcaster’s controls. [Official channel](https://www.youtube.com/@SaudiQuranTv/live) · [YouTube player API](https://developers.google.com/youtube/iframe_api_reference) |
| Play Qur’an radio | The MP3Quran developer directory lists an Abdul Basit Abdus Samad station at `https://backup.qurango.net/radio/abdulbasit_abdulsamad`. The publisher expressly allows developers to use its links, including Qurango. The phone requests the stream directly and Stop releases the connection. The station carries continuous recitations. [Directory](https://mp3quran.net/api/v3/radios?language=eng) · [Publisher’s permissions](https://www.mp3quran.net/privacy-en.html) |
| Open Saudi Quran Radio from Riyadh | The old Aloula address returned HTTP 503. The replacement SBA Radio+ station page returned HTTP 200 on a full request. The service sets X-Frame-Options DENY. This separate link opens the broadcaster. [Saudi Radio+](https://radioplus.sba.sa/ar/live/4) |

## Acceptance evidence

- A direct request to the configured Abdul Basit stream returned HTTP 200 and audio/mpeg. FFmpeg decoded 16,384 received bytes to 1.04 seconds of stereo MP3 at 44.1 kHz and 128 kb/s with mean level −16.6 dB. Other requests to the same URL returned HTTP 500. A later retry decoded audio again. Availability can vary. Nothing from the broadcast is stored or distributed by the companion.
- Run `node --test docs/phase-one/test-broadcast.mjs` in the development clone. Controlled media events exercise user-initiated loading, source switching without overlap, late events, stop/release, offline handling, retry, embedding refusal and cleanup. This is a control-flow test. It does not decode a video or observe a real phone.
- Finish acceptance in Safari and in the Capacitor app on physical iPhones. Select the video, press Play, confirm picture and sound, pause, try fullscreen, switch to radio, hear the station, stop it, disconnect, and reconnect. Check failure and fallback on a network that restricts YouTube. The channel can change video IDs. If the displayed programme ends or is unavailable, use the channel link and reconfirm the current ID before a release.
