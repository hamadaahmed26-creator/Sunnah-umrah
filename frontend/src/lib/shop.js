// Curated affiliate products for the Sunnah Umrah Shop.
//
// Affiliate tags resolve from REACT_APP_* env vars at build time, so the same
// codebase works in dev (no tags = clean URLs) and production (with tags
// appended). When a tag is missing the link is still functional — the user
// just lands on Amazon/Booking/etc. and you earn nothing on that click.
//
// Curation rules (all products MUST satisfy ALL):
//   1. Genuinely useful to a pilgrim (no random affiliate junk)
//   2. Halal-friendly (no haram product placements)
//   3. Reviewed positively by Muslim customers (where checkable)
//   4. Available on Amazon UK or major Saudi-relevant store (so links work
//      for the largest portion of the audience)

const AMZ_TAG = process.env.REACT_APP_AMAZON_TAG || ""; // e.g. sunnahumrah-21
const AIRALO_REF = process.env.REACT_APP_AIRALO_REF || "";
const SKYSCANNER_TAG = process.env.REACT_APP_SKYSCANNER_TAG || ""; // ranid

// Build an Amazon UK URL with the affiliate tag attached.
function amzUk(asin) {
  const base = `https://www.amazon.co.uk/dp/${asin}`;
  return AMZ_TAG ? `${base}?tag=${AMZ_TAG}` : base;
}

// Skyscanner — for now we deep-link to the search page; once approved by
// Travelpayouts/Skyscanner partner, swap in the partnered URL pattern.
function skySearch(from = "LOND", to = "JED") {
  const base = `https://www.skyscanner.net/transport/flights/${from}/${to}/`;
  return SKYSCANNER_TAG ? `${base}?associateid=${SKYSCANNER_TAG}` : base;
}

export const SHOP_CATEGORIES = [
  { id: "ihram",   icon_emoji: "🕋", label_en: "Ihram & travel kit", label_ar: "إحرام ومستلزمات السّفر" },
  { id: "books",   icon_emoji: "📚", label_en: "Islamic books",       label_ar: "الكتب الإسلاميّة" },
  { id: "food",    icon_emoji: "🍯", label_en: "Halal food kit",       label_ar: "أطعمة حلال" },
  { id: "hotels",  icon_emoji: "🏨", label_en: "Hotels",                label_ar: "الفنادق" },
  { id: "flights", icon_emoji: "✈️", label_en: "Flights",              label_ar: "الطّيران" },
  { id: "esim",    icon_emoji: "🌐", label_en: "Saudi eSIM",            label_ar: "شريحة سعوديّة" },
];

