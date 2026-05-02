import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Calendar, AlertCircle } from "lucide-react";
import { LangContext } from "../components/Layout";

// "When to go" — quick infographic helping pilgrims pick the quietest /
// most-blessed time for their Umrah. Static curated guidance based on:
//   • Saudi MoH historical pilgrim numbers (publicly published)
//   • School holiday patterns (UK + Gulf)
//   • Religious calendar (Ramadan, Hajj)

const MONTHS = [
  { en: "January",   ar: "يناير",     level: "quiet",    why_en: "Cold, school in session — among the quietest months. Excellent choice.",                    why_ar: "بارد، الدّراسة قائمة — من أهدأ الشّهور. خيار ممتاز." },
  { en: "February",  ar: "فبراير",    level: "quiet",    why_en: "Quiet outside half-term week. Great prices, calm Haram.",                                     why_ar: "هادئ خارج عطلة منتصف الفصل. أسعار جيّدة، حرم هادئ." },
  { en: "March",     ar: "مارس",      level: "moderate", why_en: "Pleasant weather draws crowds. Often overlaps with Ramadan — check the date.",                 why_ar: "طقس لطيف يجذب النّاس. يتقاطع غالبًا مع رمضان — تحقّق من التّاريخ." },
  { en: "April",     ar: "أبريل",     level: "busy",     why_en: "Often Ramadan / post-Ramadan rush. Very crowded but spiritually rewarding.",                  why_ar: "غالبًا رمضان أو ما بعده. زحام شديد، لكن أجره عظيم." },
  { en: "May",       ar: "مايو",      level: "busy",     why_en: "Shawwāl ʿUmrah rush — many believe it carries Hajj reward (well-known but contested).",        why_ar: "زحام عمرة شوّال — يظنّ كثيرٌ أنّ لها أجر حجّة (مشهور وفيه خلاف)." },
  { en: "June",      ar: "يونيو",     level: "moderate", why_en: "Hot but quieter. Schools break — families travel.",                                            why_ar: "حارّ لكن أقلّ زحامًا. المدارس في إجازة — تسافر العائلات." },
  { en: "July",      ar: "يوليو",     level: "moderate", why_en: "Very hot (45°C+). Indoor cooling in the Haram is excellent. Quieter on weekdays.",            why_ar: "حارّ جدًّا (٤٥°+). تبريد الحرم ممتاز. أهدأ في أيّام الأسبوع." },
  { en: "August",    ar: "أغسطس",     level: "blocked",  why_en: "ʿUmrah typically suspended late-month for Hajj preparation.",                                  why_ar: "تُعلَّق العمرة عادةً أواخر الشّهر استعدادًا للحجّ." },
  { en: "September", ar: "سبتمبر",    level: "blocked",  why_en: "Hajj month — ʿUmrah suspended until pilgrims depart, usually mid-month.",                       why_ar: "شهر الحجّ — تُعلّق العمرة حتّى مغادرة الحجّاج، عادةً منتصف الشّهر." },
  { en: "October",   ar: "أكتوبر",    level: "quiet",    why_en: "Among the BEST months. Cool, calm, post-Hajj reset. Highly recommended.",                      why_ar: "من أفضل الشّهور. بارد، هادئ، ما بعد الحجّ. ننصح به بشدّة." },
  { en: "November",  ar: "نوفمبر",    level: "quiet",    why_en: "Cool, calm, school in session. Excellent choice with great prices.",                            why_ar: "بارد، هادئ، الدّراسة قائمة. خيار ممتاز بأسعار جيّدة." },
  { en: "December",  ar: "ديسمبر",    level: "moderate", why_en: "Christmas/winter break brings UK families. Mid-month is best.",                                 why_ar: "عطلة عيد الميلاد تجلب العائلات البريطانيّة. منتصف الشّهر أفضل." },
];

const LEVEL_STYLES = {
  quiet:    { bg: "#E7F1EB", border: "#BCD9C5", text: "#1F4F3A", label_en: "Quiet",    label_ar: "هادئ" },
  moderate: { bg: "#FFF7E6", border: "#EBD9B0", text: "#8B6A1F", label_en: "Moderate", label_ar: "متوسّط" },
  busy:     { bg: "#FBE5E1", border: "#E5BFB7", text: "#8B4540", label_en: "Busy",     label_ar: "مزدحم" },
  blocked:  { bg: "#EDEDEC", border: "#CFCFCC", text: "#5C5D58", label_en: "Limited",  label_ar: "محدود" },
};

