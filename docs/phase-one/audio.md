# Audio review and release evidence

Baseline commit 646bf5d4cb3997d8e98a66f38f7f375397bff792.

| Finding | Evidence | Preview disposition |
| --- | --- | --- |
| A user can start simultaneous players and cannot pause or replay the current track using the old recitation button. Playback errors silently switch to unreviewed device-generated speech. | frontend/src/pages/Tour.jsx lines 554–564. Each click constructs a fresh Audio object. | The companion has one active media element with observable loading, playing, paused, ended, blocked and error states. |
| Arabic duas are synthesized through different code paths. | frontend/src/components/TawafFlow.jsx lines 43–60 and 255, SaiFlow.jsx lines 35–42 and 259. MIGRATION_NOTES.md line 72 and frontend/public/sw.js line 13 identify the bundled recordings as Onyx. | No automatic recitation, speech-synthesis fallback or unreviewed religious track in the companion. |
| A completed service worker install is insufficient evidence that every track can play offline. | frontend/public/sw.js lines 37–44 uses allSettled and ignores failures. | Precache both local navigation MP3s. Test after a complete offline download, including byte-range delivery and a first play in airplane mode. |

All nine existing dua files decoded individually with FFmpeg. They are mono 24 kHz MPEG layer III. This verifies file integrity only. No record pairing the exact file with a qualified human hearing and approving its Arabic wording and pronunciation was found. A separate Adhan recording decoded to 28.735 seconds. Its filename alone provides no evidence of the caller, completeness or distribution rights. None of the ten files is cleared in this review.

| Existing dua MP3 stem | Seconds |
| --- | ---: |
| black_stone | 3.120 |
| enter_masjid | 13.656 |
| exit_masjid | 8.976 |
| maqam_ibrahim | 4.920 |
| safa_first | 23.592 |
| safa_marwah_takbir | 31.680 |
| talbiyah_full | 13.344 |
| talbiyah_start | 2.568 |
| yemeni_corner | 9.216 |

The preview's two MP3s contain interface instructions only. The English voice was rendered in advance with Flite SLT and the Arabic with eSpeak NG. Both files decoded without FFmpeg errors. English is 12.120 seconds, Arabic 19.344 seconds. Preview narration quality and intelligibility still require listening tests with target users.

English script: Read the current step. Choose Continue when you are ready. When counting, record each lap after you finish it. If you tap twice, use the correction button. You can pause and come back to this device.

Arabic script: اقرأ خطوتك الحالية. عندما تكون جاهزًا، اضغط على متابعة. سجّل كل شوط بعد إتمامه. إذا ضغطت مرتين، استخدم زر التصحيح. يمكنك التوقف والعودة إلى هذا الجهاز.

## Reproduction

Run the audio test with Node from the directory containing the test and module. The test uses a simulated media element and covers control state, exclusivity, permission errors, media errors, retry and stale playback resolution. Decode the two navigation assets separately. This evidence does not establish speaker output, permissions on a real iPhone or intelligibility.

```sh
node --test docs/phase-one/test-audio.mjs
for f in frontend/public/companion/audio/*.mp3; do
  ffmpeg -v error -xerror -nostdin -i "$f" -f null - || exit 1
done
```

To clear each religious recording for publication, use a reciter with distribution permission. Pair the final audio file hash with the matching Arabic transcript and reference, named qualified reviewer, review date, pronunciation sign-off and rights evidence covering offline and app distribution. A newly encoded or replaced recording needs review against its own hash.
