import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RotateCcw, Check, Volume2, ArrowRight } from "lucide-react";
import { LangContext } from "../components/Layout";
import TawafVisual from "../components/TawafVisual";

/*
 Real-time Tawaf coach.
 Pilgrim taps the SEGMENT they are currently at. Big du'a/instruction takes over.
 When they finish the lap (return to Black Stone after segment 3), they tap "Lap done".
*/

const SEGMENTS = [
  {
    id: 0,
    short: "Black Stone",
    label_en: "I'm at the Black Stone",
    label_ar: "أنا عند الحجر الأسود",
    headline_en: "Say Allāhu Akbar",
    headline_ar: "قل: اللَّهُ أَكْبَر",
    arabic: "اللَّهُ أَكْبَر",
    transliteration: "Allāhu Akbar",
    english: "Allah is the Greatest",
    body_en: "Face the Black Stone, raise your right hand, and say it once. Kiss/touch only if it is easy without harming others. Then begin walking.",
    body_ar: "استقبل الحجر الأسود، ارفع يدك اليمنى وقلها مرّة. لا تُقبّله ولا تستلمه إلا إن تيسّر دون أذى. ثم ابدأ المشي.",
    tone: "#2A5A4A",
  },
  {
    id: 1,
    short: "Walking",
    label_en: "I'm walking",
    label_ar: "أمشي حول الكعبة",
    headline_en: "Free du'a, dhikr, Qur'an",
    headline_ar: "ادعُ، اذكر الله، اقرأ القرآن",
    arabic: "سُبْحَانَ اللَّهِ، الْحَمْدُ لِلَّهِ، لاَ إِلَهَ إِلاَّ اللَّهُ، اللَّهُ أَكْبَر",
    transliteration: "Subḥān-Allāh, al-ḥamdu lillāh, lā ilāha illallāh, Allāhu akbar",
    english: "Glory be to Allah, all praise is due to Allah, there is no god but Allah, Allah is the Greatest.",
    body_en: "Keep the Ka'bah on your LEFT. There is no fixed du'a here — supplicate freely in any language. Men: Raml (brisk, shoulders shaken) for laps 1–3. Walk normally laps 4–7. Women walk normally throughout.",
    body_ar: "اجعل الكعبة عن يسارك. لا يوجد دعاء محدّد — ادعُ بما تشاء. الرجال: الرَّمَل في الأشواط ١–٣، ثم المشي العادي في ٤–٧. النساء يمشين بالمعتاد.",
    tone: "#1C1D1B",
  },
  {
    id: 2,
    short: "Yemeni Corner",
    label_en: "I'm at the Yemeni Corner",
    label_ar: "أنا عند الركن اليماني",
    headline_en: "Touch with right hand only",
    headline_ar: "استلم بيدك اليمنى فقط",
    arabic: null,
    transliteration: null,
    english: null,
    body_en: "Touch the Yemeni Corner with your RIGHT hand if it's easy. Do NOT kiss it. Do NOT say takbir here. Do NOT make du'a here. If crowded, simply pass it without pointing.",
    body_ar: "استلم الركن اليماني بيدك اليمنى إن تيسّر. لا تُقبّله. لا تكبّر عنده. لا تدعُ عنده. إذا ازدحم فمرّ به دون إشارة.",
    tone: "#B3884D",
  },
  {
    id: 3,
    short: "Between Corners",
    label_en: "I'm between Yemeni & Black Stone",
    label_ar: "أنا بين الركن اليماني والحجر",
    headline_en: "Recite the verse",
    headline_ar: "اقرأ هذه الآية",
    arabic: "رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ",
    transliteration: "Rabbanā ātinā fid-dunyā ḥasanatan wa fil-ākhirati ḥasanatan wa qinā 'adhāban-nār.",
    english: "Our Lord, give us good in this world and good in the Hereafter, and protect us from the punishment of the Fire.",
    body_en: "On the final stretch back to the Black Stone, recite this verse. When you reach the Black Stone, the lap is done — tap 'Lap done' below.",
    body_ar: "في الجزء الأخير عائدًا للحجر الأسود اقرأ هذه الآية. عند وصولك الحجر يكون الشوط قد اكتمل — اضغط زرّ «انتهى الشوط» بالأسفل.",
    tone: "#B3884D",
  },
];

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

