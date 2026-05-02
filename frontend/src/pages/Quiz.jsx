import React from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, Check, X, RotateCcw, Trophy, BookOpen, Share2, Sparkles } from "lucide-react";
import { LangContext } from "../components/Layout";
import {
  QUIZ_CATEGORIES,
  DIFFICULTIES,
  pickQuestions,
} from "../lib/quiz";

const ROUND_SIZE = 10;

export default function Quiz() {
  const { lang } = React.useContext(LangContext);
  const isAr = lang === "ar";
  const [stage, setStage] = React.useState("start"); // start | playing | done
  const [category, setCategory] = React.useState(null); // null = mix
  const [difficulty, setDifficulty] = React.useState(null); // null = mix
  const [questions, setQuestions] = React.useState([]);
  const [idx, setIdx] = React.useState(0);
  const [picked, setPicked] = React.useState(null);
  const [score, setScore] = React.useState(0);
  const [bestScore, setBestScore] = React.useState(
    () => parseInt(localStorage.getItem("umrah_quiz_best") || "0", 10)
  );

  const begin = () => {
    const qs = pickQuestions({ count: ROUND_SIZE, category, difficulty });
    if (qs.length === 0) return;
    setQuestions(qs);
    setIdx(0);
    setScore(0);
    setPicked(null);
    setStage("playing");
  };

  const choose = (i) => {
    if (picked != null) return;
    setPicked(i);
    if (i === questions[idx].answer) setScore((s) => s + 1);
  };

  const next = () => {
    if (idx + 1 >= questions.length) {
      // Quiz complete
      if (score > bestScore) {
        localStorage.setItem("umrah_quiz_best", String(score));
        setBestScore(score);
      }
      setStage("done");
    } else {
      setIdx(idx + 1);
      setPicked(null);
    }
  };

  const share = async () => {
    const text = isAr
      ? `حصلت على ${score} من ${questions.length} في اختبار العمرة على السنة! جرّبه: https://sunnahumrah.app/quiz`
      : `I scored ${score}/${questions.length} on the Sunnah Umrah quiz! Try it: https://sunnahumrah.app/quiz`;
    if (navigator.share) {
      try { await navigator.share({ title: "Sunnah Umrah Quiz", text }); return; } catch (_) {}
    }
    try { await navigator.clipboard.writeText(text); } catch (_) {}
  };

  // ─── Start screen ─────────────────────────────────────────────────
  if (stage === "start") {
    return (
      <div className="max-w-md mx-auto pb-12" data-testid="quiz-page">
        <Link to="/" className="inline-flex items-center gap-1 text-[12px] text-[#8E8F8A] no-underline mb-3 mt-2">
          <ArrowLeft className={`w-3.5 h-3.5 ${isAr ? "rotate-180" : ""}`} />
          <span className={isAr ? "font-arabic" : ""}>{isAr ? "الرّجوع" : "Back"}</span>
        </Link>
        <div className="mt-2">
          <p className="text-xs uppercase tracking-[0.22em] text-[#8E8F8A]">{isAr ? "اختبر نفسك" : "Test yourself"}</p>
          <h1 className="mt-2 text-[28px] font-medium tracking-tight text-[#1C1D1B]">
            {isAr ? "اختبار العمرة" : "Umrah Quiz"}
          </h1>
          <p className="mt-2 text-[14px] text-[#5C5D58] max-w-[34ch]">
            {isAr
              ? "اختبر معرفتك بأحكام العمرة وفق السنّة. كلّ سؤال يأتي مع المصدر."
              : "Test your knowledge of ʿUmrah according to the Sunnah. Every question shows its source."}
          </p>
        </div>

        {bestScore > 0 && (
          <div className="mt-5 rounded-2xl bg-[#1C1D1B] text-white p-4 flex items-center gap-3" data-testid="quiz-best">
            <Trophy className="w-5 h-5 text-[#B3884D]" />
            <div className="flex-1">
              <div className="text-[10px] uppercase tracking-[0.22em] text-[#B3884D]">
                {isAr ? "أعلى نتيجة" : "Best score"}
              </div>
              <div className="text-[20px] font-light tabular-nums">
                {bestScore}/{ROUND_SIZE}
              </div>
            </div>
          </div>
        )}

        {/* Category */}
        <div className="mt-5">
          <div className="text-[10px] uppercase tracking-[0.22em] text-[#8E8F8A] mb-2">
            {isAr ? "الفئة" : "Category"}
          </div>
          <div className="grid grid-cols-2 gap-2" data-testid="quiz-categories">
            <button
              onClick={() => setCategory(null)}
              className={`px-3 py-2 rounded-xl text-[13px] border transition ${
                category === null
                  ? "bg-[#1C1D1B] text-white border-[#1C1D1B]"
                  : "bg-white text-[#1C1D1B] border-[#E8E5DD]"
              }`}
              data-testid="quiz-cat-all"
            >
              {isAr ? "كل الفئات" : "All categories"}
            </button>
            {QUIZ_CATEGORIES.map((c) => (
              <button
                key={c.id}
                onClick={() => setCategory(c.id)}
                className={`px-3 py-2 rounded-xl text-[13px] border transition ${
                  category === c.id
                    ? "bg-[#1C1D1B] text-white border-[#1C1D1B]"
                    : "bg-white text-[#1C1D1B] border-[#E8E5DD]"
                }`}
                data-testid={`quiz-cat-${c.id}`}
              >
                {isAr ? c.label_ar : c.label_en}
              </button>
            ))}
          </div>
        </div>

        {/* Difficulty */}
        <div className="mt-4">
          <div className="text-[10px] uppercase tracking-[0.22em] text-[#8E8F8A] mb-2">
            {isAr ? "المستوى" : "Difficulty"}
          </div>
          <div className="grid grid-cols-4 gap-2" data-testid="quiz-difficulties">
            <button
              onClick={() => setDifficulty(null)}
              className={`px-2 py-2 rounded-xl text-[12px] border transition ${
                difficulty === null
                  ? "bg-[#B3884D] text-white border-[#B3884D]"
                  : "bg-white text-[#1C1D1B] border-[#E8E5DD]"
              }`}
              data-testid="quiz-diff-all"
            >
              {isAr ? "الكلّ" : "Mix"}
            </button>
            {DIFFICULTIES.map((d) => (
              <button
                key={d.id}
                onClick={() => setDifficulty(d.id)}
                className={`px-2 py-2 rounded-xl text-[12px] border transition ${
                  difficulty === d.id
                    ? "bg-[#B3884D] text-white border-[#B3884D]"
                    : "bg-white text-[#1C1D1B] border-[#E8E5DD]"
                }`}
                data-testid={`quiz-diff-${d.id}`}
              >
                {isAr ? d.label_ar : d.label_en}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={begin}
          className="mt-7 w-full tap-pulse rounded-full bg-[#1C1D1B] text-white text-sm font-medium px-5 py-3.5 inline-flex items-center justify-center gap-2"
          data-testid="quiz-start"
        >
          <Sparkles className="w-4 h-4" />
          {isAr ? "ابدأ الاختبار" : "Start quiz"}
        </button>

        <p className="mt-3 text-center text-[11px] text-[#8E8F8A]">
          {isAr ? `${ROUND_SIZE} أسئلة لكلّ جولة` : `${ROUND_SIZE} questions per round`}
        </p>
      </div>
    );
  }

  // ─── Playing screen ────────────────────────────────────────────────
  if (stage === "playing") {
    const q = questions[idx];
    const correct = picked === q.answer;
    const cat = QUIZ_CATEGORIES.find((c) => c.id === q.category);
    return (
      <div className="max-w-md mx-auto pb-32" data-testid="quiz-active">
        {/* Progress + score */}
        <div className="mt-2 flex items-center justify-between text-[11px] text-[#5C5D58]">
          <span data-testid="quiz-progress">{idx + 1} / {questions.length}</span>
          <span>
            {isAr ? "النّتيجة" : "Score"}: <span className="font-semibold text-[#1C1D1B] tabular-nums" data-testid="quiz-score">{score}</span>
          </span>
        </div>
        <div className="mt-1.5 h-1 rounded-full bg-[#E8E5DD] overflow-hidden">
          <div
            className="h-full bg-[#B3884D] transition-all"
            style={{ width: `${((idx + (picked != null ? 1 : 0)) / questions.length) * 100}%` }}
          />
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={q.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
            className="mt-5 rounded-3xl bg-white border border-[#E8E5DD] p-5"
          >
            <div className="text-[10px] uppercase tracking-[0.22em] text-[#B3884D]">
              {isAr ? cat?.label_ar : cat?.label_en} · {isAr ? DIFFICULTIES.find((d) => d.id === q.difficulty)?.label_ar : DIFFICULTIES.find((d) => d.id === q.difficulty)?.label_en}
            </div>
            <h2 className={`mt-3 text-[18px] font-medium leading-snug text-[#1C1D1B] ${isAr ? "font-arabic text-right" : ""}`} data-testid="quiz-question">
              {isAr ? q.q_ar : q.q_en}
            </h2>

            <div className="mt-4 space-y-2" data-testid="quiz-options">
              {q.options.map((opt, i) => {
                const isCorrect = i === q.answer;
                const isPicked = picked === i;
                let bg = "bg-[#F8F6F0] border-[#E8E5DD]";
                let icon = null;
                if (picked != null) {
                  if (isCorrect) {
                    bg = "bg-[#E7F1EB] border-[#2A5A4A] text-[#1C1D1B]";
                    icon = <Check className="w-4 h-4 text-[#2A5A4A] flex-shrink-0" />;
                  } else if (isPicked) {
                    bg = "bg-[#F4E1DF] border-[#8B4540] text-[#1C1D1B]";
                    icon = <X className="w-4 h-4 text-[#8B4540] flex-shrink-0" />;
                  }
                }
                return (
                  <button
                    key={i}
                    onClick={() => choose(i)}
                    disabled={picked != null}
                    className={`w-full text-left flex items-center gap-3 px-4 py-3 rounded-2xl border ${bg} transition active:scale-[0.99] disabled:cursor-default`}
                    data-testid={`quiz-option-${i}`}
                  >
                    <span className={`text-[14px] flex-1 ${isAr ? "font-arabic text-right" : ""}`}>
                      {isAr ? opt.ar : opt.en}
                    </span>
                    {icon}
                  </button>
                );
              })}
            </div>

            {picked != null && (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 rounded-2xl bg-[#F8F6F0] border border-[#E8E5DD] p-3.5"
                data-testid="quiz-explain"
              >
                <div className={`text-[12px] font-semibold ${correct ? "text-[#2A5A4A]" : "text-[#8B4540]"} mb-1`}>
                  {correct ? (isAr ? "إجابة صحيحة" : "Correct") : (isAr ? "غير صحيح" : "Not quite")}
                </div>
                <p className={`text-[13px] text-[#1C1D1B] leading-relaxed ${isAr ? "font-arabic text-right" : ""}`}>
                  {isAr ? q.explain_ar : q.explain_en}
                </p>
                {q.source && (
                  <div className="mt-2 inline-flex items-center gap-1.5 text-[10px] text-[#8E8F8A]">
                    <BookOpen className="w-3 h-3" />
                    {q.source}
                  </div>
                )}
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>

        {picked != null && (
          <button
            onClick={next}
            className="fixed bottom-24 left-1/2 -translate-x-1/2 w-[min(92vw,28rem)] tap-pulse rounded-full bg-[#1C1D1B] text-white text-sm font-medium px-5 py-3 inline-flex items-center justify-center gap-2 shadow-lg"
            data-testid="quiz-next"
          >
            {idx + 1 < questions.length ? (isAr ? "السّؤال التالي" : "Next question") : (isAr ? "إنهاء" : "Finish")}
            <ArrowRight className={`w-4 h-4 ${isAr ? "rotate-180" : ""}`} />
          </button>
        )}
      </div>
    );
  }

  // ─── Done screen ───────────────────────────────────────────────────
  const pct = Math.round((score / questions.length) * 100);
  const tier =
    pct >= 90 ? (isAr ? "ممتاز ما شاء الله" : "Excellent — mā shāʾa Allāh") :
    pct >= 70 ? (isAr ? "أحسنت" : "Well done") :
    pct >= 50 ? (isAr ? "جيّد، استمرّ" : "Keep going") :
    (isAr ? "ابدأ من جديد" : "Worth another try");
  return (
    <div className="max-w-md mx-auto pb-12 text-center" data-testid="quiz-done">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 110, damping: 14 }}
        className="mt-8 mx-auto w-24 h-24 rounded-full bg-[#1C1D1B] grid place-items-center"
      >
        <Trophy className="w-10 h-10 text-[#B3884D]" />
      </motion.div>
      <h1 className="mt-5 text-[28px] font-medium tracking-tight text-[#1C1D1B]">{tier}</h1>
      <div className="mt-2 text-[14px] text-[#5C5D58]">
        {isAr ? "نتيجتك" : "Your score"}
      </div>
      <div className="mt-1 text-[64px] font-light tracking-tight tabular-nums text-[#1C1D1B]" data-testid="quiz-final-score">
        {score}<span className="text-[#8E8F8A]">/{questions.length}</span>
      </div>
      {score === bestScore && score > 0 && (
        <div className="mt-2 inline-flex items-center gap-1 text-[12px] text-[#B3884D]">
          <Sparkles className="w-3.5 h-3.5" /> {isAr ? "أعلى نتيجة جديدة!" : "New best score!"}
        </div>
      )}

      <div className="mt-7 grid grid-cols-2 gap-2 text-left">
        <button
          onClick={begin}
          className="tap-pulse rounded-full bg-[#1C1D1B] text-white text-sm font-medium px-5 py-3 inline-flex items-center justify-center gap-2"
          data-testid="quiz-retry"
        >
          <RotateCcw className="w-4 h-4" /> {isAr ? "أعد" : "Play again"}
        </button>
        <button
          onClick={share}
          className="tap-pulse rounded-full bg-white border border-[#E8E5DD] text-[#1C1D1B] text-sm font-medium px-5 py-3 inline-flex items-center justify-center gap-2"
          data-testid="quiz-share"
        >
          <Share2 className="w-4 h-4" /> {isAr ? "شارك" : "Share"}
        </button>
      </div>

      <button
        onClick={() => setStage("start")}
        className="mt-3 text-[12px] text-[#8E8F8A] underline"
        data-testid="quiz-change-topic"
      >
        {isAr ? "تغيير الفئة أو المستوى" : "Change category or level"}
      </button>
    </div>
  );
}
