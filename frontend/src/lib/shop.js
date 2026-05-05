// Curated affiliate products for the Sunnah Umrah Shop.
//
// We use Amazon SEARCH URLs (not direct ASINs) so links never 404 — Amazon
// ranks the best in-stock products first, and commission still attributes
// to our `sunnahumrah-21` tag for anything purchased in the same session
// (24-hour cookie window).
//
// Curation rules:
//   1. Genuinely useful to a pilgrim
//   2. Halal-friendly
//   3. Available on Amazon UK
//   4. The search query is specific enough that the top results are good

import { amazonUkSearch } from "./affiliate";

export const SHOP_CATEGORIES = [
  { id: "ihram",   icon_emoji: "🕋", label_en: "Ihram & travel kit", label_ar: "إحرام ومستلزمات السّفر" },
  { id: "books",   icon_emoji: "📚", label_en: "Islamic books",       label_ar: "الكتب الإسلاميّة" },
  { id: "food",    icon_emoji: "🍯", label_en: "Halal food kit",       label_ar: "أطعمة حلال" },
];

// `query` is what we search Amazon UK for. Tuned so the first results are
// the best fit — verified by spot-checking each query on amazon.co.uk.
export const SHOP_PRODUCTS = [
  // ─── Ihram & travel ─────────────────────────────────────────────
  {
    id: "ihram-set-mens",
    category: "ihram",
    name_en: "Men's Ihram set (2-piece, soft cotton)",
    name_ar: "إحرام رجالي (قطعتان، قطن ناعم)",
    desc_en: "Two-piece izār + ridāʾ in soft, breathable white cotton — comfortable for hot weather, fast-drying.",
    desc_ar: "قطعتان (إزار + رداء) من قطن أبيض ناعم خفيف، مناسب للحرارة وسريع الجفاف.",
    url: amazonUkSearch("ihram set mens 2 piece cotton"),
    source: "amazon",
    tag: "before",
  },
  {
    id: "ihram-belt",
    category: "ihram",
    name_en: "Ihram belt with pockets",
    name_ar: "حزام إحرام بجيوب",
    desc_en: "Secure pocket belt to hold passport, hotel key, and money safely under your iḥrām cloth.",
    desc_ar: "حزام بجيوب لحفظ جواز السّفر ومفتاح الفندق والمال بأمان تحت ثوب الإحرام.",
    url: amazonUkSearch("ihram belt pocket hajj money"),
    source: "amazon",
    tag: "before",
  },
  {
    id: "prayer-mat-pocket",
    category: "ihram",
    name_en: "Pocket prayer mat (waterproof)",
    name_ar: "سجّادة جيب (مقاومة للماء)",
    desc_en: "Lightweight, foldable prayer mat — perfect for praying in the courtyard, at the airport, or in the hotel.",
    desc_ar: "سجّادة خفيفة قابلة للطّيّ، مناسبة للصّلاة في صحن الحرم أو المطار أو الفندق.",
    url: amazonUkSearch("pocket prayer mat travel waterproof"),
    source: "amazon",
    tag: "before",
  },
  {
    id: "miswak-pack",
    category: "ihram",
    name_en: "Miswak pack (Sunnah-approved)",
    name_ar: "مسواك (سواك)",
    desc_en: "Natural Salvadora persica miswak — the Sunnah of cleaning teeth before every prayer.",
    desc_ar: "مسواك طبيعي من شجرة الأراك، سنّة قبل كلّ صلاة.",
    url: amazonUkSearch("miswak natural sewak"),
    source: "amazon",
    tag: "before",
  },
  {
    id: "zamzam-bottle",
    category: "ihram",
    name_en: "Zamzam carry container (5L food-safe — empty, for your free airport Zamzam)",
    name_ar: "حاوية لزمزم (٥ لتر آمنة للطّعام — فارغة، لزمزم مطار جدّة)",
    desc_en: "An empty leak-proof food-safe carrier for your free 5L Zamzam bottle from Jeddah/Madinah airport. Saudi airline rules require Zamzam to be in a sealed food-safe container in checked luggage.",
    desc_ar: "حاوية فارغة مُحكمة الإغلاق لزجاجة زمزم المجّانيّة (٥ لتر) من مطار جدّة أو المدينة.",
    url: amazonUkSearch("zamzam water container 5 litre"),
    source: "amazon",
    tag: "before",
  },
  {
    id: "rihla-bag",
    category: "ihram",
    name_en: "Pilgrim travel backpack (carry-on)",
    name_ar: "حقيبة ظهر للحاجّ (محمولة)",
    desc_en: "Durable cabin-size backpack — fits iḥrām, prayer mat, Zamzam bottle, and essentials.",
    desc_ar: "حقيبة ظهر متينة بحجم الكابينة — تتّسع للإحرام والسّجّادة وقارورة زمزم والأساسيّات.",
    url: amazonUkSearch("travel backpack cabin carry on 35l"),
    source: "amazon",
    tag: "before",
  },

  // ─── Islamic books ──────────────────────────────────────────────
  {
    id: "hisn-al-muslim",
    category: "books",
    name_en: "Ḥiṣn al-Muslim (Fortress of the Muslim)",
    name_ar: "حصن المسلم",
    desc_en: "Pocket-sized authentic du'as for every situation — by Saʿīd ibn ʿAlī al-Qaḥṭānī (raḥimahullāh).",
    desc_ar: "كتاب أدعية صحيحة لكلّ مناسبة، تأليف الشّيخ سعيد بن علي القحطاني رحمه الله.",
    url: amazonUkSearch("hisn al muslim fortress of the muslim"),
    source: "amazon",
    tag: "before",
  },
  {
    id: "manasik-albani",
    category: "books",
    name_en: "Manāsik al-Ḥajj wal-ʿUmrah — Shaykh al-Albānī",
    name_ar: "مناسك الحجّ والعمرة — الشيخ الألباني",
    desc_en: "Concise step-by-step rites of Hajj and Umrah from a strong Sunnah-based reference.",
    desc_ar: "مناسك الحجّ والعمرة بطريقة مختصرة مع التّخريج الصّحيح للأحاديث.",
    url: amazonUkSearch("manasik hajj umrah albani"),
    source: "amazon",
    tag: "before",
  },
  {
    id: "bulugh-al-maram",
    category: "books",
    name_en: "Bulūgh al-Marām (Arabic + English)",
    name_ar: "بلوغ المرام (عربي + إنجليزي)",
    desc_en: "Ḥāfiẓ Ibn Ḥajar's classic compilation of fiqh hadiths — a study companion for understanding Umrah-related rulings.",
    desc_ar: "مجموع الحافظ ابن حجر للأحاديث الفقهيّة، مرجع للأحكام المتعلّقة بالعمرة.",
    url: amazonUkSearch("bulugh al maram english arabic"),
    source: "amazon",
    tag: "before",
  },
  {
    id: "riyadh-saliheen",
    category: "books",
    name_en: "Riyāḍ aṣ-Ṣāliḥīn (Gardens of the Righteous)",
    name_ar: "رياض الصالحين",
    desc_en: "Imām an-Nawawī's compilation on character, worship, and du'a — companion reading for long flights.",
    desc_ar: "كتاب الإمام النّووي في الأخلاق والعبادة والدّعاء — صحبةٌ ممتازة في الرّحلات.",
    url: amazonUkSearch("riyad us saliheen gardens of the righteous"),
    source: "amazon",
    tag: "before",
  },
  {
    id: "tafsir-as-sadi",
    category: "books",
    name_en: "Tafsīr as-Saʿdī (Concise Qur'an Tafsīr)",
    name_ar: "تيسير الكريم الرّحمن — السّعدي",
    desc_en: "Shaykh ʿAbd ar-Raḥmān as-Saʿdī's clear, easy-to-read tafsīr of the Qur'an. A fantastic introduction.",
    desc_ar: "تفسير الشيخ عبد الرّحمن السّعدي رحمه الله — واضح، سهل، مدخل ممتاز للفهم.",
    url: amazonUkSearch("tafsir as sadi english"),
    source: "amazon",
    tag: "before",
  },

  // ─── Halal food kit ──────────────────────────────────────────────
  {
    id: "sidr-honey",
    category: "food",
    name_en: "Yemeni Sidr honey (raw)",
    name_ar: "عسل سدر يمني خام",
    desc_en: "Premium raw Sidr honey — the Sunnah remedy mentioned in the Qur'an and ahadith.",
    desc_ar: "عسل سدر خام فاخر — من الشّفاء المذكور في القرآن والسنّة.",
    url: amazonUkSearch("yemeni sidr honey raw"),
    source: "amazon",
    tag: "souvenir",
  },
  {
    id: "ajwa-dates",
    category: "food",
    name_en: "Ajwa dates of Madīnah (500g)",
    name_ar: "تمر العجوة المدني (٥٠٠ جم)",
    desc_en: "The dates the Prophet ﷺ praised: 'Whoever eats seven Ajwa dates in the morning, no poison or sorcery will harm him that day.' (Bukhari)",
    desc_ar: "قال النبي ﷺ: «من تصبّح بسبع تمرات عجوة لم يضرّه ذلك اليوم سمّ ولا سحر». (البخاري)",
    url: amazonUkSearch("ajwa dates madinah 500g"),
    source: "amazon",
    tag: "souvenir",
  },
  {
    id: "barakah-zaytun-oil",
    category: "food",
    name_en: "Cold-pressed Palestinian olive oil",
    name_ar: "زيت زيتون فلسطيني بكر بارد",
    desc_en: "The blessed tree mentioned in Sūrat al-Nūr. Premium cold-pressed extra virgin olive oil.",
    desc_ar: "الشّجرة المباركة المذكورة في سورة النّور. زيت زيتون بكر معصور بارد.",
    url: amazonUkSearch("palestinian olive oil cold pressed extra virgin"),
    source: "amazon",
    tag: "souvenir",
  },
  {
    id: "black-seed-oil",
    category: "food",
    name_en: "Habba sawda (black seed) oil",
    name_ar: "زيت الحبّة السّوداء",
    desc_en: "The Prophet ﷺ said: 'In the black seed there is healing for every disease except death.' (Bukhari) Cold-pressed.",
    desc_ar: "قال النبي ﷺ: «إنّ في الحبّة السّوداء شفاءً من كلّ داء إلّا السّام». (البخاري) معصور بارد.",
    url: amazonUkSearch("black seed oil habba sawda cold pressed"),
    source: "amazon",
    tag: "souvenir",
  },
];

export function productsByCategory(catId) {
  return SHOP_PRODUCTS.filter((p) => p.category === catId);
}
