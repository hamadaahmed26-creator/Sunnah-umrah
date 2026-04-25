import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Volume2, ArrowRight, Check, RotateCcw } from "lucide-react";
import { LangContext } from "../components/Layout";
import Inline3DModel from "../components/Inline3DModel";
import { PHOTOS, ALT } from "../lib/ritualPhotos";

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

function buildSteps(trip, isFinalMarwah) {
  const onSafa = trip % 2 === 0;
  const startEn = onSafa ? "Safa" : "Marwah";
  const startAr = onSafa ? "الصفا" : "المروة";
  const endEn = onSafa ? "Marwah" : "Safa";
  const endAr = onSafa ? "المروة" : "الصفا";

  const steps = [];

  if (trip === 0) {
    steps.push({
      place_en: "1 · Safa — first time",
      place_ar: "١ · الصفا — أول مرّة",
      title_en: "Read this verse — once",
      title_ar: "اقرأ هذه الآية مرّة واحدة",
      sub_en: "Climb Safa, face the Ka'bah, and read this verse one time only — the very first time you climb Safa.",
      sub_ar: "اصعد الصفا، استقبل الكعبة، واقرأ هذه الآية مرة واحدة فقط في أول مرة تصعد الصفا.",
      dua: SAFA_VERSE,
      accent: "#1C1D1B",
      photo: PHOTOS.mountSafa,
      alt: ALT.mountSafa,
    });
  }

  steps.push({
    place_en: `${steps.length + 1} · On ${startEn}`,
    place_ar: `${steps.length + 1} · على ${startAr}`,
    title_en: "Say takbir 3 times",
    title_ar: "كبّر ثلاث مرّات",
    sub_en: "Raise your hands. Recite 3 times. After 1st & 2nd: make du'a. After 3rd: NO du'a — start walking.",
    sub_ar: "ارفع يديك. اقرأها ثلاث مرات. بعد الأولى والثانية: ادعُ. بعد الثالثة: لا تَدعُ — ابدأ المشي.",
    dua: TAKBIR_TAHLIL,
    accent: onSafa ? "#1C1D1B" : "#B3884D",
    photo: onSafa ? PHOTOS.onSafa : PHOTOS.onMarwah,
    alt: onSafa ? ALT.onSafa : ALT.onMarwah,
  });

  steps.push({
    place_en: `${steps.length + 1} · Walk toward ${endEn}`,
    place_ar: `${steps.length + 1} · المشي إلى ${endAr}`,
    title_en: `Walk to ${endEn}`,
    title_ar: `امشِ إلى ${endAr}`,
    sub_en: "Walk normally. Make du'a in any language. Watch for the two GREEN markers ahead.",
    sub_ar: "امشِ بمشيك المعتاد. ادعُ بأي لغة. وانتبه للعَلَمين الأخضرين.",
    dua: null,
    accent: "#5C5D58",
    photo: PHOTOS.masaaCorridor,
    alt: ALT.masaaCorridor,
  });

  steps.push({
    place_en: `${steps.length + 1} · Green markers`,
    place_ar: `${steps.length + 1} · العَلَمان الأخضران`,
    title_en: "Men jog briskly here",
    title_ar: "الرجال يَهرولون هنا",
    sub_en: "MEN: jog briskly between the two green pillars. WOMEN: keep walking normally.",
    sub_ar: "الرجال: يَهرولون بين العمودين الأخضرين. النساء: يُكملن المشي العادي.",
    dua: null,
    accent: "#2A5A4A",
    photo: PHOTOS.masaaGreenMarkers,
    alt: ALT.masaaGreenMarkers,
  });

  if (isFinalMarwah) {
    steps.push({
      place_en: `${steps.length + 1} · Final Marwah`,
      place_ar: `${steps.length + 1} · المروة الأخيرة`,
      title_en: "Make du'a — no takbir this time",
      title_ar: "ادعُ — لا تكبير هذه المرّة",
      sub_en: "This is the 7th and last visit. Per the Sunnah: do NOT recite the takbir here. Make a long heartfelt du'a, then tap Done.",
      sub_ar: "هذه هي الزيارة السابعة والأخيرة. من السنة: لا تُكرّر التكبير هنا. ادعُ دعاءً مطوّلًا، ثم اضغط «انتهى».",
      dua: null,
      accent: "#8B4540",
      photo: PHOTOS.onMarwah,
      alt: ALT.onMarwah,
    });
  } else {
    steps.push({
      place_en: `${steps.length + 1} · On ${endEn}`,
      place_ar: `${steps.length + 1} · على ${endAr}`,
      title_en: "Say takbir 3 times again",
      title_ar: "كبّر ثلاث مرّات مرّة أخرى",
      sub_en: "Same as before: 3 times, du'a after 1st & 2nd, no du'a after 3rd.",
      sub_ar: "كما في السابق: ثلاث مرات، دعاء بعد الأولى والثانية، ولا دعاء بعد الثالثة.",
      dua: TAKBIR_TAHLIL,
      accent: endEn === "Safa" ? "#1C1D1B" : "#B3884D",
      photo: endEn === "Safa" ? PHOTOS.onSafa : PHOTOS.onMarwah,
      alt: endEn === "Safa" ? ALT.onSafa : ALT.onMarwah,
    });
  }

  return steps;
}

