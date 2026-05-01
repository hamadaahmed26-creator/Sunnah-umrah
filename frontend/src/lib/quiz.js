// Sunnah Umrah Quiz — vetted from authentic Salafi sources.
// Sources: Sahih al-Bukhari, Sahih Muslim, Hisn al-Muslim, Bulugh al-Maram,
// Manasik al-Hajj wal-Umrah by Shaykh al-Albani (raḥimahullāh).
//
// IMPORTANT — Religious accuracy: questions, answers, and references in this
// file MUST be reviewed by the app owner (Hamada) before going live. Do NOT
// modify Arabic texts or hadith references without source verification.

export const QUIZ_CATEGORIES = [
  { id: "ihram",    label_en: "Ihram",         label_ar: "الإحرام" },
  { id: "tawaf",    label_en: "Tawaf",         label_ar: "الطواف" },
  { id: "sai",      label_en: "Sa'i",          label_ar: "السعي" },
  { id: "halq",     label_en: "Halq / Taqsīr", label_ar: "الحلق والتقصير" },
  { id: "general",  label_en: "General",       label_ar: "أحكام عامة" },
];

export const DIFFICULTIES = [
  { id: "beginner",     label_en: "Beginner",     label_ar: "مبتدئ" },
  { id: "intermediate", label_en: "Intermediate", label_ar: "متوسط" },
  { id: "advanced",     label_en: "Advanced",     label_ar: "متقدم" },
];