// Each product:
//   id, category, name_en/ar, desc_en/ar, price (numeric GBP, optional),
//   currency (defaults to GBP), url, source ("amazon" | "booking" | "airalo" | "skyscanner"),
//   curated (always true for shop items — drives the trust badge).
export const SHOP_PRODUCTS = [
  // ─── Ihram & travel ─────────────────────────────────────────────
  {
    id: "ihram-set-mens",
    category: "ihram",
    name_en: "Men's Ihram set (2-piece, soft cotton)",
    name_ar: "إحرام رجالي (قطعتان، قطن ناعم)",
    desc_en: "Two-piece izār + ridāʾ in soft, breathable white cotton — comfortable for hot weather, fast-drying.",
    desc_ar: "قطعتان (إزار + رداء) من قطن أبيض ناعم خفيف، مناسب للحرارة وسريع الجفاف.",
    price: 22.99,
    url: amzUk("B07NRSPJX1"),
    source: "amazon",
  },
  {
    id: "ihram-belt",
    category: "ihram",
    name_en: "Ihram belt with pockets",
    name_ar: "حزام إحرام بجيوب",
    desc_en: "Secure pocket belt to hold passport, hotel key, and money safely under your iḥrām cloth.",
    desc_ar: "حزام بجيوب لحفظ جواز السّفر ومفتاح الفندق والمال بأمان تحت ثوب الإحرام.",
    price: 12.99,
    url: amzUk("B0BG5WS1FX"),
    source: "amazon",
  },
  {
    id: "prayer-mat-pocket",
    category: "ihram",
    name_en: "Pocket prayer mat (waterproof)",
    name_ar: "سجّادة جيب (مقاومة للماء)",
    desc_en: "Lightweight, foldable prayer mat — perfect for praying in the courtyard, at the airport, or in the hotel.",
    desc_ar: "سجّادة خفيفة قابلة للطّيّ، مناسبة للصّلاة في صحن الحرم أو المطار أو الفندق.",
    price: 8.99,
    url: amzUk("B08XPMG2QV"),
    source: "amazon",
  },
  {
    id: "miswak-pack",
    category: "ihram",
    name_en: "Miswak pack (Sunnah-approved)",
    name_ar: "مسواك (سواك)",
    desc_en: "Natural Salvadora persica miswak — the Sunnah of cleaning teeth before every prayer. Pack of 5.",
    desc_ar: "مسواك طبيعي من شجرة الأراك، سنّة قبل كلّ صلاة. عبوة من ٥.",
    price: 5.99,
    url: amzUk("B07BF1V47G"),
    source: "amazon",
  },
  {
    id: "zamzam-bottle",
    category: "ihram",
    name_en: "Zamzam carry bottle (5L food-safe)",
    name_ar: "قارورة زمزم (٥ لتر آمنة للطّعام)",
    desc_en: "Sealed 5-litre container designed for airline check-in to carry Zamzam water home safely.",
    desc_ar: "حاوية محكمة سعة ٥ لتر، مصمّمة لشحن ماء زمزم في الطّيران بأمان.",
    price: 14.99,
    url: amzUk("B07RJPB8HN"),
    source: "amazon",
  },
  {
    id: "rihla-bag",
    category: "ihram",
    name_en: "Pilgrim travel backpack (carry-on)",
    name_ar: "حقيبة ظهر للحاجّ (محمولة)",
    desc_en: "Durable 35-litre backpack sized for cabin luggage — fits iḥrām, prayer mat, Zamzam bottle, and essentials.",
    desc_ar: "حقيبة ظهر متينة سعة ٣٥ لترًا بحجم الكابينة — تتّسع للإحرام والسّجّادة وقارورة زمزم والأساسيّات.",
    price: 39.99,
    url: amzUk("B08KH53NTL"),
    source: "amazon",
  },

  // ─── Islamic books ──────────────────────────────────────────────
  {
    id: "hisn-al-muslim",
    category: "books",
    name_en: "Ḥiṣn al-Muslim (Fortress of the Muslim)",
    name_ar: "حصن المسلم",
    desc_en: "Pocket-sized authentic du'as for every situation — by Saʿīd ibn ʿAlī al-Qaḥṭānī (raḥimahullāh). Essential for every pilgrim.",
    desc_ar: "كتاب أدعية صحيحة لكلّ مناسبة، تأليف الشّيخ سعيد بن علي القحطاني رحمه الله. ضروري لكلّ معتمر.",
    price: 4.99,
    url: amzUk("B07Q8RNTF8"),
    source: "amazon",
  },
  {
    id: "manasik-albani",
    category: "books",
    name_en: "Manāsik al-Ḥajj wal-ʿUmrah — Shaykh al-Albānī",
    name_ar: "مناسك الحجّ والعمرة — الشيخ الألباني",
    desc_en: "Concise step-by-step rites of Hajj and Umrah, with strong Sunnah-based references throughout. The classic short manual.",
    desc_ar: "مناسك الحجّ والعمرة بطريقة مختصرة مع التّخريج الصّحيح للأحاديث. مرجع موجز مشهور.",
    price: 7.50,
    url: amzUk("B0BHFDJKJV"),
    source: "amazon",
  },
  {
    id: "bulugh-al-maram",
    category: "books",
    name_en: "Bulūgh al-Marām (Arabic + English)",
    name_ar: "بلوغ المرام (عربي + إنجليزي)",
    desc_en: "Ḥāfiẓ Ibn Ḥajar's classic compilation of fiqh hadiths — a study companion for understanding Umrah-related rulings.",
    desc_ar: "مجموع الحافظ ابن حجر للأحاديث الفقهيّة، مرجع للأحكام المتعلّقة بالعمرة.",
    price: 14.99,
    url: amzUk("B0789ZTQ1H"),
    source: "amazon",
  },
  {
    id: "riyadh-saliheen",
    category: "books",
    name_en: "Riyāḍ aṣ-Ṣāliḥīn (Gardens of the Righteous)",
    name_ar: "رياض الصالحين",
    desc_en: "Imām an-Nawawī's 1,896-hadith compilation on character, worship, and du'a — companion reading on long flights.",
    desc_ar: "كتاب الإمام النّووي (١٨٩٦ حديثًا) في الأخلاق والعبادة والدّعاء — صحبةٌ ممتازة في الرّحلات الطّويلة.",
    price: 16.99,
    url: amzUk("B07KQF2MKH"),
    source: "amazon",
  },
  {
    id: "tafsir-as-sadi",
    category: "books",
    name_en: "Tafsīr as-Saʿdī (Concise Qur'an Tafsīr)",
    name_ar: "تيسير الكريم الرّحمن — السّعدي",
    desc_en: "Shaykh ʿAbd ar-Raḥmān as-Saʿdī's clear, easy-to-read tafsīr of the Qur'an. A fantastic introduction.",
    desc_ar: "تفسير الشيخ عبد الرّحمن السّعدي رحمه الله — واضح، سهل، مدخل ممتاز للفهم.",
    price: 19.99,
    url: amzUk("B083RTFP15"),
    source: "amazon",
  },

  // ─── Halal food kit ──────────────────────────────────────────────
  {
    id: "sidr-honey",
    category: "food",
    name_en: "Yemeni Sidr honey (raw)",
    name_ar: "عسل سدر يمني خام",
    desc_en: "Premium raw Sidr honey — the Sunnah remedy mentioned in the Qur'an and ahadith. Excellent gift to bring home.",
    desc_ar: "عسل سدر خام فاخر — من الشّفاء المذكور في القرآن والسنّة. هديّة مميّزة.",
    price: 24.99,
    url: amzUk("B08BP6CDLM"),
    source: "amazon",
  },
  {
    id: "ajwa-dates",
    category: "food",
    name_en: "Ajwa dates of Madīnah (500g)",
    name_ar: "تمر العجوة المدني (٥٠٠ جم)",
    desc_en: "The dates the Prophet ﷺ praised: 'Whoever eats seven Ajwa dates in the morning, no poison or sorcery will harm him that day.' (Bukhari)",
    desc_ar: "قال النبي ﷺ: «من تصبّح بسبع تمرات عجوة لم يضرّه ذلك اليوم سمّ ولا سحر». (البخاري)",
    price: 13.99,
    url: amzUk("B07CWJM5B5"),
    source: "amazon",
  },
  {
    id: "barakah-zaytun-oil",
    category: "food",
    name_en: "Cold-pressed Palestinian olive oil",
    name_ar: "زيت زيتون فلسطيني بكر بارد",
    desc_en: "The blessed tree mentioned in Sūrat al-Nūr. Premium 500ml bottle — for cooking and the Sunnah of using it on hair.",
    desc_ar: "الشّجرة المباركة المذكورة في سورة النّور. زجاجة فاخرة ٥٠٠ مل — للطّهي وللسنّة باستعماله للشّعر.",
    price: 14.99,
    url: amzUk("B08H1V6Y9P"),
    source: "amazon",
  },
  {
    id: "black-seed-oil",
    category: "food",
    name_en: "Habba sawda (black seed) oil",
    name_ar: "زيت الحبّة السّوداء",
    desc_en: "The Prophet ﷺ said: 'In the black seed there is healing for every disease except death.' (Bukhari) Cold-pressed, 100ml.",
    desc_ar: "قال النبي ﷺ: «إنّ في الحبّة السّوداء شفاءً من كلّ داء إلّا السّام». (البخاري) معصور بارد، ١٠٠ مل.",
    price: 9.99,
    url: amzUk("B0875D5ZVF"),
    source: "amazon",
  },

  // ─── Hotels ───────────────────────────────────────────────────────
  {
    id: "booking-makkah",
    category: "hotels",
    name_en: "Hotels near Masjid al-Ḥaram",
    name_ar: "فنادق قرب المسجد الحرام",
    desc_en: "Browse and book hotels in Makkah with prices, photos, and reviews — sorted by distance from the Ḥaram.",
    desc_ar: "تصفّح واحجز فنادق مكّة بالأسعار والصّور والتّقييمات — مرتّبة بالمسافة من الحرم.",
    url: "/hotels",
    internal: true,
    source: "booking",
  },
  {
    id: "booking-madinah",
    category: "hotels",
    name_en: "Hotels near Masjid an-Nabawī",
    name_ar: "فنادق قرب المسجد النّبوي",
    desc_en: "Browse and book hotels in Madīnah with prices, photos, and reviews — sorted by distance from the Masjid.",
    desc_ar: "تصفّح واحجز فنادق المدينة بالأسعار والصّور والتّقييمات — مرتّبة بالمسافة من المسجد.",
    url: "/hotels",
    internal: true,
    source: "booking",
  },

  // ─── Flights ──────────────────────────────────────────────────────
  {
    id: "flight-london-jeddah",
    category: "flights",
    name_en: "London → Jeddah (JED)",
    name_ar: "لندن → جدّة",
    desc_en: "Compare hundreds of airlines for flights to Jeddah, the gateway to Makkah. Direct & multi-stop options.",
    desc_ar: "قارن مئات شركات الطّيران للسّفر إلى جدّة، البوّابة إلى مكّة. رحلات مباشرة ومتعدّدة التّوقّفات.",
    url: skySearch("LOND", "JED"),
    source: "skyscanner",
  },
  {
    id: "flight-london-medina",
    category: "flights",
    name_en: "London → Madīnah (MED)",
    name_ar: "لندن → المدينة",
    desc_en: "Direct flights to Prince Mohammad bin Abdulaziz Airport — closest to the Prophet's Masjid.",
    desc_ar: "رحلات إلى مطار الأمير محمد بن عبد العزيز — الأقرب إلى مسجد رسول الله ﷺ.",
    url: skySearch("LOND", "MED"),
    source: "skyscanner",
  },

  // ─── Saudi eSIM ───────────────────────────────────────────────────
  {
    id: "airalo-saudi",
    category: "esim",
    name_en: "Airalo Saudi Arabia eSIM",
    name_ar: "شريحة Airalo للسّعوديّة",
    desc_en: "Instant mobile data in Saudi Arabia. Activate in 2 minutes. From £4 for 1GB / 7 days. No physical SIM swap needed.",
    desc_ar: "بيانات فوريّة في السّعوديّة. تفعيل خلال دقيقتين. من ٤£ لـ١GB لمدّة ٧ أيّام. بدون تبديل شريحة.",
    url: AIRALO_REF
      ? `https://www.airalo.com/saudi-arabia-esim?ref=${AIRALO_REF}`
      : "https://www.airalo.com/saudi-arabia-esim",
    source: "airalo",
  },
];

export function productsByCategory(catId) {
  return SHOP_PRODUCTS.filter((p) => p.category === catId);
}
