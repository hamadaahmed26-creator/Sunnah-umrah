import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { LangContext } from "../components/Layout";
import { PLACES, CITY_LABELS } from "../lib/places";

/* Ziyārah — historical and religious sites pilgrims visit during their
   trip to Makkah and Madīnah. Three tabs: Makkah · Mīqāts · Madīnah. */

const TABS = ["makkah", "miqat", "madinah"];

const TAB_ACCENT = {
  makkah: "#B3884D",
  miqat: "#8B4540",
  madinah: "#2A5A4A",
};

export default function Places() {
  const { lang } = React.useContext(LangContext);
  const isAr = lang === "ar";
  const [tab, setTab] = React.useState(() => localStorage.getItem("umrah_places_tab") || "makkah");

  React.useEffect(() => {
    localStorage.setItem("umrah_places_tab", tab);
  }, [tab]);

  const items = PLACES.filter((p) => p.city === tab);
  const accent = TAB_ACCENT[tab];

  return (
    <div className="max-w-md mx-auto pb-12" data-testid="places-page">
      <Link to="/" className="inline-flex items-center gap-1 text-[12px] text-[#8E8F8A] no-underline mb-3 mt-2">
        <ArrowLeft className={`w-3.5 h-3.5 ${isAr ? "rotate-180" : ""}`} />
        <span className={isAr ? "font-arabic" : ""}>{isAr ? "الرّجوع" : "Back"}</span>
      </Link>
      <div className="mt-2">
        <p className="text-xs uppercase tracking-[0.22em] text-[#8E8F8A]">
          {isAr ? "زيارات" : "Ziyārah"}
        </p>
        <h1 className={`mt-2 text-[28px] font-medium tracking-tight text-[#1C1D1B] ${isAr ? "font-arabic text-right" : ""}`}>
          {isAr ? "أماكن للزيارة" : "Places to visit"}
        </h1>
        <p className={`mt-2 text-[14px] text-[#5C5D58] leading-relaxed ${isAr ? "font-arabic text-right" : ""}`}>
          {isAr
            ? "مواقع تاريخية وزياريّة في رحلتك إلى مكة والمدينة. صور وقصص ومواقع GPS."
            : "Historical and religious sites for your journey to Makkah and Madīnah. Photos, stories, and GPS pins."}
        </p>
      </div>

      {/* Tabs */}
      <div className="mt-5 flex items-center gap-1 rounded-full bg-white border border-[#E8E5DD] p-1" data-testid="places-tabs">
        {TABS.map((t) => {
          const active = tab === t;
          return (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`flex-1 rounded-full text-[12px] font-medium tracking-wide transition py-2 ${
                active ? "text-white" : "text-[#5C5D58] hover:text-[#1C1D1B]"
              } ${isAr ? "font-arabic" : ""}`}
              style={active ? { background: TAB_ACCENT[t] } : undefined}
              data-testid={`places-tab-${t}`}
            >
              {CITY_LABELS[lang][t]}
            </button>
          );
        })}
      </div>

      {/* Cards */}
      <div className="mt-5 space-y-3" data-testid="places-list">
        {items.map((p, i) => (
          <motion.div
            key={p.slug}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.32, delay: i * 0.03 }}
          >
            <Link
              to={`/places/${p.slug}`}
              className="group block rounded-2xl bg-white border border-[#E8E5DD] overflow-hidden hover:border-[#B3884D] transition active:scale-[0.99]"
              data-testid={`place-card-${p.slug}`}
            >
              <div className="relative aspect-[16/9] bg-[#1C1D1B]">
                <img
                  src={`/images/places/${p.slug}.jpg`}
                  alt={isAr ? p.name_ar : p.name_en}
                  className="absolute inset-0 w-full h-full object-cover"
                  loading="lazy"
                  decoding="async"
                />
                <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/65 to-transparent" />
                <div
                  className="absolute top-3 left-3 inline-flex items-center gap-1.5 rounded-full bg-white/90 backdrop-blur px-2.5 py-1 text-[10px] font-semibold tracking-[0.2em] uppercase text-[#1C1D1B]"
                >
                  <span className="w-1.5 h-1.5 rounded-full" style={{ background: accent }} />
                  {CITY_LABELS[lang][p.city]}
                </div>
              </div>
              <div className="p-4">
                <div className={`text-[16px] font-semibold text-[#1C1D1B] leading-tight ${isAr ? "font-arabic text-right" : ""}`}>
                  {isAr ? p.name_ar : p.name_en}
                </div>
                <div className={`mt-1 text-[12px] text-[#8E8F8A] ${isAr ? "font-arabic text-right" : ""}`}>
                  {isAr ? p.subtitle_ar : p.subtitle_en}
                </div>
                <div className="mt-3 inline-flex items-center gap-1 text-[11px] font-medium text-[#B3884D] group-hover:gap-2 transition-all">
                  {isAr ? "اعرف أكثر" : "Learn more"}
                  <ArrowRight className={`w-3 h-3 ${isAr ? "rotate-180" : ""}`} />
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
