// Tour-mode steps. Each step shows an illustrated scene, an instruction,
// and (where relevant) the exact Sunnah du'a to recite.
// Scene names map to /app/frontend/src/components/TourScene.jsx

export const TOUR_STEPS = [
  // ─── INTRO ─────────────────────────────────────────────────
  {
    chapter: "Intro",
    scene: "intro",
    title_en: "Before you begin Umrah",
    title_ar: "قبل أن تبدأ العمرة",
    what_en:
      "Umrah is four simple parts — Iḥrām, Ṭawāf, Saʿī, and Ḥalq. We'll walk you through each one, step by step, based on the Qur'ān and Sunnah. Don't worry if it's your first time — take your time, and tap any Arabic word for its meaning.",
    what_ar:
      "العمرة أربعة أجزاء فقط: الإحرام، الطّواف، السّعي، والحلق. سنرافقك في كلّ خطوة على هدي الكتاب والسنّة. لا تقلق إن كانت أوّل مرّة — خُذ وقتك، واضغط على أيّ كلمة عربيّة لتعرف معناها.",
  },

  // ─── 1. IHRAM ──────────────────────────────────────────────
  {
    chapter: "Ihram",
    scene: "miqat",
    title_en: "Before Iḥrām — prepare yourself",
    title_ar: "قبل الإحرام — استعدّ",
    what_en:
      "Important — you ENTER iḥrām (the sacred state of pilgrimage) when you make the niyyah (intention, in your heart) and recite the Talbiyah (the pilgrim's call) at the Mīqāt (the official boundary). Until then, you are NOT yet in iḥrām, even after putting on the cloth — so do these Sunnah preparations now while you still can: (1) Ghusl — a full-body wash, (2) trim your nails, (3) remove armpit and pubic hair, (4) men: trim the moustache, (5) apply perfume to your body and hair (yes, perfume is permitted now — it only becomes forbidden once you have entered the state of iḥrām via the Talbiyah), but NOT to the iḥrām cloth itself, (6) men: put on the two unstitched white sheets — izār + ridāʾ (lower + upper wrap). Women: any modest clothing, no niqāb, no gloves.",
    what_ar:
      "مهمّ — أنت تدخل في الإحرام عند النيّة والتلبية في الميقات (في الخطوات التالية)، وقبل ذلك لستَ مُحرِمًا حتّى وإن لبستَ ثياب الإحرام. فاغتنم الآن السنن قبل أن تُحرم: ١) الاغتسال، ٢) تقليم الأظفار، ٣) إزالة شعر الإبط والعانة، ٤) للرّجال: قصّ الشّارب، ٥) التّطيّب في البدن والرّأس (نعم، الطّيب جائز الآن — وإنّما يحرم بعد الدّخول في الإحرام بالتّلبية) — لا في ثوب الإحرام نفسه، ٦) الرّجال: لبس الإزار والرّداء غير المخيطين. النّساء: ملابس محتشمة، بلا نقاب ولا قفّازين.",
    sections: [
      {
        icon: "🧠",
        title_en: "Start here",
        title_ar: "ابدأ من هنا",
        body_en:
          "Before you begin ʿUmrah, the first step is to prepare yourself properly. You are not yet in **Iḥrām** (the sacred state of pilgrimage) — so this is your time to get ready.",
        body_ar:
          "قبل أن تبدأ العمرة، أوّل خطوة هي أن تستعدّ جيّدًا. أنت لم تدخل في **الإحرام** بعدُ (الحالة المقدّسة للحجّ أو العمرة) — فهذا وقتك للتّهيئة.",
      },
      {
        icon: "📍",
        title_en: "When do you enter Iḥrām?",
        title_ar: "متى تدخل في الإحرام؟",
        body_en: "You only enter Iḥrām when you:",
        body_ar: "لا تدخل في الإحرام إلّا عندما:",
        bullets_en: [
          "Make your **niyyah** (intention in your heart)",
          "Recite the **Talbiyah** (the pilgrimage call)",
          "Do this at the **Mīqāt** (the designated boundary before Makkah)",
        ],
        bullets_ar: [
          "تعقد **النيّة** في قلبك",
          "تقول **التلبية** (نداء الحجّ والعمرة)",
          "وتفعل ذلك عند **الميقات** (الحدّ المكاني قبل مكّة)",
        ],
        note_en: "Until then, you can still prepare freely.",
        note_ar: "قبل ذلك، ما زال بإمكانك التّحضير بحرّيّة.",
      },
      {
        icon: "🧼",
        title_en: "Clean & prepare",
        title_ar: "نظافة وتهيئة",
        bullets_en: [
          "Perform **ghusl** (full-body wash)",
          "Trim your nails",
          "Remove underarm and pubic hair",
        ],
        bullets_ar: [
          "اغتسل (**غُسل** كامل للبدن)",
          "قلّم أظفارك",
          "أزِل شعر الإبط والعانة",
        ],
      },
      {
        icon: "✂️",
        title_en: "Grooming",
        title_ar: "العناية الشّخصيّة",
        bullets_en: ["♂️ Men: trim the moustache"],
        bullets_ar: ["♂️ الرّجال: قصّ الشّارب"],
      },
      {
        icon: "🌿",
        title_en: "Apply perfume (important)",
        title_ar: "التّطيّب (مهمّ)",
        bullets_en: [
          "Apply perfume to your **body and hair**",
          "❌ Not on the iḥrām cloth itself",
          "✅ Allowed NOW — before entering iḥrām",
          "⛔ Forbidden AFTER reciting the Talbiyah",
        ],
        bullets_ar: [
          "تطيّب في **البدن والشّعر**",
          "❌ لا تضع الطّيب على ثوب الإحرام",
          "✅ جائز الآن — قبل الدّخول في الإحرام",
          "⛔ محرّم بعد قول التّلبية",
        ],
      },
      {
        icon: "👕",
        title_en: "Clothing",
        title_ar: "اللّباس",
        bullets_en: [
          "♂️ **Men**: two unstitched white sheets — **izār** (lower wrap) + **ridāʾ** (upper wrap), head uncovered",
          "♀️ **Women**: any modest clothing, no niqāb, no gloves",
        ],
        bullets_ar: [
          "♂️ **الرّجال**: إزار ورداء أبيضان غير مخيطين، والرّأس مكشوف",
          "♀️ **النّساء**: ملابس محتشمة، بلا نقاب ولا قفّازين",
        ],
      },
      {
        icon: "⚠️",
        title_en: "Important reminder",
        title_ar: "تنبيه مهمّ",
        body_en:
          "Even if you are wearing Iḥrām clothing, you are **NOT in Iḥrām yet** — not until you make the niyyah in your heart and recite the Talbiyah.",
        body_ar:
          "حتّى إن لبستَ ثياب الإحرام، فأنت **لم تدخل في الإحرام بعد** — لن تدخله إلّا بعد النيّة بالقلب وقول التّلبية.",
        accent: "warning",
      },
      {
        icon: "🧭",
        title_en: "Next",
        title_ar: "الخطوة التّالية",
        body_en: "Once you're ready, tap NEXT — we'll head to the Mīqāt to begin Iḥrām.",
        body_ar: "عندما تجهز، اضغط «التّالي» — سنتّجه إلى الميقات لبدء الإحرام.",
      },
    ],
    tip: "Forbidden ONLY AFTER entering iḥrām (i.e. after the Talbiyah at the Mīqāt) and until Taḥallul: 1) using perfume, 2) cutting/trimming hair, 3) cutting nails, 4) covering the head (men), 5) wearing stitched clothing (men), 6) niqāb and gloves (women), 7) signing a marriage contract, 8) intimacy with one's spouse, 9) hunting. Right now — BEFORE the Talbiyah — all of these are still allowed. So clip your nails, perfume your body, and prepare properly while you still can.",
  },
  {
    chapter: "Ihram",
    scene: "miqat",
    title_en: "Step 1 · At the Mīqāt — change & make niyyah",
    title_ar: "الخطوة ١ · عند الميقات — البِس وانوِ",
    what_en:
      "At the Mīqāt (official boundary) men change into their two unstitched white sheets (izār + ridāʾ — lower + upper wrap), head uncovered. Women keep their normal modest clothing — but no niqāb, no gloves. You are still not yet in iḥrām — that begins on the next screen with the niyyah (intention) and the Talbiyah (pilgrim's call).",
    what_ar:
      "عند الميقات: يرتدي الرّجال إزارهم ورداءهم غير المخيطين والرّأس مكشوف. وتلبس النّساء الملابس المحتشمة المعتادة بلا نقاب ولا قفّازين. لم تدخل في الإحرام بعد — يبدأ الإحرام في الشّاشة التّالية بالنيّة والتلبية.",
    tip: "There are 5 official Mīqāt boundaries — plus Masjid ʿĀʾishah (Tanʿīm) for those already in Makkah. See all of them in the Ziyārah tab (📍 in the bottom nav).",
  },
  {
    chapter: "Ihram",
    scene: "niyyah",
    title_en: "Make your intention (Niyyah) — in the heart",
    title_ar: "النية — في القلب",
    what_en:
      "Niyyah (intention) is in the HEART — never said out loud (Ibn Taymiyyah, Ibn Bāz, al-Albānī). Simply intend ʿUmrah in your heart, then say the phrase below ONCE out loud — this is the start of your Talbiyah (pilgrim's call), not a verbal niyyah.",
    what_ar:
      "النيّة محلّها القلب — لا تُنطق باللسان (ابن تيمية، ابن باز، الألباني). انوِ العمرة بقلبك، ثم قل العبارة التالية مرّة واحدة جهرًا — وهي بداية التلبية، وليست تلفّظًا بالنية.",
    dua: {
      ar: "لَبَّيْكَ اللَّهُمَّ بِعُمْرَة",
      tr: "Labbayk Allāhumma bi-ʿumrah.",
      en: "Here I am at Your service, O Allah, for ʿUmrah.",
      label_en: "Start of Talbiyah for ʿUmrah",
      label_ar: "بداية التلبية بالعمرة",
      audio_id: "talbiyah_start",
    },
    tip: "Niyyah is silent — the heart only. Saying the niyyah aloud is not from the Sunnah.",
  },
  {
    chapter: "Ihram",
    scene: "talbiyah",
    title_en: "Recite the Talbiyah",
    title_ar: "التلبية",
    what_en:
      "Begin reciting the Talbiyah (pilgrim's call) out loud (men) or quietly (women). Keep repeating it the whole way to Masjid al-Haram.",
    what_ar:
      "ابدأ بترديد التلبية جهرًا (للرجال) أو سرًّا (للنساء). استمر في ترديدها حتى تصل المسجد الحرام.",
    dua: {
      ar:
        "لَبَّيْكَ اللَّهُمَّ لَبَّيْكَ، لَبَّيْكَ لَا شَرِيكَ لَكَ لَبَّيْكَ، إِنَّ الْحَمْدَ وَالنِّعْمَةَ لَكَ وَالْمُلْكُ، لَا شَرِيكَ لَكَ",
      tr:
        "Labbayk Allāhumma labbayk. Labbayk lā sharīka laka labbayk. Innal-ḥamda wan-niʿmata laka wal-mulk, lā sharīka lak.",
      en:
        "Here I am at Your service, O Allah, here I am at Your service. Here I am at Your service — You have no partner — here I am at Your service. Truly all praise, blessing, and sovereignty belong to You. You have no partner.",
      label_en: "Talbiyah — keep repeating",
      label_ar: "التلبية — كرّرها",
      audio_id: "talbiyah_full",
    },
  },

  // ─── 2. ARRIVING AT MASJID AL-HARAM ────────────────────────
  {
    chapter: "Tawaf",
    scene: "enter-masjid",
    title_en: "Enter Masjid al-Haram",
    title_ar: "دخول المسجد الحرام",
    what_en:
      "Step in with your RIGHT foot first and recite the entry du'a. KEEP reciting the Talbiyah (pilgrim's call) — it doesn't stop until you reach the Black Stone (al-Ḥajar al-Aswad — the dark stone in the eastern corner of the Ka'bah) to begin Tawaf (walking around the Ka'bah, 7 times).",
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
      audio_id: "enter_masjid",
    },
  },

  // ─── 3. TAWAF ──────────────────────────────────────────────
  {
    chapter: "Tawaf",
    scene: "tawaf-start",
    title_en: "Step 2 · Tawaf — start at the Black Stone",
    title_ar: "الخطوة ٢ · الطواف — ابدأ من الحجر الأسود",
    what_en:
      "Stand facing the Black Stone (al-Ḥajar al-Aswad — embedded in the eastern corner of the Ka'bah). Raise your right hand toward it and say 'Bismillāh, Allāhu Akbar' (in the name of Allah, Allah is the Greatest) — once. This marks the start of every lap.\n\nMEN: uncover your right shoulder (Idhṭibāʿ — passing the iḥrām cloth under your right armpit) and keep it like this until the end of all 7 laps. For the FIRST 3 laps, walk swiftly (Raml — a brisk sunnah jog); for laps 4–7, walk normally.",
    what_ar:
      "قف مستقبلًا الحجر الأسود (الرّكن الشّرقي للكعبة)، ارفع يدك اليمنى نحوه وقل: «بِسْمِ اللَّهِ، اللَّهُ أَكْبَر» — مرّة واحدة. وهذه بداية كلّ شوط.\n\nالرّجال: اكشف الكتف الأيمن (الاضطباع) بجعل الإحرام تحت الإبط الأيمن، وأبقِه كذلك حتّى نهاية الأشواط السّبعة. وفي الأشواط الثّلاثة الأولى: امشِ بسرعة (الرَّمَل) كالهرولة الخفيفة؛ وفي الأشواط ٤–٧: امشِ عاديًّا.",
    dua: {
      ar: "بِسْمِ اللَّهِ، اللَّهُ أَكْبَر",
      tr: "Bismillāh, Allāhu Akbar.",
      en: "In the name of Allah; Allah is the Greatest.",
      label_en: "At the Black Stone — every lap",
      label_ar: "عند الحجر الأسود — كلّ شوط",
      audio_id: "black_stone",
    },
    tip: "Istilām (greeting the Black Stone) has a Sunnah order of preference: 1) Touch AND kiss it — if easily possible. 2) Touch it with your hand, then kiss your hand. 3) Touch it with a stick, then kiss the stick. 4) From a distance, point towards it with your right hand and say Allāhu Akbar ONLY — DO NOT kiss your hand afterwards. This last point is a common mistake, with no basis in the Sunnah. Never push or harm others trying to reach it.",
  },
  {
    chapter: "Tawaf",
    scene: "tawaf-flow",
    title_en: "Walk around the Ka'bah — 7 laps",
    title_ar: "طُف حول الكعبة سبعة أشواط",
    what_en:
      "Now you'll go around 7 times. Walk so the Ka'bah is on your LEFT. Important: stay OUTSIDE the low semi-circular wall (Ḥijr Ismāʿīl — counted as part of the Ka'bah) — passing through it INVALIDATES that lap. We'll guide you through each lap step by step.",
    what_ar:
      "ستطوف الآن سبعة أشواط، وتجعل الكعبة عن يسارك. مهمّ: ابقَ خارج جدار حِجر إسماعيل النّصف دائري — فهو من الكعبة، ومن طاف من داخله بطل شوطه. سنرافقك في كلّ شوط خطوة بخطوة.",
  },
  {
    chapter: "Tawaf",
    scene: "maqam",
    title_en: "After Tawaf — pray 2 rakʿah behind Maqām Ibrāhīm",
    title_ar: "بعد الطواف — صلِّ ركعتين خلف المقام",
    what_en:
      "After 7 laps, pray 2 rakʿah (units of prayer) behind Maqām Ibrāhīm (the standing place of Ibrāhīm — a small glass-encased stone near the Ka'bah) — or, if it is crowded, ANYWHERE in the masjid facing the Ka'bah. Both Ibn Bāz and al-Albānī permitted this; do not push or harm others to stand behind the Maqām. 1st rakʿah: al-Fātiḥah, then Sūrat al-Kāfirūn. 2nd rakʿah: al-Fātiḥah, then Sūrat al-Ikhlāṣ.",
    what_ar:
      "بعد سبعة أشواط، صلِّ ركعتين خلف مقام إبراهيم — أو في أيّ مكان من المسجد إذا كان الزّحام شديدًا مستقبلًا الكعبة. أفتى بذلك ابن باز والألباني رحمهما الله؛ لا تدفع النّاس ولا تؤذهم لتقف خلف المقام. الأولى: الفاتحة ثمّ الكافرون. الثّانية: الفاتحة ثمّ الإخلاص.",
    tip: "After the two rakʿahs (and before going to Zamzam), if you can return to the Black Stone and greet it again with takbīr (saying Allāhu Akbar — 'Allah is the Greatest'), that is sunnah — but it is optional and was not done by the Prophet ﷺ in every narration. If the crowd is heavy, skip it without guilt and proceed to Zamzam.",
  },
  {
    chapter: "Tawaf",
    scene: "zamzam",
    title_en: "Drink Zamzam water",
    title_ar: "اشرب من ماء زمزم",
    what_en:
      "Drink Zamzam (the blessed well-water inside Masjid al-Ḥaram) to your fill, in three breaths. Pour some over your head too — both are Sunnah. Make any du'a (supplication) you wish before the first sip — in any language.",
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
      "Sa'i is walking 7 trips between two small hills inside the masjid: Ṣafā and Marwah. Walk to the hill of Ṣafā (the starting hill, near the Black Stone). As you approach, recite the verse below — the FIRST time only.",
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
      audio_id: "safa_first",
    },
  },
  {
    chapter: "Sa'i",
    scene: "hill-takbir",
    title_en: "On Safa & Marwah — takbir × 3",
    title_ar: "على الصفا والمروة — التكبير ٣ مرات",
    what_en:
      "Climb the hill (Ṣafā first, then Marwah on every trip), face the Ka'bah, raise both hands and recite this du'a 3 times. After the 1st & 2nd: make personal du'a (supplication, in any language). After the 3rd: just go.",
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
      audio_id: "safa_marwah_takbir",
    },
    tip: "The green pillars: between the two green-lit pillars along the Masʿā (the corridor connecting the two hills), MEN should jog briskly (a brisk sunnah run, not a sprint) on each of the 7 trips. Outside the green pillars, walk normally. WOMEN walk normally throughout — no jogging.",
  },
  {
    chapter: "Sa'i",
    scene: "sai-flow",
    title_en: "Walk between Safa & Marwah — 7 trips",
    title_ar: "اسعَ بين الصفا والمروة سبعة أشواط",
    what_en:
      "We'll walk you through each of the 7 trips one by one — the takbir (saying Allāhu Akbar) on each hill, the green markers, and the final Marwah du'a.",
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
      "MEN: shave your head completely (Halq — shaving, more virtuous) or trim all hair short (Taqsir — trimming). WOMEN: trim a fingertip's length from the end of your hair.",
    what_ar:
      "الرجال: احلِق رأسك (الحلق أفضل) أو قصِّر جميع شعرك. النساء: قُصصن قدر أنملة من أطراف الشعر.",
  },
  {
    chapter: "Done",
    scene: "done",
    title_en: "Umrah complete · Alhamdulillah",
    title_ar: "اكتملت العمرة — الحمد لله",
    what_en:
      "You've now exited Ihram (Taḥallul — exiting the sacred state). All prohibitions are lifted. May Allah accept your Umrah — taqabbalAllāhu minnā wa minkum.",
    what_ar:
      "خرجت من الإحرام، وعاد كل ما كان محظورًا جائزًا. تقبّل الله منا ومنكم.",
  },
];
