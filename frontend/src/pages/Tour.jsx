import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Volume2,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  Check,
  Lightbulb,
  Plus,
} from "lucide-react";
import { LangContext } from "../components/Layout";
import { TOUR_STEPS } from "../lib/tourSteps";
import TourScene from "../components/TourScene";
import AskHelper from "../components/AskHelper";

/*
 ONE PAGE = THE WHOLE UMRAH.
 An illustrated tour. Each step shows a scene of what's happening,
 a plain instruction, and the exact Sunnah du'a. Tap NEXT to move on.
 For the Tawaf-walk and Sa'i-walk steps, there's a built-in tap counter
 so the pilgrim can count their 7 laps right on this same screen.
*/

function speak(text) {
  if (!text) return;
  try {
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = "ar-SA";
    u.rate = 0.85;
    window.speechSynthesis.speak(u);
  } catch (_) {}
}

const CHAPTER_COLOR = {
  Intro: "#5C5D58",
  Ihram: "#2A5A4A",
  Tawaf: "#B3884D",
  "Sa'i": "#8B4540",
  Halq: "#1C1D1B",
  Done: "#2A5A4A",
};

export default function Tour() {
  const { lang } = React.useContext(LangContext);
  const isAr = lang === "ar";

  const [idx, setIdx] = React.useState(() =>
    Math.min(
      TOUR_STEPS.length - 1,
      Math.max(0, parseInt(localStorage.getItem("umrah_tour_step") || "0", 10))
    )
  );
  const [lap, setLap] = React.useState(() =>
    parseInt(localStorage.getItem("umrah_tawaf_count") || "0", 10)
  );
  const [trip, setTrip] = React.useState(() =>
    parseInt(localStorage.getItem("umrah_sai_count") || "0", 10)
  );

  const step = TOUR_STEPS[idx];
  const total = TOUR_STEPS.length;

  React.useEffect(() => {
    localStorage.setItem("umrah_tour_step", String(idx));
  }, [idx]);
  React.useEffect(() => {
    localStorage.setItem("umrah_tawaf_count", String(lap));
  }, [lap]);
  React.useEffect(() => {
    localStorage.setItem("umrah_sai_count", String(trip));
  }, [trip]);

  const next = () => {
    if (idx < total - 1) {
      if (navigator.vibrate) navigator.vibrate(30);
      setIdx((i) => i + 1);
    }
  };
  const prev = () => idx > 0 && setIdx((i) => i - 1);
  const restart = () => {
    setIdx(0);
    setLap(0);
    setTrip(0);
  };

  const accent = CHAPTER_COLOR[step.chapter] || "#B3884D";
  const title = isAr ? step.title_ar : step.title_en;
  const what = isAr ? step.what_ar : step.what_en;

  // For walking steps, the NEXT button only enables once the count is hit
  const isWalkStep = step.counter === "tawaf" || step.counter === "sai";
  const walkCount = step.counter === "tawaf" ? lap : trip;
  const walkLabel = step.counter === "tawaf" ? "Lap" : "Trip";
  const walkLabelAr = step.counter === "tawaf" ? "الشوط" : "الشوط";
  const walkDone = isWalkStep && walkCount >= 7;
  const canAdvance = !isWalkStep || walkDone;

  const incWalk = () => {
    if (navigator.vibrate) navigator.vibrate([30, 40, 30]);
    if (step.counter === "tawaf") {
      setLap((l) => Math.min(7, l + 1));
      speak("اللَّهُ أَكْبَر");
    } else {
      setTrip((t) => Math.min(7, t + 1));
    }
  };
  const decWalk = () => {
    if (step.counter === "tawaf") setLap((l) => Math.max(0, l - 1));
    else setTrip((t) => Math.max(0, t - 1));
  };

  return (
    <div className="max-w-md mx-auto pb-60 sm:pb-44 px-1" data-testid="tour-page">
      {/* Header */}
      <div className="mt-2 flex items-center justify-between">
        <div>
          <div
            className="text-[10px] uppercase tracking-[0.22em]"
            style={{ color: accent }}
            data-testid="tour-chapter"
          >
            {step.chapter}
          </div>
          <div className="mt-1 text-[14px] text-[#5C5D58]" data-testid="tour-step-label">
            {isAr ? `الخطوة ${idx + 1} من ${total}` : `Step ${idx + 1} of ${total}`}
          </div>
        </div>
        <button
          onClick={restart}
          className="tap-pulse w-10 h-10 rounded-full bg-white border border-[#E8E5DD] grid place-items-center"
          aria-label="restart-tour"
          data-testid="tour-reset"
        >
          <RotateCcw className="w-4 h-4 text-[#1C1D1B]" />
        </button>
      </div>

      {/* Progress bar */}
      <div className="mt-3 h-1.5 rounded-full bg-[#E8E5DD] overflow-hidden" data-testid="tour-progress">
        <motion.div
          className="h-full rounded-full"
          style={{ background: accent }}
          initial={false}
          animate={{ width: `${((idx + 1) / total) * 100}%` }}
          transition={{ duration: 0.45 }}
        />
      </div>

      {/* SCENE */}
      <div
        className="mt-4 relative rounded-3xl overflow-hidden bg-[#F8F6F0] border border-[#E8E5DD]"
        style={{ aspectRatio: "16 / 10" }}
        data-testid="tour-scene"
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={step.scene + idx}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="absolute inset-0"
          >
            <TourScene scene={step.scene} lap={lap} trip={trip} onJump={(i) => setIdx(i)} />
          </motion.div>
        </AnimatePresence>
        {/* Chapter pill */}
        <div className="absolute top-3 left-3 inline-flex items-center gap-1.5 rounded-full bg-white/90 backdrop-blur px-2.5 py-1 text-[10px] font-semibold tracking-[0.2em] uppercase text-[#1C1D1B] border border-[#E8E5DD]">
          <span className="w-1.5 h-1.5 rounded-full" style={{ background: accent }} />
          {step.chapter}
        </div>
      </div>

      {/* Title + instruction */}
      <AnimatePresence mode="wait">
        <motion.section
          key={idx}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.25 }}
          className="mt-5"
        >
          <h1
            className={`text-[26px] font-medium text-[#1C1D1B] leading-tight ${
              isAr ? "text-right font-arabic" : ""
            }`}
            data-testid="tour-title"
          >
            {title}
          </h1>
          <p
            className={`mt-2 text-[15px] text-[#5C5D58] leading-relaxed ${
              isAr ? "text-right font-arabic" : ""
            }`}
            data-testid="tour-what"
          >
            {what}
          </p>

          {/* Inline counter for the walking steps */}
          {isWalkStep && (
            <div
              className="mt-4 rounded-2xl bg-[#1C1D1B] text-white p-5 flex items-center justify-between gap-4"
              data-testid="tour-walk-counter"
            >
              <div>
                <div
                  className="text-[10px] uppercase tracking-[0.28em] text-[#B3884D]"
                  data-testid="tour-walk-label"
                >
                  {isAr ? walkLabelAr : walkLabel}
                </div>
                <div className="mt-0.5 flex items-baseline gap-2">
                  <span
                    className="text-[44px] leading-none font-medium"
                    data-testid="tour-walk-count"
                  >
                    {walkCount}
                  </span>
                  <span className="text-[16px] text-white/55">/ 7</span>
                </div>
                <div className="mt-2 grid grid-cols-7 gap-1">
                  {Array.from({ length: 7 }).map((_, i) => (
                    <div
                      key={i}
                      className={`h-1 rounded-full ${
                        i < walkCount ? "bg-[#B3884D]" : "bg-white/15"
                      }`}
                    />
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={decWalk}
                  className="w-10 h-10 rounded-full border border-white/15 text-white/70 grid place-items-center text-lg font-medium tap-pulse"
                  aria-label="undo lap"
                  data-testid="tour-walk-dec"
                >
                  −
                </button>
                <motion.button
                  whileTap={{ scale: 0.94 }}
                  onClick={incWalk}
                  disabled={walkCount >= 7}
                  className={`w-16 h-16 rounded-full grid place-items-center font-medium ${
                    walkCount >= 7 ? "bg-[#2A5A4A]" : "bg-[#B3884D] hover:bg-[#a07939]"
                  } text-white`}
                  data-testid="tour-walk-inc"
                  aria-label="count one"
                >
                  {walkCount >= 7 ? <Check className="w-7 h-7" /> : <Plus className="w-7 h-7" />}
                </motion.button>
              </div>
            </div>
          )}

          {/* Du'a card */}
          {step.dua && (
            <div
              className="mt-4 rounded-2xl bg-[#F8F6F0] border border-[#E8E5DD] p-5"
              data-testid="tour-dua"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="text-[10px] uppercase tracking-[0.22em] text-[#B3884D] mb-2">
                    {isAr ? step.dua.label_ar : step.dua.label_en}
                  </div>
                  <p className="font-arabic text-[20px] leading-[2] text-right text-[#1C1D1B]">
                    {step.dua.ar}
                  </p>
                </div>
                <button
                  onClick={() => speak(step.dua.ar)}
                  className="tap-pulse w-11 h-11 flex-shrink-0 grid place-items-center rounded-full bg-white border border-[#E8E5DD]"
                  aria-label="listen"
                  data-testid="tour-dua-play"
                >
                  <Volume2 className="w-5 h-5 text-[#1C1D1B]" />
                </button>
              </div>
              <p className="mt-3 text-[12px] italic text-[#5C5D58]">{step.dua.tr}</p>
              <p className="mt-1 text-[12px] text-[#1C1D1B]">{step.dua.en}</p>
            </div>
          )}

          {/* Sunnah tip */}
          {step.tip && (
            <div className="mt-3 rounded-2xl border border-[#E8E5DD] bg-white p-4 flex gap-3" data-testid="tour-tip">
              <Lightbulb className="w-4 h-4 text-[#B3884D] flex-shrink-0 mt-0.5" />
              <p
                className={`text-[13px] text-[#5C5D58] leading-relaxed ${
                  isAr ? "text-right font-arabic" : ""
                }`}
              >
                {step.tip}
              </p>
            </div>
          )}
        </motion.section>
      </AnimatePresence>

      {/* STICKY BOTTOM CONTROL — positioned ABOVE the bottom nav */}
      <div className="fixed inset-x-0 bottom-36 sm:bottom-24 px-4 z-[55] pointer-events-none">
        <div className="max-w-md mx-auto pointer-events-auto">
          <div className="flex items-center gap-2">
            <button
              onClick={prev}
              disabled={idx === 0}
              className={`tap-pulse rounded-full w-14 h-14 grid place-items-center border ${
                idx === 0
                  ? "border-[#E8E5DD] bg-white/60 text-[#B5B5B0]"
                  : "border-[#E8E5DD] bg-white text-[#1C1D1B]"
              }`}
              aria-label="previous step"
              data-testid="tour-prev"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>

            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={next}
              disabled={idx === total - 1 || !canAdvance}
              className={`flex-1 rounded-full text-white py-4 shadow-[0_18px_40px_-10px_rgba(28,29,27,0.55)] flex flex-col items-center justify-center transition-opacity ${
                idx === total - 1 || !canAdvance ? "bg-[#1C1D1B] opacity-50" : "bg-[#1C1D1B] hover:bg-black"
              } ${idx === total - 1 ? "bg-[#2A5A4A]" : ""}`}
              data-testid="tour-next"
            >
              <span className="text-[10px] uppercase tracking-[0.28em] text-[#B3884D]">
                {idx + 1} / {total}
              </span>
              <span className="mt-0.5 text-[16px] font-medium inline-flex items-center gap-2">
                {idx === total - 1 ? (
                  <>
                    <Check className="w-5 h-5" />
                    {isAr ? "اكتملت العمرة" : "Umrah Complete"}
                  </>
                ) : isWalkStep && !walkDone ? (
                  <>
                    {isAr
                      ? `أكمل ${7 - walkCount} ${step.counter === "tawaf" ? "أشواط" : "أشواط"}`
                      : `Finish ${7 - walkCount} more`}
                  </>
                ) : (
                  <>
                    {isAr ? "أنا جاهز — التالي" : "I'm done — next step"}
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </span>
            </motion.button>
          </div>
        </div>
      </div>
      {/* Floating "Ask the Companion" button — context-aware */}
      <AskHelper stepLabel={isAr ? step.title_ar : step.title_en} />
    </div>
  );
}
