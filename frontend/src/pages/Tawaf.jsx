import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Volume2, RotateCcw, Check, ArrowDown } from "lucide-react";
import { LangContext } from "../components/Layout";

/*
 ONE-BUTTON TAWAF MODE
 ─────────────────────
 The pilgrim is tired, in ihram, hands full, in a crowd.
 They never have to swipe. The whole screen is:
   • Huge lap counter
   • 4 plain instructions for THIS lap
   • One giant button to tap when they pass the Black Stone

 Tapping the button advances the lap, vibrates, and says
 "Allāhu Akbar" out loud. After 7 taps → Tawaf complete.
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

const RABBANA_DUA = {
  ar: "رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ",
  tr: "Rabbanā ātinā fid-dunyā ḥasanatan wa fil-ākhirati ḥasanatan wa qinā 'adhāban-nār.",
  en: "Our Lord, give us good in this world and good in the Hereafter, and protect us from the Fire.",
};

function instructionsFor(lap, isAr) {
  const isJogLap = lap < 3;
  return [
    {
      icon: "1",
      title_en: "At the Black Stone",
      title_ar: "عند الحجر الأسود",
      body_en: "Face it, raise your right hand, say Allāhu Akbar — once.",
      body_ar: "استقبله، ارفع يدك اليمنى، قل: اللَّهُ أَكْبَر — مرّة واحدة.",
    },
    {
      icon: "2",
      title_en: isAr ? "" : "Walking",
      title_ar: "أثناء المشي",
      body_en: isJogLap
        ? "Ka'bah on your LEFT. Men: brisk pace, shoulders shaken (Raml). Women: walk normally."
        : "Ka'bah on your LEFT. Walk at normal pace. Make du'a in any language.",
      body_ar: isJogLap
        ? "الكعبة على يسارك. الرجال: بسرعة مع تحريك الكتفين (الرَّمَل). النساء: المشي العادي."
        : "الكعبة على يسارك. بمشيك المعتاد. ادعُ بأي لغة.",
    },
    {
      icon: "3",
      title_en: "Yemeni Corner",
      title_ar: "الركن اليماني",
      body_en: "Touch with your right hand if easy. DO NOT kiss it. NO takbir, NO du'a here.",
      body_ar: "المسه بيدك اليمنى إن تيسّر. لا تُقبّله. لا تكبّر ولا تَدعُ هنا.",
    },
    {
      icon: "4",
      title_en: "Yemeni → Black Stone",
      title_ar: "بين الركن والحجر",
      body_en: "On the final stretch, recite the du'a below.",
      body_ar: "في الجزء الأخير اقرأ الدعاء بالأسفل.",
    },
  ];
}

export default function Tawaf() {
  const { lang } = React.useContext(LangContext);
  const isAr = lang === "ar";

  const [lap, setLap] = React.useState(() =>
    parseInt(localStorage.getItem("umrah_tawaf_count") || "0", 10)
  );
  const [pulse, setPulse] = React.useState(0);

  React.useEffect(() => {
    localStorage.setItem("umrah_tawaf_count", String(lap));
  }, [lap]);

  const allDone = lap >= 7;

  const onLapDone = () => {
    if (lap >= 7) return;
    if (navigator.vibrate) navigator.vibrate([40, 50, 40, 50, 80]);
    speak("اللَّهُ أَكْبَر");
    setPulse((p) => p + 1);
    setLap((l) => Math.min(7, l + 1));
  };

  const reset = () => setLap(0);

  if (allDone) {
    return (
      <div className="max-w-md mx-auto pb-12 text-center" data-testid="tawaf-page">
        <div className="mt-12 inline-flex w-20 h-20 rounded-full bg-[#2A5A4A] text-white items-center justify-center">
          <Check className="w-10 h-10" />
        </div>
        <h1 className="mt-6 text-[28px] font-medium text-[#1C1D1B]">
          {isAr ? "اكتمل الطواف" : "Tawaf Complete"}
        </h1>
        <p className="mt-1 text-[14px] tracking-[0.18em] uppercase text-[#B3884D]">
          {isAr ? "الحمد لله" : "Alhamdulillah"}
        </p>
        <div className="mt-8 mx-4 rounded-2xl border border-[#E8E5DD] bg-[#F8F6F0] p-5 text-left">
          <div className="text-[10px] uppercase tracking-[0.22em] text-[#B3884D] mb-3">
            {isAr ? "ما يلي" : "What's next"}
          </div>
          <ol className="space-y-2 text-[15px] text-[#1C1D1B] leading-relaxed">
            <li>1 — {isAr ? "صلِّ ركعتين خلف مقام إبراهيم" : "Pray 2 raka'ah behind Maqam Ibrahim"}</li>
            <li>2 — {isAr ? "اشرب من ماء زمزم" : "Drink Zamzam water"}</li>
            <li>3 — {isAr ? "توجّه للسعي بين الصفا والمروة" : "Go to Sa'i between Safa and Marwah"}</li>
          </ol>
        </div>
        <button
          onClick={reset}
          className="mt-8 inline-flex items-center gap-2 rounded-full border border-[#E8E5DD] bg-white px-5 py-3 text-sm text-[#1C1D1B] tap-pulse"
          data-testid="tawaf-reset"
        >
          <RotateCcw className="w-4 h-4" /> {isAr ? "إعادة" : "Start over"}
        </button>
      </div>
    );
  }

  const steps = instructionsFor(lap, isAr);

  return (
    <div className="max-w-md mx-auto pb-44 px-1" data-testid="tawaf-page">
      {/* Header */}
      <div className="mt-2 flex items-center justify-between">
        <div>
          <div className="text-[10px] uppercase tracking-[0.22em] text-[#B3884D]">
            {isAr ? "الطواف" : "Tawaf"}
          </div>
          <div className="mt-1 text-[14px] text-[#5C5D58]">
            {isAr ? "اضغط الزر الكبير عند كل مرور بالحجر الأسود" : "Tap the big button each time you pass the Black Stone"}
          </div>
        </div>
        <button
          onClick={reset}
          className="tap-pulse w-10 h-10 rounded-full bg-white border border-[#E8E5DD] grid place-items-center"
          aria-label="reset"
          data-testid="tawaf-reset"
        >
          <RotateCcw className="w-4 h-4 text-[#1C1D1B]" />
        </button>
      </div>

      {/* HUGE lap counter */}
      <div className="mt-5 rounded-3xl bg-[#1C1D1B] text-white px-6 py-7 text-center relative overflow-hidden">
        <AnimatePresence>
          <motion.div
            key={pulse}
            initial={{ scale: 1.2, opacity: 0 }}
            animate={{ scale: 1, opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="absolute inset-0 bg-[#B3884D]"
          />
        </AnimatePresence>
        <div className="relative">
          <div className="text-[10px] uppercase tracking-[0.28em] text-[#B3884D]">
            {isAr ? "الشوط" : "Lap"}
          </div>
          <div className="mt-1 flex items-baseline justify-center gap-2">
            <span className="text-[88px] leading-none font-medium" data-testid="tawaf-lap-number">
              {lap + 1}
            </span>
            <span className="text-[24px] text-white/55">/ 7</span>
          </div>
          <div className="mt-4 grid grid-cols-7 gap-1.5" data-testid="tawaf-pips">
            {Array.from({ length: 7 }).map((_, i) => (
              <div
                key={i}
                className={`h-1.5 rounded-full ${i < lap ? "bg-[#B3884D]" : "bg-white/15"}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* What to do this lap */}
      <ol className="mt-6 space-y-3" data-testid="tawaf-steps">
        {steps.map((s, i) => (
          <li
            key={i}
            className="flex gap-3 rounded-2xl bg-white border border-[#E8E5DD] p-4"
          >
            <div className="flex-shrink-0 w-7 h-7 rounded-full bg-[#F8F6F0] border border-[#E8E5DD] grid place-items-center text-[12px] font-medium text-[#1C1D1B]">
              {s.icon}
            </div>
            <div className="flex-1 min-w-0">
              {(isAr ? s.title_ar : s.title_en) && (
                <div className={`text-[13px] font-medium text-[#1C1D1B] ${isAr ? "text-right font-arabic" : ""}`}>
                  {isAr ? s.title_ar : s.title_en}
                </div>
              )}
              <div className={`text-[14px] text-[#5C5D58] leading-relaxed ${isAr ? "text-right font-arabic" : ""}`}>
                {isAr ? s.body_ar : s.body_en}
              </div>
            </div>
          </li>
        ))}
      </ol>

      {/* The single du'a (only one for whole lap) */}
      <div className="mt-4 rounded-2xl bg-[#F8F6F0] border border-[#E8E5DD] p-5" data-testid="tawaf-dua">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <div className="text-[10px] uppercase tracking-[0.22em] text-[#B3884D] mb-2">
              {isAr ? "دعاء عند الركن قبل الحجر" : "Du'a between Yemeni & Black Stone"}
            </div>
            <p className="font-arabic text-[22px] leading-[2] text-right text-[#1C1D1B]">
              {RABBANA_DUA.ar}
            </p>
          </div>
          <button
            onClick={() => speak(RABBANA_DUA.ar)}
            className="tap-pulse w-11 h-11 grid place-items-center rounded-full bg-white border border-[#E8E5DD]"
            aria-label="listen"
            data-testid="tawaf-dua-play"
          >
            <Volume2 className="w-5 h-5 text-[#1C1D1B]" />
          </button>
        </div>
        <p className="mt-3 text-[12px] italic text-[#5C5D58]">{RABBANA_DUA.tr}</p>
        <p className="mt-1 text-[12px] text-[#1C1D1B]">{RABBANA_DUA.en}</p>
      </div>

      {/* Down arrow hint pointing to the big button */}
      <div className="mt-6 flex flex-col items-center text-[11px] tracking-[0.22em] uppercase text-[#B3884D]">
        <ArrowDown className="w-4 h-4 mb-1" />
        {isAr ? "اضغط عند المرور بالحجر" : "Tap when you pass the Black Stone"}
      </div>

      {/* THE BIG BUTTON — sticky bottom for thumb reach */}
      <div className="fixed inset-x-0 bottom-20 px-4 z-30 pointer-events-none">
        <div className="max-w-md mx-auto">
          <motion.button
            whileTap={{ scale: 0.96 }}
            onClick={onLapDone}
            className="pointer-events-auto w-full rounded-full bg-[#1C1D1B] hover:bg-black text-white py-7 shadow-[0_18px_40px_-10px_rgba(28,29,27,0.55)] flex flex-col items-center justify-center"
            data-testid="tawaf-pass-button"
          >
            <span className="text-[10px] uppercase tracking-[0.28em] text-[#B3884D]">
              {isAr ? "الشوط" : "Lap"} {lap + 1}
            </span>
            <span className="mt-0.5 text-[20px] font-medium">
              {isAr ? "مررت بالحجر الأسود" : "I passed the Black Stone"}
            </span>
          </motion.button>
        </div>
      </div>
    </div>
  );
}
