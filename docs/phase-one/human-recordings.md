# Human recordings for preparation

The official online book of Saʿīd al-Qaḥṭānī presents a separate audio player for each Hisn al-Muslim item. Its player explicitly pairs each of three named readers with a different MP3. Reading choices are حمد الدريهم (default), سليمان الشويهي and راشد الحليبة. Direct queries of the four publisher webpages and full FFmpeg decoding of each default stream succeeded on 20 November 2026. No third-party recordings were placed in the application.

| Practice topic | Publisher's listening page | What the listener hears |
| --- | --- | --- |
| Talbiyah | https://binwahaf.com/ar/audio-book-lesson/1284/ | Item 233. The page prints the full Talbiyah, citing al-Bukhari 1549 and Muslim 1184. |
| Passing the Black Stone | https://binwahaf.com/ar/audio-book-lesson/1285/ | Item 234. The text is the hadith describing the action. Do not label the audiobook a standalone recording of “Allāhu akbar.” |
| Between the Yemeni Corner and Black Stone | https://binwahaf.com/ar/audio-book-lesson/1287/ | Item 235. The supplication begins Rabbanā ātinā. A full Qur’an 2:201 track additionally contains the ayah's narrative introduction. |
| Standing at Safa and Marwah | https://binwahaf.com/ar/audio-book-lesson/1289/ | Item 236. An extended narration includes the verse excerpt, dhikr and reported actions. It is longer than a recitation of just the first words of Qur’an 2:158. |

Item 237 belongs to the Day of ʿArafah and is outside this Umrah itinerary. The author’s collection and list are at https://binwahaf.com/ar/audio-book-series/897/. Its footer reserves all rights. The public listening page and download control establish public access. Commercial app redistribution, audio editing and offline bundling require separate rights evidence. No explicit commercial redistribution licence for these MP3s was located. Link to the publisher's page with an online label. Each bundled recitation also needs a documented hearing against the exact on-screen transcript and release approval.

The default track sizes decoded were 191,973, 145,274, 146,842 and 893,427 bytes for 233, 234, 235 and 236 respectively. Decoder success confirms transport and MPEG integrity only. Reproduce by opening the published page, finding its default source URL in the audio element, and running FFmpeg with input piped from that exact source.

Quran Foundation separately allows direct streaming under its developer terms, requires attribution, limits downloaded files to a week and disallows rehosting. https://api-docs.quran.com/docs/tutorials/faq/
