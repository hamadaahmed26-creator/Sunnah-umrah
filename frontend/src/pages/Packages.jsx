import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, ExternalLink, Briefcase, Mail, Star } from "lucide-react";
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
        // Empty state — invites the user to partner with you.
        <div className="mt-8 rounded-2xl bg-white border border-[#E8E5DD] p-6 text-center" data-testid="packages-empty">
          <div className="w-12 h-12 mx-auto rounded-full bg-[#F8F6F0] grid place-items-center">
            <Briefcase className="w-5 h-5 text-[#B3884D]" />
          </div>
          <h2 className={`mt-4 text-[16px] font-semibold text-[#1C1D1B] ${isAr ? "font-arabic" : ""}`}>
            {isAr ? "نختار شركاءنا بعناية" : "We're choosing our partners carefully"}
          </h2>
          <p className={`mt-2 text-[13px] text-[#5C5D58] leading-[1.7] ${isAr ? "font-arabic" : ""}`}>
            {isAr
              ? "نُفضّل أن نوصي بوكلاء عمرة موثوقين فقط. سنُضيفهم هنا قريبًا."
              : "We'd rather recommend a few trusted agencies than dozens of random ones. Coming soon."}
          </p>
          <a
            href="mailto:partners@sunnahumrah.com?subject=Umrah%20package%20partnership"
            className="mt-5 inline-flex items-center gap-2 rounded-full bg-[#1C1D1B] text-white px-5 py-2.5 text-[12px] font-medium"
            data-testid="packages-partner-cta"
          >
            <Mail className="w-3.5 h-3.5" />
            <span className={isAr ? "font-arabic" : ""}>{isAr ? "هل تدير وكالة سفر؟" : "Run a travel agency?"}</span>
          </a>
        </div>
      )}
    </div>
  );
}
