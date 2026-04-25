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

const STEPS = (lap) => [
  {
    place_en: "1 · Black Stone — east corner",
    place_ar: "١ · الحجر الأسود — الركن الشرقي",
    title_en: "Say Allāhu Akbar",
    title_ar: "قل: اللَّهُ أَكْبَر",
    sub_en: "Stand at the east corner where the Black Stone is. Face it, raise your right hand, say it once. Each lap starts here.",
    sub_ar: "قف عند الركن الشرقي حيث الحجر الأسود. استقبله، ارفع يدك اليمنى، قلها مرّة. كل شوط يبدأ من هنا.",
    dua: { ar: "اللَّهُ أَكْبَر", tr: "Allāhu Akbar", en: "Allah is the Greatest." },
    accent: "#2A5A4A",
    photo: PHOTOS.blackStone,
    alt: ALT.blackStone,
  },
  {
    place_en: "2 · Walk around the Ka'bah",
    place_ar: "٢ · امشِ حول الكعبة",
    title_en: "Walk and make du'a",
    title_ar: "امشِ وادعُ الله",
    sub_en:
      lap < 3
        ? "Walk counter-clockwise. Keep the Ka'bah on your LEFT. Men: brisk pace, shoulders shaken (Raml). Women: walk normally."
        : "Walk counter-clockwise. Keep the Ka'bah on your LEFT. Walk at your normal pace. Make du'a in any language.",
    sub_ar:
      lap < 3
        ? "امشِ عكس عقارب الساعة، والكعبة عن يسارك. الرجال: بسرعة مع تحريك الكتفين (الرَّمَل). النساء: المشي العادي."
        : "امشِ عكس عقارب الساعة، والكعبة عن يسارك. بمشيك المعتاد. ادعُ بأي لغة.",
    dua: null,
    accent: "#B3884D",
    photo: PHOTOS.tawafCircle,
    alt: ALT.tawafCircle,
  },
  {
    place_en: "3 · Yemeni Corner — south-west",
    place_ar: "٣ · الركن اليماني — الجنوبي الغربي",
    title_en: "Touch with right hand only",
    title_ar: "استلم بيدك اليمنى فقط",
    sub_en: "The corner BEFORE the Black Stone. Touch with your right hand if easy. DO NOT kiss it. NO takbir. NO du'a here. If crowded, walk past.",
    sub_ar: "الركن قبل الحجر الأسود. المسه بيدك اليمنى إن تيسّر. لا تُقبّله. لا تكبّر. لا تدعُ. إذا ازدحم فمرّ.",
    dua: null,
    accent: "#B3884D",
    photo: PHOTOS.yemeniCorner,
    alt: ALT.yemeniCorner,
  },
  {
    place_en: "4 · Yemeni → Black Stone",
    place_ar: "٤ · بين الركن اليماني والحجر",
    title_en: "Say this prayer",
    title_ar: "اقرأ هذا الدعاء",
    sub_en: "On the final stretch back to the Black Stone, recite this du'a. When you reach the Black Stone, the lap is complete.",
    sub_ar: "في الجزء الأخير عائدًا للحجر الأسود اقرأ هذا الدعاء. عند وصولك الحجر يكتمل الشوط.",
    dua: {
      ar: "رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ",
      tr: "Rabbanā ātinā fid-dunyā ḥasanatan wa fil-ākhirati ḥasanatan wa qinā 'adhāban-nār.",
      en: "Our Lord, give us good in this world and good in the Hereafter, and protect us from the Fire.",
    },
    accent: "#8B4540",
    photo: PHOTOS.kaabaWide,
    alt: ALT.kaabaWide,
  },
];

