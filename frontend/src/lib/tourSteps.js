// Tour-mode steps. Each step shows an illustrated scene, an instruction,
// and (where relevant) the exact Sunnah du'a to recite.
// Scene names map to /app/frontend/src/components/TourScene.jsx

export const TOUR_STEPS = [
  // ─── INTRO ─────────────────────────────────────────────────
  {
    chapter: "Intro",
    scene: "intro",
    title_en: "Umrah in 4 simple steps",
    title_ar: "العمرة في ٤ خطوات بسيطة",
    what_en:
      "Umrah is just four parts: Ihram, Tawaf, Sa'i, and Halq. We'll do each one together — tap NEXT when you're ready.",
    what_ar:
      "العمرة أربعة أجزاء فقط: الإحرام، الطواف، السعي، والحلق. سنقوم بكل خطوة معًا — اضغط «التالي» عند الاستعداد.",
  },

  // ─── 1. IHRAM ──────────────────────────────────────────────
  {
    chapter: "Ihram",
    scene: "miqat",
    title_en: "Before Iḥrām — prepare yourself",
    title_ar: "قبل الإحرام — استعدّ",
    what_en:
      "Before putting on Iḥrām, do these as part of the Sunnah: (1) Ghusl — a full-body wash, (2) trim nails, (3) shave armpit / pubic hair, (4) men — trim moustache, (5) apply perfume to the body and hair — NOT to the cloth. Once you put on Iḥrām and enter its state, these nine things become forbidden until Taḥallul:",
    what_ar:
      "قبل ارتداء الإحرام، من السنّة: ١) الاغتسال، ٢) تقليم الأظفار، ٣) حلق شعر العانة ونتف الإبط، ٤) للرجال: قصّ الشّارب، ٥) التّطيّب في البدن والرّأس — لا في الثّوب. بعد الدّخول في الإحرام تحرم عليك تسعة أمور حتى التّحلّل:",
    tip: "Once in Iḥrām, these are forbidden: 1) perfume, 2) trimming hair, 3) cutting nails, 4) covering the head (men), 5) wearing stitched clothing (men), 6) niqab & gloves (women), 7) marriage contracts, 8) intimacy, 9) hunting. Most first-timers forget to clip nails and perfume themselves BEFORE putting on Iḥrām — do it now.",
  },
  {
    chapter: "Ihram",
    scene: "miqat",
    title_en: "Step 1 · Iḥrām — at the Mīqāt",
    title_ar: "الخطوة ١ · الإحرام — عند الميقات",
    what_en:
      "At the Mīqāt boundary, change into Iḥrām. MEN: two unstitched white sheets — izār (bottom) + ridāʾ (top) — head uncovered. WOMEN: any modest clothing — no niqab, no gloves.",
    what_ar:
      "عند الميقات، ارتدِ الإحرام. الرّجال: قطعتان بيضاوان غير مخيطتين (إزار ورداء) والرّأس مكشوف. النّساء: ملابس محتشمة، بلا نقاب ولا قفّازين.",
    tip: "There are 5 official Mīqāt boundaries — plus Masjid ʿĀʾishah (Tanʿīm) for those already in Makkah. See all of them in the Ziyārah tab (📍 in the bottom nav).",
  },
  {
    chapter: "Ihram",
    scene: "niyyah",
    title_en: "Make your intention (Niyyah) — in the heart",
    title_ar: "النية — في القلب",
    what_en:
      "Niyyah is in the HEART — never said out loud (Ibn Taymiyyah, Ibn Bāz, al-Albānī). Simply intend ʿUmrah in your heart, then say the phrase below ONCE out loud — this is the start of your Talbiyah, not a verbal niyyah.",
    what_ar:
      "النيّة محلّها القلب — لا تُنطق باللسان (ابن تيمية، ابن باز، الألباني). انوِ العمرة بقلبك، ثم قل العبارة التالية مرّة واحدة جهرًا — وهي بداية التلبية، وليست تلفّظًا بالنية.",
    dua: {
      ar: "لَبَّيْكَ اللَّهُمَّ بِعُمْرَة",
      tr: "Labbayk Allāhumma bi-ʿumrah.",
      en: "Here I am, O Allah, for ʿUmrah.",
      label_en: "Start of Talbiyah for ʿUmrah",
      label_ar: "بداية التلبية بالعمرة",
    },
    tip: "Niyyah is silent — the heart only. Saying the niyyah aloud is not from the Sunnah.",
  },
  {
    chapter: "Ihram",
    scene: "talbiyah",
    title_en: "Recite the Talbiyah",
    title_ar: "التلبية",
    what_en:
      "Begin reciting the Talbiyah out loud (men) or quietly (women). Keep repeating it the whole way to Masjid al-Haram.",
    what_ar:
      "ابدأ بترديد التلبية جهرًا (للرجال) أو سرًّا (للنساء). استمر في ترديدها حتى تصل المسجد الحرام.",
    dua: {
      ar:
        "لَبَّيْكَ اللَّهُمَّ لَبَّيْكَ، لَبَّيْكَ لَا شَرِيكَ لَكَ لَبَّيْكَ، إِنَّ الْحَمْدَ وَالنِّعْمَةَ لَكَ وَالْمُلْكُ، لَا شَرِيكَ لَكَ",
      tr:
        "Labbayk Allāhumma labbayk. Labbayk lā sharīka laka labbayk. Innal-ḥamda wan-niʿmata laka wal-mulk, lā sharīka lak.",
      en:
        "Here I am, O Allah, here I am. Here I am — You have no partner — here I am. All praise, blessing, and sovereignty belong to You. You have no partner.",
      label_en: "Talbiyah — keep repeating",
      label_ar: "التلبية — كرّرها",
    },
  },

  // ─── 2. ARRIVING AT MASJID AL-HARAM ────────────────────────
  {
    chapter: "Tawaf",
    scene: "enter-masjid",
    title_en: "Enter Masjid al-Haram",
    title_ar: "دخول المسجد الحرام",
    what_en:
      "Step in with your RIGHT foot first and recite the entry du'a. KEEP reciting the Talbiyah — it doesn't stop until you reach the Black Stone to begin Tawaf.",
    what_ar:
      "ادخل بقدمك اليمنى وقل دعاء الدخول. استمر في التلبية — لا تتوقف حتى تصل الحجر الأسود لبدء الطواف.",
    dua: {
      ar:
        "بِسْمِ اللَّهِ، وَالصَّلَاةُ وَالسَّلَامُ عَلَى رَسُولِ اللَّهِ، اللَّهُمَّ اغْفِرْ لِي ذُنُوبِي وَافْتَحْ لِي أَبْوَابَ رَحْمَتِكَ",
      tr:
        "Bismillāh, waṣ-ṣalātu was-salāmu ʿalā Rasūlillāh. Allāhumma-ghfir lī dhunūbī waftaḥ lī abwāba raḥmatik.",
      en:
        "In the name of Allah, peace and blessings upon the Messenger of Allah. O Allah, forgive my sins and open the gates of Your mercy for me.",
      label_en: "Du'a on entering the masjid",
      label_ar: "دعاء دخول المسجد",
    },
  },

  // ─── 3. TAWAF ──────────────────────────────────────────────
  {
    chapter: "Tawaf",
    scene: "tawaf-start",
    title_en: "Step 2 · Tawaf — start at the Black Stone",
    title_ar: "الخطوة ٢ · الطواف — ابدأ من الحجر الأسود",
    what_en:
      "Stand facing the Black Stone (east corner of the Ka'bah). Raise your right hand toward it and say 'Allāhu Akbar' — once. This marks the start of every lap.\n\nMEN: uncover your right shoulder (Idhtibāʿ) by placing the iḥrām under your right armpit — keep it like this until the end of all 7 laps. For the FIRST 3 laps, walk swiftly (Raml) like a brisk jog; for laps 4–7, walk normally.",
    what_ar:
      "قف مستقبلًا الحجر الأسود (الركن الشرقي للكعبة)، ارفع يدك اليمنى نحوه وقل: 'اللَّهُ أَكْبَر' — مرّة واحدة. وهذه بداية كل شوط.\n\nالرجال: اكشف الكتف الأيمن (الاضطباع) بجعل الإحرام تحت الإبط الأيمن، وأبقِه كذلك حتى نهاية الأشواط السبعة. وفي الأشواط الثلاثة الأولى: امشِ بسرعة (الرَّمَل) وكأنّك تهرول؛ وفي الأشواط ٤–٧: امشِ عاديًا.",
    dua: {
      ar: "اللَّهُ أَكْبَر",
      tr: "Allāhu Akbar.",
      en: "Allah is the Greatest.",
      label_en: "At the Black Stone — every lap",
      label_ar: "عند الحجر الأسود — كل شوط",
    },
    tip: "Istilām (greeting the Black Stone) has a Sunnah order of preference: 1) Touch AND kiss it — if easily possible. 2) Touch it with your hand, then kiss your hand. 3) Touch it with a stick, then kiss the stick. 4) From a distance, point towards it with your right hand and say Allāhu Akbar ONLY — DO NOT kiss your hand afterwards. This last point is a common mistake, with no basis in the Sunnah. Never push or harm others trying to reach it.",
  },
  {
    chapter: "Tawaf",
    scene: "tawaf-flow",
    title_en: "Walk around the Ka'bah — 7 laps",
    title_ar: "طُف حول الكعبة سبعة أشواط",
    what_en:
      "Now you'll go around 7 times. We'll walk you through each lap step by step — Black Stone, the Yemeni Corner, and the du'a between them.",
    what_ar:
      "ستطوف الآن سبعة أشواط. سنرافقك في كل شوط خطوة بخطوة — الحجر الأسود، الركن اليماني، والدعاء بينهما.",
  },
  {
    chapter: "Tawaf",
    scene: "maqam",
    title_en: "After Tawaf — pray 2 rakʿah behind Maqām Ibrāhīm",
    title_ar: "بعد الطواف — صلِّ ركعتين خلف المقام",
    what_en:
      "After 7 laps, pray 2 rakʿah behind Maqām Ibrāhīm — or, if it is crowded, ANYWHERE in the masjid facing the Ka'bah. Both Ibn Bāz and al-Albānī permitted this; do not push or harm others to stand behind the Maqām. 1st rakʿah: Sūrat al-Kāfirūn after al-Fātiḥah. 2nd rakʿah: Sūrat al-Ikhlāṣ.",
    what_ar:
      "بعد سبعة أشواط، صلِّ ركعتين خلف مقام إبراهيم — أو في أيّ مكان من المسجد إذا كان الزّحام شديدًا مستقبلًا الكعبة. أفتى بذلك ابن باز والألباني رحمهما الله؛ لا تدفع النّاس ولا تؤذهم لتقف خلف المقام. الأولى: الفاتحة ثم الكافرون. الثّانية: الفاتحة ثم الإخلاص.",
  },
  {
    chapter: "Tawaf",
    scene: "zamzam",
    title_en: "Drink Zamzam water",
    title_ar: "اشرب من ماء زمزم",
    what_en:
      "Drink Zamzam to your fill, in three breaths. Pour some over your head too — both are Sunnah. Make any du'a you wish before the first sip — in any language.",
    what_ar:
      "اشرب من زمزم حتى تكتفي، على ثلاث جُرعات، واصبب على رأسك منها — كلاهما من السنّة. ادعُ بما شئت قبل أول رشفة بأي لغة.",
  },

  // ─── 4. SA'I ───────────────────────────────────────────────
  {
    chapter: "Sa'i",
    scene: "safa-start",
    title_en: "Step 3 · Sa'i — start at Safa",
    title_ar: "الخطوة ٣ · السعي — ابدأ من الصفا",
    what_en:
      "Walk to the hill of Safa. As you approach, recite the verse below — the FIRST time only.",
    what_ar:
      "اتّجه إلى الصفا. عند الاقتراب، اقرأ الآية التالية في المرّة الأولى فقط.",
    dua: {
      ar:
        "إِنَّ الصَّفَا وَالْمَرْوَةَ مِنْ شَعَائِرِ اللَّهِ ۖ فَمَنْ حَجَّ الْبَيْتَ أَوِ اعْتَمَرَ فَلَا جُنَاحَ عَلَيْهِ أَنْ يَطَّوَّفَ بِهِمَا ۚ وَمَنْ تَطَوَّعَ خَيْرًا فَإِنَّ اللَّهَ شَاكِرٌ عَلِيمٌ — نَبْدَأُ بِمَا بَدَأَ اللَّهُ بِه",
      tr:
        "Innaṣ-Ṣafā wal-Marwata min shaʿāʾirillāh. Faman ḥajjal-bayta awiʿtamara falā junāḥa ʿalayhi an yaṭṭawwafa bihimā. Wa man taṭawwaʿa khayran fa-innallāha shākirun ʿalīm. Nabdaʾu bimā badaʾallāhu bih.",
      en:
        "Indeed, Safa and Marwah are among the symbols of Allah. So whoever makes Ḥajj or ʿUmrah of the House — there is no blame upon him for walking between them. And whoever does good voluntarily, then indeed Allah is Appreciative and Knowing. (We begin with what Allah began with.)",
      label_en: "On approach to Safa — once",
      label_ar: "آية الصفا — مرّة واحدة",
    },
  },
  {
    chapter: "Sa'i",
    scene: "hill-takbir",
    title_en: "On Safa & Marwah — takbir × 3",
    title_ar: "على الصفا والمروة — التكبير ٣ مرات",
    what_en:
      "Climb the hill, face the Ka'bah, raise both hands and recite this du'a 3 times. After the 1st & 2nd: make personal du'a. After the 3rd: just go.",
    what_ar:
      "اصعد الجبل، استقبل الكعبة، ارفع يديك، واقرأ هذا الدعاء ثلاث مرات. بعد الأولى والثانية: ادعُ بما شئت. بعد الثالثة: ابدأ المشي.",
    dua: {
      ar:
        "اللَّهُ أَكْبَر، اللَّهُ أَكْبَر، اللَّهُ أَكْبَر، لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ يُحْيِي وَيُمِيتُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ، لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، أَنْجَزَ وَعْدَهُ وَنَصَرَ عَبْدَهُ وَهَزَمَ الْأَحْزَابَ وَحْدَهُ",
      tr:
        "Allāhu Akbar (×3). Lā ilāha illallāhu waḥdahu lā sharīka lah, lahul-mulku wa lahul-ḥamdu, yuḥyī wa yumītu, wa huwa ʿalā kulli shayʾin qadīr. Lā ilāha illallāhu waḥdahu lā sharīka lah, anjaza waʿdahu wa naṣara ʿabdahu wa hazamal-aḥzāba waḥdah.",
      en:
        "Allah is the Greatest (×3). There is no god but Allah alone, He has no partner. To Him belongs all sovereignty and praise. He gives life and death and has power over all things. There is no god but Allah alone, He has no partner — He fulfilled His promise, aided His servant, and alone defeated the confederates.",
      label_en: "On each hill — 3 times",
      label_ar: "على كل جبل — ٣ مرّات",
    },
    tip: "The green pillars: between the two green-lit pillars along the Masʿā, MEN should jog briskly (a brisk sunnah run, not a sprint) on each of the 7 trips. Outside the green pillars, walk normally. WOMEN walk normally throughout — no jogging.",
  },
  {
    chapter: "Sa'i",
    scene: "sai-flow",
    title_en: "Walk between Safa & Marwah — 7 trips",
    title_ar: "اسعَ بين الصفا والمروة سبعة أشواط",
    what_en:
      "We'll walk you through each of the 7 trips one by one — the takbir on each hill, the green markers, and the final Marwah du'a.",
    what_ar:
      "سنرافقك في كل شوط من الأشواط السبعة — التكبير على كل جبل، العَلَمان الأخضران، ودعاء المروة الأخير.",
  },

  // ─── 5. HALQ / TAQSIR ──────────────────────────────────────
  {
    chapter: "Halq",
    scene: "halq",
    title_en: "Step 4 · Halq or Taqsir",
    title_ar: "الخطوة ٤ · الحلق أو التقصير",
    what_en:
      "MEN: shave your head completely (Halq, more virtuous) or trim all hair short (Taqsir). WOMEN: trim a fingertip's length from the end of your hair.",
    what_ar:
      "الرجال: احلِق رأسك (الحلق أفضل) أو قصِّر جميع شعرك. النساء: قُصصن قدر أنملة من أطراف الشعر.",
  },
  {
    chapter: "Done",
    scene: "done",
    title_en: "Umrah complete · Alhamdulillah",
    title_ar: "اكتملت العمرة — الحمد لله",
    what_en:
      "You've now exited Ihram. All prohibitions are lifted. May Allah accept your Umrah — taqabbalAllāhu minnā wa minkum.",
    what_ar:
      "خرجت من الإحرام، وعاد كل ما كان محظورًا جائزًا. تقبّل الله منا ومنكم.",
  },
];
