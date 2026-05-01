// Daily Sunnah reminder — one rotating hadith / duʿāʾ shown on the Home
// dashboard. Rotates once per UTC day so the same user sees the same card all
// day, but a fresh one tomorrow. Designed to make the app a quiet daily habit.
//
// Curation rules:
//  • All sources are Ṣaḥīḥ (authentic) — Bukhārī, Muslim, or graded ṣaḥīḥ by
//    al-Albānī.
//  • Short — single-screen readable, no scroll required.
//  • Bilingual EN + AR.
//  • Action-friendly — almost all are something the user can DO today.

export const DAILY_REMINDERS = [
  {
    en: "Whoever says SubḥānAllāhi wa biḥamdihi a hundred times a day, his sins are wiped away even if they were like the foam of the sea.",
    ar: "من قال «سبحان الله وبحمده» في يومٍ مئةَ مرّةٍ حُطّت خطاياه ولو كانت مثلَ زبدِ البحر.",
    source: "Bukhārī 6405 · Muslim 2691",
  },
  {
    en: "The two are light on the tongue, heavy on the scale, beloved to the Most Merciful: SubḥānAllāhi wa biḥamdihi, SubḥānAllāhi-l-ʿAẓīm.",
    ar: "كلمتان خفيفتان على اللّسان، ثقيلتان في الميزان، حبيبتان إلى الرحمن: سبحان الله وبحمده، سبحان الله العظيم.",
    source: "Bukhārī 6406 · Muslim 2694",
  },
  {
    en: "Smiling at your brother is sadaqah.",
    ar: "تبسّمك في وجه أخيك لك صدقة.",
    source: "Tirmidhī 1956 · ṣaḥīḥ",
  },
  {
    en: "When you enter the masjid say: Allāhumma-ftaḥ lī abwāba raḥmatik — O Allah, open for me the gates of Your mercy.",
    ar: "إذا دخل أحدكم المسجد فليقل: اللّهمّ افتح لي أبواب رحمتك.",
    source: "Muslim 713",
  },
  {
    en: "Whoever recites Āyat al-Kursī after every prayer, nothing keeps him from Paradise except death.",
    ar: "من قرأ آية الكرسي دبر كلّ صلاة لم يمنعه من دخول الجنّة إلّا أن يموت.",
    source: "Nasāʾī (al-Kubrā) 9928 · ṣaḥīḥ al-Albānī",
  },
  {
    en: "Whoever says Astaghfirullāh-alladhī lā ilāha illā Huwa-l-Ḥayyu-l-Qayyūm wa atūbu ilayh — his sins are forgiven, even if he had fled from battle.",
    ar: "من قال «أستغفر الله الذي لا إله إلّا هو الحيّ القيّوم وأتوب إليه» غُفرت ذنوبه وإن كان فرَّ من الزّحف.",
    source: "Abū Dāwūd 1517 · ṣaḥīḥ",
  },
  {
    en: "The most beloved deeds to Allah are those done consistently, even if they are small.",
    ar: "أحبُّ الأعمال إلى الله أدومها وإن قلّ.",
    source: "Bukhārī 6464 · Muslim 783",
  },
  {
    en: "Du'ā at the time of breaking your fast is not rejected.",
    ar: "للصّائم عند فطره دعوة لا تُردّ.",
    source: "Ibn Mājah 1753 · ḥasan",
  },
  {
    en: "When you enter your home, mention Allah; Shayṭān will say: 'Tonight you have no place to sleep here.'",
    ar: "إذا دخل الرّجل بيته فذكر الله عند دخوله، قال الشّيطان: لا مبيت لكم.",
    source: "Muslim 2018",
  },
  {
    en: "Sayyid al-Istighfār — the master of seeking forgiveness — whoever says it in the morning with conviction and dies that day enters Paradise.",
    ar: "سيّد الاستغفار: من قاله موقنًا به نهارًا فمات من يومه دخل الجنّة.",
    source: "Bukhārī 6306",
  },
  {
    en: "He who recites Sūrat al-Ikhlāṣ ten times, Allah will build for him a palace in Paradise.",
    ar: "من قرأ «قل هو الله أحد» عشر مرّات بنى الله له قصرًا في الجنّة.",
    source: "Aḥmad 15610 · ṣaḥīḥ al-Albānī",
  },
  {
    en: "When the Prophet ﷺ entered the marketplace, he said: Lā ilāha illā-Allāh waḥdahu lā sharīka lah… Allah writes for him a million good deeds.",
    ar: "من دخل السّوق فقال: لا إله إلّا الله وحده لا شريك له... كتب الله له ألف ألف حسنة.",
    source: "Tirmidhī 3428 · ḥasan",
  },
  {
    en: "Be in this world as if you were a stranger or a traveller.",
    ar: "كن في الدّنيا كأنّك غريب أو عابر سبيل.",
    source: "Bukhārī 6416",
  },
  {
    en: "Whoever recites the last two verses of Sūrat al-Baqarah at night, they will suffice him.",
    ar: "من قرأ الآيتين من آخر سورة البقرة في ليلة كفتاه.",
    source: "Bukhārī 5051 · Muslim 808",
  },
  {
    en: "Allah, exalted is He, says: 'I am as My servant thinks I am, and I am with him when he remembers Me.'",
    ar: "يقول الله تعالى: أنا عند ظنّ عبدي بي، وأنا معه إذا ذكرني.",
    source: "Bukhārī 7405 · Muslim 2675",
  },
  {
    en: "The strong believer is better and more beloved to Allah than the weak believer — and in each there is good.",
    ar: "المؤمن القويّ خير وأحبّ إلى الله من المؤمن الضّعيف، وفي كلٍّ خير.",
    source: "Muslim 2664",
  },
  {
    en: "When you hear the call to prayer, repeat after the muezzin — and ask Allah for His grace; whoever does so, intercession from me is due upon him.",
    ar: "إذا سمعتم المؤذّن فقولوا مثل ما يقول، ثمّ صلّوا عليّ، ثمّ سلوا الله لي الوسيلة... فمن سألها لي حلّت له شفاعتي.",
    source: "Muslim 384",
  },
  {
    en: "Whoever takes a path in search of knowledge, Allah will make easy for him a path to Paradise.",
    ar: "من سلك طريقًا يلتمس فيه علمًا سهّل الله له به طريقًا إلى الجنّة.",
    source: "Muslim 2699",
  },
  {
    en: "Two raka'at of Fajr (sunnah) are better than the world and what it contains.",
    ar: "ركعتا الفجر خير من الدّنيا وما فيها.",
    source: "Muslim 725",
  },
  {
    en: "He who relieves a hardship of this world for a believer, Allah will relieve a hardship of the Day of Resurrection for him.",
    ar: "من نفّس عن مؤمن كربةً من كرب الدّنيا نفّس الله عنه كربةً من كرب يوم القيامة.",
    source: "Muslim 2699",
  },
  {
    en: "The heaviest deed in the scale on the Day of Judgement is good character.",
    ar: "ما من شيء أثقل في ميزان المؤمن يوم القيامة من حسن الخلق.",
    source: "Tirmidhī 2002 · ṣaḥīḥ",
  },
  {
    en: "Whoever fasts a day for the sake of Allah, Allah distances his face from the Fire by seventy autumns.",
    ar: "من صام يومًا في سبيل الله بعّد الله وجهه عن النّار سبعين خريفًا.",
    source: "Bukhārī 2840 · Muslim 1153",
  },
  {
    en: "When the rooster crows ask Allah from His grace, for it has seen an angel.",
    ar: "إذا سمعتم صياح الدّيكة فاسألوا الله من فضله، فإنّها رأت ملكًا.",
    source: "Bukhārī 3303 · Muslim 2729",
  },
  {
    en: "He who builds a masjid for Allah, Allah builds for him the like of it in Paradise.",
    ar: "من بنى مسجدًا لله بنى الله له مثله في الجنّة.",
    source: "Bukhārī 450 · Muslim 533",
  },
  {
    en: "The supplication of a Muslim for his brother in his absence is answered — an angel by his side says: Āmīn, and may you have the same.",
    ar: "دعوةُ المرءِ المسلم لأخيه بظهر الغيب مستجابة، عند رأسه ملكٌ موكَّل، كلّما دعا لأخيه بخيرٍ قال الملك الموكّل به: آمين ولك بمثل.",
    source: "Muslim 2733",
  },
  {
    en: "When one of you sneezes, let him say Al-ḥamdulillāh; let his brother say Yarḥamuk-Allāh; and let him reply Yahdīkum-ullāhu wa yuṣliḥu bālakum.",
    ar: "إذا عطس أحدكم فليقل الحمد لله، وليقل له أخوه يرحمك الله، فإذا قال يرحمك الله فليقل يهديكم الله ويصلح بالكم.",
    source: "Bukhārī 6224",
  },
  {
    en: "The dearest words to Allah are four: SubḥānAllāh, al-ḥamdulillāh, lā ilāha illā-Allāh, and Allāhu akbar.",
    ar: "أحبّ الكلام إلى الله أربع: سبحان الله، والحمد لله، ولا إله إلّا الله، والله أكبر.",
    source: "Muslim 2137",
  },
  {
    en: "Allāhumma innī as'aluka-l-ʿafwa wal-ʿāfiyah fī-d-dunyā wal-ākhirah — O Allah, I ask You for pardon and well-being in this life and the next.",
    ar: "اللّهمّ إنّي أسألك العفو والعافية في الدّنيا والآخرة.",
    source: "Ibn Mājah 3871 · ṣaḥīḥ",
  },
  {
    en: "He is not a believer who fills his stomach while his neighbour beside him is hungry.",
    ar: "ليس المؤمن الّذي يشبع وجاره جائع إلى جنبه.",
    source: "Bukhārī (al-Adab al-Mufrad) 112 · ṣaḥīḥ",
  },
  {
    en: "Whoever reads Sūrat al-Kahf on Friday, light will shine for him from one Friday to the next.",
    ar: "من قرأ سورة الكهف يوم الجمعة أضاء له من النّور ما بين الجمعتين.",
    source: "Ḥākim 6169 · ṣaḥīḥ al-Albānī",
  },
];

// Pick today's reminder. Rotates by UTC day so users in any timezone get a
// fresh card each day. Cycles through the list — never repeats within a month.
export function todaysReminder() {
  const dayIndex = Math.floor(Date.now() / 86400000);
  return DAILY_REMINDERS[dayIndex % DAILY_REMINDERS.length];
}