export default function Tawaf() {
  const { lang } = React.useContext(LangContext);
  const isAr = lang === "ar";

  const [lap, setLap] = React.useState(() =>
    parseInt(localStorage.getItem("umrah_tawaf_count") || "0", 10)
  );
  const [step, setStep] = React.useState(0);
  React.useEffect(() => {
    localStorage.setItem("umrah_tawaf_count", String(lap));
  }, [lap]);

  const allDone = lap >= 7;
  const steps = STEPS(lap);
  const cur = steps[step];
  const isLastStepInLap = step === steps.length - 1;

  const onNext = () => {
    if (isLastStepInLap) {
      if (lap >= 7) return;
      setLap((l) => Math.min(7, l + 1));
      setStep(0);
      if (navigator.vibrate) navigator.vibrate([40, 60, 40]);
      speak("اللَّهُ أَكْبَر");
    } else {
      setStep((s) => s + 1);
    }
  };

  const reset = () => {
    setLap(0);
    setStep(0);
  };

  if (allDone) {
    return (
      <div className="max-w-md mx-auto pb-12" data-testid="tawaf-page">
        <div className="mt-2">
          {/* Persistent 3D model */}
          <Inline3DModel src={PHOTOS.kaabaWide} alt={ALT.kaabaWide} caption="Tawaf complete · Alhamdulillah" testid="tawaf-3d" />
        </div>
        <div className="mt-6 text-center">
          <div className="inline-flex w-14 h-14 rounded-full bg-[#2A5A4A] text-white items-center justify-center mb-3">
            <Check className="w-7 h-7" />
          </div>
          <h1 className="text-[26px] font-medium text-[#1C1D1B]">
            {isAr ? "اكتمل الطواف — الحمد لله" : "Tawaf Complete · Alhamdulillah"}
          </h1>
          <p className="mt-3 text-[15px] text-[#5C5D58]">
            {isAr
              ? "صلِّ ركعتين خلف مقام إبراهيم، اشرب من زمزم، ثم توجّه للسعي."
              : "Now pray 2 raka'ah behind Maqam Ibrahim, drink Zamzam, then start Sa'i."}
          </p>
        </div>
        <button
          onClick={reset}
          className="mt-6 w-full tap-pulse inline-flex items-center justify-center gap-2 rounded-full border border-[#E8E5DD] bg-white px-5 py-3 text-sm text-[#1C1D1B]"
          data-testid="tawaf-reset"
        >
          <RotateCcw className="w-4 h-4" /> {isAr ? "إعادة" : "Start over"}
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto pb-10" data-testid="tawaf-page">
      {/* Lap header */}
      <div className="mt-2 flex items-center justify-between">
        <div>
          <div className="text-[10px] uppercase tracking-[0.22em] text-[#B3884D]">Tawaf</div>
          <div className="mt-0.5 text-[22px] font-medium text-[#1C1D1B]" data-testid="tawaf-lap-label">
            {isAr ? `الشوط ${lap + 1} من ٧` : `Lap ${lap + 1} of 7`}
          </div>
        </div>
        <button
          onClick={reset}
          className="tap-pulse w-9 h-9 rounded-full bg-white border border-[#E8E5DD] grid place-items-center"
          aria-label="reset"
          data-testid="tawaf-reset"
        >
          <RotateCcw className="w-4 h-4 text-[#1C1D1B]" />
        </button>
      </div>

      {/* Lap dots */}
      <div className="mt-3 grid grid-cols-7 gap-1.5" data-testid="tawaf-pips">
        {Array.from({ length: 7 }).map((_, i) => (
          <div key={i} className={`h-1.5 rounded-full ${i < lap ? "bg-[#B3884D]" : "bg-[#E8E5DD]"}`} />
        ))}
      </div>

      {/* PERSISTENT 3D — stays mounted across all steps */}
      <div className="mt-4">
        <Inline3DModel
          src={cur.photo}
          alt={cur.alt}
          height="h-[280px]"
          caption={isAr ? cur.place_ar : cur.place_en}
          testid="tawaf-3d"
        />
      </div>

      {/* Step pips */}
      <div className="mt-4 flex gap-1.5" data-testid="tawaf-step-pips">
        {steps.map((_, i) => (
          <div key={i} className={`h-1 flex-1 rounded-full ${i <= step ? "bg-[#1C1D1B]" : "bg-[#E8E5DD]"}`} />
        ))}
      </div>

      {/* Flowing instruction card — only this swaps */}
      <AnimatePresence mode="wait">
        <motion.section
          key={`${lap}-${step}`}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.25 }}
          className="mt-4"
          data-testid="tawaf-step-card"
        >
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2.5 h-2.5 rounded-full" style={{ background: cur.accent }} />
            <span className="text-[10px] uppercase tracking-[0.2em] text-[#8E8F8A]">
              {isAr ? cur.place_ar : cur.place_en}
            </span>
          </div>
          <h2
            className={`text-[26px] font-medium text-[#1C1D1B] leading-tight ${isAr ? "text-right font-arabic" : ""}`}
            data-testid="tawaf-headline"
          >
            {isAr ? cur.title_ar : cur.title_en}
          </h2>
          <p className={`mt-2 text-[15px] text-[#5C5D58] leading-relaxed ${isAr ? "text-right font-arabic" : ""}`}>
            {isAr ? cur.sub_ar : cur.sub_en}
          </p>

          {cur.dua && (
            <div className="mt-4 rounded-2xl bg-[#F8F6F0] border border-[#E8E5DD] p-5" data-testid="tawaf-dua">
              <div className="flex items-start justify-between gap-3">
                <p className="font-arabic text-[24px] leading-[2] text-right flex-1 text-[#1C1D1B]">
                  {cur.dua.ar}
                </p>
                <button
                  onClick={() => speak(cur.dua.ar)}
                  className="tap-pulse w-11 h-11 grid place-items-center rounded-full bg-white border border-[#E8E5DD]"
                  aria-label="listen"
                  data-testid="tawaf-dua-play"
                >
                  <Volume2 className="w-5 h-5 text-[#1C1D1B]" />
                </button>
              </div>
              <p className="mt-3 text-[13px] italic text-[#5C5D58]">{cur.dua.tr}</p>
              <p className="mt-1.5 text-[13px] text-[#1C1D1B]">{cur.dua.en}</p>
            </div>
          )}
        </motion.section>
      </AnimatePresence>

      <button
        onClick={onNext}
        className={`mt-6 w-full tap-pulse rounded-full text-white text-[16px] font-medium px-6 py-4 inline-flex items-center justify-center gap-2 ${
          isLastStepInLap ? "bg-[#2A5A4A] hover:bg-[#1f4438]" : "bg-[#1C1D1B] hover:bg-black"
        }`}
        data-testid="tawaf-next"
      >
        {isLastStepInLap ? (
          <>
            <Check className="w-5 h-5" /> {isAr ? `أكملت الشوط ${lap + 1}` : `Done with Lap ${lap + 1}`}
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
          data-testid="tawaf-back"
        >
          ← {isAr ? "السابق" : "Back"}
        </button>
      )}
    </div>
  );
}
