import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RotateCcw, Check, Volume2, ArrowRight } from "lucide-react";
import { LangContext } from "../components/Layout";
import SaiVisual from "../components/SaiVisual";

const SAFA_MARWAH_DUA = {
  ar: "اللَّهُ أَكْبَرُ، اللَّهُ أَكْبَرُ، اللَّهُ أَكْبَر، لَا إِلَهَ إِلاَّ اللَّهُ وَحْدَهُ لاَ شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ يُحْيِي وَيُمِيتُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِير، لاَ إِلَهَ إِلاَّ اللَّهُ وَحْدَهُ لاَ شَرِيكَ لَهُ، أَنْجَزَ وَعْدَهُ وَنَصَرَ عَبْدَهُ وَهَزَمَ الأَحْزَابَ وَحْدَهُ",
  tr: "Allāhu Akbar (×3). Lā ilāha illallāhu wahdahu lā sharīka lah, lahul-mulku wa lahul-hamdu, yuhyī wa yumītu, wa huwa 'alā kulli shay'in qadīr. Lā ilāha illallāhu wahdahu lā sharīka lah, anjaza wa'dahu wa nasara 'abdahu wa hazamal-ahzāba wahdah.",
  en: "Allah is the Greatest (×3). There is none worthy of worship except Allah alone, without partner. To Him belongs all sovereignty and praise. He gives life and death, and He is over all things capable. There is none worthy of worship except Allah alone, without partner. He fulfilled His promise, aided His slave, and alone defeated the confederates.",
};

const SAFA_VERSE = {
  ar: "إِنَّ الصَّفَا وَالْمَرْوَةَ مِنْ شَعَائِرِ اللَّهِ ۖ فَمَنْ حَجَّ الْبَيْتَ أَوِ اعْتَمَرَ فَلَا جُنَاحَ عَلَيْهِ أَن يَطَّوَّفَ بِهِمَا — نَبْدَأُ بِمَا بَدَأَ اللَّهُ بِه",
  tr: "Innaṣ-Ṣafā wal-Marwata min sha'ā'irillāh… Nabda'u bimā bada'allāhu bihi.",
  en: "Indeed, Safa and Marwah are among the symbols of Allah… We begin with what Allah began with.",
};

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

