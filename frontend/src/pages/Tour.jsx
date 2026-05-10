import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Volume2,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  Check,
  Lightbulb,
  Plus,
  Compass,
  BookOpen,
} from "lucide-react";
import { LangContext } from "../components/Layout";
import { TOUR_STEPS } from "../lib/tourSteps";
import TourScene from "../components/TourScene";
import AskHelper from "../components/AskHelper";
import TawafFlow from "../components/TawafFlow";
import SaiFlow from "../components/SaiFlow";
import GlossarySheet from "../components/GlossarySheet";
import TourSections from "../components/TourSections";

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
  "Post-Tawaf": "#9A6F3A",
  "Sa'i": "#8B4540",
  Halq: "#1C1D1B",
  Done: "#2A5A4A",
};

const CHAPTER_AR = {
  Intro: "مقدمة",
  Ihram: "الإحرام",
  Tawaf: "الطواف",
  "Post-Tawaf": "بعد الطواف",
  "Sa'i": "السعي",
  Halq: "الحلق",
  Done: "تمّت",
};

// Human chapter framing — "You're preparing for Iḥrām" instead of a cold
// "Step 2 of 15". Gives the pilgrim emotional context for what they're
// about to do. Matches the chapter key exactly (Intro / Ihram / Tawaf /
// "Sa'i" / Halq / Done).
const CHAPTER_SUBLINE = {
  en: {
    Intro: "Getting ready",
    Ihram: "You're preparing for Iḥrām",
    Tawaf: "You're circling the Kaʿbah",
    "Post-Tawaf": "Just finished circling the Kaʿbah",
    "Sa'i": "You're walking between Ṣafā & Marwah",
    Halq: "You're ending your ʿUmrah",
    Done: "Your ʿUmrah is complete",
  },
  ar: {
    Intro: "التّهيئة",
    Ihram: "أنت تستعدّ للإحرام",
    Tawaf: "تطوف حول الكعبة",
    "Post-Tawaf": "بعد الطّواف",
    "Sa'i": "تسعى بين الصّفا والمروة",
    Halq: "تُنهي عمرتك",
    Done: "اكتملت عمرتك",
  },
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
  const [glossaryOpen, setGlossaryOpen] = React.useState(false);

  // Welcome sheet REMOVED — was duplicate friction with the personalised
  // OnboardingSheet shown on Home, and was blocking the Tour content.

  const step = TOUR_STEPS[idx];
  const total = TOUR_STEPS.length;

  React.useEffect(() => {
    localStorage.setItem("umrah_tour_step", String(idx));
    // Reset lap/trip whenever the user (re)enters a flow step from outside
    const cur = TOUR_STEPS[idx];
    if (cur?.scene === "tawaf-flow" && lap >= 7) setLap(0);
    if (cur?.scene === "sai-flow" && trip >= 7) setTrip(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
  const finishUmrah = () => {
    if (navigator.vibrate) navigator.vibrate([60, 80, 60, 80, 200]);
    speak("تَقَبَّلَ اللَّهُ مِنَّا وَمِنْكُم");
    // Small celebration delay, then reset back to the beginning so the next
    // pilgrim (or another visit) starts fresh.
    setTimeout(() => restart(), 1200);
  };

  const accent = CHAPTER_COLOR[step.chapter] || "#B3884D";
  const chapterLabel = isAr ? (CHAPTER_AR[step.chapter] || step.chapter) : step.chapter;
  const title = isAr ? step.title_ar : step.title_en;
  const what = isAr ? step.what_ar : step.what_en;

  // Detect flow scenes — these get a custom rich UI instead of standard step layout
  const isTawafFlow = step.scene === "tawaf-flow";
  const isSaiFlow = step.scene === "sai-flow";
  const isFlowStep = isTawafFlow || isSaiFlow;

  const advanceToNextStep = () => {
    if (idx < total - 1) setIdx(idx + 1);
  };

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
    <div className="max-w-md mx-auto pb-[280px] sm:pb-52 px-1" data-testid="tour-page">
      {/* Header — chapter-aware so it reads "You're preparing for Iḥrām · 2 / 15"
          rather than the cold "Step 2 of 15". Warmer, gives the pilgrim
          emotional context for what they're about to do next. */}
      <div className="mt-2 flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div
            className={`text-[10px] uppercase tracking-[0.22em] ${isAr ? "font-arabic" : ""}`}
            style={{ color: accent }}
            data-testid="tour-chapter"
          >
            {chapterLabel}
          </div>
          <div
            className={`mt-1 text-[14px] text-[#1C1D1B] font-medium leading-snug ${isAr ? "font-arabic text-right" : ""}`}
            data-testid="tour-step-label"
          >
            {(CHAPTER_SUBLINE[isAr ? "ar" : "en"][step.chapter] || "")}
            <span className="text-[#8E8F8A] font-normal tabular-nums ms-1.5">
              · {idx + 1} / {total}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          {/* Glossary opener — tap to learn any Arabic term */}
          <button
            onClick={() => setGlossaryOpen(true)}
            className="tap-pulse h-10 px-3 rounded-full bg-white border border-[#E8E5DD] inline-flex items-center gap-1.5 text-[11px] font-medium text-[#1C1D1B]"
            aria-label={isAr ? "قاموس المصطلحات" : "Arabic terms"}
            data-testid="tour-glossary"
          >
            <BookOpen className="w-3.5 h-3.5 text-[#7B5C24]" />
            <span className={isAr ? "font-arabic" : ""}>
              {isAr ? "مصطلحات" : "Terms"}
            </span>
          </button>
          {idx > 0 && (
            <button
              onClick={restart}
              className="tap-pulse w-10 h-10 rounded-full bg-white border border-[#E8E5DD] grid place-items-center"
              aria-label="restart-tour"
              data-testid="tour-reset"
            >
              <RotateCcw className="w-4 h-4 text-[#1C1D1B]" />
            </button>
          )}
        </div>
      </div>

      {/* Calm one-liner — only on the home/intro screen. */}
      {idx === 0 && (
        <>
          <p
            className={`mt-3 text-[13.5px] text-[#5C5D58] leading-[1.7] ${isAr ? "font-arabic text-right" : ""}`}
            data-testid="tour-tagline"
          >
            {isAr
              ? "رفيقك الهادئ في رحلة العمرة — على السنّة، خطوة بخطوة، مع أماكن للزيارة، الأدعية الصحيحة، فنادق، رفيق ذكي للأسئلة، وطريقة لا تضيع بها عن مجموعتك."
              : "Your gentle companion for ʿUmrah — guided step by step following the Sunnah, with places to visit, the right du'as, hotels, an AI companion for your questions, and a way to never lose your group."}
          </p>
          {/* Reassurance — ChatGPT feedback: feel like a companion, not a
              textbook. Shown only on the intro so it doesn't repeat. */}
          <div
            className="mt-3 rounded-2xl bg-[#FBF8F1] border border-[#E8E5DD] p-3 flex items-start gap-2.5"
            data-testid="tour-reassurance"
          >
            <Lightbulb className="w-4 h-4 text-[#B3884D] flex-shrink-0 mt-0.5" />
            <p className={`text-[12.5px] text-[#5C5D58] leading-snug ${isAr ? "font-arabic text-right" : ""}`}>
              {isAr
                ? "لا تقلق إن كانت أوّل مرّة لك — الكثيرون يشعرون بالتّشتّت في البداية. سنرافقك خطوة بخطوة، خذ وقتك."
                : "Don't worry if this is your first time — many people find it confusing at first. We'll walk you through it. Take your time."}
            </p>
          </div>
          {/* FAQ shortcut — visible only on the intro to answer the most
              common "what if I mess up?" worries before pilgrims start. */}
          <Link
            to="/faq"
            className="mt-3 block rounded-2xl bg-white border border-[#E8E5DD] p-3 hover:border-[#B3884D] transition tap-pulse"
            data-testid="tour-faq-link"
          >
            <div className={`flex items-center gap-2.5 ${isAr ? "flex-row-reverse" : ""}`}>
              <div className="w-9 h-9 rounded-full bg-[#FBF4E4] grid place-items-center flex-shrink-0">
                <span className="text-[16px] leading-none">❓</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className={`text-[13px] font-semibold text-[#1C1D1B] leading-tight ${isAr ? "font-arabic text-right" : ""}`}>
                  {isAr ? "عندك سؤال؟ اطّلع على الأسئلة الشّائعة" : "Got a question? Read the FAQs"}
                </p>
                <p className={`mt-0.5 text-[11px] text-[#8E8F8A] leading-snug ${isAr ? "font-arabic text-right" : ""}`}>
                  {isAr
                    ? "ماذا لو انتقض وضوئي؟ وإذا أخطأت؟ والحيض؟ والكرسي المتحرّك؟"
                    : "What if my wuḍū breaks? I made a mistake? Period? Wheelchair?"}
                </p>
              </div>
              <ArrowRight className={`w-4 h-4 text-[#8E8F8A] flex-shrink-0 ${isAr ? "rotate-180" : ""}`} />
            </div>
          </Link>
          {/* Checklist bar — intro-only. Shown right after the FAQ shortcut,
              below the reassurance. Prominent sage-green nudge so pilgrims
              tick their prep before diving into the steps. */}
          <Link
            to="/checklist"
            className="mt-2 block rounded-2xl border border-[#C5DBC9] p-3 hover:border-[#2A5A4A] transition tap-pulse bg-gradient-to-br from-[#F4F9F4] to-[#E6F1E6]"
            data-testid="tour-checklist-link"
          >
            <div className={`flex items-center gap-2.5 ${isAr ? "flex-row-reverse" : ""}`}>
              <div className="w-9 h-9 rounded-full bg-white grid place-items-center flex-shrink-0 border border-[#C5DBC9]">
                <span className="text-[16px] leading-none">📋</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className={`text-[13px] font-semibold text-[#1C1D1B] leading-tight ${isAr ? "font-arabic text-right" : ""}`}>
                  {isAr ? "قائمة قبل العمرة" : "Checklist before Umrah"}
                </p>
                <p className={`mt-0.5 text-[11px] text-[#3E5E4B] leading-snug ${isAr ? "font-arabic text-right" : ""}`}>
                  {isAr
                    ? "تأكّد من كلّ ما تحتاجه — إحرام، تأشيرة، فندق، وأكثر"
                    : "Make sure you have everything — iḥrām, visa, hotel & more"}
                </p>
              </div>
              <ArrowRight className={`w-4 h-4 text-[#2A5A4A] flex-shrink-0 ${isAr ? "rotate-180" : ""}`} />
            </div>
          </Link>
        </>
      )}

      {/* "I'm lost" — quick GPS gate finder. Saves tour state via localStorage. */}
      <Link
        to="/lost"
        className="mt-3 group inline-flex items-center gap-2 rounded-full bg-[#8B4540] hover:bg-[#713934] text-white px-4 py-2 text-[12px] font-medium shadow-sm tap-pulse"
        data-testid="tour-im-lost"
      >
        <Compass className="w-3.5 h-3.5" />
        <span className={isAr ? "font-arabic" : ""}>
          {isAr ? "أنا تائه — أوجدْ بابي" : "I'm lost — find my gate"}
        </span>
        <ArrowRight className={`w-3.5 h-3.5 opacity-70 group-hover:translate-x-0.5 transition ${isAr ? "rotate-180" : ""}`} />
      </Link>

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

      {/* SCENE — hidden for flow steps (they have their own header/map) */}
      {!isFlowStep && (
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
            <TourScene
              scene={step.scene}
              lap={lap}
              trip={trip}
              isAr={isAr}
              onJump={(i) => setIdx(Math.max(0, Math.min(total - 1, i)))}
            />
          </motion.div>
        </AnimatePresence>
        {/* Chapter pill */}
        <div className={`absolute top-3 left-3 inline-flex items-center gap-1.5 rounded-full bg-white/90 backdrop-blur px-2.5 py-1 text-[10px] font-semibold tracking-[0.2em] uppercase text-[#1C1D1B] border border-[#E8E5DD] ${isAr ? "font-arabic" : ""}`}>
          <span className="w-1.5 h-1.5 rounded-full" style={{ background: accent }} />
          {chapterLabel}
        </div>
        </div>
      )}

      {/* TAWAF FLOW (replaces the regular step body) */}
      {isTawafFlow && (
        <div className="mt-4" data-testid="tawaf-flow">
          <h1
            className={`text-[22px] font-medium text-[#1C1D1B] leading-tight ${
              isAr ? "text-right font-arabic" : ""
            }`}
          >
            {title}
          </h1>
          {step.sections && step.sections.length > 0 ? (
            <TourSections sections={step.sections} isAr={isAr} />
          ) : (
            <p
              className={`mt-1.5 text-[13px] text-[#5C5D58] leading-relaxed ${
                isAr ? "text-right font-arabic" : ""
              }`}
            >
              {what}
            </p>
          )}
          <div className="mt-4">
            <TawafFlow lap={lap} setLap={setLap} isAr={isAr} onComplete={advanceToNextStep} />
          </div>
        </div>
      )}

      {/* SA'I FLOW */}
      {isSaiFlow && (
        <div className="mt-4" data-testid="sai-flow">
          <h1
            className={`text-[22px] font-medium text-[#1C1D1B] leading-tight ${
              isAr ? "text-right font-arabic" : ""
            }`}
          >
            {title}
          </h1>
          {step.sections && step.sections.length > 0 ? (
            <TourSections sections={step.sections} isAr={isAr} />
          ) : (
            <p
              className={`mt-1.5 text-[13px] text-[#5C5D58] leading-relaxed ${
                isAr ? "text-right font-arabic" : ""
              }`}
            >
              {what}
            </p>
          )}
          <div className="mt-4">
            <SaiFlow trip={trip} setTrip={setTrip} isAr={isAr} onComplete={advanceToNextStep} />
          </div>
        </div>
      )}

      {/* Title + instruction (hidden for flow steps — they render their own) */}
      {!isFlowStep && (
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
          {/* Prefer the bullet-and-icon layout when the step defines
              `sections` — much easier to scan than a long paragraph.
              Falls back to the legacy prose when `sections` is missing
              (other 14 steps, for now). */}
          {step.sections && step.sections.length > 0 ? (
            <TourSections sections={step.sections} isAr={isAr} />
          ) : (
            <p
              className={`mt-2 text-[15px] text-[#5C5D58] leading-relaxed ${
                isAr ? "text-right font-arabic" : ""
              }`}
              data-testid="tour-what"
            >
              {what}
            </p>
          )}

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
                  onClick={() => {
                    if (step.dua.audio_id) {
                      // Real Arabic recitation (Onyx TTS, recorded once,
                      // cached by SW for offline playback).
                      const url = `${process.env.PUBLIC_URL || ""}/audio/duas/${step.dua.audio_id}.mp3`;
                      const a = new Audio(url);
                      a.play().catch(() => speak(step.dua.ar));
                    } else {
                      // Fallback to browser speech synthesis if no
                      // pre-recorded audio is available for this du'a.
                      speak(step.dua.ar);
                    }
                  }}
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

          {/* Sunnah tip (legacy string-only) — only rendered for steps
              that don't use the new `sections` array (the 14 others, until
              they're migrated to the section format). Steps with sections
              embed the tip as a card with accent="tip" instead. */}
          {step.tip && !(step.sections && step.sections.length > 0) && (
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
      )}

      {/* STICKY BOTTOM CONTROL — sits just ABOVE the bottom nav. Uses
          safe-area + a calc so on iPhones the button never gets clipped by
          the home indicator and never overlaps content above it. The bottom
          nav is at safe-area + 12px and is ~72px tall, so we float at +96px. */}
      {!isFlowStep && (
      <div
        className="fixed inset-x-0 px-4 z-[55] pointer-events-none"
        style={{ bottom: "calc(env(safe-area-inset-bottom, 0px) + 96px)" }}
      >
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
              onClick={idx === total - 1 ? finishUmrah : next}
              disabled={!canAdvance}
              className={`flex-1 rounded-full text-white py-4 shadow-[0_18px_40px_-10px_rgba(28,29,27,0.55)] flex flex-col items-center justify-center transition-opacity ${
                !canAdvance ? "bg-[#1C1D1B] opacity-50" : "bg-[#1C1D1B] hover:bg-black"
              } ${idx === total - 1 ? "bg-[#2A5A4A] hover:bg-[#1f4438]" : ""}`}
              data-testid="tour-next"
            >
              {idx > 0 && idx < total - 1 && (
                <span className="text-[10px] uppercase tracking-[0.28em] text-[#B3884D]">
                  {idx + 1} / {total}
                </span>
              )}
              <span className="mt-0.5 text-[16px] font-medium inline-flex items-center gap-2">
                {idx === total - 1 ? (
                  <>
                    <Check className="w-5 h-5" />
                    {isAr ? "اكتملت العمرة" : "Umrah Complete"}
                  </>
                ) : idx === 0 ? (
                  <>
                    {isAr ? "ابدأ عمرتي" : "Begin my Umrah"}
                    <ArrowRight className={`w-5 h-5 ${isAr ? "rotate-180" : ""}`} />
                  </>
                ) : isWalkStep && !walkDone ? (
                  <>
                    {isAr
                      ? `أكمل ${7 - walkCount} ${step.counter === "tawaf" ? "أشواط" : "أشواط"}`
                      : `Finish ${7 - walkCount} more`}
                  </>
                ) : (
                  <>
                    {isAr ? "أنا جاهز — التالي" : "I'm ready — next step"}
                    <ArrowRight className={`w-5 h-5 ${isAr ? "rotate-180" : ""}`} />
                  </>
                )}
              </span>
            </motion.button>
          </div>
        </div>
      </div>
      )}

      {/* On flow steps: small floating "back" button — also anchored to safe
          area so it sits cleanly above the bottom nav on iOS. */}
      {isFlowStep && idx > 0 && (
        <button
          onClick={prev}
          className="fixed left-4 z-[55] tap-pulse rounded-full w-12 h-12 grid place-items-center border border-[#E8E5DD] bg-white text-[#1C1D1B] shadow-md"
          style={{ bottom: "calc(env(safe-area-inset-bottom, 0px) + 96px)" }}
          aria-label="previous step"
          data-testid="tour-prev"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
      )}

      {/* Floating "Ask the Companion" button — context-aware */}
      <AskHelper stepLabel={isAr ? step.title_ar : step.title_en} lowerPosition={isFlowStep} />

      {/* Glossary bottom-sheet — plain-English definitions of Arabic terms */}
      <GlossarySheet
        open={glossaryOpen}
        onClose={() => setGlossaryOpen(false)}
        isAr={isAr}
      />
    </div>
  );
}
