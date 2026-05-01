// Ramadan reminders — vetted from Salafi sources.
// Sources: Sahih al-Bukhari, Sahih Muslim, Hisn al-Muslim.
//
// Each reminder is a short Sunnah-grounded card shown daily during Ramadan.
// Content is bilingual (EN + AR). The owner (Hamada) MUST review before
// publishing to ensure religious accuracy.

// Approximate Ramadan 1st Gregorian dates for the next several years.
// These can drift by ±1 day depending on moon-sighting locally — we use these
// as a default UI countdown only; the actual fasting start should follow the
// user's local moon-sighting authority.
export const RAMADAN_GREGORIAN_START = {
  1447: "2026-02-17",  // Feb 2026 (current year for the user)
  1448: "2027-02-07",
  1449: "2028-01-27",
  1450: "2029-01-15",
  1451: "2030-01-05",
};

// 30 daily reminders — cycle through them based on the day of Ramadan.
export const RAMADAN_REMINDERS = [
  {
    day: 1,
    title_en: "Welcome, Ramadan",
    title_ar: "مرحبًا يا رمضان",
    body_en: "The Prophet ﷺ said: 'When Ramadan begins, the gates of Paradise are opened, the gates of Hellfire are closed, and the devils are chained.'",
    body_ar: "قال النبي ﷺ: «إذا جاء رمضان فُتّحت أبواب الجنّة، وغُلّقت أبواب النّار، وصُفّدت الشّياطين».",
    source: "Sahih al-Bukhari 1899; Sahih Muslim 1079",
  },
  {
    day: 2,
    title_en: "The Sahūr du'a",
    title_ar: "دعاء السّحور",
    body_en: "Eat sahūr — even a sip of water. The Prophet ﷺ said: 'Eat sahūr, for in sahūr there is barakah.' Renew your niyyah for fasting tonight.",
    body_ar: "تسحّر ولو بشربة ماء. قال النبي ﷺ: «تسحّروا فإنّ في السّحور بركة». واعقد النيّة للصّيام في اللّيل.",
    source: "Sahih al-Bukhari 1923; Sahih Muslim 1095",
  },
  {
    day: 3,
    title_en: "Du'a at iftār",
    title_ar: "الدعاء عند الإفطار",
    body_en: "When you break your fast, the Prophet ﷺ would say: 'Dhahaba-ẓ-ẓamaʾu wa-btallati-l-ʿurūqu wa thabata-l-ajru in shāʾa Allāh' — The thirst is gone, the veins are moistened, and the reward is established, in shāʾa Allāh.",
    body_ar: "كان النبي ﷺ إذا أفطر قال: «ذهب الظّمأ وابتلّت العروق وثبت الأجر إن شاء الله».",
    source: "Sunan Abī Dāwūd 2357 (ḥasan)",
  },
  {
    day: 4,
    title_en: "Hasten to break your fast",
    title_ar: "تعجيل الإفطار",
    body_en: "The Prophet ﷺ said: 'People will continue to be in goodness as long as they hasten to break the fast.' Break with a fresh date or water.",
    body_ar: "قال النبي ﷺ: «لا يزال النّاس بخير ما عجّلوا الفطر». والإفطار على رطب أو ماء.",
    source: "Sahih al-Bukhari 1957",
  },
  {
    day: 5,
    title_en: "Guard your tongue",
    title_ar: "احفظ لسانك",
    body_en: "The Prophet ﷺ said: 'Whoever does not give up false speech and acting upon it — Allāh has no need that he should leave his food and drink.' Fasting is more than abstaining from food.",
    body_ar: "قال النبي ﷺ: «من لم يدع قول الزّور والعمل به فليس لله حاجة في أن يدع طعامه وشرابه».",
    source: "Sahih al-Bukhari 1903",
  },
  {
    day: 6,
    title_en: "Rewards multiplied",
    title_ar: "الأجر مضاعف",
    body_en: "Allāh said in a qudsī hadith: 'Every deed of the son of Adam is for him, except fasting — it is for Me, and I shall reward him for it.' Choose your deeds well today.",
    body_ar: "قال الله في الحديث القدسي: «كلّ عمل ابن آدم له إلّا الصّوم، فإنّه لي وأنا أجزي به». اختر أعمالك بحكمة اليوم.",
    source: "Sahih al-Bukhari 1904; Sahih Muslim 1151",
  },
  {
    day: 7,
    title_en: "The smell of the fasting person",
    title_ar: "خُلوف فم الصّائم",
    body_en: "The Prophet ﷺ said: 'The smell of the fasting person's mouth is sweeter to Allāh than the fragrance of musk.' May Allāh accept from you.",
    body_ar: "قال النبي ﷺ: «لخلوف فم الصّائم أطيب عند الله من ريح المسك». تقبّل الله منك.",
    source: "Sahih al-Bukhari 1894; Sahih Muslim 1151",
  },
  {
    day: 8,
    title_en: "Two joys",
    title_ar: "فرحتان للصّائم",
    body_en: "The Prophet ﷺ said: 'The fasting person has two joys: a joy when he breaks his fast, and a joy when he meets his Lord.'",
    body_ar: "قال النبي ﷺ: «للصّائم فرحتان: فرحة عند فطره، وفرحة عند لقاء ربّه».",
    source: "Sahih Muslim 1151",
  },
  {
    day: 9,
    title_en: "Pray Tarāwīḥ tonight",
    title_ar: "صلّ التراويح اللّيلة",
    body_en: "The Prophet ﷺ said: 'Whoever prays during Ramadan out of faith and seeking reward, his previous sins will be forgiven.' Don't miss it tonight.",
    body_ar: "قال النبي ﷺ: «من قام رمضان إيمانًا واحتسابًا غُفر له ما تقدّم من ذنبه». لا تفوّتها اللّيلة.",
    source: "Sahih al-Bukhari 37; Sahih Muslim 759",
  },
  {
    day: 10,
    title_en: "Charity multiplies",
    title_ar: "الصّدقة تتضاعف",
    body_en: "The Prophet ﷺ was the most generous of people, and he was most generous in Ramadan. Even a smile or a date given is sadaqah today.",
    body_ar: "كان النبي ﷺ أجود النّاس، وكان أجود ما يكون في رمضان. حتى الابتسامة وتمرة تُعطى — صدقة اليوم.",
    source: "Sahih al-Bukhari 6; Sahih Muslim 2308",
  },
  {
    day: 11,
    title_en: "Reading the Qurʾān",
    title_ar: "قراءة القرآن",
    body_en: "Jibrīl (AS) would meet the Prophet ﷺ every night of Ramadan to revise the Qurʾān. Set a daily portion — even one juzʾ — and don't break the chain.",
    body_ar: "كان جبريل عليه السلام يلقى النبي ﷺ كلّ ليلة من رمضان فيُدارسه القرآن. اجعل لنفسك ورِدًا يوميًّا — ولو جزءًا — ولا تقطعه.",
    source: "Sahih al-Bukhari 6",
  },
  {
    day: 12,
    title_en: "Du'a is answered",
    title_ar: "دعاء الصّائم مستجاب",
    body_en: "The Prophet ﷺ said: 'Three du'as are not rejected: the du'a of the fasting person, the just leader, and the oppressed.' Use the moments before iftār.",
    body_ar: "قال النبي ﷺ: «ثلاثة لا تُردّ دعوتهم: الصّائم حتى يفطر، والإمام العادل، ودعوة المظلوم». استثمر اللحظات قبل الإفطار.",
    source: "Sunan al-Tirmidhi 3598 (ḥasan)",
  },
  {
    day: 13,
    title_en: "Forgiveness and mercy",
    title_ar: "اسأل المغفرة والرّحمة",
    body_en: "ʿĀʾishah (RA) asked: 'O Messenger of Allāh, if I find Laylatu-l-Qadr, what shall I say?' He ﷺ said: 'Say: Allāhumma innaka ʿAfuwwun tuḥibbu-l-ʿafwa fa-ʿfu ʿannī.'",
    body_ar: "سألت عائشة رضي الله عنها: يا رسول الله، إن وافقتُ ليلة القدر، ماذا أقول؟ قال ﷺ: «قولي: اللهم إنّك عفوّ تحبّ العفو فاعفُ عنّي».",
    source: "Sunan al-Tirmidhi 3513 (saḥīḥ)",
  },
  {
    day: 14,
    title_en: "Halfway there",
    title_ar: "منتصف الشّهر",
    body_en: "Half of Ramadan has passed. Don't let the second half pass without the gift of forgiveness. Ask Allāh sincerely now.",
    body_ar: "مضى نصف الشّهر. لا تدع النّصف الثاني يمرّ بلا مغفرة. اسأل الله مخلصًا الآن.",
    source: "—",
  },
  {
    day: 15,
    title_en: "Repent and return",
    title_ar: "تُب وارجع",
    body_en: "The Prophet ﷺ said: 'Allāh extends His Hand at night so that those who sinned during the day may repent, and extends His Hand during the day so that those who sinned at night may repent.' (Sahih Muslim)",
    body_ar: "قال النبي ﷺ: «إنّ الله يبسط يده باللّيل ليتوب مسيء النّهار، ويبسط يده بالنّهار ليتوب مسيء اللّيل».",
    source: "Sahih Muslim 2759",
  },
  {
    day: 16,
    title_en: "Family iftār",
    title_ar: "إفطار الأهل",
    body_en: "The Prophet ﷺ said: 'Whoever feeds a fasting person, he will have a reward similar to his, without any decrease in the fasting person's reward.' Invite someone tonight.",
    body_ar: "قال النبي ﷺ: «من فطّر صائمًا كان له مثل أجره، غير أنّه لا ينقص من أجر الصّائم شيء». ادعُ أحدًا اللّيلة.",
    source: "Sunan al-Tirmidhi 807 (saḥīḥ)",
  },
  {
    day: 17,
    title_en: "Battle of Badr",
    title_ar: "غزوة بدر",
    body_en: "On the 17th of Ramadan in 2 AH, Allāh granted victory to the Muslims at Badr. Reflect on the trials the early Muslims endured for this Dīn.",
    body_ar: "في السّابع عشر من رمضان عام ٢ هـ، نصر الله المسلمين في بدر. تفكّر في صبر الصحابة على هذا الدّين.",
    source: "Tārīkh al-Ṭabarī",
  },
  {
    day: 18,
    title_en: "ʿUmrah in Ramadan",
    title_ar: "عمرة في رمضان",
    body_en: "The Prophet ﷺ said: 'ʿUmrah in Ramadan equals a Hajj' — in reward, not in obligation. If Allāh has made it easy, take the chance.",
    body_ar: "قال النبي ﷺ: «عمرة في رمضان تعدل حجّة» — أي في الأجر لا في الفريضة. إن يسّر الله، فاغتنمها.",
    source: "Sahih al-Bukhari 1782",
  },
  {
    day: 19,
    title_en: "The first odd night",
    title_ar: "أوّل ليلة وتر",
    body_en: "Tonight is the 19th — the first ODD night of the last 10. Laylatu-l-Qadr is in these nights. Pray, supplicate, and stand.",
    body_ar: "اللّيلة هي التّاسعة عشرة — أوّل ليالي العشر الأواخر الوتريّة. ليلة القدر فيها. صلّ، وادعُ، وقم.",
    source: "Sahih al-Bukhari 2017",
  },
  {
    day: 20,
    title_en: "The last 10",
    title_ar: "العشر الأواخر",
    body_en: "ʿĀʾishah (RA) said: 'When the last 10 nights of Ramadan came, the Prophet ﷺ would tighten his waist-belt, stay awake at night, and wake his family.' (i.e., he intensified worship.)",
    body_ar: "قالت عائشة رضي الله عنها: «كان النبي ﷺ إذا دخل العشر شدّ مئزره وأحيا ليله وأيقظ أهله».",
    source: "Sahih al-Bukhari 2024; Sahih Muslim 1174",
  },
  {
    day: 21,
    title_en: "Laylatu-l-Qadr — odd night",
    title_ar: "ليلة القدر — ليلة وتر",
    body_en: "Tonight may be Laylatu-l-Qadr. Worship in it is better than 1,000 months. Recite: Allāhumma innaka ʿAfuwwun tuḥibbu-l-ʿafwa fa-ʿfu ʿannī.",
    body_ar: "قد تكون هذه ليلة القدر. العبادة فيها خير من ألف شهر. ردّد: «اللهم إنّك عفوّ تحبّ العفو فاعفُ عنّي».",
    source: "Qurʾān 97:3",
  },
  {
    day: 22,
    title_en: "Nights of forgiveness",
    title_ar: "ليالي المغفرة",
    body_en: "The Prophet ﷺ said: 'Whoever stands (in prayer) on Laylatu-l-Qadr out of faith and seeking reward, his previous sins are forgiven.'",
    body_ar: "قال النبي ﷺ: «من قام ليلة القدر إيمانًا واحتسابًا غُفر له ما تقدّم من ذنبه».",
    source: "Sahih al-Bukhari 1901",
  },
  {
    day: 23,
    title_en: "Odd night",
    title_ar: "ليلة وتر",
    body_en: "Tonight is the 23rd — another odd night. Don't let exhaustion stop you. The Prophet ﷺ stood until his feet swelled out of gratitude.",
    body_ar: "اللّيلة هي الثّالثة والعشرون — ليلة وتر. لا يصرفك التّعب. كان النبي ﷺ يقوم حتى تتفطّر قدماه شكرًا.",
    source: "Sahih al-Bukhari 4837",
  },
  {
    day: 24,
    title_en: "Iʿtikāf",
    title_ar: "الاعتكاف",
    body_en: "The Prophet ﷺ would observe iʿtikāf in the last 10 nights. Even if you can't do full iʿtikāf, dedicate longer hours to the masjid this week.",
    body_ar: "كان النبي ﷺ يعتكف في العشر الأواخر. وإن لم تستطع الاعتكاف، فأطل المكوث في المسجد هذا الأسبوع.",
    source: "Sahih al-Bukhari 2026",
  },
  {
    day: 25,
    title_en: "Odd night",
    title_ar: "ليلة وتر",
    body_en: "Tonight is the 25th. Spend on those in need — the Prophet ﷺ described himself as 'more generous than the unleashed wind' in Ramadan.",
    body_ar: "اللّيلة هي الخامسة والعشرون. أنفق على المحتاجين — وُصف النبي ﷺ بأنّه «أجود من الرّيح المرسلة» في رمضان.",
    source: "Sahih al-Bukhari 6",
  },
  {
    day: 26,
    title_en: "Du'a list",
    title_ar: "قائمة الدّعاء",
    body_en: "Write a list of your most important du'as — for parents, for children, for guidance, for ease in this world and the next. Recite them tonight.",
    body_ar: "اكتب قائمة بأهمّ ما تدعو به — للوالدين، للأبناء، للهداية، لخير الدّنيا والآخرة. وادعُ بها اللّيلة.",
    source: "—",
  },
  {
    day: 27,
    title_en: "Possibly THE night",
    title_ar: "ربّما هي اللّيلة",
    body_en: "Many of the Companions held that Laylatu-l-Qadr is most likely the 27th. Stand the entire night if you can. The reward is beyond imagination.",
    body_ar: "ذهب كثير من الصحابة إلى أنّ ليلة القدر هي السّابعة والعشرون. قم ما استطعت اللّيلة. الأجر يفوق التّصوّر.",
    source: "Sahih Muslim 762",
  },
  {
    day: 28,
    title_en: "Zakāt al-Fiṭr",
    title_ar: "زكاة الفطر",
    body_en: "Zakāt al-Fiṭr is obligatory on every Muslim — male, female, child, adult — equal to one ṣāʿ (~2.5 kg) of food per person. Pay it before the ʿĪd prayer.",
    body_ar: "زكاة الفطر فرض على كلّ مسلم — ذكر وأنثى، صغير وكبير — صاعًا (نحو ٢.٥ كغ) من الطّعام. أدّها قبل صلاة العيد.",
    source: "Sahih al-Bukhari 1503",
  },
  {
    day: 29,
    title_en: "Final pleas",
    title_ar: "آخر الرّجاء",
    body_en: "The night may be the last of Ramadan. Make sincere du'a — perhaps Allāh has decreed your forgiveness in this very moment.",
    body_ar: "قد تكون هذه آخر ليلة من رمضان. ادعُ مخلصًا — لعلّ الله قد قدّر مغفرتك في هذه اللّحظة بالذّات.",
    source: "—",
  },
  {
    day: 30,
    title_en: "Farewell, Ramadan",
    title_ar: "وداعًا يا رمضان",
    body_en: "May Allāh accept your fasting, your prayers, and your du'as — taqabbalAllāhu minnā wa minkum. Carry the discipline of Ramadan into the year ahead.",
    body_ar: "تقبّل الله منّا ومنكم صيامنا وقيامنا ودعاءنا. واحمل أثر رمضان معك سائر العام.",
    source: "—",
  },
];

// Compute days until Ramadan begins (or the day-of-Ramadan if currently in it)
export function ramadanStatus(now = new Date()) {
  const today = new Date(now);
  today.setHours(0, 0, 0, 0);
  // Find the next or current Ramadan
  for (const [hijriYear, gregStart] of Object.entries(RAMADAN_GREGORIAN_START)) {
    const start = new Date(gregStart + "T00:00:00");
    const end = new Date(start);
    end.setDate(end.getDate() + 30); // ~30-day Ramadan
    if (today >= start && today < end) {
      const dayOfMonth = Math.floor((today - start) / 86400000) + 1;
      return { state: "during", hijriYear: parseInt(hijriYear, 10), day: dayOfMonth, start };
    }
    if (today < start) {
      const daysUntil = Math.ceil((start - today) / 86400000);
      return { state: "upcoming", hijriYear: parseInt(hijriYear, 10), daysUntil, start };
    }
  }
  return { state: "unknown" };
}

export function reminderForDay(day) {
  return RAMADAN_REMINDERS.find((r) => r.day === day) ||
         RAMADAN_REMINDERS[(day - 1) % RAMADAN_REMINDERS.length];
}