export default function Sai() {
  const { lang } = React.useContext(LangContext);
  const isAr = lang === "ar";

  const [trip, setTrip] = React.useState(() =>
    parseInt(localStorage.getItem("umrah_sai_count") || "0", 10)
  );
  const [step, setStep] = React.useState(0);

  React.useEffect(() => {
    localStorage.setItem("umrah_sai_count", String(trip));
  }, [trip]);

  const allDone = trip >= 7;
  const isFinalMarwah = trip === 6;
  const steps = buildSteps(trip, isFinalMarwah);
  const cur = steps[step];
  const isLastStep = step === steps.length - 1;

  const onNext = () => {
    if (isLastStep) {
      if (trip >= 7) return;
      setTrip((t) => Math.min(7, t + 1));
      setStep(0);
      if (navigator.vibrate) navigator.vibrate([40, 60, 40]);
    } else {
      setStep((s) => s + 1);
    }
  };

  const reset = () => {
    setTrip(0);
    setStep(0);
  };

  if (allDone) {
    return (
      <div className="max-w-md mx-auto pb-12" data-testid="sai-page">
        <div className="mt-2">
          <Inline3DModel src={PHOTOS.masaaCorridor} alt={ALT.masaaCorridor} caption="Sa'i complete · Alhamdulillah" testid="sai-3d" />
        </div>
        <div className="mt-6 text-center">
          <div className="inline-flex w-14 h-14 rounded-full bg-[#2A5A4A] text-white items-center justify-center mb-3">
            <Check className="w-7 h-7" />
          </div>
          <h1 className="text-[26px] font-medium text-[#1C1D1B]">
            {isAr ? "اكتمل السعي — الحمد لله" : "Sa'i Complete · Alhamdulillah"}
          </h1>
          <p className="mt-3 text-[15px] text-[#5C5D58]">
            {isAr
              ? "اذهب إلى الحلق أو التقصير لإتمام العمرة."
              : "Now go for Halq (shave) or Taqsir (trim) to finish your Umrah."}
          </p>
        </div>
        <div className="mt-6 rounded-2xl bg-[#F8F6F0] border border-[#E8E5DD] p-4" data-testid="leave-masjid-dua">
          <div className="text-[10px] uppercase tracking-[0.22em] text-[#B3884D] mb-2">When leaving the masjid</div>
          <p className="font-arabic text-[20px] leading-[2] text-right text-[#1C1D1B]">
            اللَّهُمَّ إِنِّي أَسْأَلُكَ مِنْ فَضْلِكَ
          </p>
          <p className="mt-1 text-[12px] italic text-[#5C5D58]">Allāhumma innī as'aluka min faḍlika.</p>
          <p className="text-[12px] text-[#1C1D1B]">O Allah, I ask You of Your bounty.</p>
        </div>
        <button
          onClick={reset}
          className="mt-6 w-full tap-pulse inline-flex items-center justify-center gap-2 rounded-full border border-[#E8E5DD] bg-white px-5 py-3 text-sm text-[#1C1D1B]"
          data-testid="sai-reset"
        >
          <RotateCcw className="w-4 h-4" /> {isAr ? "إعادة" : "Start over"}
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto pb-10" data-testid="sai-page">
      <div className="mt-2 flex items-center justify-between">
        <div>
          <div className="text-[10px] uppercase tracking-[0.22em] text-[#B3884D]">Sa'i</div>
          <div className="mt-0.5 text-[22px] font-medium text-[#1C1D1B]" data-testid="sai-trip-label">
            {isAr ? `الشوط ${trip + 1} من ٧` : `Trip ${trip + 1} of 7`}
          </div>
        </div>
        <button
          onClick={reset}
          className="tap-pulse w-9 h-9 rounded-full bg-white border border-[#E8E5DD] grid place-items-center"
          aria-label="reset"
          data-testid="sai-reset"
        >
          <RotateCcw className="w-4 h-4 text-[#1C1D1B]" />
        </button>
      </div>

      <div className="mt-3 grid grid-cols-7 gap-1.5" data-testid="sai-pips">
        {Array.from({ length: 7 }).map((_, i) => (
          <div key={i} className={`h-1.5 rounded-full ${i < trip ? "bg-[#B3884D]" : "bg-[#E8E5DD]"}`} />
        ))}
      </div>

      {/* PERSISTENT 3D — Grand Mosque includes Safa, Marwah, Mas'a corridor */}
      <div className="mt-4">
        <Inline3DModel
          src={cur.photo}
          alt={cur.alt}
          height="h-[280px]"
          caption={isAr ? cur.place_ar : cur.place_en}
          testid="sai-3d"
        />
      </div>

      <div className="mt-4 flex gap-1.5" data-testid="sai-step-pips">
        {steps.map((_, i) => (
          <div key={i} className={`h-1 flex-1 rounded-full ${i <= step ? "bg-[#1C1D1B]" : "bg-[#E8E5DD]"}`} />
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.section
          key={`${trip}-${step}`}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.25 }}
          className="mt-4"
          data-testid="sai-step-card"
        >
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2.5 h-2.5 rounded-full" style={{ background: cur.accent }} />
            <span className="text-[10px] uppercase tracking-[0.2em] text-[#8E8F8A]">
              {isAr ? cur.place_ar : cur.place_en}
            </span>
          </div>
          <h2
            className={`text-[24px] font-medium text-[#1C1D1B] leading-tight ${isAr ? "text-right font-arabic" : ""}`}
            data-testid="sai-headline"
          >
            {isAr ? cur.title_ar : cur.title_en}
          </h2>
          <p className={`mt-2 text-[14px] text-[#5C5D58] leading-relaxed ${isAr ? "text-right font-arabic" : ""}`}>
            {isAr ? cur.sub_ar : cur.sub_en}
          </p>

          {cur.dua && (
            <div className="mt-4 rounded-2xl bg-[#F8F6F0] border border-[#E8E5DD] p-5" data-testid="sai-dua">
              <div className="flex items-start justify-between gap-3">
                <p className="font-arabic text-[20px] leading-[2] text-right flex-1 text-[#1C1D1B]">
                  {cur.dua.ar}
                </p>
                <button
                  onClick={() => speak(cur.dua.ar)}
                  className="tap-pulse w-11 h-11 grid place-items-center rounded-full bg-white border border-[#E8E5DD]"
                  aria-label="listen"
                  data-testid="sai-dua-play"
                >
                  <Volume2 className="w-5 h-5 text-[#1C1D1B]" />
                </button>
              </div>
              <p className="mt-3 text-[12px] italic text-[#5C5D58]">{cur.dua.tr}</p>
              <p className="mt-1 text-[12px] text-[#1C1D1B]">{cur.dua.en}</p>
            </div>
          )}
        </motion.section>
      </AnimatePresence>

      <button
        onClick={onNext}
        className={`mt-6 w-full tap-pulse rounded-full text-white text-[16px] font-medium px-6 py-4 inline-flex items-center justify-center gap-2 ${
          isLastStep ? "bg-[#2A5A4A] hover:bg-[#1f4438]" : "bg-[#1C1D1B] hover:bg-black"
        }`}
        data-testid="sai-next"
      >
        {isLastStep ? (
          <>
            <Check className="w-5 h-5" /> {isAr ? `أكملت الشوط ${trip + 1}` : `Done with Trip ${trip + 1}`}
          </>
        ) : (
          <>
            {isAr ? "التالي" : "Next"} <ArrowRight className="w-5 h-5" />
          </>
        )}
      </button>

      {step > 0 && (
        <button
          onClick={() => setStep((s) => Math.max(0, s - 1))}
          className="mt-3 w-full tap-pulse rounded-full border border-[#E8E5DD] bg-white text-[14px] text-[#5C5D58] py-2.5"
          data-testid="sai-back"
        >
          ← {isAr ? "السابق" : "Back"}
        </button>
      )}
    </div>
  );
}
