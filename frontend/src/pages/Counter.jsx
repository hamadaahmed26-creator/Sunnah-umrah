import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RotateCcw, Check, Volume2, ListChecks } from "lucide-react";
import { LangContext } from "../components/Layout";
import { useT } from "../lib/i18n";
import { TAWAF_GUIDE, SAI_GUIDE } from "../lib/lapGuide";

// Reusable counter for both Tawaf (7 laps) and Sa'i (7 trips)
export default function Counter({ kind = "tawaf", title, total = 7 }) {
  const { lang } = React.useContext(LangContext);
  const t = useT(lang);
  const key = `umrah_${kind}_count`;
  const [count, setCount] = React.useState(() => parseInt(localStorage.getItem(key) || "0", 10));
  const [pulse, setPulse] = React.useState(false);

  React.useEffect(() => {
    localStorage.setItem(key, String(count));
  }, [count, key]);

  const inc = () => {
    if (count >= total) return;
    setCount((c) => Math.min(total, c + 1));
    setPulse(true);
    setTimeout(() => setPulse(false), 220);
    if (navigator.vibrate) navigator.vibrate(30);
  };
  const reset = () => setCount(0);

  const pct = (count / total) * 100;
  const done = count >= total;

  // SVG ring
  const R = 120;
  const C = 2 * Math.PI * R;
  const offset = C - (pct / 100) * C;

  return (
    <div className="max-w-md mx-auto pb-10" data-testid={`${kind}-page`}>
      <div className="mt-2">
        <p className="text-xs uppercase tracking-[0.22em] text-[#8E8F8A]">{t("progress")}</p>
        <h1 className="mt-2 text-[28px] font-medium tracking-tight text-[#1C1D1B]" data-testid={`${kind}-title`}>
          {title}
        </h1>
      </div>

      <div className="mt-8 flex flex-col items-center" style={{ direction: "ltr" }}>
        <button
          onClick={inc}
          className={`tap-pulse relative rounded-full grid place-items-center transition-colors`}
          aria-label="tap to count"
          data-testid={`${kind}-tap`}
        >
          <svg width="280" height="280" viewBox="0 0 280 280" className="-rotate-90">
            <circle cx="140" cy="140" r={R} stroke="#E8E5DD" strokeWidth="10" fill="none" />
            <motion.circle
              cx="140"
              cy="140"
              r={R}
              stroke={done ? "#2A5A4A" : "#B3884D"}
              strokeWidth="10"
              fill="none"
              strokeLinecap="round"
              strokeDasharray={C}
              strokeDashoffset={offset}
              initial={false}
              animate={{ strokeDashoffset: offset }}
              transition={{ type: "spring", stiffness: 110, damping: 18 }}
            />
          </svg>
          <motion.div
            className="absolute inset-0 grid place-items-center"
            animate={pulse ? { scale: [1, 0.95, 1] } : { scale: 1 }}
            transition={{ duration: 0.22 }}
          >
            <div className="text-center">
              <div className="text-[80px] leading-none font-light tracking-tight text-[#1C1D1B] tabular-nums" data-testid={`${kind}-count`}>
                {count}
              </div>
              <div className="mt-1 text-xs uppercase tracking-[0.22em] text-[#8E8F8A]">
                {t("of")} {total} {t("laps")}
              </div>
            </div>
          </motion.div>
        </button>

        <p className="mt-6 text-sm text-[#5C5D58]">
          {done ? (
            <span className="inline-flex items-center gap-2 text-[#2A5A4A] font-medium" data-testid={`${kind}-done`}>
              <Check className="w-4 h-4" /> {t("completed")}
            </span>
          ) : (
            t("tap")
          )}
        </p>

        <button
          onClick={reset}
          className="mt-6 tap-pulse inline-flex items-center gap-2 rounded-full border border-[#E8E5DD] bg-white px-5 py-2.5 text-sm text-[#1C1D1B]"
          data-testid={`${kind}-reset`}
        >
          <RotateCcw className="w-4 h-4" /> {t("reset")}
        </button>
      </div>

      <div className="mt-8 grid grid-cols-7 gap-1.5" data-testid={`${kind}-pips`}>
        {Array.from({ length: total }).map((_, i) => (
          <div
            key={i}
            className={`h-2 rounded-full transition-colors ${i < count ? "bg-[#B3884D]" : "bg-[#E8E5DD]"}`}
          />
        ))}
      </div>

      <LapActions kind={kind} count={count} />
    </div>
  );
}

function LapActions({ kind, count }) {
  const { lang } = React.useContext(LangContext);
  const isAr = lang === "ar";
  const guide = kind === "tawaf" ? TAWAF_GUIDE : SAI_GUIDE;
  const idx = Math.min(count, guide.length - 1);
  const item = guide[idx];

  const speak = (text) => {
    if (!text) return;
    try {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.lang = "ar-SA";
      window.speechSynthesis.speak(u);
    } catch (_) {}
  };

  return (
    <div className="mt-7" data-testid={`${kind}-lap-actions`}>
      <div className="flex items-center gap-2 mb-3">
        <ListChecks className="w-4 h-4 text-[#B3884D]" />
        <div className="text-[10px] uppercase tracking-[0.22em] text-[#8E8F8A]">
          {isAr ? "الخطوات الآن" : "What to do now"}
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={`${kind}-${idx}`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.3 }}
          className="rounded-3xl border border-[#E8E5DD] bg-white p-5"
          data-testid={`${kind}-lap-card`}
        >
          <div className={`text-[16px] font-medium text-[#1C1D1B] leading-snug ${isAr ? "font-arabic text-right" : ""}`}>
            {isAr ? item.title_ar : item.title_en}
          </div>

          <ul
            className={`mt-3 space-y-2 ${isAr ? "font-arabic text-right" : ""}`}
            data-testid={`${kind}-lap-steps`}
          >
            {(isAr ? item.actions_ar : item.actions_en).map((line, i) => (
              <li key={i} className="flex gap-3 text-[14px] leading-relaxed text-[#1C1D1B]">
                <span
                  className="flex-shrink-0 w-5 h-5 rounded-full bg-[#F8F6F0] border border-[#E8E5DD] grid place-items-center text-[10px] font-semibold text-[#B3884D] mt-0.5"
                  style={{ direction: "ltr" }}
                >
                  {i + 1}
                </span>
                <span className="flex-1">{line}</span>
              </li>
            ))}
          </ul>

          {item.dua && (
            <div className="mt-4 rounded-2xl bg-[#F8F6F0] border border-[#E8E5DD] p-4" data-testid={`${kind}-lap-dua`}>
              <div className="flex items-center justify-between mb-2">
                <div className="text-[10px] uppercase tracking-[0.22em] text-[#B3884D]">
                  {isAr ? "دعاء" : "Du'a"}
                </div>
                <button
                  onClick={() => speak(item.dua.ar)}
                  className="tap-pulse w-8 h-8 grid place-items-center rounded-full bg-white border border-[#E8E5DD]"
                  aria-label="play"
                  data-testid={`${kind}-lap-dua-play`}
                >
                  <Volume2 className="w-4 h-4 text-[#1C1D1B]" />
                </button>
              </div>
              <p className="font-arabic text-[20px] text-right leading-[2] text-[#1C1D1B]">{item.dua.ar}</p>
              <p className="mt-2 text-[12px] italic text-[#5C5D58]">{item.dua.tr}</p>
              <p className="mt-1 text-[13px] text-[#1C1D1B]">{item.dua.en}</p>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