export default function Tawaf() {
  const { lang } = React.useContext(LangContext);
  const isAr = lang === "ar";

  const [count, setCount] = React.useState(() => parseInt(localStorage.getItem("umrah_tawaf_count") || "0", 10));
  const [segment, setSegment] = React.useState(0);

  React.useEffect(() => {
    localStorage.setItem("umrah_tawaf_count", String(count));
  }, [count]);

  const lapDone = () => {
    if (count >= 7) return;
    setCount((c) => Math.min(7, c + 1));
    setSegment(0);
    if (navigator.vibrate) navigator.vibrate([40, 60, 40]);
    speak("اللَّهُ أَكْبَر");
  };

  const reset = () => {
    setCount(0);
    setSegment(0);
  };

  const active = SEGMENTS[segment];
  const totalDone = count >= 7;

  return (
    <div className="max-w-md mx-auto pb-12" data-testid="tawaf-page">
      {/* Lap header with photo */}
      <section
        className="mt-2 rounded-3xl overflow-hidden relative"
        style={{
          backgroundImage:
            'linear-gradient(180deg, rgba(28,29,27,0.55) 0%, rgba(28,29,27,0.95) 100%), url("https://images.unsplash.com/photo-1591604157118-b94e2684f857?crop=entropy&cs=srgb&fm=jpg&q=80&w=900")',
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
        data-testid="tawaf-hero"
      >
        <div className="p-5 text-[#F8F6F0]">
          <div className="text-[10px] uppercase tracking-[0.24em] text-[#B3884D]">Tawaf · Sunnah</div>
          <div className="mt-1 flex items-baseline gap-3">
            <div className="text-[64px] font-light leading-none tabular-nums" data-testid="tawaf-count">
              {count}
            </div>
            <div className="text-[15px] text-white/80">/ 7 laps complete</div>
          </div>
          {/* progress bar */}
          <div className="mt-3 grid grid-cols-7 gap-1.5">
            {Array.from({ length: 7 }).map((_, i) => (
              <div key={i} className={`h-1.5 rounded-full ${i < count ? "bg-[#B3884D]" : "bg-white/20"}`} />
            ))}
          </div>
          <div className="mt-3 text-[12px] text-white/70">
            {totalDone
              ? "Tawaf complete. Pray 2 raka'ah behind Maqam Ibrahim, drink Zamzam, then proceed to Sa'i."
              : count < 3
              ? "Lap " + (count + 1) + " — men do Raml (brisk pace)"
              : "Lap " + (count + 1) + " — walk at normal pace"}
          </div>
        </div>
      </section>

      {/* WHERE ARE YOU – big segment selector */}
      <section className="mt-5" data-testid="tawaf-segments">
        <div className="text-[10px] uppercase tracking-[0.22em] text-[#8E8F8A] mb-2">
          {isAr ? "أين أنت الآن؟" : "Where are you right now?"}
        </div>
        <div className="grid grid-cols-2 gap-2">
          {SEGMENTS.map((s) => (
            <button
              key={s.id}
              onClick={() => setSegment(s.id)}
              className={`tap-pulse rounded-2xl border p-3 text-left transition-colors ${
                segment === s.id
                  ? "bg-[#1C1D1B] text-white border-[#1C1D1B]"
                  : "bg-white border-[#E8E5DD] text-[#1C1D1B] hover:border-[#B3884D]"
              }`}
              data-testid={`segment-${s.id}`}
            >
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full" style={{ background: s.tone }} />
                <span className="text-[11px] uppercase tracking-[0.16em] opacity-80">Step {s.id + 1}</span>
              </div>
              <div className="mt-1.5 text-[13px] font-medium leading-snug">
                {isAr ? s.label_ar : s.label_en}
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* HUGE active guidance card */}
      <AnimatePresence mode="wait">
        <motion.section
          key={`coach-${segment}`}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.3 }}
          className="mt-4 rounded-3xl border border-[#E8E5DD] bg-white p-6"
          data-testid="tawaf-coach"
        >
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full" style={{ background: active.tone }} />
            <div className="text-[10px] uppercase tracking-[0.22em] text-[#8E8F8A]">{active.short}</div>
          </div>
          <h2 className="mt-2 text-[24px] font-medium tracking-tight text-[#1C1D1B] leading-tight" data-testid="tawaf-coach-headline">
            {isAr ? active.headline_ar : active.headline_en}
          </h2>

          {active.arabic && (
            <div className="mt-5 rounded-2xl bg-[#F8F6F0] border border-[#E8E5DD] p-5">
              <div className="flex items-start justify-between gap-3">
                <p className="font-arabic text-[26px] leading-[2] text-right flex-1 text-[#1C1D1B]" data-testid="tawaf-coach-arabic">
                  {active.arabic}
                </p>
                <button
                  onClick={() => speak(active.arabic)}
                  className="tap-pulse w-10 h-10 grid place-items-center rounded-full bg-white border border-[#E8E5DD]"
                  aria-label="play"
                  data-testid="tawaf-coach-play"
                >
                  <Volume2 className="w-4 h-4 text-[#1C1D1B]" />
                </button>
              </div>
              {active.transliteration && (
                <p className="mt-3 text-[13px] italic text-[#5C5D58]">{active.transliteration}</p>
              )}
              {active.english && <p className="mt-1.5 text-[13px] text-[#1C1D1B]">{active.english}</p>}
            </div>
          )}

          <p className={`mt-4 text-[14px] leading-relaxed text-[#1C1D1B] ${isAr ? "font-arabic text-right" : ""}`}>
            {isAr ? active.body_ar : active.body_en}
          </p>

          {/* segment nav inside coach */}
          <div className="mt-5 flex items-center justify-between">
            <button
              onClick={() => setSegment((s) => Math.max(0, s - 1))}
              disabled={segment === 0}
              className="tap-pulse rounded-full border border-[#E8E5DD] bg-white px-4 py-2 text-[12px] disabled:opacity-40"
              data-testid="seg-prev"
            >
              ← {isAr ? "السابق" : "Previous"}
            </button>
            {segment < SEGMENTS.length - 1 ? (
              <button
                onClick={() => setSegment((s) => Math.min(SEGMENTS.length - 1, s + 1))}
                className="tap-pulse rounded-full bg-[#B3884D] hover:bg-[#997441] text-white px-4 py-2 text-[12px] inline-flex items-center gap-1"
                data-testid="seg-next"
              >
                {isAr ? "التالي" : "Next"} <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                onClick={lapDone}
                disabled={totalDone}
                className="tap-pulse rounded-full bg-[#2A5A4A] hover:bg-[#1f4438] text-white px-5 py-2.5 text-[13px] font-medium inline-flex items-center gap-2 disabled:opacity-40"
                data-testid="lap-done"
              >
                <Check className="w-4 h-4" /> {isAr ? "انتهى الشوط" : "Lap done"}
              </button>
            )}
          </div>
        </motion.section>
      </AnimatePresence>

      {/* Top-down map (smaller, supplementary) */}
      <section className="mt-5" data-testid="tawaf-visual-wrap">
        <TawafVisual count={count} total={7} segment={segment} />
      </section>

      {/* Reset */}
      <div className="mt-5 flex justify-center">
        <button
          onClick={reset}
          className="tap-pulse inline-flex items-center gap-2 rounded-full border border-[#E8E5DD] bg-white px-5 py-2 text-sm text-[#1C1D1B]"
          data-testid="tawaf-reset"
        >
          <RotateCcw className="w-4 h-4" /> {isAr ? "إعادة تعيين الطواف" : "Reset Tawaf"}
        </button>
      </div>

      {totalDone && (
        <div className="mt-5 rounded-2xl border border-[#2A5A4A] bg-white p-4 text-[#2A5A4A] text-[13px] font-medium" data-testid="tawaf-complete">
          {isAr
            ? "اكتمل الطواف. صلِّ ركعتين خلف مقام إبراهيم، اشرب من زمزم، ثم توجّه للسعي."
            : "Tawaf complete. Pray 2 raka'ah behind Maqam Ibrahim, drink Zamzam, then proceed to Sa'i."}
        </div>
      )}
    </div>
  );
}
