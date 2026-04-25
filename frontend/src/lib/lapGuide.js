// Per-step action guidance for Tawaf and Sa'i.
// Du'as below taken verbatim from the user-supplied "Simple Umrah Guide" (Sunnah).
// Index n = state AFTER `n` laps/trips completed.

const SAFA_MARWAH_DUA = {
  ar: "اللَّهُ أَكْبَرُ، اللَّهُ أَكْبَرُ، اللَّهُ أَكْبَر، لَا إِلَهَ إِلاَّ اللَّهُ وَحْدَهُ لاَ شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ يُحْيِي وَيُمِيتُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِير، لاَ إِلَهَ إِلاَّ اللَّهُ وَحْدَهُ لاَ شَرِيكَ لَهُ، أَنْجَزَ وَعْدَهُ وَنَصَرَ عَبْدَهُ وَهَزَمَ الأَحْزَابَ وَحْدَهُ",
  tr: "Allāhu Akbar, Allāhu Akbar, Allāhu Akbar. Lā ilāha illallāhu wahdahu lā sharīka lah, lahul-mulku wa lahul-hamdu, yuhyī wa yumītu, wa huwa 'alā kulli shay'in qadīr. Lā ilāha illallāhu wahdahu lā sharīka lah, anjaza wa'dahu, wa nasara 'abdahu, wa hazamal-ahzāba wahdah.",
  en: "Allah is the Greatest (×3). There is none worthy of worship except Allah alone, without partner. To Him belongs all sovereignty and praise. He gives life and death, and He is over all things capable. There is none worthy of worship except Allah alone, without partner. He fulfilled His promise, aided His slave, and alone defeated the confederates.",
  note: "Recite 3 times, raising your hands and facing the Ka'bah. After the 1st and 2nd recitation, make plentiful du'a. After the 3rd, do NOT add du'a — proceed.",
};

const SAFA_OPENING_VERSE = {
  ar: "إِنَّ الصَّفَا وَالْمَرْوَةَ مِنْ شَعَائِرِ اللَّهِ ۖ فَمَنْ حَجَّ الْبَيْتَ أَوِ اعْتَمَرَ فَلَا جُنَاحَ عَلَيْهِ أَن يَطَّوَّفَ بِهِمَا ۚ وَمَن تَطَوَّعَ خَيْرًا فَإِنَّ اللَّهَ شَاكِرٌ عَلِيمٌ — نَبْدَأُ بِمَا بَدَأَ اللَّهُ بِه",
  tr: "Innaṣ-Ṣafā wal-Marwata min sha'ā'irillāh, faman ḥajjal-bayta awi'tamara falā junāḥa 'alayhi an yaṭṭawwafa bihimā, wa man taṭawwa'a khayran fa-innallāha shākirun 'alīm. Nabda'u bimā bada'allāhu bihi.",
  en: "Indeed, Safa and Marwah are among the symbols of Allah. So whoever performs Hajj or Umrah of the House — there is no blame on him for walking between them. And whoever volunteers good — indeed Allah is Appreciative and Knowing. We begin with what Allah began with.",
  note: "Recite this only ONCE, the very first time you climb Safa.",
};

const BETWEEN_CORNERS_DUA = {
  ar: "رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ",
  tr: "Rabbanā ātinā fid-dunyā ḥasanatan wa fil-ākhirati ḥasanatan wa qinā 'adhāban-nār.",
  en: "Our Lord, give us good in this world and good in the Hereafter, and protect us from the punishment of the Fire.",
};

