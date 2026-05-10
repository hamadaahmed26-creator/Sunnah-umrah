import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, MapPin, Plane, Info } from "lucide-react";
import { LangContext } from "../components/Layout";

// THE SIX MĪQĀT BOUNDARIES — taken directly from the agreed-upon Salafi
// references already used in the app (Bukhārī, Muslim, Manāsik of al-Albānī,
// Ibn Bāz Fatāwā). The five outer boundaries were fixed by the Prophet ﷺ;
// the sixth, Masjid ʿĀʾishah at Tanʿīm, is the entry point for those who are
// already inside Makkah (e.g. residents performing a second ʿUmrah).
//
// Distances and the "who uses it" guidance are sourced from the same
// references; the app keeps these short by design so a pilgrim can read
// the whole list in one screen-height.
const MIQATS = [
  {
    name_en: "Dhul-Ḥulayfah (Abyār ʿAlī)",
    name_ar: "ذو الحُليفة (آبار علي)",
    distance_en: "≈ 18 km outside Madīnah",
    distance_ar: "نحو ١٨ كم من المدينة",
    who_en: "For pilgrims travelling from Madīnah toward Makkah.",
    who_ar: "للقادمين من المدينة المنوّرة باتّجاه مكّة.",
  },
  {
    name_en: "Al-Juḥfah (near Rābigh)",
    name_ar: "الجُحفة (قريبًا من رابغ)",
    distance_en: "≈ 187 km north-west of Makkah",
    distance_ar: "نحو ١٨٧ كم شمال غرب مكّة",
    who_en: "For pilgrims coming from the direction of Greater Syria, Egypt, and North-West Africa.",
    who_ar: "للقادمين من الشّام ومصر وشمال غرب إفريقيا.",
  },
  {
    name_en: "Qarn al-Manāzil (As-Sayl al-Kabīr)",
    name_ar: "قَرن المنازل (السّيل الكبير)",
    distance_en: "≈ 78 km east of Makkah",
    distance_ar: "نحو ٧٨ كم شرق مكّة",
    who_en: "For pilgrims travelling from Najd, the Gulf, and the east (incl. UAE, Qatar, Oman).",
    who_ar: "للقادمين من نجد والخليج والشّرق (الإمارات وقطر وعُمان).",
  },
  {
    name_en: "Yalamlam",
    name_ar: "يَلَمْلَم",
    distance_en: "≈ 92 km south of Makkah",
    distance_ar: "نحو ٩٢ كم جنوب مكّة",
    who_en: "For pilgrims arriving from Yemen and southern routes.",
    who_ar: "للقادمين من اليمن والجنوب.",
  },
  {
    name_en: "Dhāt ʿIrq",
    name_ar: "ذات عِرق",
    distance_en: "≈ 94 km north-east of Makkah",
    distance_ar: "نحو ٩٤ كم شمال شرق مكّة",
    who_en: "For pilgrims coming from Iraq and the eastern Arabian routes.",
    who_ar: "للقادمين من العراق والمشرق.",
  },
  {
    name_en: "Masjid ʿĀʾishah at Tanʿīm",
    name_ar: "مسجد عائشة بالتّنعيم",
    distance_en: "≈ 7 km from the Ḥaram",
    distance_ar: "نحو ٧ كم من الحرم",
    who_en: "For anyone already inside Makkah (residents or pilgrims wanting a second ʿUmrah).",
    who_ar: "لمن كان داخل مكّة (مقيمًا أو يريد عمرةً أخرى).",
  },
];

