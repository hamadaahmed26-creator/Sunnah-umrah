// First-launch personalized onboarding. 4 short questions, builds a tailored
// home experience. Saved locally; never sent to a server.

import React from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  X, ArrowRight, ArrowLeft, User, Users, Heart, Accessibility,
  BookOpen, Sparkles, Calendar, Check, Briefcase, Plane, MapPin, Footprints,
} from "lucide-react";
import { saveProfile } from "../lib/userProfile";

const STEPS = 4;

// Maps each "purpose" choice to the experience field + which personas need
// the full 4-step flow (going / helping) vs. a quick "go straight in" path
// (in-makkah / learning / completed).
const PURPOSE_TO_EXPERIENCE = {
  going: "first",
  helping: "helping",
  "in-makkah": "first",
  learning: "first",
  completed: "returning",
};
const NEEDS_FULL_FLOW = (purpose) => purpose === "going" || purpose === "helping";

export default function OnboardingSheet({ open, onComplete, onSkip, isAr, initialAnswers, editMode }) {
  const navigate = useNavigate();
  const [step, setStep] = React.useState(0);
  const [answers, setAnswers] = React.useState({
    purpose: null,
    travelers: null,
    experience: null,
    knowledge: null,
    tripDate: null,
  });

  // When reopened in edit mode, pre-fill with the user's previous answers
  // so they only change what they want, instead of starting from scratch.
  React.useEffect(() => {
    if (open && initialAnswers) {
      setAnswers({
        purpose: initialAnswers.purpose ?? null,
        travelers: initialAnswers.travelers ?? null,
        experience: initialAnswers.experience ?? null,
        knowledge: initialAnswers.knowledge ?? null,
        tripDate: initialAnswers.tripDate ?? null,
      });
      setStep(0);
    } else if (open && !initialAnswers) {
      setStep(0);
      setAnswers({
        purpose: null,
        travelers: null,
        experience: null,
        knowledge: null,
        tripDate: null,
      });
    }
  }, [open, initialAnswers]);

  // Total steps depends on the user's purpose. Going / Helping = 4 steps
  // (purpose + travelers + knowledge + date). All other personas are done
  // after step 0 — they don't need travel logistics.
  const totalSteps = NEEDS_FULL_FLOW(answers.purpose) ? STEPS : 1;

  const next = () => setStep((s) => Math.min(totalSteps - 1, s + 1));
  const back = () => setStep((s) => Math.max(0, s - 1));

  const finish = () => {
    saveProfile({ ...answers, done: true });
    onComplete?.(answers);
  };

  const skip = () => {
    saveProfile({ ...answers, done: true });
    onSkip?.();
  };

  // When the user picks a purpose, we set BOTH `purpose` and the legacy
  // `experience` field so existing code that checks experience keeps working.
  // For "in-makkah" / "learning" / "completed" we auto-finish — no extra
  // questions; they want to use the app immediately.
  const pickPurpose = (purpose) => {
    const exp = PURPOSE_TO_EXPERIENCE[purpose];
    const updated = { ...answers, purpose, experience: exp };
    setAnswers(updated);
    if (!NEEDS_FULL_FLOW(purpose)) {
      // Save & close on the same tick — feels instant.
      saveProfile({ ...updated, done: true });
      // Tiny defer so the choice tick animates before the sheet closes.
      setTimeout(() => onComplete?.(updated), 220);
    }
  };

  const set = (k, v) => setAnswers((a) => ({ ...a, [k]: v }));

  const canAdvance =
    (step === 0 && answers.purpose && NEEDS_FULL_FLOW(answers.purpose)) ||
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
                {editMode
                  ? (isAr ? "تعديل تفضيلاتي" : "Edit my answers")
                  : NEEDS_FULL_FLOW(answers.purpose)
                    ? (isAr ? `${step + 1} من ${STEPS}` : `Step ${step + 1} of ${STEPS}`)
                    : (isAr ? "ابدأ" : "Get started")}
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
                  animate={{ width: `${((step + 1) / totalSteps) * 100}%` }}
                />
              </div>
            </div>

            <div className="px-6 pt-5 pb-8 min-h-[420px]">
              {/* Step 0 — purpose. Captures WHY the user is here so the
                  rest of the app (and the home layout) adapt accordingly.
                  Going / Helping → continue to travelers / knowledge / date.
                  In Makkah / Learning / Already done → auto-finish, straight in. */}
              {step === 0 && (
                <div data-testid="onboard-step-purpose">
                  <h2 className={`text-[24px] font-medium leading-tight text-[#1C1D1B] ${isAr ? "font-arabic text-right" : ""}`}>
                    {isAr ? "ما الذي جاء بك إلى هنا؟" : "What brings you here?"}
                  </h2>
                  <p className={`mt-2 text-[13px] text-[#5C5D58] ${isAr ? "font-arabic text-right" : ""}`}>
                    {isAr ? "سنُكيّف الصّفحة الرّئيسيّة لتُناسبك." : "We'll tailor the home page to suit you."}
                  </p>
                  <div className="mt-5 space-y-2">
                    <Choice icon={Footprints} active={answers.purpose === "going"}
                      label={isAr ? "أنوي الذّهاب" : "I'm planning to go"}
                      sub={isAr ? "قريبًا إن شاء الله" : "Soon, in shāʾ Allāh"}
                      onClick={() => pickPurpose("going")}
                      testid="onboard-purpose-going" />
                    <Choice icon={Heart} active={answers.purpose === "helping"}
                      label={isAr ? "أساعد شخصًا للذّهاب" : "I'm helping someone go"}
                      sub={isAr ? "زوج، والد، صديق" : "Spouse, parent, friend"}
                      onClick={() => pickPurpose("helping")}
                      testid="onboard-purpose-helping" />
                    <Choice icon={MapPin} active={answers.purpose === "in-makkah"}
                      label={isAr ? "أنا في مكّة/المدينة الآن" : "I'm in Makkah/Madinah right now"}
                      sub={isAr ? "ابدأ مباشرة" : "Take me straight to the steps"}
                      onClick={() => pickPurpose("in-makkah")}
                      testid="onboard-purpose-makkah" />
                    <Choice icon={BookOpen} active={answers.purpose === "learning"}
                      label={isAr ? "أريد التّعلّم فقط" : "I just want to learn"}
                      sub={isAr ? "لا توجد رحلة مخطّطة" : "No trip planned yet"}
                      onClick={() => pickPurpose("learning")}
                      testid="onboard-purpose-learning" />
                    <Choice icon={Sparkles} active={answers.purpose === "completed"}
                      label={isAr ? "أدّيت العمرة من قبل" : "I've already been"}
                      sub={isAr ? "تذكيرات، أدعية، معرفة" : "Reminders, du'ās, knowledge"}
                      onClick={() => pickPurpose("completed")}
                      testid="onboard-purpose-completed" />
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
                  </div>

                  {/* Not booked yet? Show two direct booking CTAs (Packages /
                      DIY) so the user can act immediately instead of being
                      stuck on a dead-end "I haven't booked yet" label. */}
                  <div className="mt-4">
                    <div className={`text-[11px] uppercase tracking-[0.18em] text-[#8E8F8A] mb-2 ${isAr ? "font-arabic text-right" : ""}`}>
                      {answers.experience === "helping"
                        ? (isAr ? "لم يحجزوا بعد؟" : "They haven't booked yet?")
                        : (isAr ? "لم تحجز بعد؟" : "Haven't booked yet?")}
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => {
                          saveProfile({ ...answers, done: true });
                          onComplete?.(answers);
                          navigate("/packages");
                        }}
                        className="rounded-2xl bg-gradient-to-br from-[#FFF7E6] to-[#F4DCA1] border border-[#EBD9B0] hover:border-[#B3884D] p-3 text-left tap-pulse transition active:scale-[0.98]"
                        data-testid="onboard-cta-packages"
                      >
                        <Briefcase className="w-4 h-4 text-[#7B5C24] mb-1.5" />
                        <div className={`text-[12px] font-semibold text-[#1C1D1B] leading-tight ${isAr ? "font-arabic" : ""}`}>
                          {isAr ? "باقات شاملة" : "Umrah packages"}
                        </div>
                        <div className={`mt-0.5 text-[10px] text-[#8B6A1F] leading-snug ${isAr ? "font-arabic text-right" : ""}`}>
                          {isAr ? "رحلة + فندق + توجيه" : "All-inclusive trips"}
                        </div>
                      </button>
                      <button
                        onClick={() => {
                          saveProfile({ ...answers, done: true });
                          onComplete?.(answers);
                          navigate("/hotels");
                        }}
                        className="rounded-2xl bg-gradient-to-br from-white to-[#F1F4F1] border border-[#DDE4DC] hover:border-[#2A5A4A] p-3 text-left tap-pulse transition active:scale-[0.98]"
                        data-testid="onboard-cta-diy"
                      >
                        <Plane className="w-4 h-4 text-[#2A5A4A] mb-1.5" />
                        <div className={`text-[12px] font-semibold text-[#1C1D1B] leading-tight ${isAr ? "font-arabic" : ""}`}>
                          {isAr ? "حجز بنفسي" : "Hotels & flights"}
                        </div>
                        <div className={`mt-0.5 text-[10px] text-[#3F584F] leading-snug ${isAr ? "font-arabic text-right" : ""}`}>
                          {isAr ? "اختر بنفسك" : "Book each piece"}
                        </div>
                      </button>
                    </div>
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
              {step < totalSteps - 1 ? (
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
