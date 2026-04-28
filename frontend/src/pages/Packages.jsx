import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, ExternalLink, Mail, Star, Sparkles } from "lucide-react";
import { LangContext } from "../components/Layout";

/* Umrah Packages — partner agency cards.
   To add a real partner: edit the PARTNERS array below. Each entry should have
   the agency name, optional logo image (place under /public/images/partners/),
   short pitch, "starting from" price, the booking URL (with your tracking ref
   appended e.g. ?ref=sunnah-umrah), and which country they primarily serve. */

const PARTNERS = [
  // Empty = "no partners yet" placeholder will show. Add objects like:
  // {
  //   slug: "example-travel",
  //   name: "Example Umrah Travel",
  //   country_en: "United Kingdom",
  //   country_ar: "المملكة المتحدة",
  //   pitch_en: "5-star, direct from Heathrow, Madinah-first 14-night package.",
  //   pitch_ar: "خمس نجوم، مباشر من هيثرو، باقة ١٤ ليلة تبدأ بالمدينة.",
  //   from_price: 1499,
  //   currency: "£",
  //   image: "/images/places/masjid-nabawi.jpg",
  //   url: "https://example.com/?ref=sunnah-umrah",
  //   rating: 4.8,
  // },
];

export default function Packages() {
  const { lang } = React.useContext(LangContext);
  const isAr = lang === "ar";

  return (
    <div className="max-w-md mx-auto pb-12" data-testid="packages-page">
      <Link to="/plan" className="mt-2 inline-flex items-center gap-1.5 text-[12px] text-[#5C5D58] hover:text-[#1C1D1B]">
        <ArrowLeft className={`w-3.5 h-3.5 ${isAr ? "rotate-180" : ""}`} />
        <span className={isAr ? "font-arabic" : ""}>{isAr ? "رجوع" : "Back"}</span>
      </Link>

      <div className="mt-3">
        <p className="text-xs uppercase tracking-[0.22em] text-[#8E8F8A]">{isAr ? "العمرة" : "Umrah"}</p>
        <h1 className={`mt-2 text-[28px] font-medium tracking-tight text-[#1C1D1B] ${isAr ? "font-arabic text-right" : ""}`}>
          {isAr ? "باقات العمرة" : "Umrah packages"}
        </h1>
        <p className={`mt-2 text-[13px] text-[#5C5D58] leading-[1.7] ${isAr ? "font-arabic text-right" : ""}`}>
          {isAr
            ? "وكلاء سفر موثوقون نختارهم بأنفسنا — تأشيرة، فندق، تذاكر طيران، ومرشد. لا حاجة للقلق."
            : "Hand-picked travel partners — visa, hotel, flights, and a guide. One package, no stress."}
        </p>
      </div>

      {PARTNERS.length > 0 ? (
        <div className="mt-6 space-y-3" data-testid="packages-list">
          {PARTNERS.map((p, i) => (
            <motion.a
              key={p.slug}
              href={p.url}
              target="_blank"
              rel="noreferrer"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="block rounded-2xl bg-white border border-[#E8E5DD] overflow-hidden hover:border-[#B3884D] transition active:scale-[0.99]"
              data-testid={`package-${p.slug}`}
            >
              {p.image && (
                <div className="relative aspect-[16/9] bg-[#1C1D1B]">
                  <img src={p.image} alt={p.name} className="absolute inset-0 w-full h-full object-cover" loading="lazy" />
                  <div className="absolute inset-x-0 bottom-0 h-14 bg-gradient-to-t from-black/65 to-transparent" />
                </div>
              )}
              <div className="p-4">
                <div className="flex items-center justify-between gap-2">
                  <div className="text-[15px] font-semibold text-[#1C1D1B]">{p.name}</div>
                  {typeof p.rating === "number" && (
                    <div className="inline-flex items-center gap-1 text-[12px] text-[#B3884D]">
                      <Star className="w-3 h-3" fill="#B3884D" />
                      <span className="tabular-nums">{p.rating.toFixed(1)}</span>
                    </div>
                  )}
                </div>
                <div className={`mt-1 text-[12px] text-[#8E8F8A] ${isAr ? "font-arabic" : ""}`}>{isAr ? p.country_ar : p.country_en}</div>
                <p className={`mt-2 text-[13px] text-[#3A3B36] leading-relaxed ${isAr ? "font-arabic text-right" : ""}`}>
                  {isAr ? p.pitch_ar : p.pitch_en}
                </p>
                <div className="mt-3 flex items-center justify-between">
                  <div className="text-[11px] uppercase tracking-[0.18em] text-[#5C5D58]">
                    {isAr ? "ابتداءً من" : "From"} <span className="text-[16px] tracking-normal text-[#1C1D1B] font-semibold tabular-nums">{p.currency}{p.from_price}</span>
                  </div>
                  <span className="inline-flex items-center gap-1 text-[12px] font-medium text-[#B3884D]">
                    {isAr ? "التفاصيل" : "Details"} <ExternalLink className="w-3 h-3" />
                  </span>
                </div>
              </div>
            </motion.a>
          ))}
        </div>
      ) : (
        // Empty state — pitch to travel agencies to become the first partner.
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 rounded-3xl overflow-hidden bg-white border border-[#E8E5DD]"
          data-testid="packages-empty"
        >
          <div className="relative aspect-[16/9] bg-[#1C1D1B]">
            <img
              src="/images/places/masjid-nabawi.jpg"
              alt="Masjid an-Nabawī"
              className="absolute inset-0 w-full h-full object-cover opacity-90"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-5">
              <div className={`inline-flex items-center gap-1.5 rounded-full bg-white/15 backdrop-blur px-3 py-1 text-[10px] font-semibold tracking-[0.22em] uppercase text-white ${isAr ? "font-arabic" : ""}`}>
                <Sparkles className="w-3 h-3" />
                {isAr ? "كن شريكنا الأول" : "Be our first partner"}
              </div>
              <h2 className={`mt-3 text-white text-[22px] font-semibold leading-tight ${isAr ? "font-arabic text-right" : ""}`}>
                {isAr
                  ? "وكلاء العمرة الموثوقون، عرّفوا بأنفسكم"
                  : "Trusted Umrah agencies — get featured here"}
              </h2>
            </div>
          </div>

          <div className="p-5">
            <p className={`text-[13px] text-[#3A3B36] leading-[1.85] ${isAr ? "font-arabic text-right" : ""}`}>
              {isAr
                ? "نُفضّل أن نوصي بوكلاء معدودين تثق بهم. إن كنتم تقدّمون باقات عمرة وتلتزمون بالإحسان لضيوف الرحمن، نسرّ بشراكتكم."
                : "We'd rather recommend a few agencies we trust than dozens of random ones. If you offer Umrah packages and care about treating Allah's guests well, we'd love to feature you."}
            </p>

            <div className={`mt-5 grid grid-cols-3 gap-3 ${isAr ? "text-right" : ""}`}>
              <div className="rounded-xl bg-[#F8F6F0] p-3">
                <div className="text-[18px] font-semibold text-[#1C1D1B] tabular-nums">↑</div>
                <div className={`text-[10px] uppercase tracking-[0.16em] text-[#5C5D58] mt-1 ${isAr ? "font-arabic" : ""}`}>
                  {isAr ? "حركة نموّ" : "Growing"}
                </div>
                <div className={`text-[11px] text-[#3A3B36] mt-1 leading-tight ${isAr ? "font-arabic" : ""}`}>
                  {isAr ? "آلاف الحجاج" : "Pilgrim downloads"}
                </div>
              </div>
              <div className="rounded-xl bg-[#F8F6F0] p-3">
                <div className="text-[18px] font-semibold text-[#1C1D1B]">EN/AR</div>
                <div className={`text-[10px] uppercase tracking-[0.16em] text-[#5C5D58] mt-1 ${isAr ? "font-arabic" : ""}`}>
                  {isAr ? "ثنائي اللغة" : "Bilingual"}
                </div>
                <div className={`text-[11px] text-[#3A3B36] mt-1 leading-tight ${isAr ? "font-arabic" : ""}`}>
                  {isAr ? "إنجليزي وعربي" : "Global reach"}
                </div>
              </div>
              <div className="rounded-xl bg-[#F8F6F0] p-3">
                <div className="text-[18px] font-semibold text-[#2A5A4A]">5–10%</div>
                <div className={`text-[10px] uppercase tracking-[0.16em] text-[#5C5D58] mt-1 ${isAr ? "font-arabic" : ""}`}>
                  {isAr ? "عمولة" : "Commission"}
                </div>
                <div className={`text-[11px] text-[#3A3B36] mt-1 leading-tight ${isAr ? "font-arabic" : ""}`}>
                  {isAr ? "بسيطة وعادلة" : "Simple, fair"}
                </div>
              </div>
            </div>

            <a
              href={`mailto:partners@sunnahumrah.com?subject=${encodeURIComponent("Umrah package partnership · Sunnah Umrah")}&body=${encodeURIComponent("Asalāmu ʿalaykum,\n\nWe run an Umrah travel agency and we'd like to be featured in the Sunnah Umrah app.\n\nAgency name:\nCountries we serve:\nDeparture cities:\nWebsite:\nPackage tiers (with prices):\nBooking link / referral system:\n\nJazākallāhu khayran")}`}
              className="mt-5 w-full inline-flex items-center justify-center gap-2 rounded-full bg-[#1C1D1B] hover:bg-black text-white px-5 py-3.5 text-[13px] font-medium"
              data-testid="packages-partner-cta"
            >
              <Mail className="w-3.5 h-3.5" />
              <span className={isAr ? "font-arabic" : ""}>
                {isAr ? "ابدأ الشراكة" : "Become a partner"}
              </span>
            </a>
            <p className={`mt-3 text-center text-[11px] text-[#8E8F8A] ${isAr ? "font-arabic" : ""}`}>
              {isAr ? "ردّنا خلال 48 ساعة" : "We reply within 48 hours"}
            </p>
          </div>
        </motion.div>
      )}
    </div>
  );
}
