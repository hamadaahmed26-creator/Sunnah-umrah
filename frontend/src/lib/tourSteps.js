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
      {
        icon: "💡",
        title_en: "Forbidden AFTER entering Iḥrām",
        title_ar: "محرّمات بعد الدّخول في الإحرام",
        body_en:
          "Once you recite the Talbiyah at the Mīqāt, and until **Taḥallul** (exiting iḥrām after Saʿī and shaving/trimming), these 9 things become forbidden:",
        body_ar:
          "بعد قول التّلبية عند الميقات وحتّى **التّحلّل** (الخروج من الإحرام بعد السّعي والحلق أو التّقصير)، تحرم هذه التّسع:",
        bullets_en: [
          "Using **perfume**",
          "Cutting or trimming **hair**",
          "Cutting **nails**",
          "♂️ Men: covering the **head**",
          "♂️ Men: wearing **stitched clothing**",
          "♀️ Women: wearing **niqāb** and **gloves**",
          "Signing a **marriage contract**",
          "**Intimacy** with one's spouse",
          "**Hunting**",
        ],
        bullets_ar: [
          "التّطيّب بالـ**طِّيب**",
          "قصّ أو تقصير الـ**شّعر**",
          "تقليم الـ**أظفار**",
          "♂️ الرّجال: تغطية الـ**رّأس**",
          "♀️ الرّجال: لبس الـ**مخيط**",
          "♀️ النّساء: لبس الـ**نّقاب** والـ**قفّازين**",
          "عقد الـ**نّكاح**",
          "الـ**مباشرة** الزّوجيّة",
          "الـ**صّيد**",
        ],
        note_en:
          "Right now — BEFORE the Talbiyah — all of these are still allowed. So clip your nails, perfume your body, and prepare properly while you still can.",
        note_ar:
          "الآن — قبل التّلبية — كلّ ذلك مباح. فقلّم أظفارك، وتطيّب، واستعدّ جيّدًا وأنت لا زلت تستطيع.",
        accent: "tip",
      },
      {
        icon: "🙏",
        title_en: "What if I do one of these by accident?",
        title_ar: "ماذا لو فعلت إحداها نسيانًا؟",
        body_en:
          "**Out of forgetfulness, ignorance, or coercion — NO penalty.** Stop the moment you remember (e.g. wash off perfume). Allah ﷻ says: *'Our Lord, do not take us to task if we forget or err'* — and He has answered: 'I have done so.'",
        body_ar:
          "**نسيانًا أو جهلًا أو إكراهًا — لا شيء عليك.** توقّف بمجرّد أن تتذكّر (كغسل الطّيب). قال الله ﷻ: ﴿رَبَّنَا لَا تُؤَاخِذْنَا إِنْ نَسِينَا أَوْ أَخْطَأْنَا﴾ — وقد أجاب: «قد فعلت».",
        bullets_en: [
          "**Intentionally** doing one = **fidyah** (choose one): fast 3 days · feed 6 poor people (~1.5 kg each) · slaughter a sheep in Makkah",
          "Intimacy with spouse **BEFORE Tawaf** = the **only thing** that invalidates your ʿUmrah (Bukhārī, Ibn ʿAbbās)",
          "**Nothing else breaks Iḥrām** — not wuḍū, not bleeding, not period, not scratching",
        ],
        bullets_ar: [
          "الفعل **عمدًا** ← **فدية** مخيّرًا: صوم ٣ أيّام · إطعام ٦ مساكين (≈١٫٥ كغ لكلّ) · ذبح شاة في مكّة",
          "الجماع **قبل الطّواف** = **الوحيد** الذي يُبطل العمرة (البخاري، ابن عبّاس)",
          "**لا شيء غير ذلك يُبطل الإحرام** — لا الوضوء، ولا الدّم، ولا الحيض، ولا الحكّ",
        ],
        note_en: "Full ruling + more worries covered in the FAQ tab.",
        note_ar: "الحكم الكامل ومزيد من المسائل في صفحة الأسئلة الشّائعة.",
        accent: "warning",
      },
    ],
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
    sections: [
      {
        icon: "📍",
        title_en: "You're at the Mīqāt",
        title_ar: "أنت عند الميقات",
        body_en:
          "The **Mīqāt** is the official boundary before Makkah. You cannot cross it to perform ʿUmrah without entering Iḥrām.",
        body_ar:
          "**الميقات** هو الحدّ المكاني قبل مكّة، ولا يجوز تجاوزه لأداء العمرة دون الدّخول في الإحرام.",
      },
      {
        icon: "👕",
        title_en: "Change into Iḥrām clothing",
        title_ar: "البس ثياب الإحرام",
        bullets_en: [
          "♂️ **Men**: two unstitched white sheets — **izār** (lower wrap) + **ridāʾ** (upper wrap), head uncovered",
          "♀️ **Women**: keep your normal modest clothing — no niqāb, no gloves",
        ],
        bullets_ar: [
          "♂️ **الرّجال**: إزار ورداء أبيضان غير مخيطين، والرّأس مكشوف",
          "♀️ **النّساء**: ملابس محتشمة معتادة، بلا نقاب ولا قفّازين",
        ],
      },
      {
        icon: "⚠️",
        title_en: "You're still not in Iḥrām yet",
        title_ar: "لم تدخل في الإحرام بعد",
        body_en:
          "Putting on the cloth alone does NOT make you a muḥrim. Iḥrām begins on the next screen — with the **niyyah** (intention) and the **Talbiyah** (pilgrim's call).",
        body_ar:
          "مجرّد لبس الثّوب لا يُدخلك في الإحرام. يبدأ الإحرام في الشّاشة التّالية بـ**النيّة** في القلب و**التلبية** (نداء الحجّ والعمرة).",
        accent: "warning",
      },
      {
        icon: "💡",
        title_en: "About the Mīqāt boundaries",
        title_ar: "عن المواقيت",
        body_en:
          "There are **5 official Mīqāt** boundaries around Makkah — plus **Masjid ʿĀʾishah (Tanʿīm)** for those already in Makkah who want to perform ʿUmrah again.",
        body_ar:
          "توجد **خمسة مواقيت** رسميّة حول مكّة، إضافةً إلى **مسجد عائشة (التّنعيم)** لمن كان داخل مكّة ويريد عمرةً ثانية.",
        note_en: "Tap 📍 in the bottom nav → Ziyārah to see all 5 Mīqāt locations on the map.",
        note_ar: "اضغط 📍 في الشّريط السّفلي ← الزّيارة لترى المواقيت الخمسة على الخريطة.",
        accent: "tip",
      },
    ],
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
    sections: [
      {
        icon: "❤️",
        title_en: "Niyyah is in the heart",
        title_ar: "النيّة في القلب",
        body_en:
          "**Niyyah** (intention) is silent — it lives in your heart alone. Simply intend ʿUmrah. That's it.",
        body_ar:
          "**النيّة** صامتة — محلّها القلب وحده. انوِ العمرة بقلبك، وكفى.",
      },
      {
        icon: "🗣️",
        title_en: "Then say this ONCE, out loud",
        title_ar: "ثمّ قل هذا مرّة واحدة جهرًا",
        body_en:
          "Read the phrase below **once**. This is the start of your **Talbiyah** (pilgrim's call) — NOT a verbal niyyah.",
        body_ar:
          "اقرأ العبارة أدناه **مرّةً واحدة**. وهي بداية **التلبية** — وليست تلفّظًا بالنيّة.",
      },
      {
        icon: "📚",
        title_en: "Scholars on silent niyyah",
        title_ar: "أقوال العلماء في إسرار النيّة",
        body_en:
          "Saying the niyyah aloud is **not from the Sunnah** — stated by Ibn Taymiyyah, Ibn Bāz, and al-Albānī.",
        body_ar:
          "التّلفّظ بالنيّة **ليس من السنّة** — نصّ على ذلك ابن تيمية وابن باز والألباني.",
        accent: "tip",
      },
    ],
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
    title_en: "Recite the Talbiyah (the pilgrim's call to Allah)",
    title_ar: "التلبية (نداء الحاجّ)",
    what_en:
      "Begin reciting the Talbiyah (pilgrim's call) out loud (men) or quietly (women). Keep repeating it the whole way to Masjid al-Haram.",
    what_ar:
      "ابدأ بترديد التلبية جهرًا (للرجال) أو سرًّا (للنساء). استمر في ترديدها حتى تصل المسجد الحرام.",
    sections: [
      {
        icon: "🎙️",
        title_en: "Start reciting now",
        title_ar: "ابدأ بالتّلبية الآن",
        bullets_en: [
          "♂️ **Men**: recite **out loud**",
          "♀️ **Women**: recite **quietly**",
          "**Keep repeating** it — the whole way to Masjid al-Ḥaram",
        ],
        bullets_ar: [
          "♂️ **الرّجال**: جهرًا",
          "♀️ **النّساء**: سرًّا",
          "**كرّرها باستمرار** طوال الطّريق إلى المسجد الحرام",
        ],
      },
      {
        icon: "✅",
        title_en: "You are now in Iḥrām",
        title_ar: "لقد دخلت في الإحرام",
        body_en:
          "From this moment, the **9 Iḥrām prohibitions** apply to you (see the tip from the previous step). Stay patient and focused.",
        body_ar:
          "من هذه اللّحظة، تطبّق عليك **محظورات الإحرام التّسع** (راجع التّنبيه في الخطوة السّابقة). اصبر واثبت.",
        accent: "warning",
      },
    ],
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
    sections: [
      {
        icon: "🚪",
        title_en: "Enter with your right foot",
        title_ar: "ادخل بقدمك اليمنى",
        bullets_en: [
          "Step in with your **right foot first**",
          "Recite the entry du'ā shown below",
          "**Keep reciting the Talbiyah** — don't stop",
        ],
        bullets_ar: [
          "ادخل **بقدمك اليمنى أوّلًا**",
          "اقرأ دعاء الدّخول أدناه",
          "**استمرّ في التّلبية** — لا تتوقّف",
        ],
      },
      {
        icon: "🕋",
        title_en: "Head to the Black Stone",
        title_ar: "توجّه إلى الحجر الأسود",
        body_en:
          "Walk through the masjid to the **Black Stone** (al-Ḥajar al-Aswad — the dark stone in the eastern corner of the Kaʿbah). This is where **Tawaf** (walking around the Kaʿbah 7 times) begins.",
        body_ar:
          "امشِ داخل المسجد إلى **الحجر الأسود** (في الرّكن الشّرقيّ للكعبة). هنا يبدأ **الطّواف** (سبعة أشواط حول الكعبة).",
      },
      {
        icon: "⏹️",
        title_en: "When to stop the Talbiyah",
        title_ar: "متى تقف عن التّلبية؟",
        body_en:
          "The Talbiyah stops the **moment you reach the Black Stone** and are about to begin the first lap of Tawaf.",
        body_ar:
          "تنقطع التّلبية **لحظة وصولك إلى الحجر الأسود** وأنت على وشك بدء أوّل شوط من الطّواف.",
        accent: "tip",
      },
    ],
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
    sections: [
      {
        icon: "📍",
        title_en: "Where to stand",
        title_ar: "أين تقف",
        body_en:
          "Stand facing the **Black Stone** (the eastern corner of the Kaʿbah). Every one of your 7 laps begins and ends here.",
        body_ar:
          "قف مستقبلًا **الحجر الأسود** (الرّكن الشّرقيّ للكعبة). كلّ شوط من الأشواط السّبعة يبدأ وينتهي من هنا.",
      },
      {
        icon: "🙌",
        title_en: "Greet the Black Stone",
        title_ar: "استلم الحجر الأسود",
        bullets_en: [
          "Raise your **right hand** toward the Black Stone",
          "Say: **Bismillāh, Allāhu Akbar** (in the name of Allah, Allah is the Greatest) — ONCE",
          "Start walking — Kaʿbah on your **left**",
        ],
        bullets_ar: [
          "ارفع **يدك اليمنى** نحو الحجر الأسود",
          "قل: **«بِسْمِ اللَّهِ، اللَّهُ أَكْبَر»** — مرّةً واحدة",
          "ثمّ ابدأ المشي — والكعبة عن **يسارك**",
        ],
      },
      {
        icon: "♂️",
        title_en: "Men only — Idhṭibāʿ & Raml",
        title_ar: "للرّجال فقط — الاضطباع والرّمَل",
        bullets_en: [
          "**Idhṭibāʿ**: pass your iḥrām cloth under your **right armpit** — right shoulder uncovered for all 7 laps",
          "**Raml** (brisk sunnah jog): laps **1, 2, 3** only",
          "**Walk normally**: laps 4, 5, 6, 7",
        ],
        bullets_ar: [
          "**الاضطباع**: اجعل الإحرام تحت **الإبط الأيمن** — الكتف الأيمن مكشوف في الأشواط السّبعة",
          "**الرَّمَل** (هرولة خفيفة سنّة): الأشواط **١، ٢، ٣** فقط",
          "**امشِ عاديًّا**: الأشواط ٤، ٥، ٦، ٧",
        ],
      },
      {
        icon: "💡",
        title_en: "Istilām — greeting order",
        title_ar: "الاستلام — الترتيب المشروع",
        body_en: "The **Sunnah order** for greeting the Black Stone:",
        body_ar: "**الترتيب المسنون** لاستلام الحجر الأسود:",
        bullets_en: [
          "1️⃣ Touch AND kiss it — if easily possible",
          "2️⃣ Touch with hand, then kiss the hand",
          "3️⃣ Touch with a stick, then kiss the stick",
          "4️⃣ From a distance: point with right hand and say **Allāhu Akbar ONLY** — ❌ do NOT kiss your hand afterwards (common mistake)",
        ],
        bullets_ar: [
          "1️⃣ تقبيلُه مع اللّمس — إن أمكن بلا مشقّة",
          "2️⃣ اللّمس باليد ثمّ تقبيل اليد",
          "3️⃣ اللّمس بالعصا ثمّ تقبيل العصا",
          "4️⃣ عن بُعد: الإشارة باليد اليمنى مع قول **«اللَّهُ أَكْبَر» فقط** — ❌ ولا تقبّل يدك بعد ذلك (خطأ شائع)",
        ],
        note_en: "Never push or harm others to reach it — crowding is forbidden.",
        note_ar: "لا تُزاحم أو تؤذِ أحدًا للوصول إليه — فالمزاحمة ممنوعة.",
        accent: "tip",
      },
    ],
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
    sections: [
      {
        icon: "🔄",
        title_en: "7 laps anticlockwise",
        title_ar: "٧ أشواط عكس عقارب السّاعة",
        bullets_en: [
          "Keep the **Kaʿbah on your LEFT** throughout",
          "Each lap starts **at the Black Stone** and ends there",
          "We'll count every lap for you — just focus on your du'ā",
        ],
        bullets_ar: [
          "اجعل **الكعبة عن يسارك** طوال الطّواف",
          "يبدأ كلّ شوط **من الحجر الأسود** وينتهي عنده",
          "سنعدّ لك الأشواط — أنت ركّز في دعائك",
        ],
      },
      {
        icon: "⚠️",
        title_en: "Stay OUTSIDE Ḥijr Ismāʿīl",
        title_ar: "لا تدخل في حِجر إسماعيل",
        body_en:
          "The low **semi-circular wall** beside the Kaʿbah (Ḥijr Ismāʿīl) is **counted as part of the Kaʿbah**. Walking through it **invalidates that lap** — you'd have to repeat it.",
        body_ar:
          "الجدار **نصف الدّائري** بجوار الكعبة (حِجر إسماعيل) **يُعدّ من الكعبة**. من طاف من داخله **بطل شوطه** ولزمه إعادته.",
        accent: "warning",
      },
    ],
  },
  {
    chapter: "Post-Tawaf",
    scene: "maqam",
    title_en: "After Tawaf — pray 2 rakʿah behind Maqām Ibrāhīm",
    title_ar: "بعد الطواف — صلِّ ركعتين خلف المقام",
    what_en:
      "After 7 laps, pray 2 rakʿah (units of prayer) behind Maqām Ibrāhīm (the standing place of Ibrāhīm — a small glass-encased stone near the Ka'bah) — or, if it is crowded, ANYWHERE in the masjid facing the Ka'bah. Both Ibn Bāz and al-Albānī permitted this; do not push or harm others to stand behind the Maqām. 1st rakʿah: al-Fātiḥah, then Sūrat al-Kāfirūn. 2nd rakʿah: al-Fātiḥah, then Sūrat al-Ikhlāṣ.",
    what_ar:
      "بعد سبعة أشواط، صلِّ ركعتين خلف مقام إبراهيم — أو في أيّ مكان من المسجد إذا كان الزّحام شديدًا مستقبلًا الكعبة. أفتى بذلك ابن باز والألباني رحمهما الله؛ لا تدفع النّاس ولا تؤذهم لتقف خلف المقام. الأولى: الفاتحة ثمّ الكافرون. الثّانية: الفاتحة ثمّ الإخلاص.",
    sections: [
      {
        icon: "🕌",
        title_en: "Pray 2 rakʿah",
        title_ar: "صلِّ ركعتين",
        body_en:
          "After completing 7 laps, pray **2 rakʿah** (two units of prayer) behind **Maqām Ibrāhīm** (the small glass-encased stone of Ibrāhīm's footprint, near the Kaʿbah).",
        body_ar:
          "بعد إتمام الأشواط السّبعة، صلِّ **ركعتين** خلف **مقام إبراهيم** (الحجر الزّجاجي الصّغير فيه أثر قدم إبراهيم عليه السّلام، قرب الكعبة).",
      },
      {
        icon: "📖",
        title_en: "What to recite",
        title_ar: "ماذا تقرأ فيهما؟",
        bullets_en: [
          "**Rakʿah 1**: al-Fātiḥah, then **Sūrat al-Kāfirūn**",
          "**Rakʿah 2**: al-Fātiḥah, then **Sūrat al-Ikhlāṣ**",
        ],
        bullets_ar: [
          "**الرّكعة الأولى**: الفاتحة ثمّ **سورة الكافرون**",
          "**الرّكعة الثّانية**: الفاتحة ثمّ **سورة الإخلاص**",
        ],
      },
      {
        icon: "⚠️",
        title_en: "If it's crowded — pray anywhere",
        title_ar: "إذا كان الزّحام شديدًا",
        body_en:
          "If standing behind the Maqām is crowded, pray **anywhere in the masjid facing the Kaʿbah**. This was the fatwā of **Ibn Bāz** and **al-Albānī** — never push or harm others.",
        body_ar:
          "إذا كان الزّحام خلف المقام شديدًا، فصلِّ **في أيّ مكان من المسجد مستقبلًا الكعبة**. أفتى بذلك **ابن باز** و**الألباني** رحمهما الله — ولا تُزاحم أو تؤذ أحدًا.",
        accent: "warning",
      },
      {
        icon: "💡",
        title_en: "Optional — greet the Black Stone again",
        title_ar: "مستحبّ — استلام الحجر مرّة أخرى",
        body_en:
          "Before heading to Zamzam, if you can return to the Black Stone and greet it with **takbīr** (saying Allāhu Akbar), that's sunnah. If the crowd is heavy — skip it without guilt.",
        body_ar:
          "قبل التّوجّه إلى زمزم، إن استطعت العودة إلى الحجر الأسود واستلامه بالتّكبير فذلك سنّة. وإن كان الزّحام شديدًا — فدعه بلا حرج.",
        accent: "tip",
      },
    ],
    tip: "After the two rakʿahs (and before going to Zamzam), if you can return to the Black Stone and greet it again with takbīr (saying Allāhu Akbar — 'Allah is the Greatest'), that is sunnah — but it is optional and was not done by the Prophet ﷺ in every narration. If the crowd is heavy, skip it without guilt and proceed to Zamzam.",
  },
  {
    chapter: "Post-Tawaf",
    scene: "zamzam",
    title_en: "Drink Zamzam water",
    title_ar: "اشرب من ماء زمزم",
    what_en:
      "Drink Zamzam (the blessed well-water inside Masjid al-Ḥaram) to your fill, in three breaths. Pour some over your head too — both are Sunnah. Make any du'a (supplication) you wish before the first sip — in any language.",
    what_ar:
      "اشرب من زمزم حتى تكتفي، على ثلاث جُرعات، واصبب على رأسك منها — كلاهما من السنّة. ادعُ بما شئت قبل أول رشفة بأي لغة.",
    sections: [
      {
        icon: "💧",
        title_en: "Drink Zamzam",
        title_ar: "اشرب من زمزم",
        body_en:
          "**Zamzam** is the blessed well-water inside Masjid al-Ḥaram. The Prophet ﷺ said: *'Zamzam water is for whatever purpose it is drunk.'*",
        body_ar:
          "**زمزم** هو الماء المبارك داخل المسجد الحرام. قال النّبي ﷺ: «ماء زمزم لما شُرب له».",
      },
      {
        icon: "🫧",
        title_en: "How to drink (sunnah)",
        title_ar: "كيف تشرب؟ (سنّة)",
        bullets_en: [
          "Drink **to your fill** — don't hold back",
          "In **three breaths** (pause between each sip)",
          "**Pour some over your head** too",
          "Make **any du'ā** in any language before the first sip",
        ],
        bullets_ar: [
          "اشرب **حتّى الرّيّ** — ولا تقصّر",
          "على **ثلاث جُرعات** (مع التّنفّس بينها)",
          "**اصبب منها على رأسك** أيضًا",
          "ادعُ **بما شئت** بأيّ لغة قبل أوّل رشفة",
        ],
      },
    ],
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
    sections: [
      {
        icon: "🚶",
        title_en: "What is Saʿī?",
        title_ar: "ما هو السّعي؟",
        body_en:
          "**Saʿī** is walking **7 trips** between two small hills inside the masjid: **Ṣafā** (the starting hill, near the Black Stone) and **Marwah**.",
        body_ar:
          "**السّعي** هو المشي **سبعة أشواط** بين جبلين صغيرين داخل المسجد: **الصّفا** (جبل البداية، قرب الحجر الأسود) و**المروة**.",
      },
      {
        icon: "📖",
        title_en: "Verse of Ṣafā — first time only",
        title_ar: "آية الصّفا — أوّل مرّة فقط",
        body_en:
          "As you approach Ṣafā for the **first trip**, recite the āyah below. On trips 2–7, don't repeat it.",
        body_ar:
          "عند الاقتراب من الصّفا في **الشّوط الأوّل**، اقرأ الآية أدناه. ولا تُعدها في الأشواط ٢–٧.",
      },
    ],
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
    sections: [
      {
        icon: "⛰️",
        title_en: "On each hill — do this",
        title_ar: "على كلّ جبل — افعل هذا",
        bullets_en: [
          "**Climb** a little up the hill",
          "Face the **Kaʿbah**",
          "Raise **both hands** in du'ā",
          "Recite the du'ā below **3 times**",
        ],
        bullets_ar: [
          "**اصعد** قليلًا على الجبل",
          "استقبل **الكعبة**",
          "ارفع **يديك** داعيًا",
          "اقرأ الدّعاء أدناه **٣ مرّات**",
        ],
      },
      {
        icon: "🙏",
        title_en: "Personal du'ā in between",
        title_ar: "دعاء شخصي بين المرّات",
        bullets_en: [
          "After the **1st** recitation: make personal du'ā (any language)",
          "After the **2nd** recitation: make personal du'ā again",
          "After the **3rd** recitation: just head off — no further du'ā needed",
        ],
        bullets_ar: [
          "بعد المرّة **الأولى**: ادعُ بما شئت (بأيّ لغة)",
          "بعد المرّة **الثّانية**: ادعُ بما شئت أيضًا",
          "بعد المرّة **الثّالثة**: امشِ — لا دعاء زائد",
        ],
      },
      {
        icon: "💡",
        title_en: "The green pillars",
        title_ar: "العَلَمان الأخضران",
        body_en:
          "Between the **two green-lit pillars** along the Masʿā (the corridor between the two hills):",
        body_ar:
          "بين **العَلَمين الأخضرين** في المَسعى (الممرّ بين الجبلين):",
        bullets_en: [
          "♂️ **Men**: jog briskly (a sunnah run, not a sprint) on all 7 trips",
          "♀️ **Women**: walk normally throughout — no jogging",
        ],
        bullets_ar: [
          "♂️ **الرّجال**: الهرولة (سنّة، وليس جريًا) في كلّ الأشواط السّبعة",
          "♀️ **النّساء**: المشي العاديّ في الأشواط كلّها — لا هرولة",
        ],
        accent: "tip",
      },
    ],
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
    sections: [
      {
        icon: "🔁",
        title_en: "7 trips total",
        title_ar: "٧ أشواط",
        bullets_en: [
          "**Ṣafā → Marwah** = 1 trip",
          "**Marwah → Ṣafā** = 2 trips",
          "Keep going until you finish on **Marwah** at trip **7**",
        ],
        bullets_ar: [
          "**من الصّفا إلى المروة** = شوط",
          "**من المروة إلى الصّفا** = شوطان",
          "تابع حتّى ينتهي الشّوط **السّابع** على **المروة**",
        ],
      },
      {
        icon: "✨",
        title_en: "We'll guide every trip",
        title_ar: "سنرافقك في كلّ شوط",
        body_en:
          "The app will count each trip for you, remind you of the takbir du'ā on the hills, mark the green-pillar section for men, and prompt the final du'ā on Marwah.",
        body_ar:
          "سيعدّ لك التّطبيق كلّ شوط، ويذكّرك بالتّكبير على الجبلين، ويبيّن حدود العَلَمين للرّجال، ويُرشدك إلى الدّعاء الختاميّ على المروة.",
      },
    ],
  },

  // ─── 5. HALQ / TAQSIR ──────────────────────────────────────
  {
    chapter: "Halq",
    scene: "halq",
    title_en: "Step 4 · Halq or Taqsīr (shave or trim your hair)",
    title_ar: "الخطوة ٤ · الحلق أو التقصير (حلق الرّأس أو تقصير الشّعر)",
    what_en:
      "MEN: shave your head completely (Halq — shaving, more virtuous) or trim all hair short (Taqsir — trimming). WOMEN: trim a fingertip's length from the end of your hair.",
    what_ar:
      "الرجال: احلِق رأسك (الحلق أفضل) أو قصِّر جميع شعرك. النساء: قُصصن قدر أنملة من أطراف الشعر.",
    sections: [
      {
        icon: "✂️",
        title_en: "The final step",
        title_ar: "الخطوة الأخيرة",
        body_en:
          "After Saʿī, cutting or shaving the hair is what **ends your Iḥrām** (the state of Taḥallul).",
        body_ar:
          "بعد السّعي، حلق الشّعر أو تقصيره هو ما **يُنهي إحرامك** (التّحلّل).",
      },
      {
        icon: "♂️",
        title_en: "For men",
        title_ar: "للرّجال",
        bullets_en: [
          "**Halq** — **shave the whole head** (most virtuous)",
          "**Taqsir** — trim all the hair short (permitted)",
        ],
        bullets_ar: [
          "**الحلق** — **حلق جميع الرّأس** (وهو الأفضل)",
          "**التّقصير** — قصّ جميع الشّعر (جائز)",
        ],
        note_en:
          "The Prophet ﷺ said 'O Allah, forgive those who shave' — three times — and said it for those who trim **once**. So shaving is far more virtuous.",
        note_ar:
          "دعا النّبي ﷺ للمحلّقين ثلاثًا، وللمقصّرين مرّةً واحدة. فالحلق أعظم أجرًا بكثير.",
      },
      {
        icon: "♀️",
        title_en: "For women",
        title_ar: "للنّساء",
        body_en:
          "Trim about a **fingertip's length** from the end of the hair. No shaving.",
        body_ar:
          "قصّ **قدر أنملة** (ما يُقارب عرض أصبع) من أطراف الشّعر. ولا حلق للنّساء.",
      },
    ],
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
    sections: [
      {
        icon: "🎉",
        title_en: "Taḥallul — you've exited Iḥrām",
        title_ar: "التّحلّل — خرجت من الإحرام",
        body_en:
          "You've completed your ʿUmrah. All **9 Iḥrām prohibitions** are now lifted — perfume, stitched clothing, covering the head, everything is back to normal.",
        body_ar:
          "أتممتَ عمرتك. رُفعت عنك **محظورات الإحرام التّسع** — الطّيب، والمخيط، وتغطية الرّأس، وكلّ شيء عاد كما كان.",
      },
      {
        icon: "🤲",
        title_en: "May Allah accept it",
        title_ar: "تقبّل الله منّا ومنكم",
        body_en: "**Taqabbal-Allāhu minnā wa minkum** — may Allah accept it from us and from you.",
        body_ar: "**تقبّل الله منّا ومنكم** — وجعلها مبرورةً وسعيًا مشكورًا.",
        accent: "tip",
      },
    ],
  },
];