// Each question:
//   id, category, difficulty,
//   q_en / q_ar:  question text
//   options:      array of { en, ar }
//   answer:       index (0-based) of correct option
//   explain_en / explain_ar:  short explanation shown after answer
//   source:       hadith / book reference (visible to learner)
export const QUIZ_QUESTIONS = [
  // ─── IHRAM (Beginner) ───────────────────────────────────────────────
  {
    id: "ihr-b-1",
    category: "ihram",
    difficulty: "beginner",
    q_en: "What is the niyyah (intention) for Umrah declared at the Mīqāt?",
    q_ar: "ما هي النيّة عند الميقات للعمرة؟",
    options: [
      { en: "Labbayka ʿumratan", ar: "لبيك عمرة" },
      { en: "Labbayka ḥajjan",   ar: "لبيك حجًا" },
      { en: "Allāhu akbar",      ar: "الله أكبر" },
      { en: "Bismillāh",         ar: "بسم الله" },
    ],
    answer: 0,
    explain_en: "The Prophet ﷺ taught us to declare the type of pilgrimage we intend at the Mīqāt by saying 'Labbayka ʿumratan' (here I am, [O Allāh,] for ʿUmrah).",
    explain_ar: "علّمنا النبي ﷺ أن نُهلّ بنوع النسك عند الميقات فنقول: «لبيك عمرة».",
    source: "Sahih Muslim 1218",
  },
  {
    id: "ihr-b-2",
    category: "ihram",
    difficulty: "beginner",
    q_en: "How many pieces of cloth does a man wear in Ihrām?",
    q_ar: "كم عدد قطع ثوب الإحرام للرجل؟",
    options: [
      { en: "One",   ar: "قطعة واحدة" },
      { en: "Two",   ar: "قطعتان" },
      { en: "Three", ar: "ثلاث قطع" },
      { en: "Four",  ar: "أربع قطع" },
    ],
    answer: 1,
    explain_en: "A man wears two unstitched white cloths: an izār (lower) and a ridāʾ (upper). Sandals are also recommended.",
    explain_ar: "يلبس الرجل قطعتين بيضاوين غير مخيطتين: إزار ورداء، ويُسنّ لبس النعلين.",
    source: "Sahih al-Bukhari 1543",
  },
  {
    id: "ihr-b-3",
    category: "ihram",
    difficulty: "beginner",
    q_en: "What does the Talbiyah begin with?",
    q_ar: "بما تبدأ التلبية؟",
    options: [
      { en: "Bismillāhi mājrāhā",                  ar: "بسم الله مجراها" },
      { en: "Labbayk Allāhumma labbayk",            ar: "لبّيك اللهم لبّيك" },
      { en: "Subḥān Allāh wa biḥamdihi",            ar: "سبحان الله وبحمده" },
      { en: "Allāhumma ṣalli ʿalā Muḥammad",        ar: "اللهم صل على محمد" },
    ],
    answer: 1,
    explain_en: "The Talbiyah of the Prophet ﷺ began: 'Labbayk Allāhumma labbayk, labbayka lā sharīka laka labbayk, inna-l-ḥamda wa-n-niʿmata laka wa-l-mulk, lā sharīka lak.'",
    explain_ar: "كانت تلبية النبي ﷺ: «لبّيك اللهم لبّيك، لبّيك لا شريك لك لبّيك، إنّ الحمد والنّعمة لك والملك، لا شريك لك».",
    source: "Sahih al-Bukhari 1549, Sahih Muslim 1184",
  },
  {
    id: "ihr-b-4",
    category: "ihram",
    difficulty: "beginner",
    q_en: "Which of these is FORBIDDEN while in Ihrām?",
    q_ar: "أيّ ممّا يلي محظور في الإحرام؟",
    options: [
      { en: "Drinking water",                ar: "شرب الماء" },
      { en: "Wearing perfume",                ar: "وضع الطّيب" },
      { en: "Reading the Qurʾān",             ar: "قراءة القرآن" },
      { en: "Sleeping",                       ar: "النّوم" },
    ],
    answer: 1,
    explain_en: "After entering Ihrām, applying perfume to the body or clothes is forbidden. Note: applying perfume BEFORE Ihrām is Sunnah.",
    explain_ar: "يحرم تطييب البدن أو الثوب بعد الإحرام. أمّا قبله فهو سنّة.",
    source: "Sahih al-Bukhari 1539",
  },

  // ─── IHRAM (Intermediate) ───────────────────────────────────────────
  {
    id: "ihr-i-1",
    category: "ihram",
    difficulty: "intermediate",
    q_en: "Where is the Mīqāt for someone coming from Madīnah?",
    q_ar: "ما ميقات أهل المدينة؟",
    options: [
      { en: "Yalamlam",      ar: "يلملم" },
      { en: "Dhāt ʿIrq",     ar: "ذات عرق" },
      { en: "Dhū-l-Ḥulayfah", ar: "ذو الحُليفة (أبيار علي)" },
      { en: "Al-Juḥfah",     ar: "الجُحفة" },
    ],
    answer: 2,
    explain_en: "The Mīqāt for the people of Madīnah is Dhū-l-Ḥulayfah (also called Abyār ʿAlī), about 9 km from Masjid an-Nabawī.",
    explain_ar: "ميقات أهل المدينة ذو الحُليفة (أبيار علي)، على بُعد ٩ كم تقريبًا من المسجد النبوي.",
    source: "Sahih al-Bukhari 1525",
  },
  {
    id: "ihr-i-2",
    category: "ihram",
    difficulty: "intermediate",
    q_en: "Is a woman's face-veil (niqāb) allowed in Ihrām?",
    q_ar: "هل يجوز للمرأة لُبس النّقاب في الإحرام؟",
    options: [
      { en: "Yes, always",                          ar: "نعم، دائمًا" },
      { en: "No — but she covers her face with a cloth from her head when men pass by", ar: "لا — لكن تُغطّي وجهها بثوبٍ من رأسها عند مرور الرّجال" },
      { en: "Yes, only at night",                   ar: "نعم، فقط في الليل" },
      { en: "Only red niqāb is forbidden",           ar: "النّقاب الأحمر فقط ممنوع" },
    ],
    answer: 1,
    explain_en: "The Prophet ﷺ said: 'A woman in Ihrām should not wear the niqāb or gloves.' Aishah (RA) reported that when men passed they lowered their khimār (head-cover) over their faces — without it touching the face like a fixed mask.",
    explain_ar: "قال النبي ﷺ: «لا تنتقب المُحرمة ولا تلبس القُفّازين». وأخبرت عائشة رضي الله عنها أنّهنّ كنّ يُسدلن الخمار على الوجه عند مرور الرجال.",
    source: "Sahih al-Bukhari 1838; Sunan Abī Dāwūd 1833 (ḥasan)",
  },
  {
    id: "ihr-i-3",
    category: "ihram",
    difficulty: "intermediate",
    q_en: "If a person passes the Mīqāt without entering Ihrām, what should they do?",
    q_ar: "إذا تجاوز الميقات ولم يُحرم، فماذا يلزمه؟",
    options: [
      { en: "Continue and start Ihrām in Makkah",         ar: "يُكمل ويُحرم من مكّة" },
      { en: "Go back to the Mīqāt and enter Ihrām there", ar: "يرجع إلى الميقات ويُحرم منه" },
      { en: "Pay sadaqah and continue",                    ar: "يتصدّق ويُكمل" },
      { en: "Cancel the Umrah",                            ar: "يُلغي العمرة" },
    ],
    answer: 1,
    explain_en: "Whoever intends Hajj or Umrah and passes the Mīqāt without entering Ihrām must return to the Mīqāt and enter Ihrām from there. If they do not, they must offer a damm (sacrifice).",
    explain_ar: "مَن أراد الحج أو العمرة وتجاوز الميقات بلا إحرام لزمه الرّجوع إليه والإحرام منه، وإلا فعليه دم.",
    source: "Sahih al-Bukhari 1524",
  },

  // ─── TAWAF (Beginner) ───────────────────────────────────────────────
  {
    id: "twf-b-1",
    category: "tawaf",
    difficulty: "beginner",
    q_en: "How many circuits (ashwāṭ) are in one Tawaf?",
    q_ar: "كم عدد أشواط الطّواف؟",
    options: [
      { en: "Five",  ar: "خمسة" },
      { en: "Six",   ar: "ستة" },
      { en: "Seven", ar: "سبعة" },
      { en: "Eight", ar: "ثمانية" },
    ],
    answer: 2,
    explain_en: "Tawaf is seven circuits, each starting and ending at the Black Stone (al-Ḥajar al-Aswad).",
    explain_ar: "الطّواف سبعة أشواط، كلّ شوط يبدأ وينتهي عند الحجر الأسود.",
    source: "Sahih al-Bukhari 1647",
  },
  {
    id: "twf-b-2",
    category: "tawaf",
    difficulty: "beginner",
    q_en: "In which direction do you walk during Tawaf?",
    q_ar: "في أيّ اتجاه يكون الطّواف؟",
    options: [
      { en: "Clockwise",     ar: "مع عقارب السّاعة" },
      { en: "Anti-clockwise (Kaʿbah on your left)", ar: "عكس عقارب السّاعة (الكعبة عن يسارك)" },
      { en: "Either way",    ar: "أيّ اتجاه" },
      { en: "Right then left", ar: "يمينًا ثم يسارًا" },
    ],
    answer: 1,
    explain_en: "Tawaf is performed anti-clockwise — the Kaʿbah remains on your left throughout.",
    explain_ar: "الطواف عكس عقارب الساعة — الكعبة عن يسارك طوال الطّواف.",
    source: "Sahih Muslim 1218",
  },
  {
    id: "twf-b-3",
    category: "tawaf",
    difficulty: "beginner",
    q_en: "What do you say at each circuit when passing the Black Stone?",
    q_ar: "ماذا يُقال عند الحجر الأسود في كلّ شوط؟",
    options: [
      { en: "Bismillāh",         ar: "بسم الله" },
      { en: "Allāhu Akbar",       ar: "الله أكبر" },
      { en: "Subḥān Allāh",       ar: "سبحان الله" },
      { en: "Lā ilāha illā Allāh", ar: "لا إله إلا الله" },
    ],
    answer: 1,
    explain_en: "When passing the Black Stone, point or kiss it (if accessible) and say 'Allāhu Akbar' — once at each circuit.",
    explain_ar: "عند المرور بالحجر الأسود تُشير إليه (أو تُقبّله إن أمكن) وتقول «الله أكبر» في كلّ شوط.",
    source: "Sahih al-Bukhari 1613",
  },

  // ─── TAWAF (Intermediate) ───────────────────────────────────────────
  {
    id: "twf-i-1",
    category: "tawaf",
    difficulty: "intermediate",
    q_en: "What is Raml in Tawaf?",
    q_ar: "ما هو الرَّمل في الطّواف؟",
    options: [
      { en: "Kissing the Black Stone",                          ar: "تقبيل الحجر الأسود" },
      { en: "Walking quickly with short steps",                  ar: "المشي السّريع بخطوات قصيرة" },
      { en: "Crying during Tawaf",                                ar: "البكاء في الطواف" },
      { en: "Running between Safa and Marwah",                    ar: "السّعي بين الصّفا والمروة" },
    ],
    answer: 1,
    explain_en: "Raml is walking briskly with short, vigorous steps. It is Sunnah only in the FIRST 3 circuits of the arrival Tawaf for men, walking normally in the last 4.",
    explain_ar: "الرَّمل هو إسراع المشي بخطوات قصيرة قويّة، ويُسنّ للرّجال في الأشواط الثلاثة الأولى من طواف القدوم فقط، ويمشي في الأربعة الأخيرة على عادته.",
    source: "Sahih al-Bukhari 1644",
  },
  {
    id: "twf-i-2",
    category: "tawaf",
    difficulty: "intermediate",
    q_en: "What is Iḍṭibāʿ?",
    q_ar: "ما هو الاضطباع؟",
    options: [
      { en: "Crying out of fear",                                 ar: "البكاء من الخشية" },
      { en: "Wearing one's ridāʾ under the right armpit, draping it over the left shoulder", ar: "إخراج الكتف الأيمن من الرّداء وجعله على الكتف الأيسر" },
      { en: "Drinking Zamzam standing",                            ar: "شرب زمزم قائمًا" },
      { en: "Tying a knot in your izār",                          ar: "عقد الإزار" },
    ],
    answer: 1,
    explain_en: "Iḍṭibāʿ — for men only — is wearing the upper garment (ridāʾ) so that it passes under the right armpit and over the left shoulder, exposing the right shoulder. Done during the entire Tawaf of arrival.",
    explain_ar: "الاضطباع للرّجال فقط، وهو جعل وسط الرّداء تحت الإبط الأيمن وطرفيه على الكتف الأيسر، فيُكشف الكتف الأيمن طوال طواف القدوم.",
    source: "Sunan Abī Dāwūd 1883 (saḥīḥ)",
  },
  {
    id: "twf-i-3",
    category: "tawaf",
    difficulty: "intermediate",
    q_en: "What is recommended to be said between the Yemeni Corner and the Black Stone?",
    q_ar: "ما الذي يُسنّ قوله بين الرّكن اليماني والحجر الأسود؟",
    options: [
      { en: "Sūrat al-Fātiḥah",                                                   ar: "سورة الفاتحة" },
      { en: "Allāhumma āti naf-sī taqwāhā",                                       ar: "اللهم آت نفسي تقواها" },
      { en: "Rabbanā ātinā fi-d-dunyā ḥasanah, wa fi-l-ākhirati ḥasanah, wa qinā ʿadhāba-n-nār", ar: "ربّنا آتنا في الدّنيا حسنة وفي الآخرة حسنة وقنا عذاب النّار" },
      { en: "Lā ilāha illā Allāh waḥdahu",                                        ar: "لا إله إلا الله وحده" },
    ],
    answer: 2,
    explain_en: "Between the Yemeni Corner and the Black Stone, the Prophet ﷺ recited: 'Rabbanā ātinā fi-d-dunyā ḥasanah, wa fi-l-ākhirati ḥasanah, wa qinā ʿadhāba-n-nār.' (Qurʾān 2:201)",
    explain_ar: "كان النبي ﷺ يقول بين الرّكن اليماني والحجر الأسود: «ربّنا آتنا في الدّنيا حسنة وفي الآخرة حسنة وقنا عذاب النّار» (البقرة: ٢٠١).",
    source: "Sunan Abī Dāwūd 1892 (saḥīḥ)",
  },

  // ─── TAWAF (Advanced) ───────────────────────────────────────────────
  {
    id: "twf-a-1",
    category: "tawaf",
    difficulty: "advanced",
    q_en: "If a person doubts whether they completed 6 or 7 circuits, what should they do?",
    q_ar: "إذا شكّ الطّائف هل طاف ستّة أم سبعة، فماذا يفعل؟",
    options: [
      { en: "Restart Tawaf from the beginning", ar: "يبدأ الطّواف من جديد" },
      { en: "Build on certainty (the lower number) and add another circuit", ar: "يبني على اليقين (الأقلّ) ويُكمل شوطًا" },
      { en: "Build on the higher number",        ar: "يبني على الأكثر" },
      { en: "Pay a damm (sacrifice)",            ar: "يدفع دمًا" },
    ],
    answer: 1,
    explain_en: "The principle in worship: when in doubt, build on certainty (the lesser amount). So they assume only 6 were completed and add a 7th circuit.",
    explain_ar: "القاعدة في العبادات: «إذا شككتَ فابنِ على اليقين». فيُعدّها ستّةً ويُكمل شوطًا.",
    source: "Sahih Muslim 571 (general principle)",
  },
  {
    id: "twf-a-2",
    category: "tawaf",
    difficulty: "advanced",
    q_en: "What is the ruling on Tawaf without wuḍūʾ (ritual purity)?",
    q_ar: "ما حكم الطّواف بغير وضوء؟",
    options: [
      { en: "Permitted, no problem",                              ar: "جائز، لا حرج" },
      { en: "Not valid — wuḍūʾ is a condition for Tawaf",          ar: "لا يصحّ — الوضوء شرط للطّواف" },
      { en: "Valid but disliked",                                  ar: "يصحّ مع الكراهة" },
      { en: "Valid only for men",                                   ar: "يصحّ للرّجال فقط" },
    ],
    answer: 1,
    explain_en: "The majority of scholars hold that wuḍūʾ is a condition for Tawaf, based on the Prophet's ﷺ statement: 'Tawaf around the House is ṣalāh, except that Allāh has permitted speech in it.' If wuḍūʾ breaks during Tawaf, one renews it and continues from where they stopped.",
    explain_ar: "ذهب جمهور العلماء إلى أنّ الوضوء شرط للطّواف لقوله ﷺ: «الطّواف بالبيت صلاة، إلّا أنّ الله أحلّ فيه الكلام». ومن انتقض وضوؤه أثناء الطواف توضأ وأكمل من حيث وقف.",
    source: "Sunan al-Tirmidhi 960 (saḥīḥ)",
  },

  // ─── SA'I (Beginner) ────────────────────────────────────────────────
  {
    id: "sai-b-1",
    category: "sai",
    difficulty: "beginner",
    q_en: "How many trips between Safa and Marwah make up Sa'i?",
    q_ar: "كم عدد أشواط السّعي بين الصّفا والمروة؟",
    options: [
      { en: "Three",  ar: "ثلاثة" },
      { en: "Five",   ar: "خمسة" },
      { en: "Seven",  ar: "سبعة" },
      { en: "Fourteen", ar: "أربعة عشر" },
    ],
    answer: 2,
    explain_en: "Sa'i is seven trips: Safa → Marwah counts as one, Marwah → Safa is the second, and so on. You begin at Safa and end at Marwah.",
    explain_ar: "السّعي سبعة أشواط: من الصّفا إلى المروة شوط، ومن المروة إلى الصّفا شوط ثانٍ، وهكذا. تبدأ بالصّفا وتنتهي بالمروة.",
    source: "Sahih Muslim 1218",
  },
  {
    id: "sai-b-2",
    category: "sai",
    difficulty: "beginner",
    q_en: "Where do you begin Sa'i?",
    q_ar: "من أين يبدأ السّعي؟",
    options: [
      { en: "Marwah", ar: "المروة" },
      { en: "Safa",   ar: "الصّفا" },
      { en: "Maqām Ibrāhīm", ar: "مقام إبراهيم" },
      { en: "Either", ar: "أيّهما" },
    ],
    answer: 1,
    explain_en: "Begin Sa'i at Safa. The Prophet ﷺ recited the verse 'Indeed, Safa and Marwah are among the symbols of Allāh' (Qurʾān 2:158) then said: 'I begin with what Allāh began with.'",
    explain_ar: "ابدأ السّعي من الصّفا. قال النبي ﷺ عند تلاوته «إنّ الصّفا والمروة من شعائر الله»: «أبدأ بما بدأ الله به».",
    source: "Sahih Muslim 1218",
  },
  {
    id: "sai-b-3",
    category: "sai",
    difficulty: "beginner",
    q_en: "What is recommended to do at Safa BEFORE starting Sa'i (only for the first time)?",
    q_ar: "ماذا يُسنّ فعله عند الصّفا قبل بدء السّعي (في المرّة الأولى فقط)؟",
    options: [
      { en: "Pray two rakʿahs",                                  ar: "صلاة ركعتين" },
      { en: "Recite verse 2:158 and say takbīr & tahlīl 3 times", ar: "قراءة الآية ٢:١٥٨ والتّكبير والتّهليل ثلاث مرّات" },
      { en: "Drink Zamzam",                                       ar: "شرب زمزم" },
      { en: "Cut your hair",                                       ar: "حلق الشّعر" },
    ],
    answer: 1,
    explain_en: "At Safa (only on the first trip), face the Kaʿbah, recite Qurʾān 2:158, then say 'Allāhu Akbar' and the tahlīl du'a 3 times with du'a in between.",
    explain_ar: "تَستقبل الكعبة من على الصّفا (في الشّوط الأوّل فقط)، تتلو الآية ٢:١٥٨، ثم تُكبّر الله وتُهلّله وتدعو، ثلاث مرّات.",
    source: "Sahih Muslim 1218",
  },

  // ─── SA'I (Intermediate) ────────────────────────────────────────────
  {
    id: "sai-i-1",
    category: "sai",
    difficulty: "intermediate",
    q_en: "Between which two markers should men jog (run) during Sa'i?",
    q_ar: "بين أيّ علامتين يُسنّ للرّجال الهرولة في السّعي؟",
    options: [
      { en: "Between the start of Safa and the green markers",  ar: "بين بداية الصّفا والعلامتين الخضراوين" },
      { en: "Between the two green markers (the original valley)", ar: "بين العلامتين الخضراوين (مكان الوادي)" },
      { en: "The whole way",                                     ar: "في كامل المسافة" },
      { en: "Only at Marwah",                                    ar: "عند المروة فقط" },
    ],
    answer: 1,
    explain_en: "The original valley where Hājar (AS) ran is now marked by the two green pillars (or green lighting). Men jog briskly between them, walking normally on either side. Women walk normally throughout.",
    explain_ar: "الوادي الذي سعت فيه هاجر عليها السلام معلَّم اليوم بالعلامتين الخضراوين (أو الإضاءة الخضراء). يُسنّ للرّجال الإسراع بينهما، ويمشي على عادته قبلهما وبعدهما. أمّا المرأة فتمشي في الجميع.",
    source: "Sahih al-Bukhari 1648",
  },
  {
    id: "sai-i-2",
    category: "sai",
    difficulty: "intermediate",
    q_en: "Is wuḍūʾ a condition for Sa'i?",
    q_ar: "هل الوضوء شرط للسّعي؟",
    options: [
      { en: "Yes — like Tawaf",     ar: "نعم — مثل الطواف" },
      { en: "No — but recommended", ar: "لا — ولكن يُستحبّ" },
      { en: "Only for the first 3 trips", ar: "فقط في الأشواط الثلاثة الأولى" },
      { en: "Only for women",       ar: "للنّساء فقط" },
    ],
    answer: 1,
    explain_en: "Wuḍūʾ is NOT a condition for Sa'i — but it is recommended. A menstruating woman may perform Sa'i (unlike Tawaf, which requires purity).",
    explain_ar: "الوضوء ليس شرطًا للسّعي بل مستحبّ. ويجوز للحائض أن تسعى (بخلاف الطّواف).",
    source: "Fatāwā al-Lajnah ad-Dāʾimah 11/247",
  },

  // ─── SA'I (Advanced) ─────────────────────────────────────────────────
  {
    id: "sai-a-1",
    category: "sai",
    difficulty: "advanced",
    q_en: "Must Sa'i immediately follow Tawaf?",
    q_ar: "هل يجب أن يكون السّعي عقب الطّواف مباشرة؟",
    options: [
      { en: "Yes — must be done immediately",        ar: "نعم — يجب على الفور" },
      { en: "No — they may be separated by a gap",   ar: "لا — يجوز الفصل بينهما" },
      { en: "Only by 30 minutes",                    ar: "بفاصل ٣٠ دقيقة فقط" },
      { en: "Sa'i must be on a different day",       ar: "السّعي يجب أن يكون في يوم آخر" },
    ],
    answer: 1,
    explain_en: "It is Sunnah and best to perform Sa'i directly after Tawaf, but a separation is permitted (e.g., to rest or to pray a congregational prayer). It must be in the same trip of Umrah.",
    explain_ar: "السّنّة أن يكون السّعي عقب الطواف، لكن يجوز الفصل بينهما (للاستراحة أو لصلاة جماعة). ويُشترط أن يكون في نفس العمرة.",
    source: "Fatāwā Ibn Bāz 17/233",
  },

  // ─── HALQ / TAQSIR ──────────────────────────────────────────────────
  {
    id: "hlq-b-1",
    category: "halq",
    difficulty: "beginner",
    q_en: "After Sa'i in Umrah, what does a man do to exit Ihrām?",
    q_ar: "بعد السّعي في العمرة، ماذا يفعل الرّجل ليتحلّل من الإحرام؟",
    options: [
      { en: "Halq (shave) or Taqsīr (shorten) the hair",       ar: "الحلق أو التّقصير" },
      { en: "Pray two rakʿahs",                                ar: "صلاة ركعتين" },
      { en: "Drink Zamzam",                                    ar: "شرب زمزم" },
      { en: "Sleep",                                           ar: "النّوم" },
    ],
    answer: 0,
    explain_en: "A man exits Ihrām by either shaving (halq) or shortening (taqsīr) all of his hair. Halq is preferred — the Prophet ﷺ supplicated for those who shave 3 times, and for those who shorten only once.",
    explain_ar: "يتحلّل الرّجل بالحلق أو التّقصير لجميع شعر رأسه، والحلق أفضل، وقد دعا النبي ﷺ للمحلّقين ثلاثًا وللمقصّرين مرّة.",
    source: "Sahih al-Bukhari 1727",
  },
  {
    id: "hlq-b-2",
    category: "halq",
    difficulty: "beginner",
    q_en: "What does a woman do to exit Ihrām after Sa'i?",
    q_ar: "ماذا تفعل المرأة لتتحلّل من الإحرام بعد السّعي؟",
    options: [
      { en: "Shave her head completely",                          ar: "تحلق رأسها بالكامل" },
      { en: "Cut a fingertip's length from the ends of her hair", ar: "تقصّ من أطراف شعرها قدر أنملة" },
      { en: "Cut her hair very short",                            ar: "تقصّ شعرها قصيرًا جدًا" },
      { en: "Nothing — she is already free",                       ar: "لا شيء — قد تحلّلت بالفعل" },
    ],
    answer: 1,
    explain_en: "A woman gathers her hair and cuts about a fingertip's length (~2 cm) from the ends. Shaving is forbidden for women.",
    explain_ar: "تجمع المرأة شعرها وتقصّ من أطرافه قدر أنملة (نحو ٢ سم). والحلق محرّم على النّساء.",
    source: "Sunan Abī Dāwūd 1985 (saḥīḥ)",
  },
  {
    id: "hlq-i-1",
    category: "halq",
    difficulty: "intermediate",
    q_en: "If a man has very little hair (e.g., bald), what should he do?",
    q_ar: "إذا كان الرّجل لا شعر له (أصلع)، فماذا يفعل؟",
    options: [
      { en: "Skip Halq — no need",                                  ar: "يترك الحلق — لا داعي" },
      { en: "Pass a razor over his head",                            ar: "يُمرّر الموسى على رأسه" },
      { en: "Pay a damm",                                            ar: "يدفع دمًا" },
      { en: "Cut his beard instead",                                  ar: "يحلق لحيته بدلًا" },
    ],
    answer: 1,
    explain_en: "If a man has no hair, he should still pass a razor over his head as a symbolic act, fulfilling the Sunnah.",
    explain_ar: "إذا لم يكن للرّجل شعر، فإنّه يُمرّر الموسى على رأسه تشبّهًا بالمتحلّلين.",
    source: "al-Mughnī 5/304 (Ibn Qudāmah)",
  },

  // ─── GENERAL ────────────────────────────────────────────────────────
  {
    id: "gen-b-1",
    category: "general",
    difficulty: "beginner",
    q_en: "What is the meaning of 'ʿUmrah' linguistically?",
    q_ar: "ما معنى «العُمرة» لغةً؟",
    options: [
      { en: "Visit",         ar: "الزّيارة" },
      { en: "Sacrifice",     ar: "الذّبح" },
      { en: "Forgiveness",    ar: "المغفرة" },
      { en: "Migration",     ar: "الهجرة" },
    ],
    answer: 0,
    explain_en: "Linguistically 'ʿUmrah' means 'a visit'. Religiously: visiting the Sacred House to perform Tawaf and Sa'i, then exiting Ihrām.",
    explain_ar: "العُمرة لغةً: الزّيارة. وشرعًا: زيارة البيت الحرام للطّواف والسّعي ثم التّحلّل.",
    source: "Lisān al-ʿArab",
  },
  {
    id: "gen-b-2",
    category: "general",
    difficulty: "beginner",
    q_en: "What does the Prophet ﷺ say about ʿUmrah to ʿUmrah?",
    q_ar: "ماذا قال النبي ﷺ عن العمرة إلى العمرة؟",
    options: [
      { en: "Equal to one prayer",                                ar: "تعدل صلاة واحدة" },
      { en: "It is an expiation for what is between them",         ar: "كفّارة لما بينهما" },
      { en: "Only valid in Ramadan",                                ar: "صحيحة في رمضان فقط" },
      { en: "It is not obligatory",                                 ar: "ليست واجبة" },
    ],
    answer: 1,
    explain_en: "The Prophet ﷺ said: 'ʿUmrah to ʿUmrah is an expiation for what is between them, and an accepted Hajj has no reward except Paradise.'",
    explain_ar: "قال النبي ﷺ: «العمرة إلى العمرة كفّارة لما بينهما، والحجّ المبرور ليس له جزاء إلّا الجنّة».",
    source: "Sahih al-Bukhari 1773; Sahih Muslim 1349",
  },
  {
    id: "gen-i-1",
    category: "general",
    difficulty: "intermediate",
    q_en: "What is special about ʿUmrah performed in Ramadan?",
    q_ar: "ما الفضل الخاصّ بعمرة رمضان؟",
    options: [
      { en: "It is obligatory",                                    ar: "واجبة" },
      { en: "It equals Hajj in reward",                              ar: "تعدل حجّة في الأجر" },
      { en: "It is invalid outside Ramadan",                          ar: "لا تصحّ في غير رمضان" },
      { en: "It does not require Mīqāt",                              ar: "لا تحتاج ميقات" },
    ],
    answer: 1,
    explain_en: "The Prophet ﷺ said: 'ʿUmrah in Ramadan equals a Hajj' (in reward, not in replacing the obligatory Hajj). It is a tremendous virtue.",
    explain_ar: "قال النبي ﷺ: «عمرة في رمضان تعدل حجّة» — أي في الأجر، لا في إسقاط فريضة الحج.",
    source: "Sahih al-Bukhari 1782; Sahih Muslim 1256",
  },
  {
    id: "gen-i-2",
    category: "general",
    difficulty: "intermediate",
    q_en: "Can a person perform ʿUmrah on behalf of a deceased parent?",
    q_ar: "هل يجوز أن يعتمر الإنسان عن والديه المتوفّيين؟",
    options: [
      { en: "No — never",                                          ar: "لا — مطلقًا" },
      { en: "Yes — but only after performing it for himself first", ar: "نعم — بشرط أن يكون قد اعتمر عن نفسه أوّلًا" },
      { en: "Only sons can do this",                                ar: "للأبناء الذكور فقط" },
      { en: "Only on a Friday",                                     ar: "في يوم الجمعة فقط" },
    ],
    answer: 1,
    explain_en: "Yes — performing ʿUmrah on behalf of a deceased (or unable) Muslim is permitted, with the condition that the performer has first completed ʿUmrah/Hajj for themselves. The Prophet ﷺ approved this in the hadith of Shubrumah.",
    explain_ar: "نعم — يجوز الإحجاج والاعتمار عن الميّت أو العاجز، بشرط أن يكون المعتمر قد أدّى عن نفسه أوّلًا. ودلّ على ذلك حديث شُبرُمة.",
    source: "Sunan Abī Dāwūd 1811 (saḥīḥ)",
  },
  {
    id: "gen-a-1",
    category: "general",
    difficulty: "advanced",
    q_en: "What is the ruling on a menstruating woman entering Ihrām for ʿUmrah?",
    q_ar: "ما حكم إحرام الحائض للعمرة؟",
    options: [
      { en: "Forbidden — wait until pure",                          ar: "ممنوع — تنتظر الطّهر" },
      { en: "Permitted — she enters Ihrām, but waits to perform Tawaf until she is pure", ar: "جائز — تُحرم وتنتظر للطّواف حتى تطهر" },
      { en: "She offers a damm and skips Tawaf",                     ar: "تدفع دمًا وتترك الطّواف" },
      { en: "Only if she is married",                                ar: "فقط إذا كانت متزوّجة" },
    ],
    answer: 1,
    explain_en: "She enters Ihrām (Ihrām is valid for her), and waits until she is ritually pure to perform Tawaf. The Prophet ﷺ told ʿĀʾishah (RA), who was menstruating: 'Do everything the pilgrim does except do not perform Tawaf until you are pure.'",
    explain_ar: "تُحرم (الإحرام صحيح منها) وتنتظر حتى تطهر فتطوف. قال النبي ﷺ لعائشة رضي الله عنها وهي حائض: «اصنعي ما يصنع الحاجّ غير ألّا تطوفي بالبيت حتى تطهري».",
    source: "Sahih al-Bukhari 305",
  },
  {
    id: "gen-a-2",
    category: "general",
    difficulty: "advanced",
    q_en: "How many ʿUmrahs did the Prophet ﷺ perform in his lifetime?",
    q_ar: "كم اعتمر النبي ﷺ في حياته؟",
    options: [
      { en: "One",   ar: "مرّة واحدة" },
      { en: "Two",   ar: "مرّتان" },
      { en: "Four",  ar: "أربع مرّات" },
      { en: "Seven", ar: "سبع مرّات" },
    ],
    answer: 2,
    explain_en: "The Prophet ﷺ performed FOUR ʿUmrahs, all in Dhū-l-Qaʿdah: ʿUmrat al-Ḥudaybiyah (which he was prevented from completing), ʿUmrat al-Qaḍāʾ, ʿUmrah from al-Jiʿrānah, and the ʿUmrah included in his Farewell Hajj.",
    explain_ar: "اعتمر النبي ﷺ أربع عُمَر، كلّها في ذي القعدة: عمرة الحُديبية (التي صُدّ عنها)، وعمرة القضاء، وعمرة الجِعرانة، وعمرته مع حجّة الوداع.",
    source: "Sahih al-Bukhari 1778; Sahih Muslim 1253",
  },
  {
    id: "gen-i-3",
    category: "general",
    difficulty: "intermediate",
    q_en: "Which of these is NOT an obligation (rukn) of ʿUmrah?",
    q_ar: "أيّ ممّا يلي ليس ركنًا في العمرة؟",
    options: [
      { en: "Ihrām",         ar: "الإحرام" },
      { en: "Tawaf",         ar: "الطواف" },
      { en: "Sa'i",          ar: "السّعي" },
      { en: "Drinking Zamzam", ar: "شرب ماء زمزم" },
    ],
    answer: 3,
    explain_en: "The arkān (pillars) of ʿUmrah are: Ihrām, Tawaf, Sa'i, and Halq/Taqsīr (according to some scholars Halq is wājib, not a rukn). Drinking Zamzam is recommended (sunnah), not an obligation.",
    explain_ar: "أركان العمرة: الإحرام، الطّواف، السّعي، والحلق أو التّقصير (واختلف فيه: ركن أم واجب). أمّا شرب زمزم فسنّة لا ركن.",
    source: "al-Mughnī 5/220",
  },
];

// Helper: shuffle an array (Fisher-Yates) — used to randomise quiz order
export function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Pick N questions for a quiz round, optionally filtered by category/difficulty.
export function pickQuestions({ count = 10, category = null, difficulty = null } = {}) {
  let pool = QUIZ_QUESTIONS;
  if (category) pool = pool.filter((q) => q.category === category);
  if (difficulty) pool = pool.filter((q) => q.difficulty === difficulty);
  return shuffle(pool).slice(0, Math.min(count, pool.length));
}
