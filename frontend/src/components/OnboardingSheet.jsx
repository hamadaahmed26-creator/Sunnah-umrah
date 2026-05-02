// First-launch personalized onboarding. 4 short questions, builds a tailored
// home experience. Saved locally; never sent to a server.

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X, ArrowRight, ArrowLeft, User, Users, Heart, Accessibility,
  BookOpen, Sparkles, Calendar, Check,
} from "lucide-react";
import { saveProfile } from "../lib/userProfile";

const STEPS = 4;

export default function OnboardingSheet({ open, onComplete, onSkip, isAr }) {
  const [step, setStep] = React.useState(0);
  const [answers, setAnswers] = React.useState({
    travelers: null,
    experience: null,
    knowledge: null,
    tripDate: null,
  });

  const next = () => setStep((s) => Math.min(STEPS - 1, s + 1));
  const back = () => setStep((s) => Math.max(0, s - 1));

  const finish = () => {
    saveProfile({ ...answers, done: true });
    onComplete?.(answers);
  };

  const skip = () => {
    saveProfile({ ...answers, done: true });
    onSkip?.();
  };

  const set = (k, v) => setAnswers((a) => ({ ...a, [k]: v }));

  const canAdvance =
    (step === 0 && answers.experience) ||
    (step === 1 && answers.travelers) ||
    (step === 2 && answers.knowledge) ||
    step === 3; // date is optional

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[80] bg-black/60 backdrop-blur-sm"
            data-testid="onboard-overlay"
          />
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 280 }}
            className="fixed left-0 right-0 bottom-0 z-[81] bg-[#F8F6F0] rounded-t-[28px] shadow-[0_-20px_60px_rgba(0,0,0,0.3)] max-h-[92vh] overflow-y-auto"
            data-testid="onboard-sheet"
          >
            <div className="sticky top-0 bg-[#F8F6F0]/95 backdrop-blur flex items-center justify-between px-5 pt-4 pb-3 border-b border-[#E8E5DD]">
              <div className="w-12 h-1 rounded-full bg-[#E8E5DD] mx-auto absolute left-1/2 -translate-x-1/2 top-2" />
              <div className="text-[10px] uppercase tracking-[0.22em] text-[#B3884D]">
                {isAr ? `${step + 1} من ${STEPS}` : `Step ${step + 1} of ${STEPS}`}
              </div>
              <button
                onClick={skip}
                className="text-[11px] uppercase tracking-[0.18em] text-[#8E8F8A] hover:text-[#1C1D1B]"
                data-testid="onboard-skip"
              >
                {isAr ? "تخطّي" : "Skip"}
              </button>
            </div>

            {/* Progress bar */}
            <div className="px-5 pt-3">
              <div className="h-1 bg-[#E8E5DD] rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-[#B3884D] rounded-full"
                  initial={false}
                  animate={{ width: `${((step + 1) / STEPS) * 100}%` }}
                />
              </div>
            </div>

            <div className="px-6 pt-5 pb-8 min-h-[420px]">
              {/* Step 0 — experience */}
              {step === 0 && (
                <div data-testid="onboard-step-experience">
                  <h2 className={`text-[24px] font-medium leading-tight text-[#1C1D1B] ${isAr ? "font-arabic text-right" : ""}`}>
                    {isAr ? "هل أدّيتَ العمرة من قبل؟" : "Have you performed Umrah before?"}
                  </h2>
                  <p className={`mt-2 text-[13px] text-[#5C5D58] ${isAr ? "font-arabic text-right" : ""}`}>
                    {isAr ? "لنُخصّص لك التجربة المناسبة." : "We'll tailor the experience to match."}
                  </p>
                  <div className="mt-5 space-y-2">
                    <Choice icon={Sparkles} active={answers.experience === "first"}
                      label={isAr ? "هذه أوّل مرّة لي" : "This is my first time"}
                      sub={isAr ? "وضع المبتدئ — شرح أكثر" : "Beginner mode — more guidance"}
                      onClick={() => set("experience", "first")}
                      testid="onboard-exp-first" />
                    <Choice icon={BookOpen} active={answers.experience === "returning"}
                      label={isAr ? "أدّيتها سابقًا" : "I've done it before"}
                      sub={isAr ? "أحتاج تذكيرًا فقط" : "Just need a refresher"}
                      onClick={() => set("experience", "returning")}
                      testid="onboard-exp-returning" />
                    <Choice icon={Heart} active={answers.experience === "helping"}
                      label={isAr ? "أساعد شخصًا آخر" : "I'm helping someone else"}
                      sub={isAr ? "زوج، والد، صديق" : "Spouse, parent, friend"}
                      onClick={() => set("experience", "helping")}
                      testid="onboard-exp-helping" />
                  </div>
                </div>
              )}

              {/* Step 1 — travelers */}
              {step === 1 && (
                <div data-testid="onboard-step-travelers">
                  <h2 className={`text-[24px] font-medium leading-tight text-[#1C1D1B] ${isAr ? "font-arabic text-right" : ""}`}>
                    {answers.experience === "helping"
                      ? (isAr ? "كيف سيُسافرون؟" : "How will they travel?")
                      : (isAr ? "كيف ستسافر؟" : "How will you travel?")}
                  </h2>
                  <p className={`mt-2 text-[13px] text-[#5C5D58] ${isAr ? "font-arabic text-right" : ""}`}>
                    {isAr ? "سنُكيّف الإرشاد بناءً على ذلك." : "We'll adapt the guidance to suit."}
                  </p>
                  <div className="mt-5 space-y-2">
                    <Choice icon={User} active={answers.travelers === "solo"}
                      label={answers.experience === "helping"
                        ? (isAr ? "بمفردهم" : "Solo")
                        : (isAr ? "بمفردي" : "Solo")}
                      onClick={() => set("travelers", "solo")} testid="onboard-tr-solo" />
                    <Choice icon={Heart} active={answers.travelers === "spouse"}
                      label={answers.experience === "helping"
                        ? (isAr ? "مع زوجته / زوجها" : "With their spouse")
                        : (isAr ? "مع زوجتي / زوجي" : "With my spouse")}
                      onClick={() => set("travelers", "spouse")} testid="onboard-tr-spouse" />
                    <Choice icon={Users} active={answers.travelers === "family"}
                      label={answers.experience === "helping"
                        ? (isAr ? "مع العائلة" : "With family")
                        : (isAr ? "مع العائلة" : "With family")}
                      sub={isAr ? "سنفعّل ميزة (ابقَ معًا)" : "We'll suggest 'Stay Together'"}
                      onClick={() => set("travelers", "family")} testid="onboard-tr-family" />
                    <Choice icon={Accessibility} active={answers.travelers === "wheelchair"}
                      label={answers.experience === "helping"
                        ? (isAr ? "يحتاجون مساعدة (كرسيّ متحرّك)" : "They need accessibility help")
                        : (isAr ? "أحتاج مساعدة (كرسي متحرّك)" : "I need accessibility help")}
                      sub={isAr ? "سنرشدك لزيارة سهلة" : "Wheelchair-friendly guidance"}
                      onClick={() => set("travelers", "wheelchair")} testid="onboard-tr-wheelchair" />
                  </div>
                </div>
              )}

              {/* Step 2 — knowledge */}
              {step === 2 && (
                <div data-testid="onboard-step-knowledge">
                  <h2 className={`text-[24px] font-medium leading-tight text-[#1C1D1B] ${isAr ? "font-arabic text-right" : ""}`}>
                    {answers.experience === "helping"
                      ? (isAr ? "كم يعرفون عن خطوات العمرة؟" : "How well do they know the steps?")
                      : (isAr ? "كم تعرف عن خطوات العمرة؟" : "How well do you know the steps?")}
                  </h2>
                  <p className={`mt-2 text-[13px] text-[#5C5D58] ${isAr ? "font-arabic text-right" : ""}`}>
                    {isAr ? "لا أحكام هنا — فقط لتُناسبك التجربة." : "No judgement — just so we pace it right."}
                  </p>
                  <div className="mt-5 space-y-2">
                    <Choice active={answers.knowledge === "confident"}
                      label={answers.experience === "helping"
                        ? (isAr ? "يعرفون ما يفعلون" : "They know what they're doing")
                        : (isAr ? "أعرف ما أفعله" : "I know what I'm doing")}
                      sub={isAr ? "وضع سريع" : "Quick-access mode"}
                      onClick={() => set("knowledge", "confident")} testid="onboard-kn-confident" />
                    <Choice active={answers.knowledge === "refresher"}
                      label={answers.experience === "helping"
                        ? (isAr ? "يعرفون القليل" : "They know a little")
                        : (isAr ? "أعرف القليل" : "I know a little")}
                      sub={answers.experience === "helping"
                        ? (isAr ? "يحتاجون تذكيرًا أحيانًا" : "Reminders along the way")
                        : (isAr ? "أحتاج تذكيرًا أحيانًا" : "Reminders along the way")}
                      onClick={() => set("knowledge", "refresher")} testid="onboard-kn-refresher" />
                    <Choice active={answers.knowledge === "beginner"}
                      label={answers.experience === "helping"
                        ? (isAr ? "لا يعرفون شيئًا بعد" : "They don't know anything yet")
                        : (isAr ? "لا أعرف شيئًا" : "I don't know anything yet")}
                      sub={isAr ? "خطوة بخطوة بكل وضوح" : "Step-by-step in detail"}
                      onClick={() => set("knowledge", "beginner")} testid="onboard-kn-beginner" />
                  </div>
                </div>
              )}

              {/* Step 3 — trip date */}
              {step === 3 && (
                <div data-testid="onboard-step-date">
                  <h2 className={`text-[24px] font-medium leading-tight text-[#1C1D1B] ${isAr ? "font-arabic text-right" : ""}`}>
                    {answers.experience === "helping"
                      ? (isAr ? "هل حُدِّد موعد رحلتهم؟" : "Have they booked their trip?")
                      : (isAr ? "هل حدّدتَ موعد رحلتك؟" : "Have you booked your trip?")}
                  </h2>
                  <p className={`mt-2 text-[13px] text-[#5C5D58] ${isAr ? "font-arabic text-right" : ""}`}>
                    {isAr ? "اختياري — سنُريك العدّ التّنازلي وذكّرك بما تحتاج." : "Optional — we'll show you a countdown and timely reminders."}
                  </p>
                  <div className="mt-5 rounded-2xl bg-white border border-[#E8E5DD] p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Calendar className="w-4 h-4 text-[#B3884D]" />
                      <span className={`text-[12px] font-semibold text-[#1C1D1B] ${isAr ? "font-arabic" : ""}`}>
                        {isAr ? "تاريخ السّفر" : "Travel date"}
                      </span>
                    </div>
                    <input
                      type="date"
                      value={answers.tripDate || ""}
                      onChange={(e) => set("tripDate", e.target.value || null)}
                      min={new Date().toISOString().slice(0, 10)}
                      className="w-full rounded-xl border border-[#E8E5DD] px-3 py-2.5 text-[14px] text-[#1C1D1B] bg-[#F8F6F0] focus:outline-none focus:border-[#B3884D]"
                      data-testid="onboard-date"
                    />
                    <button
                      onClick={() => set("tripDate", null)}
                      className="mt-2 text-[11px] text-[#8E8F8A] hover:text-[#1C1D1B]"
                      data-testid="onboard-date-clear"
                    >
                      {isAr ? "لم أحجز بعد" : "I haven't booked yet"}
                    </button>
                  </div>

                  <div className="mt-5 rounded-2xl bg-[#FBF1DD] border border-[#EBD9B0] p-4 flex items-start gap-2">
                    <span className="text-[14px]">🤲</span>
                    <p className={`text-[12px] text-[#6E5424] leading-relaxed ${isAr ? "font-arabic text-right" : ""}`}>
                      {isAr
                        ? "تقبّل الله منك — رحلتك بدأت من اللّحظة الّتي عقدتَ فيها النّيّة."
                        : "May Allah accept it — your journey began the moment you intended it."}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Sticky footer */}
            <div className="sticky bottom-0 bg-[#F8F6F0]/95 backdrop-blur border-t border-[#E8E5DD] px-5 py-3 flex items-center gap-2">
              <button
                onClick={back}
                disabled={step === 0}
                className={`w-12 h-12 rounded-full grid place-items-center border ${
                  step === 0
                    ? "border-[#E8E5DD] bg-white/40 text-[#B5B5B0]"
                    : "border-[#E8E5DD] bg-white text-[#1C1D1B]"
                }`}
                data-testid="onboard-back"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
              {step < STEPS - 1 ? (
                <button
                  onClick={next}
                  disabled={!canAdvance}
                  className={`flex-1 rounded-full py-3.5 text-white font-medium text-[14px] flex items-center justify-center gap-2 transition ${
                    canAdvance ? "bg-[#1C1D1B] hover:bg-black" : "bg-[#1C1D1B]/40"
                  }`}
                  data-testid="onboard-next"
                >
                  {isAr ? "التّالي" : "Continue"}
                  <ArrowRight className={`w-4 h-4 ${isAr ? "rotate-180" : ""}`} />
                </button>
              ) : (
                <button
                  onClick={finish}
                  className="flex-1 rounded-full bg-[#2A5A4A] hover:bg-[#1f4438] text-white py-3.5 font-medium text-[14px] flex items-center justify-center gap-2"
                  data-testid="onboard-finish"
                >
                  <Check className="w-4 h-4" />
                  {isAr ? "ابدأ رحلتي" : "Start my journey"}
                </button>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function Choice({ icon: Icon, active, label, sub, onClick, testid }) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left rounded-2xl border p-4 transition active:scale-[0.99] ${
        active
          ? "border-[#B3884D] bg-[#FBF1DD] shadow-[0_8px_18px_-12px_rgba(179,136,77,0.5)]"
          : "border-[#E8E5DD] bg-white hover:border-[#B3884D]"
      }`}
      data-testid={testid}
    >
      <div className="flex items-center gap-3">
        {Icon && (
          <div className={`w-10 h-10 rounded-full grid place-items-center flex-shrink-0 ${
            active ? "bg-white" : "bg-[#FBF8F1]"
          }`}>
            <Icon className={`w-[18px] h-[18px] ${active ? "text-[#B3884D]" : "text-[#7B5C24]"}`} />
          </div>
        )}
        <div className="flex-1">
          <div className="text-[14px] font-semibold text-[#1C1D1B]">{label}</div>
          {sub && <div className="text-[11px] text-[#8E8F8A] mt-0.5">{sub}</div>}
        </div>
        {active && <Check className="w-4 h-4 text-[#B3884D] flex-shrink-0" />}
      </div>
    </button>
  );
}
