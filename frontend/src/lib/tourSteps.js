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
    title_en: "Step 1 · Ihram — at the Miqāt",
    title_ar: "الخطوة ١ · الإحرام — عند الميقات",
    what_en:
      "Before crossing the Miqāt boundary into Mecca, change into Ihram. Men: two unstitched white sheets, head uncovered. Women: any modest clothing — no niqab, no gloves.",
    what_ar:
      "قبل تجاوز الميقات إلى مكة، ارتدِ الإحرام. الرجال: إزار ورداء أبيضان والرأس مكشوف. النساء: ملابس محتشمة، بلا نقاب ولا قفّازين.",
    tip: "The Miqāt is the boundary line outside Mecca — Ihram begins there.",
  },
  {
    chapter: "Ihram",
    scene: "niyyah",
    title_en: "Make your intention (Niyyah)",
    title_ar: "النية",
    what_en:
      "Stand still, raise your hand to your heart, and say the Niyyah for Umrah out loud — once.",
    what_ar:
      "قف ساكنًا، ضع يدك على قلبك، وانطق نية العمرة جهرًا — مرّة واحدة.",
    dua: {
      ar: "لَبَّيْكَ اللَّهُمَّ عُمْرَة",
      tr: "Labbayk Allāhumma ʿumrah.",
      en: "Here I am, O Allah, for Umrah.",
      label_en: "Niyyah for Umrah",
      label_ar: "نية العمرة",
    },
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
        "لَبَّيْكَ اللَّهُمَّ لَبَّيْكَ، لَبَّيْكَ لَا شَرِيكَ لَكَ لَبَّيْكَ، إِنَّ الْحَمْدَ وَالنِّعْمَةَ لَكَ وَالْمُلْكَ، لَا شَرِيكَ لَكَ",
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
      "Step in with your RIGHT foot first and recite the entry du'a. Stop the Talbiyah — you've arrived.",
    what_ar:
      "ادخل بقدمك اليمنى وقل دعاء الدخول. توقّف عن التلبية — فقد وصلت.",
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
      "Stand facing the Black Stone (east corner of the Ka'bah). Raise your right hand toward it and say 'Bismillāh, Allāhu Akbar' — once. This marks the start of every lap.",
    what_ar:
      "قف مستقبلًا الحجر الأسود (الركن الشرقي للكعبة)، ارفع يدك اليمنى نحوه وقل: 'بِسْمِ اللَّهِ، وَاللَّهُ أَكْبَر' — مرّة واحدة. وهذه بداية كل شوط.",
    dua: {
      ar: "بِسْمِ اللَّهِ، وَاللَّهُ أَكْبَر",
      tr: "Bismillāh, Allāhu Akbar.",
      en: "In the name of Allah; Allah is the Greatest.",
      label_en: "At the Black Stone — every lap",
      label_ar: "عند الحجر الأسود — كل شوط",
    },
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
    scene: "yemeni-corner",
    title_en: "Du'a between the corners",
    title_ar: "الدعاء بين الركنين",
    what_en:
      "Every lap, on the final stretch — between the Yemeni Corner and the Black Stone — recite this du'a. Touch the Yemeni Corner with your RIGHT hand only if easy. Don't kiss it.",
    what_ar:
      "في الجزء الأخير من كل شوط — بين الركن اليماني والحجر الأسود — اقرأ هذا الدعاء. استلم الركن اليماني بيدك اليمنى إن تيسّر. لا تُقبّله.",
    dua: {
      ar:
        "رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ",
      tr:
        "Rabbanā ātinā fid-dunyā ḥasanatan wa fil-ākhirati ḥasanatan wa qinā ʿadhāban-nār.",
      en:
        "Our Lord, give us good in this world and good in the Hereafter, and protect us from the Fire.",
      label_en: "Between Yemeni Corner & Black Stone",
      label_ar: "بين الركن اليماني والحجر",
    },
  },
  {
    chapter: "Tawaf",
    scene: "maqam",
    title_en: "After Tawaf — pray behind Maqam Ibrahim",
    title_ar: "بعد الطواف — صلِّ ركعتين خلف المقام",
    what_en:
      "After 7 laps, walk to Maqam Ibrahim and pray 2 raka'ah behind it. 1st raka'ah: Surah Al-Kāfirūn after Al-Fātiḥah. 2nd raka'ah: Surah Al-Ikhlāṣ.",
    what_ar:
      "بعد سبعة أشواط، اذهب إلى مقام إبراهيم وصلِّ ركعتين خلفه. الأولى: الفاتحة ثم الكافرون. الثانية: الفاتحة ثم الإخلاص.",
  },
  {
    chapter: "Tawaf",
    scene: "zamzam",
    title_en: "Drink Zamzam water",
    title_ar: "اشرب من ماء زمزم",
    what_en:
      "Drink Zamzam to your fill, in three breaths. Make any du'a you wish before the first sip — in any language.",
    what_ar:
      "اشرب من زمزم حتى تكتفي، على ثلاث جُرعات. ادعُ بما شئت قبل أول رشفة بأي لغة.",
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
        "إِنَّ الصَّفَا وَالْمَرْوَةَ مِنْ شَعَائِرِ اللَّهِ ۖ نَبْدَأُ بِمَا بَدَأَ اللَّهُ بِه",
      tr:
        "Innaṣ-Ṣafā wal-Marwata min shaʿāʾirillāh. Nabdaʾu bimā badaʾallāhu bih.",
      en:
        "Indeed, Safa and Marwah are among the symbols of Allah. We begin with what Allah began with.",
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
        "اللَّهُ أَكْبَر، اللَّهُ أَكْبَر، اللَّهُ أَكْبَر، لَا إِلَهَ إِلاَّ اللَّهُ وَحْدَهُ لاَ شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ يُحْيِي وَيُمِيتُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِير، لاَ إِلَهَ إِلاَّ اللَّهُ وَحْدَهُ، أَنْجَزَ وَعْدَهُ وَنَصَرَ عَبْدَهُ وَهَزَمَ الأَحْزَابَ وَحْدَهُ",
      tr:
        "Allāhu Akbar (×3). Lā ilāha illallāhu waḥdahu lā sharīka lah, lahul-mulku wa lahul-ḥamdu, yuḥyī wa yumītu, wa huwa ʿalā kulli shayʾin qadīr. Lā ilāha illallāhu waḥdahu, anjaza waʿdahu wa naṣara ʿabdahu wa hazamal-aḥzāba waḥdah.",
      en:
        "Allah is the Greatest (×3). There is no god but Allah alone, He has no partner. To Him belongs all sovereignty and praise. He gives life and death and has power over all things. There is no god but Allah alone — He fulfilled His promise, aided His servant, and alone defeated the confederates.",
      label_en: "On each hill — 3 times",
      label_ar: "على كل جبل — ٣ مرّات",
    },
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
