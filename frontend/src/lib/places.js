// Ziyārah — historical and religious sites for pilgrims to visit in
// Makkah, the Mīqāts, and Madīnah. Photos live in /public/images/places/{slug}.jpg.
// All descriptions reference authentic sources; tone is calm and informative.

export const PLACES = [
  // ─── MAKKAH ─────────────────────────────────────────────────
  {
    slug: "jabal-al-nur",
    city: "makkah",
    name_en: "Jabal al-Nūr",
    name_ar: "جبل النور",
    subtitle_en: "Mountain of Light · Cave Hirā'",
    subtitle_ar: "جبل النور · غار حراء",
    description_en:
      "On this mountain, in the Cave of Hirā', the Prophet Muhammad ﷺ received the very first verses of the Qur'an from the angel Jibrīl: 'Iqra' bismi rabbika alladhī khalaq…' (Sūrat al-ʿAlaq). The cave faces the Ka'bah and the climb is steep — about 600 metres of rock steps.",
    description_ar:
      "في غار حراء على هذا الجبل، نزل على النبي محمد ﷺ أول الوحي بقوله تعالى: «اقْرَأْ بِاسْمِ رَبِّكَ الَّذِي خَلَقَ» (سورة العلق). والغار يطلّ على الكعبة، والصعود إليه شاقّ — نحو ٦٠٠ متر من السلالم الصخرية.",
    lat: 21.4581,
    lng: 39.8597,
  },
  {
    slug: "jabal-thawr",
    city: "makkah",
    name_en: "Jabal Thawr",
    name_ar: "جبل ثور",
    subtitle_en: "Cave of the Hijrah",
    subtitle_ar: "غار الهجرة",
    description_en:
      "The cave on Mount Thawr where the Prophet ﷺ and Abū Bakr aṣ-Ṣiddīq (RA) hid for three nights from the Quraysh during the Hijrah to Madīnah. Allah refers to this in the Qur'an: 'When they two were in the cave, when he said to his companion: do not grieve, indeed Allah is with us' (9:40).",
    description_ar:
      "هو الغار الذي اختبأ فيه النبي ﷺ وأبو بكر الصديق رضي الله عنه ثلاث ليالٍ من قريش في طريق الهجرة إلى المدينة. وفيه قول الله تعالى: «إِذْ هُمَا فِي الْغَارِ إِذْ يَقُولُ لِصَاحِبِهِ لَا تَحْزَنْ إِنَّ اللَّهَ مَعَنَا» (التوبة ٤٠).",
    lat: 21.3833,
    lng: 39.8633,
  },
  {
    slug: "jabal-arafat",
    city: "makkah",
    name_en: "Jabal al-Raḥmah · Arafat",
    name_ar: "جبل الرحمة · عرفات",
    subtitle_en: "Site of the Farewell Sermon",
    subtitle_ar: "موضع خطبة الوداع",
    description_en:
      "The plain of Arafat is the heart of Hajj — 'Hajj is Arafat'. On this hill the Prophet ﷺ delivered his Farewell Sermon. Pilgrims standing here in wuqūf during Hajj have all their sins forgiven if Allah accepts.",
    description_ar:
      "صعيد عرفات هو ركن الحج الأعظم — «الحجّ عرفة». وعلى هذا الجبل ألقى النبي ﷺ خطبة الوداع. ومن وقف به في الحجّ متضرّعًا فإنّ الله يغفر له ذنوبه.",
    lat: 21.3548,
    lng: 39.9844,
  },
  {
    slug: "mina",
    city: "makkah",
    name_en: "Minā",
    name_ar: "منى",
    subtitle_en: "City of tents · Jamarāt",
    subtitle_ar: "مدينة الخيام · الجمرات",
    description_en:
      "A valley five kilometres east of Makkah, filled with white tents during Hajj. Pilgrims spend the days of Tashrīq here and stone the three Jamarāt — re-enacting Ibrāhīm ʿalayhi-s-salām rejecting Shayṭān.",
    description_ar:
      "وادٍ يقع شرق مكة بنحو خمسة كيلومترات، تنتشر فيه الخيام البيضاء أيام الحج. يقضي الحجاج فيه أيام التشريق ويرمون الجمرات الثلاث — اقتداءً بإبراهيم عليه السلام في رميه للشيطان.",
    lat: 21.4133,
    lng: 39.8933,
  },
  {
    slug: "muzdalifah",
    city: "makkah",
    name_en: "Muzdalifah",
    name_ar: "المزدلفة",
    subtitle_en: "Night stop after Arafat",
    subtitle_ar: "مبيت ليلة العاشر من ذي الحجة",
    description_en:
      "An open plain between Arafat and Minā where pilgrims spend the night of the 10th of Dhul-Ḥijjah after wuqūf. Here they pray Maghrib and ʿIshā' combined, and gather pebbles for the Jamarāt.",
    description_ar:
      "أرض مكشوفة بين عرفات ومنى، يبيت فيها الحجاج ليلة العاشر من ذي الحجة بعد الوقوف بعرفة. ويُجمع فيها بين المغرب والعشاء ويُلقط الحصى لرمي الجمرات.",
    lat: 21.3833,
    lng: 39.9333,
  },
  {
    slug: "masjid-jinn",
    city: "makkah",
    name_en: "Masjid al-Jinn",
    name_ar: "مسجد الجنّ",
    subtitle_en: "Where the Jinn pledged",
    subtitle_ar: "موضع بيعة الجنّ",
    description_en:
      "A small mosque north of the Ḥaram. Tradition relates this is where a delegation of jinn came to listen to the Prophet ﷺ recite Qur'an and pledged allegiance to him — referenced in Sūrat al-Jinn.",
    description_ar:
      "مسجد صغير شمال المسجد الحرام. يُذكر أنه الموضع الذي جاء فيه نفرٌ من الجنّ يستمعون لقراءة النبي ﷺ القرآن وبايعوه — كما في سورة الجنّ.",
    lat: 21.4267,
    lng: 39.8261,
  },
  {
    slug: "masjid-khayf",
    city: "makkah",
    name_en: "Masjid al-Khayf",
    name_ar: "مسجد الخيف",
    subtitle_en: "The mosque of the prophets · Minā",
    subtitle_ar: "مسجد الأنبياء · منى",
    description_en:
      "The principal mosque of Minā. The Prophet ﷺ said: 'Seventy prophets prayed in Masjid al-Khayf.' Pilgrims pray Ẓuhr, ʿAṣr, Maghrib, and ʿIshā' here during the days of Tashrīq.",
    description_ar:
      "المسجد الأكبر في منى. قال النبي ﷺ: «صلّى في مسجد الخيف سبعون نبيًا». ويصلّي فيه الحجاج الظهر والعصر والمغرب والعشاء أيام التشريق.",
    lat: 21.4136,
    lng: 39.8939,
  },
  {
    slug: "abu-qubays",
    city: "makkah",
    name_en: "Jabal Abū Qubays",
    name_ar: "جبل أبي قُبيس",
    subtitle_en: "First mountain placed on earth",
    subtitle_ar: "أوّل جبل وُضع على الأرض",
    description_en:
      "An ancient mountain overlooking the Ka'bah from the east. Tradition holds it is the first mountain Allah placed on earth, and from its summit the Prophet ﷺ split the moon as a sign for Quraysh (Sūrat al-Qamar).",
    description_ar:
      "جبل عريق يشرف على الكعبة من جهة الشرق. يُقال إنه أوّل جبل وُضع على وجه الأرض، ومنه شُقّ القمر للنبي ﷺ آيةً لقريش (سورة القمر).",
    lat: 21.4233,
    lng: 39.8278,
  },
  {
    slug: "mawlid-nabi",
    city: "makkah",
    name_en: "Mawlid an-Nabī",
    name_ar: "مولد النبي ﷺ",
    subtitle_en: "Birthplace of the Prophet ﷺ · now a library",
    subtitle_ar: "موضع مولد النبي ﷺ · مكتبة مكة",
    description_en:
      "The site of the Prophet ﷺ's birth in 570 CE, in the Banū Hāshim quarter of Makkah. Today the building functions as the Makkah Public Library. (Note: by Salafī sunnah, no special worship is performed at the site.)",
    description_ar:
      "موضع ولادة النبي ﷺ سنة ٥٧٠م في شِعب بني هاشم بمكة. وهو اليوم مكتبة مكة المكرّمة. (تنبيه: لم يُشرع تخصيص هذا الموضع بعبادة خاصّة عند أهل السنة.)",
    lat: 21.4225,
    lng: 39.8261,
  },
  {
    slug: "masjid-aisha",
    city: "makkah",
    name_en: "Masjid Aisha · Tan'eem",
    name_ar: "مسجد عائشة · التنعيم",
    subtitle_en: "Closest Mīqāt for those in Makkah",
    subtitle_ar: "أقرب ميقات لمن كان بمكة",
    description_en:
      "Named after ʿĀ'isha (RA), who entered iḥrām here at the Prophet ﷺ's instruction during the Farewell Pilgrimage. Today it is the most popular Mīqāt for those already in Makkah who wish to perform an additional ʿUmrah — about 7 km from the Ḥaram.",
    description_ar:
      "نُسب إلى عائشة رضي الله عنها التي أحرمت منه بأمر النبي ﷺ في حجة الوداع. وهو اليوم أشهر ميقات لمن أراد عمرة من أهل مكة، يبعد عن الحرم نحو ٧ كم.",
    lat: 21.4514,
    lng: 39.7681,
  },

  // ─── MĪQĀTS — the 5 official boundaries ──────────────────────
  {
    slug: "miqat-dhul-hulayfah",
    city: "miqat",
    name_en: "Dhul-Ḥulayfah · Abyār ʿAlī",
    name_ar: "ذو الحُليفة · آبار علي",
    subtitle_en: "Mīqāt of the people of Madīnah",
    subtitle_ar: "ميقات أهل المدينة",
    description_en:
      "The Mīqāt for those coming from Madīnah and beyond — about 13 km south of Madīnah and the farthest of all the Mīqāts from Makkah (≈420 km). The Prophet ﷺ entered iḥrām here in his Farewell Pilgrimage.",
    description_ar:
      "ميقات أهل المدينة ومن جاء من جهتها — يبعد عن المدينة نحو ١٣ كم، وهو أبعد المواقيت عن مكة (نحو ٤٢٠ كم). أحرم منه النبي ﷺ في حجة الوداع.",
    lat: 24.4203,
    lng: 39.5589,
  },
  {
    slug: "miqat-juhfah",
    city: "miqat",
    name_en: "Al-Juḥfah · Rābigh",
    name_ar: "الجُحفة · رابغ",
    subtitle_en: "Mīqāt of Levant, Egypt, Maghrib",
    subtitle_ar: "ميقات أهل الشام ومصر والمغرب",
    description_en:
      "The Mīqāt for those coming from Shām, Egypt, Sudan, and the Maghrib. The original village of al-Juḥfah is in ruins; today most pilgrims enter iḥrām at Rābigh, the modern coastal town that lies on the same line.",
    description_ar:
      "ميقات أهل الشام ومصر والسودان والمغرب. والقرية الأصلية للجحفة قد خرّبت، فيُحرم الناس اليوم من رابغ الواقعة على البحر الأحمر على خطّ المحاذاة نفسه.",
    lat: 22.7633,
    lng: 39.0408,
  },
  {
    slug: "miqat-qarn-manazil",
    city: "miqat",
    name_en: "Qarn al-Manāzil · As-Sayl al-Kabīr",
    name_ar: "قرن المنازل · السيل الكبير",
    subtitle_en: "Mīqāt of Najd & the Gulf",
    subtitle_ar: "ميقات أهل نجد والخليج",
    description_en:
      "The Mīqāt for pilgrims arriving from Najd, Riyadh, the Gulf states (UAE, Qatar, Bahrain, Kuwait), and Tā'if. Located at as-Sayl al-Kabīr on the Tā'if road, about 75 km east of Makkah.",
    description_ar:
      "ميقات أهل نجد والرياض ودول الخليج (الإمارات وقطر والبحرين والكويت) والطائف. ويقع في السيل الكبير على طريق الطائف، شرق مكة بنحو ٧٥ كم.",
    lat: 21.6275,
    lng: 40.5161,
  },
  {
    slug: "miqat-yalamlam",
    city: "miqat",
    name_en: "Yalamlam · As-Saʿdiyyah",
    name_ar: "يَلَمْلَم · السعدية",
    subtitle_en: "Mīqāt of Yemen",
    subtitle_ar: "ميقات أهل اليمن",
    description_en:
      "The Mīqāt for pilgrims coming from Yemen and South Asia by sea. A wadi about 92 km south-east of Makkah on the road to Yemen.",
    description_ar:
      "ميقات أهل اليمن ومن جاء من جنوب آسيا عن طريق البحر. وهو وادٍ يبعد عن مكة نحو ٩٢ كم جنوبًا شرقيًا على طريق اليمن.",
    lat: 20.5083,
    lng: 40.0992,
  },
  {
    slug: "miqat-dhat-irq",
    city: "miqat",
    name_en: "Dhāt ʿIrq",
    name_ar: "ذات عِرق",
    subtitle_en: "Mīqāt of Iraq & the East",
    subtitle_ar: "ميقات أهل العراق والمشرق",
    description_en:
      "The Mīqāt for pilgrims coming from Iraq and points east — appointed by ʿUmar (RA) when iḥrām became necessary for those new lands. About 100 km north-east of Makkah.",
    description_ar:
      "ميقات أهل العراق ومن جاء من المشرق — وقّته عمر بن الخطاب رضي الله عنه لأهل تلك البلاد بعد الفتوح. يبعد عن مكة نحو ١٠٠ كم شمالًا شرقيًا.",
    lat: 22.0667,
    lng: 41.5667,
  },
  {
    slug: "miqat-tan-eem",
    city: "miqat",
    name_en: "Tan'eem · Masjid Aisha",
    name_ar: "التنعيم · مسجد عائشة",
    subtitle_en: "Mīqāt for those already in Makkah",
    subtitle_ar: "ميقات من كان بمكة",
    description_en:
      "Not one of the five primary Mīqāts, but the closest valid point of iḥrām for someone already in Makkah who wishes to perform an additional ʿUmrah — about 7 km from the Ḥaram.",
    description_ar:
      "ليس من المواقيت الخمسة الأصلية، لكنه أقرب موضع يحلّ فيه الإحرام لمن كان بمكة وأراد عمرة أخرى — يبعد نحو ٧ كم عن الحرم.",
    lat: 21.4514,
    lng: 39.7681,
  },

  // ─── MADĪNAH ────────────────────────────────────────────────
  {
    slug: "masjid-nabawi",
    city: "madinah",
    name_en: "Masjid an-Nabawī",
    name_ar: "المسجد النبوي",
    subtitle_en: "The Prophet ﷺ's Mosque · 1,000× reward",
    subtitle_ar: "مسجد النبي ﷺ · الصلاة فيه بألف صلاة",
    description_en:
      "The second-holiest mosque in Islam, founded by the Prophet ﷺ himself when he arrived in Madīnah in 622 CE. The Prophet ﷺ said: 'A prayer in this mosque of mine is better than a thousand prayers anywhere else, except al-Masjid al-Ḥarām.' His blessed grave is inside.",
    description_ar:
      "ثاني أقدس المساجد في الإسلام، بناه النبي ﷺ بنفسه حين قدم المدينة سنة ٦٢٢م. قال النبي ﷺ: «صلاة في مسجدي هذا خير من ألف صلاة فيما سواه إلا المسجد الحرام». وفي داخله قبره الشريف.",
    lat: 24.4672,
    lng: 39.6111,
  },
  {
    slug: "rawdah",
    city: "madinah",
    name_en: "Ar-Rawḍah ash-Sharīfah",
    name_ar: "الروضة الشريفة",
    subtitle_en: "A garden from the gardens of Paradise",
    subtitle_ar: "روضة من رياض الجنّة",
    description_en:
      "The space inside Masjid an-Nabawī between the Prophet ﷺ's grave and his minbar. He ﷺ said: 'Between my house and my minbar is a garden from the gardens of Paradise.' Praying here is one of the most beloved acts pilgrims seek in Madīnah.",
    description_ar:
      "البقعة داخل المسجد النبوي بين بيت النبي ﷺ ومنبره. قال ﷺ: «ما بين بيتي ومنبري روضة من رياض الجنة». والصلاة فيها من أحبّ ما يحرص عليه زائر المدينة.",
    lat: 24.4674,
    lng: 39.6110,
  },
  {
    slug: "quba",
    city: "madinah",
    name_en: "Masjid Qubā'",
    name_ar: "مسجد قُباء",
    subtitle_en: "First mosque in Islam · ʿUmrah reward",
    subtitle_ar: "أوّل مسجد في الإسلام · أجر عمرة",
    description_en:
      "The very first mosque in Islam, built by the Prophet ﷺ on his arrival in Madīnah. He said: 'Whoever purifies himself at home and comes to Masjid Qubā' to pray two rakʿah, has the reward of an ʿUmrah.' (Ibn Mājah, ṣaḥīḥ al-Albānī)",
    description_ar:
      "أوّل مسجد بُني في الإسلام، أسّسه النبي ﷺ حين قدم المدينة. قال ﷺ: «من تطهّر في بيته ثم أتى مسجد قباء فصلّى فيه ركعتين كان له كأجر عُمرة» (ابن ماجه، صحّحه الألباني).",
    lat: 24.4392,
    lng: 39.6175,
  },
  {
    slug: "qiblatayn",
    city: "madinah",
    name_en: "Masjid al-Qiblatayn",
    name_ar: "مسجد القبلتين",
    subtitle_en: "Where the Qiblah changed",
    subtitle_ar: "موضع تحويل القبلة",
    description_en:
      "The 'Mosque of the Two Qiblahs' — where the verse came down commanding the Prophet ﷺ to turn from Bayt al-Maqdis to the Ka'bah mid-prayer. The companions turned with him in the same rakʿah.",
    description_ar:
      "«مسجد القبلتين» — وهو الموضع الذي نزل فيه الأمر بتحويل القبلة من بيت المقدس إلى الكعبة، فاستدار النبي ﷺ والصحابة في الصلاة نفسها.",
    lat: 24.4843,
    lng: 39.5786,
  },
  {
    slug: "uhud",
    city: "madinah",
    name_en: "Mount Uḥud",
    name_ar: "جبل أُحد",
    subtitle_en: "Battle of Uḥud · Ḥamza (RA)",
    subtitle_ar: "غزوة أحد · حمزة رضي الله عنه",
    description_en:
      "The site of the Battle of Uḥud (3 AH). The Prophet ﷺ said of Uḥud: 'This is a mountain that loves us and we love it.' At its foot lies the graveyard of the seventy martyrs, including the Prophet's uncle Ḥamza ibn ʿAbd al-Muṭṭalib (RA).",
    description_ar:
      "موضع غزوة أُحد سنة ٣هـ. قال النبي ﷺ عن أُحد: «هذا جبل يحبّنا ونحبّه». وفي سفحه مقبرة شهداء أُحد السبعين، ومنهم عمّ النبي ﷺ حمزة بن عبد المطلب رضي الله عنه.",
    lat: 24.4986,
    lng: 39.6172,
  },
  {
    slug: "sabaa-masajid",
    city: "madinah",
    name_en: "The Seven Mosques",
    name_ar: "السبع مساجد",
    subtitle_en: "Khandaq battle line · Western Madīnah",
    subtitle_ar: "خطّ غزوة الخندق · غرب المدينة",
    description_en:
      "A cluster of small historic mosques on the western edge of Madīnah at the line of the Khandaq (Trench) — including Masjid al-Fatḥ, Masjid Salmān al-Fārsī, and mosques associated with Abū Bakr, ʿUmar, ʿAlī and Fāṭimah (RA).",
    description_ar:
      "مجموعة مساجد تاريخية صغيرة في غرب المدينة عند خطّ الخندق — منها مسجد الفتح، ومسجد سلمان الفارسي، ومساجد منسوبة إلى أبي بكر وعمر وعليّ وفاطمة رضي الله عنهم.",
    lat: 24.4858,
    lng: 39.5969,
  },
  {
    slug: "al-baqi",
    city: "madinah",
    name_en: "Al-Baqīʿ",
    name_ar: "البقيع",
    subtitle_en: "Cemetery of the Companions",
    subtitle_ar: "مقبرة الصحابة",
    description_en:
      "The principal cemetery of Madīnah, immediately east of Masjid an-Nabawī. Thousands of the Prophet's family and Companions are buried here — including ʿUthmān ibn ʿAffān (RA), Imām Mālik, and most of the Prophet ﷺ's wives and children.",
    description_ar:
      "المقبرة الكبرى للمدينة، تقع شرق المسجد النبوي مباشرة. دُفن فيها آلاف من آل بيت النبي ﷺ وأصحابه — منهم عثمان بن عفان رضي الله عنه، والإمام مالك، وأكثر أمهات المؤمنين وأبناء النبي ﷺ.",
    lat: 24.4669,
    lng: 39.6143,
  },
  {
    slug: "ghamamah",
    city: "madinah",
    name_en: "Masjid al-Ghamāmah",
    name_ar: "مسجد الغمامة",
    subtitle_en: "Mosque of the Cloud · Eid prayer site",
    subtitle_ar: "مسجد الغمامة · مصلّى العيد",
    description_en:
      "An Ottoman-era mosque near Masjid an-Nabawī marking the place where the Prophet ﷺ used to lead the Eid prayer in the open. It is said a cloud (ghamāmah) shaded him here while he prayed for rain.",
    description_ar:
      "مسجد عثماني بجوار المسجد النبوي يُعلِّم على الموضع الذي كان يصلّي فيه النبي ﷺ صلاة العيد في الخلاء. ويُقال إنّ غمامةً أظلّته فيه حين استسقى.",
    lat: 24.4677,
    lng: 39.6097,
  },
  {
    slug: "abu-bakr-umar-ali",
    city: "madinah",
    name_en: "Mosques of Abū Bakr, ʿUmar & ʿAlī",
    name_ar: "مساجد أبي بكر وعمر وعليّ",
    subtitle_en: "Around Masjid an-Nabawī",
    subtitle_ar: "بجوار المسجد النبوي",
    description_en:
      "Three small historic mosques close to Masjid an-Nabawī, named after the three rightly-guided caliphs who lived there. Today they sit within walking distance of the Prophet's Mosque on its western side.",
    description_ar:
      "ثلاثة مساجد تاريخية صغيرة قرب المسجد النبوي، نُسبت إلى الخلفاء الراشدين الثلاثة الذين سكنوا المدينة. وتقع اليوم على مسافة قريبة من المسجد النبوي من جهته الغربية.",
    lat: 24.4682,
    lng: 39.6094,
  },
  {
    slug: "madinah-dates",
    city: "madinah",
    name_en: "Date farms & souq",
    name_ar: "مزارع التمور والسوق",
    subtitle_en: "ʿAjwa, Barḥī, Ṣukkarī",
    subtitle_ar: "العجوة، البرحي، السكّري",
    description_en:
      "Madīnah's famous date farms and the souq north of Masjid an-Nabawī. The Prophet ﷺ said of ʿAjwa: 'Whoever eats seven ʿAjwa dates in the morning will not be harmed by poison or sorcery that day' (Ṣaḥīḥ al-Bukhārī).",
    description_ar:
      "مزارع التمور المشهورة بالمدينة والسوق الواقع شمال المسجد النبوي. قال النبي ﷺ عن العجوة: «من تصبّح بسبع تمرات عجوة لم يضرّه ذلك اليوم سمٌّ ولا سحر» (صحيح البخاري).",
    lat: 24.4710,
    lng: 39.6010,
  },
];

export const CITY_LABELS = {
  en: { makkah: "Makkah", miqat: "Mīqāts", madinah: "Madīnah" },
  ar: { makkah: "مكة المكرمة", miqat: "المواقيت", madinah: "المدينة المنورة" },
};

export function placesByCity(city) {
  return PLACES.filter((p) => p.city === city);
}

export function placeBySlug(slug) {
  return PLACES.find((p) => p.slug === slug);
}
