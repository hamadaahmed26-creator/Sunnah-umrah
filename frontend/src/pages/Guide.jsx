import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Volume2 } from "lucide-react";
import { STEPS } from "../lib/umrahData";
import { LangContext } from "../components/Layout";
import { useT } from "../lib/i18n";
import TawafVisual from "../components/TawafVisual";
import SaiVisual from "../components/SaiVisual";
import IhramVisual from "../components/IhramVisual";
import HalqVisual from "../components/HalqVisual";
import TalbiyahPlayer from "../components/TalbiyahPlayer";

export default function Guide() {
  const { lang } = React.useContext(LangContext);
  const t = useT(lang);
  const [idx, setIdx] = React.useState(0);
  const step = STEPS[idx];
  const isAr = lang === "ar";

  return (
    <div className="max-w-md mx-auto pb-12" data-testid="guide-page">
      <div className="mt-2 flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.22em] text-[#8E8F8A]">
            {t("step")} {idx + 1} / {STEPS.length}
          </p>
          <h1 className="mt-2 text-[26px] font-medium tracking-tight text-[#1C1D1B]" data-testid="guide-title">
            {isAr ? step.title_ar : step.title_en}
          </h1>
        </div>
        <div className="text-xs font-medium text-[#B3884D]" data-testid="guide-progress">
          {Math.round(((idx + 1) / STEPS.length) * 100)}%
        </div>
      </div>

      {/* Progress dots */}
      <div className="mt-4 flex gap-1.5" data-testid="guide-dots">
        {STEPS.map((s, i) => (
          <button
            key={s.id}
            onClick={() => setIdx(i)}
            className={`h-1.5 flex-1 rounded-full transition-all ${i <= idx ? "bg-[#B3884D]" : "bg-[#E8E5DD]"}`}
            aria-label={`step-${i + 1}`}
            data-testid={`guide-dot-${i}`}
          />
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.article
          key={step.id}
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.35 }}
          className="mt-6 rounded-3xl border border-[#E8E5DD] bg-white p-6"
          data-testid="guide-card"
        >
          <p className={`text-[15px] leading-relaxed text-[#1C1D1B] ${isAr ? "font-arabic text-right" : ""}`}>
            {isAr ? step.summary_ar : step.summary_en}
          </p>

          {step.id === "ihram" && (
            <div className="mt-5 space-y-4" data-testid="guide-ihram-extras">
              <IhramVisual />
              <TalbiyahPlayer />
            </div>
          )}
          {step.id === "tawaf" && (
            <div className="mt-5" data-testid="guide-tawaf-visual">
              <TawafVisual count={0} total={7} />
            </div>
          )}
          {step.id === "sai" && (
            <div className="mt-5" data-testid="guide-sai-visual">
              <SaiVisual count={0} total={7} />
            </div>
          )}
          {step.id === "halq" && (
            <div className="mt-5" data-testid="guide-halq-visual">
              <HalqVisual />
            </div>
          )}

          {step.dua && (
            <div className="mt-6 rounded-2xl bg-[#F8F6F0] border border-[#E8E5DD] p-5" data-testid="guide-dua">
              <div className="flex items-center justify-between mb-3">
                <div className="text-[11px] uppercase tracking-[0.22em] text-[#B3884D]">Du'a</div>
                <button
                  onClick={() => {
                    const u = new SpeechSynthesisUtterance(step.dua.ar);
                    u.lang = "ar-SA";
                    window.speechSynthesis.speak(u);
                  }}
                  className="tap-pulse w-8 h-8 grid place-items-center rounded-full bg-white border border-[#E8E5DD]"
                  aria-label="play dua"
                  data-testid="play-dua-btn"
                >
                  <Volume2 className="w-4 h-4 text-[#1C1D1B]" />
                </button>
              </div>
              <p className="font-arabic text-2xl text-right leading-[2.2] text-[#1C1D1B]">{step.dua.ar}</p>
              <p className="mt-3 text-sm italic text-[#5C5D58]">{step.dua.tr}</p>
              <p className="mt-2 text-sm text-[#1C1D1B]">{step.dua.en}</p>
            </div>
          )}

          {step.talbiyah && (
            <div className="mt-4 rounded-2xl bg-[#1C1D1B] text-[#F8F6F0] p-5" data-testid="guide-talbiyah">
              <div className="text-[11px] uppercase tracking-[0.22em] text-[#B3884D] mb-3">Talbiyah</div>
              <p className="font-arabic text-xl text-right leading-[2.2]">{step.talbiyah.ar}</p>
              <p className="mt-3 text-sm italic text-white/70">{step.talbiyah.tr}</p>
              <p className="mt-2 text-sm text-white/85">{step.talbiyah.en}</p>
            </div>
          )}
        </motion.article>
      </AnimatePresence>

      <div className="mt-6 flex items-center justify-between" style={{ direction: "ltr" }}>
        <button
          onClick={() => setIdx((i) => Math.max(0, i - 1))}
          disabled={idx === 0}
          className="tap-pulse inline-flex items-center gap-1 rounded-full border border-[#E8E5DD] bg-white px-4 py-2.5 text-sm disabled:opacity-40"
          data-testid="guide-prev"
        >
          <ChevronLeft className="w-4 h-4" /> {t("previous")}
        </button>
        <button
          onClick={() => setIdx((i) => Math.min(STEPS.length - 1, i + 1))}
          disabled={idx === STEPS.length - 1}
          className="tap-pulse inline-flex items-center gap-1 rounded-full bg-[#B3884D] hover:bg-[#997441] text-white px-5 py-2.5 text-sm disabled:opacity-40"
          data-testid="guide-next"
        >
          {t("next")} <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