export default function Sai() {
  const { lang } = React.useContext(LangContext);
  const isAr = lang === "ar";

  const [trips, setTrips] = React.useState(() => parseInt(localStorage.getItem("umrah_sai_count") || "0", 10));
  const [segment, setSegment] = React.useState(0);

  React.useEffect(() => {
    localStorage.setItem("umrah_sai_count", String(trips));
  }, [trips]);

  const allDone = trips >= 7;
  // What hill should the next trip end at?
  // Trip 1 starts on Safa, ends on Marwah → odd-indexed end = Marwah
  // Even completed trips → currently on Safa side (start next from Safa)
  // Odd completed trips → currently on Marwah side
  const onSafa = trips % 2 === 0;

  // Final Marwah = when we are about to complete trip 7 = trips === 6 and segment === 3
  const isFinalMarwah = trips === 6 && segment === 3;
  const isFirstSafa = trips === 0 && segment === 0;

  const buildContent = () => {
    if (allDone) {
      return {
        short: "Sa'i complete",
        headline: isAr ? "اكتمل السعي — الحمد لله" : "Sa'i complete — Alhamdulillah",
        arabic: "اللَّهُمَّ إِنِّي أَسْأَلُكَ مِنْ فَضْلِكَ",
        transliteration: "Allāhumma innī as'aluka min faḍlika.",
        english: "O Allah, I ask You of Your bounty.",
        body_en: "Make a final long du'a on Marwah facing the Qiblah. When leaving Masjid al-Haram, recite the du'a above. Then proceed to Halq (shave) for men — preferred — or Taqsīr (trim). Women cut a fingertip's length from the ends of their hair.",
        body_ar: "ادعُ دعاءً مطوّلًا على المروة مستقبلًا القبلة. عند الخروج من المسجد قل الدعاء أعلاه. ثم توجّه للحلق (للرجال، وهو الأفضل) أو التقصير. النساء يأخذن من أطراف الشعر قدر أنملة.",
        tone: "#2A5A4A",
        showLapDone: false,
      };
    }

    if (segment === 0) {
      // On Safa
      if (isFirstSafa) {
        return {
          short: "On Safa · first time",
          headline: isAr ? "ابدأ السعي — اقرأ الآية ثم كبّر ثلاثًا" : "Begin Sa'i — recite the verse, then takbir 3×",
          arabic: SAFA_VERSE.ar,
          transliteration: SAFA_VERSE.tr,
          english: SAFA_VERSE.en,
          extra: SAFA_MARWAH_DUA,
          body_en: "Climb Safa, face the Ka'bah, raise both hands. Recite the verse ONCE. Then recite the long takbir+tahlil 3 times. After the 1st and 2nd recitation make plentiful du'a. After the 3rd, do NOT add du'a — descend toward Marwah.",
          body_ar: "اصعد الصفا واستقبل الكعبة وارفع يديك. اقرأ الآية مرة واحدة. ثم اقرأ التكبير والتهليل ثلاث مرات. بعد الأولى والثانية ادعُ بما شئت، وبعد الثالثة لا تَدعُ — انزل متجهًا إلى المروة.",
          tone: "#1C1D1B",
          showLapDone: false,
        };
      }
      return {
        short: "On Safa",
        headline: isAr ? "كبّر ثلاثًا" : "Takbir + tahlil 3 times",
        arabic: SAFA_MARWAH_DUA.ar,
        transliteration: SAFA_MARWAH_DUA.tr,
        english: SAFA_MARWAH_DUA.en,
        body_en: "Face the Ka'bah, raise hands, recite 3 times. After 1st & 2nd: plentiful du'a. After 3rd: NO du'a — descend toward Marwah.",
        body_ar: "استقبل الكعبة وارفع يديك واقرأها ثلاث مرات. بعد الأولى والثانية ادعُ بما شئت، وبعد الثالثة لا تَدعُ — انزل متجهًا إلى المروة.",
        tone: "#1C1D1B",
        showLapDone: false,
      };
    }

    if (segment === 1) {
      return {
        short: "Walking",
        headline: isAr ? "ادعُ بما شئت" : "Free du'a / dhikr",
        arabic: "سُبْحَانَ اللَّهِ، الْحَمْدُ لِلَّهِ، لاَ إِلَهَ إِلاَّ اللَّهُ، اللَّهُ أَكْبَر",
        transliteration: "Subḥān-Allāh, al-ḥamdu lillāh, lā ilāha illallāh, Allāhu akbar.",
        english: "Glory be to Allah, all praise to Allah, no god but Allah, Allah is the Greatest.",
        body_en: "Walk at a normal pace toward " + (onSafa ? "Marwah" : "Safa") + ". There is no fixed du'a — supplicate freely, recite Qur'an, send salawat upon the Prophet ﷺ. Watch for the green markers ahead.",
        body_ar: "امشِ بمشيك المعتاد متجهًا إلى " + (onSafa ? "المروة" : "الصفا") + ". لا دعاء محدّد — ادعُ، اقرأ القرآن، أكثر من الصلاة على النبي ﷺ. وانتبه للعَلَمين الأخضرين.",
        tone: "#1C1D1B",
        showLapDone: false,
      };
    }

    if (segment === 2) {
      return {
        short: "Between green markers",
        headline: isAr ? "الرجال يَهرولون" : "Men jog briskly here",
        arabic: null,
        transliteration: null,
        english: null,
        body_en: "MEN: jog briskly between the two green-light markers. WOMEN: continue walking normally. Continue any du'a or dhikr — there is no specific du'a here.",
        body_ar: "الرجال: يَهرولون بين العَلَمين الأخضرين. النساء: يمشين بالمعتاد. استمر في الدعاء والذكر — لا دعاء محدّد هنا.",
        tone: "#2A5A4A",
        showLapDone: false,
      };
    }

    // segment 3 — at the destination hill
    if (isFinalMarwah) {
      return {
        short: "On Marwah · 7th & final",
        headline: isAr ? "آخر زيارة — لا تكرّر التكبير" : "Final Marwah — do NOT recite takbir+tahlil",
        arabic: null,
        transliteration: null,
        english: null,
        body_en: "This is the 7th and final visit to Marwah. Per the Sunnah, do NOT recite the long takbir+tahlil here. Make a long, sincere personal du'a facing the Qiblah, then tap 'Trip done' to complete Sa'i.",
        body_ar: "هذه الزيارة السابعة والأخيرة للمروة. من السنة: لا تُكرّر التكبير والتهليل هنا. ادعُ دعاءً مطوّلًا مستقبلًا القبلة، ثم اضغط «انتهى الشوط» لإتمام السعي.",
        tone: "#8B4540",
        showLapDone: true,
      };
    }
    const hill = onSafa ? "Marwah" : "Safa"; // wait, this is destination; if onSafa was state at start, dest is Marwah
    // segment 3 reached → ending at the opposite hill from where the trip started
    const destEn = trips % 2 === 0 ? "Marwah" : "Safa";
    const destAr = trips % 2 === 0 ? "المروة" : "الصفا";
    return {
      short: `On ${destEn}`,
      headline: isAr ? `كبّر ثلاثًا على ${destAr}` : `Takbir + tahlil 3× on ${destEn}`,
      arabic: SAFA_MARWAH_DUA.ar,
      transliteration: SAFA_MARWAH_DUA.tr,
      english: SAFA_MARWAH_DUA.en,
      body_en: `Face the Ka'bah on ${destEn}, raise both hands, recite 3 times. After 1st & 2nd: make plentiful personal du'a. After 3rd: do NOT add du'a. Then tap 'Trip done' to start the next trip.`,
      body_ar: `استقبل الكعبة من ${destAr} وارفع يديك واقرأها ثلاث مرات. بعد الأولى والثانية ادعُ بما شئت، وبعد الثالثة لا تَدعُ. ثم اضغط «انتهى الشوط» للبدء بالشوط التالي.`,
      tone: "#B3884D",
      showLapDone: true,
    };
  };

  const c = buildContent();

  const tripDone = () => {
    if (allDone) return;
    setTrips((t) => Math.min(7, t + 1));
    setSegment(0);
    if (navigator.vibrate) navigator.vibrate([40, 60, 40]);
  };

  const reset = () => { setTrips(0); setSegment(0); };

  const segments = [
    { id: 0, label_en: onSafa ? "I'm on Safa" : "I'm on Safa", label_ar: "أنا على الصفا", tone: "#1C1D1B" },
    { id: 1, label_en: "I'm walking", label_ar: "أمشي بين الصفا والمروة", tone: "#1C1D1B" },
    { id: 2, label_en: "Green markers", label_ar: "بين العَلَمين الأخضرين", tone: "#2A5A4A" },
    { id: 3, label_en: "I'm on Marwah", label_ar: "أنا على المروة", tone: "#B3884D" },
  ];

  return (
    <div className="max-w-md mx-auto pb-12" data-testid="sai-page">
      {/* Hero */}
      <section
        className="mt-2 rounded-3xl overflow-hidden relative"
        style={{
          backgroundImage:
            'linear-gradient(180deg, rgba(28,29,27,0.55) 0%, rgba(28,29,27,0.95) 100%), url("https://images.unsplash.com/photo-1591604157118-b94e2684f857?crop=entropy&cs=srgb&fm=jpg&q=80&w=900")',
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
        data-testid="sai-hero"
      >
        <div className="p-5 text-[#F8F6F0]">
          <div className="text-[10px] uppercase tracking-[0.24em] text-[#B3884D]">Sa'i · Sunnah</div>
          <div className="mt-1 flex items-baseline gap-3">
            <div className="text-[64px] font-light leading-none tabular-nums" data-testid="sai-count">
              {trips}
            </div>
            <div className="text-[15px] text-white/80">/ 7 trips complete</div>
          </div>
          <div className="mt-3 grid grid-cols-7 gap-1.5">
            {Array.from({ length: 7 }).map((_, i) => (
              <div key={i} className={`h-1.5 rounded-full ${i < trips ? "bg-[#B3884D]" : "bg-white/20"}`} />
            ))}
          </div>
          <div className="mt-3 text-[12px] text-white/70">
            {allDone
              ? "Sa'i complete. Proceed to Halq or Taqsir."
              : trips % 2 === 0
              ? `Trip ${trips + 1} — start on Safa, walk to Marwah`
              : `Trip ${trips + 1} — start on Marwah, walk back to Safa`}
          </div>
        </div>
      </section>

      {/* Segment selector */}
      <section className="mt-5" data-testid="sai-segments">
        <div className="text-[10px] uppercase tracking-[0.22em] text-[#8E8F8A] mb-2">
          {isAr ? "أين أنت الآن؟" : "Where are you right now?"}
        </div>
        <div className="grid grid-cols-2 gap-2">
          {segments.map((s) => (
            <button
              key={s.id}
              onClick={() => setSegment(s.id)}
              className={`tap-pulse rounded-2xl border p-3 text-left transition-colors ${
                segment === s.id
                  ? "bg-[#1C1D1B] text-white border-[#1C1D1B]"
                  : "bg-white border-[#E8E5DD] text-[#1C1D1B] hover:border-[#B3884D]"
              }`}
              data-testid={`sai-segment-${s.id}`}
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

      {/* Coach card */}
      <AnimatePresence mode="wait">
        <motion.section
          key={`scoach-${segment}-${trips}-${allDone}`}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.3 }}
          className="mt-4 rounded-3xl border border-[#E8E5DD] bg-white p-6"
          data-testid="sai-coach"
        >
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full" style={{ background: c.tone }} />
            <div className="text-[10px] uppercase tracking-[0.22em] text-[#8E8F8A]">{c.short}</div>
          </div>
          <h2 className="mt-2 text-[24px] font-medium tracking-tight text-[#1C1D1B] leading-tight" data-testid="sai-coach-headline">
            {c.headline}
          </h2>

          {c.arabic && (
            <div className="mt-5 rounded-2xl bg-[#F8F6F0] border border-[#E8E5DD] p-5">
              <div className="flex items-start justify-between gap-3">
                <p className="font-arabic text-[22px] leading-[2] text-right flex-1 text-[#1C1D1B]" data-testid="sai-coach-arabic">
                  {c.arabic}
                </p>
                <button
                  onClick={() => speak(c.arabic)}
                  className="tap-pulse w-10 h-10 grid place-items-center rounded-full bg-white border border-[#E8E5DD]"
                  aria-label="play"
                  data-testid="sai-coach-play"
                >
                  <Volume2 className="w-4 h-4 text-[#1C1D1B]" />
                </button>
              </div>
              {c.transliteration && (
                <p className="mt-3 text-[12px] italic text-[#5C5D58]">{c.transliteration}</p>
              )}
              {c.english && <p className="mt-1.5 text-[12px] text-[#1C1D1B]">{c.english}</p>}
            </div>
          )}

          {c.extra && (
            <div className="mt-3 rounded-2xl bg-[#1C1D1B] text-[#F8F6F0] p-5" data-testid="sai-coach-extra">
              <div className="text-[10px] uppercase tracking-[0.22em] text-[#B3884D] mb-2">Then takbir + tahlil 3×</div>
              <p className="font-arabic text-[20px] leading-[2] text-right">{c.extra.ar}</p>
              <p className="mt-2 text-[11px] italic text-white/70">{c.extra.tr}</p>
            </div>
          )}

          <p className={`mt-4 text-[14px] leading-relaxed text-[#1C1D1B] ${isAr ? "font-arabic text-right" : ""}`}>
            {isAr ? c.body_ar : c.body_en}
          </p>

          {/* segment nav */}
          <div className="mt-5 flex items-center justify-between">
            <button
              onClick={() => setSegment((s) => Math.max(0, s - 1))}
              disabled={segment === 0}
              className="tap-pulse rounded-full border border-[#E8E5DD] bg-white px-4 py-2 text-[12px] disabled:opacity-40"
              data-testid="sai-seg-prev"
            >
              ← {isAr ? "السابق" : "Previous"}
            </button>
            {c.showLapDone ? (
              <button
                onClick={tripDone}
                disabled={allDone}
                className="tap-pulse rounded-full bg-[#2A5A4A] hover:bg-[#1f4438] text-white px-5 py-2.5 text-[13px] font-medium inline-flex items-center gap-2 disabled:opacity-40"
                data-testid="sai-trip-done"
              >
                <Check className="w-4 h-4" /> {isAr ? "انتهى الشوط" : "Trip done"}
              </button>
            ) : (
              <button
                onClick={() => setSegment((s) => Math.min(3, s + 1))}
                disabled={segment === 3}
                className="tap-pulse rounded-full bg-[#B3884D] hover:bg-[#997441] text-white px-4 py-2 text-[12px] inline-flex items-center gap-1 disabled:opacity-40"
                data-testid="sai-seg-next"
              >
                {isAr ? "التالي" : "Next"} <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </motion.section>
      </AnimatePresence>

      {/* Visual diagram */}
      <section className="mt-5" data-testid="sai-visual-wrap">
        <SaiVisual trips={trips} segment={segment} total={7} />
      </section>

      <div className="mt-5 flex justify-center">
        <button
          onClick={reset}
          className="tap-pulse inline-flex items-center gap-2 rounded-full border border-[#E8E5DD] bg-white px-5 py-2 text-sm text-[#1C1D1B]"
          data-testid="sai-reset"
        >
          <RotateCcw className="w-4 h-4" /> {isAr ? "إعادة تعيين السعي" : "Reset Sa'i"}
        </button>
      </div>

      {allDone && (
        <div className="mt-5 rounded-2xl border border-[#2A5A4A] bg-white p-4 text-[#2A5A4A] text-[13px] font-medium" data-testid="sai-complete">
          {isAr
            ? "اكتمل السعي. توجّه إلى الحلق أو التقصير لتختم العمرة."
            : "Sa'i complete. Proceed to Halq or Taqsir to complete your Umrah."}
        </div>
      )}
    </div>
  );
}