export default function BestMonths() {
  const { lang } = React.useContext(LangContext);
  const isAr = lang === "ar";

  return (
    <div className="max-w-2xl mx-auto pb-16" data-testid="bestmonths-page">
      <Link to="/" className="inline-flex items-center gap-1 text-[12px] text-[#8E8F8A] no-underline mb-4">
        <ArrowLeft className="w-3.5 h-3.5" /> {isAr ? "الرّجوع" : "Back"}
      </Link>

      <p className="text-[10px] uppercase tracking-[0.28em] text-[#B3884D]">
        {isAr ? "متى تذهب" : "When to go"}
      </p>
      <h1 className={`mt-2 text-[28px] font-medium tracking-tight text-[#1C1D1B] ${isAr ? "font-arabic" : ""}`}>
        {isAr ? "أفضل الشّهور لأداء العمرة" : "Best months for Umrah"}
      </h1>
      <p className={`mt-3 text-[13px] text-[#5C5D58] leading-[1.7] ${isAr ? "font-arabic text-right" : ""}`}>
        {isAr
          ? "الزّيارة في كلّ وقت مأجورة، لكن بعض الشّهور أهدأ وأرخص — وأكثر خشوعًا."
          : "Every visit is rewarded, but some months are quieter, cheaper, and more focused."}
      </p>

      {/* Legend */}
      <div className="mt-6 flex flex-wrap gap-2" data-testid="bestmonths-legend">
        {Object.entries(LEVEL_STYLES).map(([k, s]) => (
          <span key={k}
            className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-semibold border"
            style={{ background: s.bg, borderColor: s.border, color: s.text }}>
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: s.text }} />
            {isAr ? s.label_ar : s.label_en}
          </span>
        ))}
      </div>

      {/* Months grid */}
      <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-2.5" data-testid="bestmonths-grid">
        {MONTHS.map((m) => {
          const s = LEVEL_STYLES[m.level];
          return (
            <div
              key={m.en}
              className="rounded-2xl p-4 border"
              style={{ background: s.bg, borderColor: s.border }}
              data-testid={`month-${m.en.toLowerCase()}`}
            >
              <div className="flex items-center justify-between gap-2 mb-2">
                <h3 className={`text-[15px] font-semibold ${isAr ? "font-arabic" : ""}`} style={{ color: s.text }}>
                  {isAr ? m.ar : m.en}
                </h3>
                <span className="text-[9px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full bg-white/50"
                      style={{ color: s.text }}>
                  {isAr ? s.label_ar : s.label_en}
                </span>
              </div>
              <p className={`text-[12px] leading-relaxed ${isAr ? "font-arabic text-right" : ""}`}
                 style={{ color: s.text, opacity: 0.85 }}>
                {isAr ? m.why_ar : m.why_en}
              </p>
            </div>
          );
        })}
      </div>

      {/* Notes */}
      <div className="mt-6 rounded-2xl bg-white border border-[#E8E5DD] p-5">
        <div className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.22em] text-[#B3884D]">
          <Calendar className="w-3.5 h-3.5" />
          {isAr ? "ملاحظات مفيدة" : "Useful notes"}
        </div>
        <ul className={`mt-3 space-y-2 text-[13px] text-[#3F3722] leading-[1.7] list-disc pl-5 ${isAr ? "font-arabic text-right pr-5 pl-0" : ""}`}>
          <li>
            {isAr
              ? "أيّام الأسبوع أهدأ بكثير من عطل نهاية الأسبوع (الجمعة والسّبت في السّعوديّة)."
              : "Weekdays are far quieter than weekends (Friday & Saturday in Saudi)."}
          </li>
          <li>
            {isAr
              ? "العشر الأواخر من رمضان: ذروة الازدحام في السّنة كاملة. روحانيّة استثنائيّة، لكن الزّحام شديد."
              : "Last 10 nights of Ramadan: peak crowds of the entire year. Spiritually unmatched, but very heavy."}
          </li>
          <li>
            {isAr
              ? "بعد الحجّ بأسبوعين (منتصف ذي الحجّة) عادةً ما تُفتح العمرة من جديد بزحامٍ يسير."
              : "Two weeks after Hajj (mid-Dhul-Ḥijjah), ʿUmrah typically reopens with light crowds."}
          </li>
          <li>
            {isAr
              ? "الفجر والعصر أهدأ أوقات اليوم. تجنّب الجمعة بعد العصر."
              : "Fajr and ʿAṣr are the calmest hours. Avoid Friday afternoons."}
          </li>
        </ul>
      </div>

      <div className="mt-4 rounded-2xl bg-[#FFF8EE] border border-[#EBD9B0] p-4 flex items-start gap-2" data-testid="bestmonths-disclaimer">
        <AlertCircle className="w-4 h-4 text-[#8B6A1F] flex-shrink-0 mt-0.5" />
        <p className={`text-[12px] text-[#6E5424] leading-relaxed ${isAr ? "font-arabic text-right" : ""}`}>
          {isAr
            ? "هذه إرشادات عامّة بناءً على أنماط تاريخيّة. تختلف الأرقام من سنة لأخرى — راجع الموقع الرّسمي لوزارة الحجّ السّعوديّة قبل الحجز."
            : "Guidance based on historical patterns. Numbers vary year to year — check the Saudi Ministry of Hajj's official site before booking."}
        </p>
      </div>
    </div>
  );
}