export default function Miqat() {
  const { lang } = React.useContext(LangContext);
  const isAr = lang === "ar";

  return (
    <div className="max-w-md mx-auto pb-12" data-testid="miqat-page">
      <Link to="/checklist" className="mt-2 inline-flex items-center gap-1.5 text-[12px] text-[#5C5D58] hover:text-[#1C1D1B]">
        <ArrowLeft className={`w-3.5 h-3.5 ${isAr ? "rotate-180" : ""}`} />
        <span className={isAr ? "font-arabic" : ""}>{isAr ? "رجوع" : "Back"}</span>
      </Link>

      <div className="mt-3">
        <p className="text-xs uppercase tracking-[0.22em] text-[#8E8F8A]">{isAr ? "الميقات" : "Mīqāt"}</p>
        <h1 className={`mt-2 text-[28px] font-medium tracking-tight text-[#1C1D1B] ${isAr ? "font-arabic text-right" : ""}`}>
          {isAr ? "المواقيت السّتّة" : "The 6 Mīqāt boundaries"}
        </h1>
        <p className={`mt-2 text-[13px] text-[#5C5D58] leading-relaxed ${isAr ? "font-arabic text-right" : ""}`}>
          {isAr
            ? "الميقات هو الحدّ المكاني الذي يلزم الإحرام قبل تجاوزه. خمسةٌ منها حدّدها النّبيّ ﷺ للقادمين من خارج مكّة، والسّادس (مسجد عائشة بالتّنعيم) لمن كان داخل مكّة."
            : "The Mīqāt is the geographic boundary you must enter Iḥrām before crossing. Five were fixed by the Prophet ﷺ for those coming from outside Makkah. The sixth, Masjid ʿĀʾishah at Tanʿīm, is for those already inside Makkah."}
        </p>
      </div>

      {/* Quick guidance card */}
      <div className="mt-5 rounded-2xl bg-[#F4F9F4] border border-[#C5DBC9] p-4">
        <div className="flex items-start gap-2.5">
          <Plane className="w-4 h-4 text-[#2A5A4A] mt-0.5 flex-shrink-0" />
          <div>
            <div className={`text-[13px] font-semibold text-[#1C1D1B] ${isAr ? "font-arabic text-right" : ""}`}>
              {isAr ? "إن كنت قادمًا بالطّائرة" : "If you're arriving by plane"}
            </div>
            <p className={`mt-1 text-[12px] text-[#3E5E4B] leading-relaxed ${isAr ? "font-arabic text-right" : ""}`}>
              {isAr
                ? "غالبًا يُعلن قائد الطّائرة عند الاقتراب من ميقات قرن المنازل أو يَلَمْلَم. استعدّ للإحرام قبل ساعة من الإعلان: اغتسل واستعمل الطّيب في بدنك، ثمّ البس ثيابك الإحرام."
                : "The pilot will usually announce when approaching Qarn al-Manāzil or Yalamlam. Be ready about an hour before: shower, apply perfume to your body (not the iḥrām cloth), then put on your iḥrām garments before crossing."}
            </p>
          </div>
        </div>
      </div>

      {/* The 6 Miqats */}
      <div className="mt-5 space-y-2.5" data-testid="miqat-list">
        {MIQATS.map((m, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04 }}
            className="rounded-2xl bg-white border border-[#E8E5DD] p-4"
            data-testid={`miqat-${i + 1}`}
          >
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-full bg-[#FBF1DD] grid place-items-center flex-shrink-0 text-[14px] font-semibold text-[#7B5C24] tabular-nums">
                {i + 1}
              </div>
              <div className="flex-1 min-w-0">
                <div className={`text-[14px] font-semibold text-[#1C1D1B] leading-tight ${isAr ? "font-arabic text-right" : ""}`}>
                  {isAr ? m.name_ar : m.name_en}
                </div>
                <div className={`mt-1 inline-flex items-center gap-1 text-[11px] text-[#7B5C24] bg-[#FBF1DD] rounded-full px-2 py-0.5 ${isAr ? "font-arabic" : ""}`}>
                  <MapPin className="w-3 h-3" />
                  {isAr ? m.distance_ar : m.distance_en}
                </div>
                <p className={`mt-2 text-[12px] text-[#5C5D58] leading-relaxed ${isAr ? "font-arabic text-right" : ""}`}>
                  {isAr ? m.who_ar : m.who_en}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Source line */}
      <div className="mt-6 rounded-2xl bg-[#F8F6F0] border border-[#E8E5DD] p-3.5 flex items-start gap-2">
        <Info className="w-3.5 h-3.5 mt-0.5 flex-shrink-0 text-[#8E8F8A]" />
        <p className={`text-[11px] text-[#5C5D58] leading-relaxed ${isAr ? "font-arabic text-right" : ""}`}>
          {isAr
            ? "المصادر: صحيح البخاري ومسلم، ومناسك الحجّ والعمرة للألباني، وفتاوى ابن باز رحمهم الله."
            : "Sources: Ṣaḥīḥ al-Bukhārī & Muslim, Manāsik al-Ḥajj wal-ʿUmrah by al-Albānī, and Fatāwā of Ibn Bāz (raḥimahumullāh)."}
        </p>
      </div>
    </div>
  );
}
