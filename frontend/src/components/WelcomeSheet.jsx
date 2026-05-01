import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X, ArrowRight, BookOpen, MapPin, Compass, MessageCircle, Users, Plane,
} from "lucide-react";

/* WelcomeSheet — slide-up sheet shown the first time someone opens the app.
   - localStorage flag `umrah_welcome_seen` keeps it from showing again
   - Always re-openable via the "?" pill on the home screen (Tour.jsx)
   - Designed to introduce the breadth of features without feeling salesy
*/

const FEATURES = [
  { icon: BookOpen,       en: "Step-by-step Tawaf, Saʿi & Halq",            ar: "الطواف والسعي والحلق خطوة بخطوة",          tint: "#B3884D" },
  { icon: MapPin,         en: "26 places to visit · Makkah, Mīqāts, Madīnah", ar: "٢٦ موقعًا للزيارة — مكة، المواقيت، المدينة", tint: "#2A5A4A" },
  { icon: Compass,        en: "GPS gate-finder when you're lost",            ar: "GPS لإيجاد بابك إذا تُهت",                  tint: "#8B4540" },
  { icon: MessageCircle,  en: "AI Companion — ask any Fiqh question",       ar: "رفيق ذكي يجيب على أسئلتك الفقهية",         tint: "#1C1D1B" },
  { icon: Users,          en: "Stay together with your family · QR invite", ar: "ابقَ مع عائلتك — دعوة QR",                  tint: "#5C5D58" },
  { icon: Plane,          en: "Hotels, Umrah packages & eSIM",               ar: "فنادق، باقات عمرة، شريحة eSIM",           tint: "#B3884D" },
];

export default function WelcomeSheet({ open, onClose, isAr }) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[80] bg-black/55 backdrop-blur-sm"
            onClick={onClose}
            data-testid="welcome-overlay"
          />
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 280 }}
            className="fixed left-0 right-0 bottom-0 z-[81] bg-[#F8F6F0] rounded-t-[28px] shadow-[0_-20px_60px_rgba(0,0,0,0.25)] max-h-[88vh] overflow-y-auto"
            data-testid="welcome-sheet"
          >
            <div className="sticky top-0 bg-[#F8F6F0]/95 backdrop-blur-sm flex items-center justify-between px-5 pt-4 pb-2">
              <div className="w-12 h-1 rounded-full bg-[#E8E5DD] mx-auto absolute left-1/2 -translate-x-1/2 top-2" />
              <div />
              <button
                onClick={onClose}
                className="w-9 h-9 rounded-full bg-white border border-[#E8E5DD] grid place-items-center"
                aria-label="close welcome sheet"
                data-testid="welcome-close"
              >
                <X className="w-4 h-4 text-[#1C1D1B]" />
              </button>
            </div>

            <div className="px-6 pb-8">
              <p className={`text-[10px] uppercase tracking-[0.28em] text-[#B3884D] ${isAr ? "font-arabic" : ""}`}>
                {isAr ? "أهلًا بك" : "Welcome"}
              </p>
              <h2 className={`mt-2 text-[26px] leading-tight font-medium tracking-tight text-[#1C1D1B] ${isAr ? "font-arabic text-right" : ""}`}>
                {isAr ? "كل ما يحتاجه الحاجّ في تطبيق واحد" : "Everything a pilgrim needs, in one app"}
              </h2>
              <p className={`mt-3 text-[14px] text-[#5C5D58] leading-[1.7] ${isAr ? "font-arabic text-right" : ""}`}>
                {isAr
                  ? "رفيقك الهادئ في رحلة العمرة — على السنّة، خطوة بخطوة، باللغتين العربية والإنجليزية."
                  : "Your gentle companion for ʿUmrah — following the Sunnah, step by step, in English and Arabic."}
              </p>

              <ul className="mt-6 space-y-3" data-testid="welcome-features">
                {FEATURES.map((f, i) => {
                  const Icon = f.icon;
                  return (
                    <motion.li
                      key={i}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.08 + i * 0.04 }}
                      className="flex items-center gap-3"
                    >
                      <div className="w-10 h-10 rounded-full grid place-items-center flex-shrink-0" style={{ background: `${f.tint}1A` }}>
                        <Icon className="w-[18px] h-[18px]" style={{ color: f.tint }} strokeWidth={2.1} />
                      </div>
                      <span className={`text-[14px] text-[#1C1D1B] leading-snug ${isAr ? "font-arabic text-right flex-1" : ""}`}>
                        {isAr ? f.ar : f.en}
                      </span>
                    </motion.li>
                  );
                })}
              </ul>

              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={onClose}
                className="mt-7 w-full rounded-full bg-[#1C1D1B] text-white py-4 text-[15px] font-medium inline-flex items-center justify-center gap-2 shadow-[0_14px_30px_-10px_rgba(28,29,27,0.5)]"
                data-testid="welcome-begin"
              >
                <span className={isAr ? "font-arabic" : ""}>{isAr ? "ابدأ عمرتي" : "Begin my Umrah"}</span>
                <ArrowRight className={`w-4 h-4 ${isAr ? "rotate-180" : ""}`} />
              </motion.button>
              <p className={`mt-3 text-center text-[11px] text-[#8E8F8A] ${isAr ? "font-arabic" : ""}`}>
                {isAr ? "تقبّل الله منا ومنكم" : "May Allah accept your ʿUmrah"}
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
