// Step-by-step Umrah guide rooted in Sunnah. Concise, with Arabic du'a + transliteration + English meaning.

export const STEPS = [
  {
    id: "ihram",
    title_en: "1. Ihram & Intention",
    title_ar: "١. الإحرام والنية",
    summary_en:
      "At the Miqat, perform Ghusl (or Wudu), wear the two white sheets (men) or modest clothing (women), pray two raka'ah, then make the intention for Umrah.",
    summary_ar:
      "عند الميقات اغتسل أو توضّأ، البس ثوبَي الإحرام (للرجال) أو الثياب الساترة (للنساء)، صلِّ ركعتين ثم انوِ العمرة.",
    dua: {
      ar: "لَبَّيْكَ اللَّهُمَّ عُمْرَةً",
      tr: "Labbayk Allahumma 'Umrah",
      en: "Here I am, O Allah, for Umrah.",
    },
    talbiyah: {
      ar: "لَبَّيْكَ اللَّهُمَّ لَبَّيْكَ، لَبَّيْكَ لاَ شَرِيكَ لَكَ لَبَّيْكَ، إِنَّ الْحَمْدَ وَالنِّعْمَةَ لَكَ وَالْمُلْكَ، لاَ شَرِيكَ لَكَ",
      tr: "Labbayk Allahumma labbayk, labbayka la sharika laka labbayk, innal-hamda wan-ni'mata laka wal-mulk, la sharika lak.",
      en: "Here I am O Allah, here I am. Here I am, You have no partner, here I am. Truly, all praise, favor and dominion are Yours; You have no partner.",
    },
  },
  {
    id: "enter-haram",
    title_en: "2. Enter Masjid al-Haram",
    title_ar: "٢. الدخول إلى المسجد الحرام",
    summary_en:
      "Enter with the right foot, recite the masjid entry du'a. Walk calmly toward the Mataf. On seeing the Ka'bah, raise your hands and make heartfelt du'a.",
    summary_ar:
      "ادخل بقدمك اليمنى وقل دعاء دخول المسجد، ثم توجّه إلى المطاف بسكينة، وعند رؤية الكعبة ارفع يديك وادعُ بما شئت.",
    dua: {
      ar: "بِسْمِ اللهِ، وَالصَّلاَةُ وَالسَّلاَمُ عَلَى رَسُولِ اللهِ، اللَّهُمَّ افْتَحْ لِي أَبْوَابَ رَحْمَتِكَ",
      tr: "Bismillah, was-salatu was-salamu 'ala Rasulillah, Allahumma-ftah li abwaba rahmatik.",
      en: "In the name of Allah, peace and blessings upon the Messenger of Allah. O Allah, open to me the gates of Your mercy.",
    },
  },
  {
    id: "tawaf",
    title_en: "3. Tawaf — 7 Circuits",
    title_ar: "٣. الطواف — سبعة أشواط",
    summary_en:
      "Begin from the Black Stone corner, keep the Ka'bah on your left, and circle 7 times. Men do raml (light jogging) in the first 3. There is no fixed du'a per lap — supplicate freely. Between the Yemeni Corner and Black Stone, recite the du'a of Surah al-Baqarah 2:201.",
    summary_ar:
      "ابدأ من الحجر الأسود، اجعل الكعبة عن يسارك، وطف سبعة أشواط. يستحب للرجال الرَّمَل في الأشواط الثلاثة الأولى. لا دعاء محدّد، ادعُ بما شئت. بين الركن اليماني والحجر الأسود قل دعاء الآية ٢٠١ من البقرة.",
    dua: {
      ar: "رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ",
      tr: "Rabbana atina fid-dunya hasanatan wa fil-akhirati hasanatan wa qina 'adhaban-nar.",
      en: "Our Lord, give us good in this world and good in the Hereafter, and protect us from the punishment of the Fire.",
    },
  },
  {
    id: "two-rakah",
    title_en: "4. Two Raka'ah behind Maqam Ibrahim",
    title_ar: "٤. ركعتان خلف مقام إبراهيم",
    summary_en:
      "After tawaf, pray two short raka'ah behind Maqam Ibrahim if possible (anywhere in the masjid otherwise). Recite Surah al-Kafirun in the first, al-Ikhlas in the second. Then drink Zamzam.",
    summary_ar:
      "بعد الطواف صلّ ركعتين خلف مقام إبراهيم إن تيسّر (وإلا في أي موضع من المسجد). اقرأ في الأولى الكافرون وفي الثانية الإخلاص، ثم اشرب من ماء زمزم.",
    dua: {
      ar: "وَاتَّخِذُوا مِن مَّقَامِ إِبْرَاهِيمَ مُصَلًّى",
      tr: "Wattakhidhu min maqami Ibrahima musalla.",
      en: "And take the Station of Ibrahim as a place of prayer.",
    },
  },
  {
    id: "sai",
    title_en: "5. Sa'i — between Safa and Marwah",
    title_ar: "٥. السعي بين الصفا والمروة",
    summary_en:
      "Climb Safa, face the Ka'bah, recite the verse below and make du'a 3 times. Walk to Marwah (1 trip). Between the green markers, men jog. From Marwah back to Safa is the 2nd trip — total 7 trips ending at Marwah.",
    summary_ar:
      "اصعد على الصفا، استقبل الكعبة، اقرأ الآية ثم ادعُ ثلاث مرات. امشِ إلى المروة (شوط)، وبين العلمين الأخضرين يَهرول الرجال. من المروة إلى الصفا شوط ثانٍ، حتى تكمل سبعة تنتهي بالمروة.",
    dua: {
      ar: "إِنَّ الصَّفَا وَالْمَرْوَةَ مِن شَعَائِرِ اللهِ ۖ أَبْدَأُ بِمَا بَدَأَ اللهُ بِهِ",
      tr: "Inna as-Safa wal-Marwata min sha'a'irillah. Abda'u bima bada'a Allahu bih.",
      en: "Indeed, Safa and Marwah are among the symbols of Allah. I begin with what Allah began with.",
    },
  },
  {
    id: "halq",
    title_en: "6. Halq or Taqsir — Shave or Shorten",
    title_ar: "٦. الحلق أو التقصير",
    summary_en:
      "Men shave the head (halq, preferred) or shorten the hair evenly (taqsir). Women cut a fingertip's length from the ends of their hair. With this, Umrah is complete and Ihram restrictions are lifted.",
    summary_ar:
      "يَحلِق الرجل رأسه (وهو أفضل) أو يُقصّر، وتأخذ المرأة من أطراف شعرها قدر أنملة. بذلك تكتمل العمرة وتنتهي محظورات الإحرام.",
    dua: {
      ar: "اللَّهُمَّ تَقَبَّلْ مِنَّا، إِنَّكَ أَنْتَ السَّمِيعُ الْعَلِيمُ",
      tr: "Allahumma taqabbal minna, innaka antas-Sami'ul-'Alim.",
      en: "O Allah, accept this from us. Indeed You are the All-Hearing, the All-Knowing.",
    },
  },
];