export const TAWAF_GUIDE = [
  {
    title_en: "Before lap 1 — Begin at the Black Stone",
    title_ar: "قبل الشوط الأول — ابدأ من الحجر الأسود",
    actions_en: [
      "Each lap is one FULL circle around the Ka'bah, starting and ending at the Black Stone corner.",
      "Men: bare your right shoulder (Idtibā') for Tawaf al-Qudum.",
      "Stand parallel to the Black Stone with the Ka'bah on your LEFT.",
      "Face the Black Stone, raise your right hand and say: «اللَّهُ أَكْبَر». (Kiss/touch only if easy without harm.)",
      "Begin walking counter-clockwise. Men perform Raml (brisk shoulders-shaken pace) for laps 1–3; women walk normally.",
    ],
    actions_ar: [
      "كل شوط دورة كاملة حول الكعبة، يبدأ وينتهي عند الحجر الأسود.",
      "للرجال: اكشف الكتف الأيمن (الاضطباع) في طواف القدوم.",
      "قف بمحاذاة الحجر الأسود واجعل الكعبة عن يسارك.",
      "استقبل الحجر الأسود، ارفع يدك اليمنى وقل: «اللَّهُ أَكْبَر». (لا تُقبّله ولا تستلمه إلا إن تيسّر دون أذى.)",
      "ابدأ المشي عكس عقارب الساعة. الرجال يَرملون في الأشواط الثلاثة الأولى، أما النساء فيمشين.",
    ],
    dua: { ar: "اللَّهُ أَكْبَر", tr: "Allāhu Akbar", en: "Allah is the Greatest." },
  },
  ...buildTawafLapEntries(),
  {
    title_en: "Tawaf complete — Alhamdulillah",
    title_ar: "اكتمل الطواف — الحمد لله",
    actions_en: [
      "Men: cover your right shoulder again (Idtibā' ends).",
      "Pray 2 short raka'ah behind Maqam Ibrahim if possible (Surah al-Kāfirūn + al-Ikhlās).",
      "Drink Zamzam generously, standing, facing the Qiblah, and make du'a.",
      "Return to the Black Stone if able and touch/point to it once more.",
      "Proceed to Safa to begin Sa'i.",
    ],
    actions_ar: [
      "الرجال: غطِّ كتفك الأيمن (انتهى الاضطباع).",
      "صلِّ ركعتين خفيفتين خلف مقام إبراهيم إن تيسّر (الكافرون والإخلاص).",
      "اشرب من ماء زمزم قائمًا مستقبلًا القبلة وادعُ بما شئت.",
      "ارجع إلى الحجر الأسود واستلمه أو أشر إليه إن استطعت.",
      "توجّه إلى الصفا للبدء بالسعي.",
    ],
  },
];

function buildTawafLapEntries() {
  // After each of the 7 laps, the message is the same flow with slight pacing notes.
  const laps = [
    { en: "Lap 1 complete — keep Raml", ar: "اكتمل الشوط الأول — استمر في الرَّمَل", note_en: "2 more Raml laps to go.", note_ar: "بقي شوطان من الرَّمَل." },
    { en: "Lap 2 complete — Raml continues", ar: "اكتمل الشوط الثاني — استمر في الرَّمَل", note_en: "1 more Raml lap.", note_ar: "بقي شوط رَمَل واحد." },
    { en: "Lap 3 complete — stop Raml now", ar: "اكتمل الشوط الثالث — انتهى الرَّمَل", note_en: "From lap 4 walk at your normal pace.", note_ar: "من الشوط الرابع امشِ بمشيك المعتاد." },
    { en: "Lap 4 complete — halfway", ar: "اكتمل الشوط الرابع — منتصف الطواف", note_en: "Walk normally; make sincere du'a.", note_ar: "امشِ بسكينة وأكثر من الدعاء." },
    { en: "Lap 5 complete", ar: "اكتمل الشوط الخامس", note_en: "Recite Qur'an, dhikr, salawāt.", note_ar: "اقرأ القرآن وأكثر من الذكر والصلاة على النبي ﷺ." },
    { en: "Lap 6 complete — final lap ahead", ar: "اكتمل الشوط السادس — اقترب الختام", note_en: "Save your most heartfelt du'a for the last lap.", note_ar: "خصّص أهم دعواتك للشوط الأخير." },
    { en: "Lap 7 complete — Tawaf done", ar: "اكتمل الشوط السابع — انتهى الطواف", note_en: "End at the Black Stone, point to it once more.", note_ar: "انتهِ عند الحجر الأسود وأشر إليه مرة أخيرة." },
  ];
  return laps.slice(0, 6).map((l) => ({
    title_en: l.en,
    title_ar: l.ar,
    actions_en: [
      l.note_en,
      "At the Black Stone (start of each new lap): face it, raise right hand, say «اللَّهُ أَكْبَر».",
      "At the Yemeni Corner: touch with right hand if easy — NO kiss, NO takbir, NO du'a here.",
      "BETWEEN the Yemeni Corner and Black Stone: recite the verse (Rabbanā ātinā…).",
      "Otherwise: free du'a, dhikr, or Qur'an throughout the rest of the lap.",
    ],
    actions_ar: [
      l.note_ar,
      "عند الحجر الأسود (بداية كل شوط جديد): استقبله، ارفع يدك اليمنى وقل «اللَّهُ أَكْبَر».",
      "عند الركن اليماني: المسه بيدك اليمنى إن تيسّر — بدون تقبيل، ولا تكبير، ولا دعاء عنده.",
      "بين الركن اليماني والحجر الأسود: اقرأ آية (ربّنا آتنا…).",
      "في باقي الشوط: ادعُ بما تشاء واذكر الله واقرأ القرآن.",
    ],
    dua: BETWEEN_CORNERS_DUA,
  }));
}

