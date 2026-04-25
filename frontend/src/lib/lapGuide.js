// Detailed per-lap action guidance for Tawaf and Sa'i.
// Index 0 = "Before you start". Indexes 1..7 = state AFTER tapping that lap (i.e. while doing lap n+1).
// Easier to read this as: show TAWAF[count] when user has completed `count` laps.

export const TAWAF_GUIDE = [
  {
    title_en: "Before lap 1 — Begin at the Black Stone",
    title_ar: "قبل الشوط الأول — ابدأ من الحجر الأسود",
    actions_en: [
      "Men: bare your right shoulder (Idhtiba) — only during Tawaf al-Qudum.",
      "Stand parallel to the Black Stone (Hajar al-Aswad). Keep the Ka'bah on your LEFT.",
      "Face the Black Stone, raise your right hand and say: «بِسْمِ اللَّهِ، اللَّهُ أَكْبَر».",
      "Begin walking. Men do Raml (brisk steps with shoulders shaken) for the first 3 laps; women walk normally.",
    ],
    actions_ar: [
      "الرجال: اكشف كتفك الأيمن (الاضطباع) في طواف القدوم فقط.",
      "قف بمحاذاة الحجر الأسود واجعل الكعبة عن يسارك.",
      "استقبل الحجر، ارفع يدك اليمنى وقل: «بِسْمِ اللَّهِ، اللَّهُ أَكْبَر».",
      "ابدأ الطواف. للرجال: الرَّمَل في الأشواط الثلاثة الأولى. للنساء: المشي العادي.",
    ],
    dua: {
      ar: "بِسْمِ اللَّهِ، اللَّهُ أَكْبَر",
      tr: "Bismillah, Allahu Akbar",
      en: "In the name of Allah; Allah is the Greatest.",
    },
  },
  {
    title_en: "Lap 1 complete — keep Raml",
    title_ar: "اكتمل الشوط الأول — استمر في الرَّمَل",
    actions_en: [
      "Pass the Yemeni Corner (Rukn Yamani): touch it with your right hand if easy — do NOT kiss or say takbir.",
      "Between Yemeni Corner and Black Stone, recite the du'a of al-Baqarah 2:201 below.",
      "At the Black Stone again: raise right hand, say takbir; that completes one lap.",
    ],
    actions_ar: [
      "عند الركن اليماني: المسه بيدك اليمنى إن تيسّر، ولا تُقبّله ولا تكبّر.",
      "بين الركن اليماني والحجر الأسود اقرأ دعاء البقرة (٢٠١).",
      "عند الحجر الأسود ارفع يدك وكبّر — اكتمل الشوط.",
    ],
    dua: {
      ar: "رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ",
      tr: "Rabbana atina fid-dunya hasanatan wa fil-akhirati hasanatan wa qina 'adhaban-nar.",
      en: "Our Lord, give us good in this world and good in the Hereafter, and protect us from the Fire.",
    },
  },
  {
    title_en: "Lap 2 complete — Raml continues",
    title_ar: "اكتمل الشوط الثاني — الرَّمَل مستمر",
    actions_en: [
      "Make du'a freely in your own language during the rest of the lap.",
      "Stay close to the Ka'bah if possible, but never push others — sakinah is sunnah.",
      "Repeat the verse 2:201 between the two corners.",
    ],
    actions_ar: [
      "ادعُ بما تشاء بلغتك خلال الشوط.",
      "اقترب من الكعبة إن استطعت دون مزاحمة — السكينة من السنة.",
      "كرّر دعاء (٢٠١) بين الركنين.",
    ],
  },
  {
    title_en: "Lap 3 complete — stop Raml now",
    title_ar: "اكتمل الشوط الثالث — انتهى الرَّمَل",
    actions_en: [
      "From Lap 4 onward, walk at your normal pace (no more Raml).",
      "Continue making personal du'a; recite Qur'an, dhikr, or salawat upon the Prophet ﷺ.",
      "Keep saying takbir at the Black Stone each round.",
    ],
    actions_ar: [
      "من الشوط الرابع: امشِ بمشيك المعتاد دون رَمَل.",
      "أكثر من الدعاء وقراءة القرآن والذكر والصلاة على النبي ﷺ.",
      "استمر بالتكبير عند محاذاة الحجر الأسود.",
    ],
  },
  {
    title_en: "Lap 4 complete — halfway done",
    title_ar: "اكتمل الشوط الرابع — منتصف الطواف",
    actions_en: [
      "Maintain calm walking. Make du'a for yourself, your family, and the Ummah.",
      "Touch Yemeni Corner with right hand if possible.",
    ],
    actions_ar: [
      "استمر بالمشي بسكينة. ادعُ لنفسك وأهلك والأمة.",
      "المس الركن اليماني بيدك اليمنى إن تيسّر.",
    ],
  },
  {
    title_en: "Lap 5 complete",
    title_ar: "اكتمل الشوط الخامس",
    actions_en: [
      "Recite verse 2:201 between the Yemeni Corner and Black Stone.",
      "Remember: there is no fixed du'a per lap — the Prophet ﷺ did not assign one.",
    ],
    actions_ar: [
      "اقرأ آية (٢٠١) بين الركن اليماني والحجر الأسود.",
      "تذكّر: لا يوجد دعاء مخصوص لكل شوط — لم يثبت ذلك عن النبي ﷺ.",
    ],
  },
  {
    title_en: "Lap 6 complete — final lap ahead",
    title_ar: "اكتمل الشوط السادس — اقترب الختام",
    actions_en: [
      "Increase your salawat and istighfar.",
      "Save your most important personal du'as for this final stretch.",
    ],
    actions_ar: [
      "أكثر من الصلاة على النبي ﷺ والاستغفار.",
      "خصّص أهم دعواتك في هذا الشوط الأخير.",
    ],
  },
  {
    title_en: "Tawaf complete — Alhamdulillah",
    title_ar: "اكتمل الطواف — الحمد لله",
    actions_en: [
      "Men: cover your right shoulder again (Idhtiba ends).",
      "Pray 2 short raka'ah behind Maqam Ibrahim if possible (Surah al-Kafirun + al-Ikhlas).",
      "Drink Zamzam water generously while standing, facing the Qiblah, and make du'a.",
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

export const SAI_GUIDE = [
  {
    title_en: "Before trip 1 — Climb Safa",
    title_ar: "قبل الشوط الأول — اصعد الصفا",
    actions_en: [
      "Recite the verse: «إِنَّ الصَّفَا وَالْمَرْوَةَ مِن شَعَائِرِ اللهِ» — once, only at the start.",
      "Say: «أَبْدَأُ بِمَا بَدَأَ اللَّهُ بِهِ».",
      "Climb Safa, face the Ka'bah, raise both hands, say «اللَّهُ أَكْبَر» three times, then make du'a.",
      "Repeat takbir + du'a 3 times in total.",
      "Walk down toward Marwah at a normal pace.",
    ],
    actions_ar: [
      "اقرأ الآية: «إِنَّ الصَّفَا وَالْمَرْوَةَ مِن شَعَائِرِ اللَّهِ» — مرة واحدة عند البدء فقط.",
      "قل: «أَبْدَأُ بِمَا بَدَأَ اللَّهُ بِهِ».",
      "اصعد على الصفا، استقبل الكعبة، ارفع يديك وقل «اللَّهُ أَكْبَر» ثلاثًا ثم ادعُ.",
      "كرّر التكبير والدعاء ثلاث مرات.",
      "انزل واتجه نحو المروة بمشيك المعتاد.",
    ],
    dua: {
      ar: "لاَ إِلَهَ إِلاَّ اللَّهُ وَحْدَهُ لاَ شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِير",
      tr: "La ilaha illallahu wahdahu la sharika lah, lahul-mulku wa lahul-hamdu wa huwa 'ala kulli shay'in qadir.",
      en: "There is no deity but Allah alone, no partner has He. To Him belongs the dominion and praise, and He has power over all things.",
    },
  },
  {
    title_en: "Trip 1 → Marwah",
    title_ar: "الشوط الأول إلى المروة",
    actions_en: [
      "Walk normally between Safa and the FIRST green light marker.",
      "Between the TWO GREEN LIGHTS: men jog briskly. Women walk normally.",
      "After the second green light: walk normally again until Marwah.",
      "On Marwah: face the Ka'bah, raise both hands, say takbir 3x, du'a 3x. (No recitation of the Safa verse here.)",
    ],
    actions_ar: [
      "امشِ بمشيك المعتاد من الصفا حتى العَلَم الأخضر الأول.",
      "بين العَلَمين الأخضرين: يَهرول الرجال، أما النساء فيمشين.",
      "بعد العَلَم الثاني عُد إلى المشي العادي حتى المروة.",
      "على المروة: استقبل الكعبة، ارفع يديك، كبّر ثلاثًا وادعُ ثلاثًا (دون قراءة آية الصفا هنا).",
    ],
  },
  {
    title_en: "Trip 2 → Safa",
    title_ar: "الشوط الثاني إلى الصفا",
    actions_en: [
      "Walk down from Marwah toward Safa.",
      "Jog between the two green markers (men only).",
      "On Safa: face the Ka'bah, takbir 3x, du'a 3x.",
    ],
    actions_ar: [
      "انزل من المروة متجهًا إلى الصفا.",
      "يَهرول الرجال بين العَلَمين الأخضرين.",
      "على الصفا: كبّر ثلاثًا وادعُ ثلاثًا.",
    ],
  },
  {
    title_en: "Trip 3 → Marwah",
    title_ar: "الشوط الثالث إلى المروة",
    actions_en: [
      "Continue with the same pattern: walk → jog between green lights → walk.",
      "Make personal du'a freely; recite Qur'an or dhikr.",
    ],
    actions_ar: [
      "كرّر النمط: مشي → هرولة بين العَلَمين → مشي.",
      "ادعُ بما شئت، واقرأ ما تيسّر من القرآن والذكر.",
    ],
  },
  {
    title_en: "Trip 4 → Safa",
    title_ar: "الشوط الرابع إلى الصفا",
    actions_en: [
      "Halfway through Sa'i. Stay focused; remember Hajar (AS) running here looking for water.",
      "Takbir + du'a on Safa as before.",
    ],
    actions_ar: [
      "وصلت منتصف السعي. تذكّر سعي السيدة هاجر بحثًا عن الماء لابنها إسماعيل.",
      "على الصفا: تكبير ودعاء كالسابق.",
    ],
  },
  {
    title_en: "Trip 5 → Marwah",
    title_ar: "الشوط الخامس إلى المروة",
    actions_en: [
      "Hydrate if needed; do not break Ihram restrictions.",
      "Continue jogging between the green markers (men).",
    ],
    actions_ar: [
      "اشرب الماء إذا احتجت دون أن تخالف محظورات الإحرام.",
      "استمر بالهرولة بين العَلَمين (للرجال).",
    ],
  },
  {
    title_en: "Trip 6 → Safa",
    title_ar: "الشوط السادس إلى الصفا",
    actions_en: [
      "One trip remaining after this. Make heartfelt du'a — this place witnessed the answered prayer of Hajar (AS).",
    ],
    actions_ar: [
      "بقي شوط واحد. ألحَّ في الدعاء — هذا مكان استجابة دعاء السيدة هاجر.",
    ],
  },
  {
    title_en: "Sa'i complete on Marwah — Alhamdulillah",
    title_ar: "اكتمل السعي على المروة — الحمد لله",
    actions_en: [
      "Make a final long du'a on Marwah, facing the Qiblah.",
      "Proceed to Halq (shave) for men — preferred — or Taqsir (trim).",
      "Women: cut a fingertip's length from the ends of their hair.",
      "With this, Umrah is complete and Ihram restrictions are lifted (after halq/taqsir).",
    ],
    actions_ar: [
      "ادعُ دعاء مطوّلًا على المروة مستقبلًا القبلة.",
      "توجّه إلى الحلق (للرجال، وهو الأفضل) أو التقصير.",
      "النساء يأخذن من أطراف الشعر قدر أنملة.",
      "بذلك تكتمل العمرة وتنتهي محظورات الإحرام بعد الحلق أو التقصير.",
    ],
  },
];
