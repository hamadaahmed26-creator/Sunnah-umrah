import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Volume2, RotateCcw, Check, ArrowDown } from "lucide-react";
import { LangContext } from "../components/Layout";

/*
 ONE-BUTTON SA'I MODE
 ────────────────────
 Same kid-friendly idea as Tawaf. The pilgrim sees:
   • Huge trip counter
   • Where to head this trip ("Heading to MARWAH")
   • 4 plain instructions for this trip
   • The full takbir+tahlil to recite on each hill
   • One giant button at the bottom: "I REACHED MARWAH"
 7 taps → Sa'i complete.
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

const TAKBIR_TAHLIL = {
  ar: "اللَّهُ أَكْبَر، اللَّهُ أَكْبَر، اللَّهُ أَكْبَر، لَا إِلَهَ إِلاَّ اللَّهُ وَحْدَهُ لاَ شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ يُحْيِي وَيُمِيتُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِير، لاَ إِلَهَ إِلاَّ اللَّهُ وَحْدَهُ لاَ شَرِيكَ لَهُ، أَنْجَزَ وَعْدَهُ وَنَصَرَ عَبْدَهُ وَهَزَمَ الأَحْزَابَ وَحْدَهُ",
  tr: "Allāhu Akbar (×3). Lā ilāha illallāhu wahdahu lā sharīka lah, lahul-mulku wa lahul-hamdu, yuhyī wa yumītu, wa huwa 'alā kulli shay'in qadīr. Lā ilāha illallāhu wahdahu lā sharīka lah, anjaza wa'dahu wa nasara 'abdahu wa hazamal-ahzāba wahdah.",
  en: "Allah is the Greatest (×3). There is no god but Allah alone, He has no partner. To Him belongs all sovereignty and praise. He gives life and death and has power over all things. He fulfilled His promise, aided His servant, and alone defeated the confederates.",
};

const SAFA_VERSE = {
  ar: "إِنَّ الصَّفَا وَالْمَرْوَةَ مِنْ شَعَائِرِ اللَّهِ ۖ نَبْدَأُ بِمَا بَدَأَ اللَّهُ بِه",
  tr: "Innaṣ-Ṣafā wal-Marwata min sha'ā'irillāh… Nabda'u bimā bada'allāhu bihi.",
  en: "Indeed, Safa and Marwah are among the symbols of Allah… We begin with what Allah began with.",
};

function instructionsFor(trip, isAr) {
  const onSafa = trip % 2 === 0;
  const target = onSafa ? (isAr ? "المروة" : "Marwah") : (isAr ? "الصفا" : "Safa");
  const standing = onSafa ? (isAr ? "الصفا" : "Safa") : (isAr ? "المروة" : "Marwah");
  const isLast = trip === 6;

  const list = [];

  if (trip === 0) {
    list.push({
      icon: "✦",
      title_en: "First time on Safa",
      title_ar: "أول مرة على الصفا",
      body_en: "Climb Safa, face the Ka'bah, recite the verse below ONCE only.",
      body_ar: "اصعد الصفا، استقبل الكعبة، اقرأ الآية بالأسفل مرّة واحدة فقط.",
    });
  }

  if (isLast) {
    list.push({
      icon: "1",
      title_en: `Heading to ${target} — final time`,
      title_ar: `الذهاب إلى ${target} — المرّة الأخيرة`,
      body_en: "Walk normally. Make heartfelt du'a in any language.",
      body_ar: "امشِ بمشيك المعتاد. ادعُ من قلبك بأي لغة.",
    });
    list.push({
      icon: "2",
      title_en: "Green markers",
      title_ar: "العَلَمان الأخضران",
      body_en: "MEN: jog briskly between the green pillars. WOMEN: walk normally.",
      body_ar: "الرجال: يَهرولون بين العمودين الأخضرين. النساء: المشي العادي.",
    });
    list.push({
      icon: "3",
      title_en: `On ${target} (final)`,
      title_ar: `على ${target} (الأخيرة)`,
      body_en: "DO NOT recite the takbir this time. Make a long, heartfelt du'a, then tap Done.",
      body_ar: "لا تُكرّر التكبير هذه المرّة. ادعُ دعاءً مطوّلًا من القلب، ثم اضغط «انتهى».",
    });
  } else {
    list.push({
      icon: "1",
      title_en: `On ${standing}`,
      title_ar: `على ${standing}`,
      body_en: "Raise both hands. Recite the takbir 3 times. Make du'a after the 1st & 2nd. NO du'a after the 3rd.",
      body_ar: "ارفع يديك. اقرأ التكبير ثلاث مرات. ادعُ بعد الأولى والثانية. لا تَدعُ بعد الثالثة.",
    });
    list.push({
      icon: "2",
      title_en: `Walking to ${target}`,
      title_ar: `المشي إلى ${target}`,
      body_en: "Walk normally. Make du'a in any language. Watch for the GREEN markers.",
      body_ar: "امشِ بمشيك المعتاد. ادعُ بأي لغة. وانتبه للعَلَمين الأخضرين.",
    });
    list.push({
      icon: "3",
      title_en: "Green markers",
      title_ar: "العَلَمان الأخضران",
      body_en: "MEN: jog briskly between the green pillars. WOMEN: walk normally.",
      body_ar: "الرجال: يَهرولون بين العمودين الأخضرين. النساء: المشي العادي.",
    });
    list.push({
      icon: "4",
      title_en: `On ${target}`,
      title_ar: `على ${target}`,
      body_en: "Same as before: takbir 3 times, du'a after 1st & 2nd, no du'a after 3rd.",
      body_ar: "كما في السابق: التكبير ثلاث مرات، دعاء بعد الأولى والثانية، ولا دعاء بعد الثالثة.",
    });
  }

  return { list, target, isLast };
}

export default function Sai() {
  const { lang } = React.useContext(LangContext);
  const isAr = lang === "ar";

  const [trip, setTrip] = React.useState(() =>
    parseInt(localStorage.getItem("umrah_sai_count") || "0", 10)
  );
  const [pulse, setPulse] = React.useState(0);

  React.useEffect(() => {
    localStorage.setItem("umrah_sai_count", String(trip));
  }, [trip]);

  const allDone = trip >= 7;

  const onTripDone = () => {
    if (trip >= 7) return;
    if (navigator.vibrate) navigator.vibrate([40, 50, 40]);
    setPulse((p) => p + 1);
    setTrip((t) => Math.min(7, t + 1));
  };

  const reset = () => setTrip(0);

  if (allDone) {
    return (
      <div className="max-w-md mx-auto pb-12 text-center" data-testid="sai-page">
        <div className="mt-12 inline-flex w-20 h-20 rounded-full bg-[#2A5A4A] text-white items-center justify-center">
          <Check className="w-10 h-10" />
        </div>
        <h1 className="mt-6 text-[28px] font-medium text-[#1C1D1B]">
          {isAr ? "اكتمل السعي" : "Sa'i Complete"}
        </h1>
        <p className="mt-1 text-[14px] tracking-[0.18em] uppercase text-[#B3884D]">
          {isAr ? "الحمد لله" : "Alhamdulillah"}
        </p>
        <div className="mt-8 mx-4 rounded-2xl border border-[#E8E5DD] bg-[#F8F6F0] p-5 text-left">
          <div className="text-[10px] uppercase tracking-[0.22em] text-[#B3884D] mb-3">
            {isAr ? "آخر خطوة" : "Last step"}
          </div>
          <p className="text-[15px] text-[#1C1D1B] leading-relaxed">
            {isAr
              ? "اذهب للحلق أو التقصير لإتمام العمرة."
              : "Go for Halq (shave) or Taqsir (trim) to finish your Umrah."}
          </p>
        </div>
        <button
          onClick={reset}
          className="mt-8 inline-flex items-center gap-2 rounded-full border border-[#E8E5DD] bg-white px-5 py-3 text-sm text-[#1C1D1B] tap-pulse"
          data-testid="sai-reset"
        >
          <RotateCcw className="w-4 h-4" /> {isAr ? "إعادة" : "Start over"}
        </button>
      </div>
    );
  }

  const { list, target, isLast } = instructionsFor(trip, isAr);
  const recitation = trip === 0 ? SAFA_VERSE : TAKBIR_TAHLIL;

  return (
    <div className="max-w-md mx-auto pb-44 px-1" data-testid="sai-page">
      <div className="mt-2 flex items-center justify-between">
        <div>
          <div className="text-[10px] uppercase tracking-[0.22em] text-[#B3884D]">
            {isAr ? "السعي" : "Sa'i"}
          </div>
          <div className="mt-1 text-[14px] text-[#5C5D58]">
            {isAr
              ? `اضغط الزر الكبير عند الوصول إلى ${target}`
              : `Tap the big button when you reach ${target}`}
          </div>
        </div>
        <button
          onClick={reset}
          className="tap-pulse w-10 h-10 rounded-full bg-white border border-[#E8E5DD] grid place-items-center"
          aria-label="reset"
          data-testid="sai-reset"
        >
          <RotateCcw className="w-4 h-4 text-[#1C1D1B]" />
        </button>
      </div>

      {/* HUGE trip counter */}
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
            {isAr ? "الشوط" : "Trip"}
          </div>
          <div className="mt-1 flex items-baseline justify-center gap-2">
            <span className="text-[88px] leading-none font-medium" data-testid="sai-trip-number">
              {trip + 1}
            </span>
            <span className="text-[24px] text-white/55">/ 7</span>
          </div>
          <div className="mt-3 text-[12px] tracking-[0.22em] uppercase text-white/70">
            {isAr ? "متّجه إلى" : "Heading to"}{" "}
            <span className="text-white font-medium">{target}</span>
          </div>
          <div className="mt-4 grid grid-cols-7 gap-1.5" data-testid="sai-pips">
            {Array.from({ length: 7 }).map((_, i) => (
              <div
                key={i}
                className={`h-1.5 rounded-full ${i < trip ? "bg-[#B3884D]" : "bg-white/15"}`}
              />
            ))}
          </div>
        </div>
      </div>

      <ol className="mt-6 space-y-3" data-testid="sai-steps">
        {list.map((s, i) => (
          <li
            key={i}
            className="flex gap-3 rounded-2xl bg-white border border-[#E8E5DD] p-4"
          >
            <div className="flex-shrink-0 w-7 h-7 rounded-full bg-[#F8F6F0] border border-[#E8E5DD] grid place-items-center text-[12px] font-medium text-[#1C1D1B]">
              {s.icon}
            </div>
            <div className="flex-1 min-w-0">
              <div className={`text-[13px] font-medium text-[#1C1D1B] ${isAr ? "text-right font-arabic" : ""}`}>
                {isAr ? s.title_ar : s.title_en}
              </div>
              <div className={`text-[14px] text-[#5C5D58] leading-relaxed ${isAr ? "text-right font-arabic" : ""}`}>
                {isAr ? s.body_ar : s.body_en}
              </div>
            </div>
          </li>
        ))}
      </ol>

      {!isLast && (
        <div className="mt-4 rounded-2xl bg-[#F8F6F0] border border-[#E8E5DD] p-5" data-testid="sai-dua">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1">
              <div className="text-[10px] uppercase tracking-[0.22em] text-[#B3884D] mb-2">
                {trip === 0
                  ? (isAr ? "الآية على الصفا — مرّة فقط" : "Verse on Safa — once only")
                  : (isAr ? "التكبير على الصفا والمروة" : "Takbir on Safa & Marwah")}
              </div>
              <p className="font-arabic text-[19px] leading-[2] text-right text-[#1C1D1B]">
                {recitation.ar}
              </p>
            </div>
            <button
              onClick={() => speak(recitation.ar)}
              className="tap-pulse w-11 h-11 flex-shrink-0 grid place-items-center rounded-full bg-white border border-[#E8E5DD]"
              aria-label="listen"
              data-testid="sai-dua-play"
            >
              <Volume2 className="w-5 h-5 text-[#1C1D1B]" />
            </button>
          </div>
          <p className="mt-3 text-[12px] italic text-[#5C5D58]">{recitation.tr}</p>
          <p className="mt-1 text-[12px] text-[#1C1D1B]">{recitation.en}</p>
        </div>
      )}

      <div className="mt-6 flex flex-col items-center text-[11px] tracking-[0.22em] uppercase text-[#B3884D]">
        <ArrowDown className="w-4 h-4 mb-1" />
        {isAr ? `اضغط عند الوصول إلى ${target}` : `Tap when you reach ${target}`}
      </div>

      {/* THE BIG BUTTON */}
      <div className="fixed inset-x-0 bottom-20 px-4 z-30 pointer-events-none">
        <div className="max-w-md mx-auto">
          <motion.button
            whileTap={{ scale: 0.96 }}
            onClick={onTripDone}
            className={`pointer-events-auto w-full rounded-full text-white py-7 shadow-[0_18px_40px_-10px_rgba(28,29,27,0.55)] flex flex-col items-center justify-center ${
              isLast ? "bg-[#2A5A4A] hover:bg-[#1f4438]" : "bg-[#1C1D1B] hover:bg-black"
            }`}
            data-testid="sai-reach-button"
          >
            <span className="text-[10px] uppercase tracking-[0.28em] text-[#B3884D]">
              {isAr ? "الشوط" : "Trip"} {trip + 1}
            </span>
            <span className="mt-0.5 text-[20px] font-medium">
              {isLast
                ? (isAr ? "أنهيت السعي" : "I finished Sa'i")
                : (isAr ? `وصلت إلى ${target}` : `I reached ${target}`)}
            </span>
          </motion.button>
        </div>
      </div>
    </div>
  );
}
