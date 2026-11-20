# Pronunciation review for the eight additional languages

The separate review build pairs each Arabic text with its draft pronunciation, meaning and a short reading key. It uses Urdu and Persian script in those two languages. It uses local Latin-script conventions for French, Spanish, Indonesian, Somali, Italian and Portuguese. The public companion contains no draft language packs.

| Review material | Current coverage | Acceptance outstanding |
|---|---:|---|
| Stages and practice checks | 7 stages and 7 checks in each of the 8 catalogues | Native and scholarly review of each instruction |
| Recitation cards | 8 Arabic source passages, 64 draft meanings and 64 draft readings | Compare every reading and meaning with the source Arabic and the final approved human recording |
| Help | 4 draft entries per catalogue | Native and scholarly review |
| Whole application | Guide interface strings in eight review catalogues | Audit peripheral screens, fallbacks, errors, mobile layouts, spoken guidance and language-switch persistence |

Each native reviewer should read the draft aloud before hearing the recording. A qualified Arabic reader should compare both with the Arabic passage, paying attention to connected words, stopping, doubled consonants, emphatic sounds, hamzah and ʿayn. The Urdu and Persian entries segment connected speech and include vowel marks. They are a separate reading aid and must never be used in place of the original Arabic. Check that French and Spanish readers pronounce both Arabic l sounds where the reading uses “ll”, and check regional reading conventions in Spanish and Portuguese. Record the reviewer, accepted wording, date and exact approved audio hash before enabling a catalogue.

The automated test builds the private review package and renders the eight cards in both Practice and Live for each language. It checks that the correct Arabic, the local reading, the local meaning and the reading key reach the rendered card. It also checks that the unmodified website ships an empty draft catalogue. Run `node --test docs/phase-one/test-languages.mjs` from the repository root.

The Indonesian drafts draw on published Arabic–Latin conventions such as “sy” for ش. The Somali drafts use doubled long vowels, “c” for ع and “x” for ح. These references describe spelling conventions. All eight review packs still need individual reading and listening review.

- [Indonesia, Ministry of Religious Affairs, Arabic–Latin transliteration table in Pendidikan Agama Islam](https://cendikia.kemenag.go.id/storage/uploads/file_path/file_06-01-2021_5ff53e9e0d5cd.pdf)
- [UK Permanent Committee on Geographical Names, Somalia Toponymic Factfile, notes on the Somali alphabet](https://assets.publishing.service.gov.uk/media/65b78d870c75e3000dd801a2/Somalia_Toponymic_Factfile.pdf)