export const SAI_GUIDE = [
  {
    title_en: "Before trip 1 — Climb Safa",
    title_ar: "قبل الشوط الأول — اصعد الصفا",
    actions_en: [
      "Climb Safa and face the Ka'bah.",
      "Recite the verse (al-Baqarah 2:158) ONCE — only the first time you climb Safa.",
      "Then raise your hands and recite the long takbīr+tahlīl 3 times. After the 1st and 2nd, make plentiful du'a. After the 3rd, do NOT add du'a — descend.",
      "Walk down toward Marwah; men jog briskly between the two GREEN markers, women walk normally.",
    ],
    actions_ar: [
      "اصعد على الصفا واستقبل الكعبة.",
      "اقرأ آية البقرة (١٥٨) مرة واحدة فقط في أول مرة تصعد الصفا.",
      "ثم ارفع يديك واقرأ التكبير والتهليل ثلاث مرات. بعد الأولى والثانية ادعُ بما شئت. بعد الثالثة لا تَدعُ — انزل.",
      "امشِ نحو المروة. يَهرول الرجال بين العَلَمين الأخضرين، أما النساء فيمشين.",
    ],
    duas: [SAFA_OPENING_VERSE, SAFA_MARWAH_DUA],
  },
  ...buildSaiTripEntries(),
];

function buildSaiTripEntries() {
  // Trips 1..7 — alternating Marwah / Safa endings.
  // After every trip recite the 3x takbīr+tahlīl with du'a, EXCEPT the very last (trip 7 on Marwah) — do not recite there.
  const labels = [
    { ord: "1st", target_en: "Marwah", target_ar: "المروة" }, // count=1 → on Marwah
    { ord: "2nd", target_en: "Safa", target_ar: "الصفا" },
    { ord: "3rd", target_en: "Marwah", target_ar: "المروة" },
    { ord: "4th", target_en: "Safa", target_ar: "الصفا" },
    { ord: "5th", target_en: "Marwah", target_ar: "المروة" },
    { ord: "6th", target_en: "Safa", target_ar: "الصفا" },
    { ord: "7th", target_en: "Marwah", target_ar: "المروة" },
  ];
  return labels.map((l, i) => {
    const isLast = i === labels.length - 1;
    return {
      title_en: isLast
        ? "Sa'i complete on Marwah — Alhamdulillah"
        : `${l.ord} trip complete — on ${l.target_en}`,
      title_ar: isLast ? "اكتمل السعي على المروة — الحمد لله" : `اكتمل الشوط ${l.ord === "1st" ? "الأول" : l.ord === "2nd" ? "الثاني" : l.ord === "3rd" ? "الثالث" : l.ord === "4th" ? "الرابع" : l.ord === "5th" ? "الخامس" : l.ord === "6th" ? "السادس" : "السابع"} — على ${l.target_ar}`,
      actions_en: isLast
        ? [
            "You are on Marwah after the 7th trip — Sa'i is now complete.",
            "Do NOT recite the long takbīr+tahlīl on this final visit to Marwah (per the Sunnah).",
            "Make a final long, heartfelt du'a facing the Qiblah.",
            "When leaving Masjid al-Haram, say: «اللَّهُمَّ إِنِّي أَسْأَلُكَ مِنْ فَضْلِكَ».",
            "Proceed to Halq (shave) for men — preferred — or Taqsīr (trim). Women cut a fingertip's length.",
          ]
        : [
            `Face the Ka'bah on ${l.target_en}, raise both hands.`,
            "Recite the long takbīr+tahlīl 3 times.",
            "After the 1st and 2nd recitation: make plentiful personal du'a.",
            "After the 3rd: do NOT add du'a — descend and walk to the other side.",
            "Between the two GREEN markers: men jog briskly, women walk normally.",
          ],
      actions_ar: isLast
        ? [
            "أنت الآن على المروة بعد الشوط السابع — اكتمل السعي.",
            "لا تُكرّر التكبير والتهليل في هذه الزيارة الأخيرة للمروة (من السنة).",
            "ادعُ دعاءً مطوّلًا مستقبلًا القبلة.",
            "عند الخروج من المسجد الحرام قل: «اللَّهُمَّ إِنِّي أَسْأَلُكَ مِنْ فَضْلِكَ».",
            "توجّه إلى الحلق (للرجال، وهو الأفضل) أو التقصير. النساء يأخذن من أطراف الشعر قدر أنملة.",
          ]
        : [
            `استقبل الكعبة من ${l.target_ar}، وارفع يديك.`,
            "اقرأ التكبير والتهليل ثلاث مرات.",
            "بعد الأولى والثانية: ادعُ بما شئت من الدعاء.",
            "بعد الثالثة: لا تَدعُ — انزل وامشِ إلى الجهة الأخرى.",
            "بين العَلَمين الأخضرين: يَهرول الرجال، أما النساء فيمشين.",
          ],
      duas: isLast ? [] : [SAFA_MARWAH_DUA],
    };
  });
}
