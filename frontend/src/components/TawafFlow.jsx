import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Volume2, ArrowRight, Lightbulb } from "lucide-react";
import { TawafMap } from "./RitualMaps";

/*
 TawafFlow — walks the pilgrim through ALL 7 laps, ONE LAP AT A TIME.
 Each lap screen shows the 4 micro-actions in order:
   ① Black Stone (takbir)
   ② Walking (with raml on laps 1–3)
   ③ Yemeni Corner (touch only)
   ④ Final stretch — du'a between corners
 One big button "Lap N complete" at the bottom advances to lap N+1.
 After lap 7 → calls onComplete() so the outer Tour goes to the next step.
*/

const RABBANA = {
  ar: "رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ",
  tr: "Rabbanā ātinā fid-dunyā ḥasanatan wa fil-ākhirati ḥasanatan wa qinā ʿadhāban-nār.",
  en: "Our Lord, give us good in this world and good in the Hereafter, and protect us from the Fire.",
};
const TAKBIR_BS = {
  ar: "بِسْمِ اللَّهِ، وَاللَّهُ أَكْبَر",
  tr: "Bismillāh, Allāhu Akbar.",
  en: "In the name of Allah; Allah is the Greatest.",
};

// Locally-hosted, hyper-realistic photos of the Ka'bah at the EXACT corner / side
// the pilgrim is at during each micro-step of a Tawaf lap. Stored under
// /public/images/kaaba so the PWA service worker caches them for offline use
// inside the Haram (no CORS, 429, or 404 risk).
const PHOTOS = {
  // ① Black Stone corner — pilgrims facing/touching the silver-framed Hajar al-Aswad
  blackStone: "/images/kaaba/01-black-stone.jpg",
  // ② Walking — wide tawaf view with Ka'bah on the left, crowd circling
  tawafCircle: "/images/kaaba/02-walking.jpg",
  // ③ Yemeni Corner — pilgrims touching the Rukn al-Yamani
  yemeniCorner: "/images/kaaba/03-yemeni-corner.jpg",
  // ④ Yemeni → Black Stone stretch — the final side every lap (Rabbana du'a)
  kaabaWide: "/images/kaaba/04-yemeni-to-stone.jpg",
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

export default function TawafFlow({ lap, setLap, isAr, onComplete }) {
  const isRamlLap = lap < 3;
  const isLastLap = lap === 6;

  const completeLap = () => {
    if (navigator.vibrate) navigator.vibrate([40, 60, 40, 60, 90]);
    speak("اللَّهُ أَكْبَر");
    if (lap >= 6) {
      setLap(7);
      setTimeout(() => onComplete && onComplete(), 280);
    } else {
      setLap(lap + 1);
    }
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={`lap-${lap}`}
        initial={{ opacity: 0, x: 24 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -24 }}
        transition={{ duration: 0.32 }}
        className="space-y-4"
      >
        {/* Big lap counter */}
        <div className="rounded-3xl bg-[#1C1D1B] text-white px-5 py-5">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-[10px] uppercase tracking-[0.28em] text-[#B3884D]">
                {isAr ? "الشوط" : "Lap"}
              </div>
              <div className="mt-0.5 flex items-baseline gap-2">
                <span className="text-[44px] leading-none font-medium" data-testid="tawaf-flow-lap">
                  {lap + 1}
                </span>
                <span className="text-[16px] text-white/55">/ 7</span>
              </div>
            </div>
            <div className="w-[160px]">
              <TawafMap lap={lap} />
            </div>
          </div>
          <div className="mt-3 grid grid-cols-7 gap-1">
            {Array.from({ length: 7 }).map((_, i) => (
              <div
                key={i}
                className={`h-1 rounded-full ${i < lap ? "bg-[#B3884D]" : i === lap ? "bg-[#F5C44A]" : "bg-white/15"}`}
              />
            ))}
          </div>
        </div>

        {/* 4 micro-action cards */}
        <Step
          n="1"
          color="#F5C44A"
          title={isAr ? "عند الحجر الأسود" : "At the Black Stone"}
          body={
            isAr
              ? "استقبل الحجر، ارفع يدك اليمنى، وقل التكبير مرّة واحدة."
              : "Face it, raise your right hand, say the takbir — once."
          }
          isAr={isAr}
          dua={TAKBIR_BS}
          image={PHOTOS.blackStone}
          alt="Hajar al-Aswad — the Black Stone"
        />

        <Step
          n="2"
          color="#B3884D"
          title={isAr ? "أثناء المشي" : "Walking"}
          body={
            isAr
              ? isRamlLap
                ? "الكعبة على يسارك. الرجال: بسرعة مع تحريك الكتفين (الرَّمَل). النساء: المشي العادي."
                : "الكعبة على يسارك. بمشيك المعتاد. ادعُ بأي لغة."
              : isRamlLap
              ? "Ka'bah on your LEFT. MEN: brisk pace, shoulders shaken (Raml). WOMEN: walk normally."
              : "Ka'bah on your LEFT. Walk at normal pace. Make du'a in any language."
          }
          isAr={isAr}
          image={PHOTOS.tawafCircle}
          alt="Pilgrims circling the Ka'bah during Tawaf"
        />

        <Step
          n="3"
          color="#5C5D58"
          title={isAr ? "الركن اليماني" : "Yemeni Corner"}
          body={
            isAr
              ? "المسه بيدك اليمنى إن تيسّر. لا تُقبّله. لا تكبّر ولا تَدعُ هنا."
              : "Touch with your right hand if easy. DO NOT kiss it. NO takbir, NO du'a here."
          }
          isAr={isAr}
          image={PHOTOS.yemeniCorner}
          alt="The Yemeni Corner of the Ka'bah"
        />

        <Step
          n="4"
          color="#2A5A4A"
          title={isAr ? "بين الركن اليماني والحجر" : "Yemeni → Black Stone"}
          body={
            isAr
              ? "في هذا الجزء اقرأ هذا الدعاء كل شوط."
              : "On this stretch, recite the du'a below every lap."
          }
          isAr={isAr}
          dua={RABBANA}
          image={PHOTOS.kaabaWide}
          alt="The Ka'bah inside Masjid al-Haram"
        />

        {/* Sticky-ish "Lap N complete" button (sits inside content so it scrolls naturally) */}
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={completeLap}
          className={`w-full rounded-full text-white py-5 mt-2 shadow-[0_18px_40px_-10px_rgba(28,29,27,0.55)] flex flex-col items-center justify-center ${
            isLastLap ? "bg-[#2A5A4A] hover:bg-[#1f4438]" : "bg-[#1C1D1B] hover:bg-black"
          }`}
          data-testid="tawaf-lap-complete"
        >
          <span className="text-[10px] uppercase tracking-[0.28em] text-[#B3884D]">
            {isAr ? `الشوط ${lap + 1}` : `Lap ${lap + 1}`}
          </span>
          <span className="mt-0.5 text-[18px] font-medium inline-flex items-center gap-2">
            {isLastLap
              ? (isAr ? "أنهيت ٧ أشواط" : "I finished 7 laps")
              : (isAr ? `أنهيت الشوط ${lap + 1}` : `Lap ${lap + 1} complete`)}
            <ArrowRight className="w-5 h-5" />
          </span>
        </motion.button>

        {isRamlLap && (
          <div className="rounded-2xl border border-[#E8E5DD] bg-white p-3 flex gap-2 text-[12px] text-[#5C5D58]">
            <Lightbulb className="w-4 h-4 text-[#B3884D] flex-shrink-0 mt-0.5" />
            <span>
              {isAr
                ? `هذا أحد الأشواط الثلاثة الأولى — الرّمَل (المشي السريع) سنة للرجال فقط.`
                : `This is one of the first 3 laps — Raml (brisk walking) is sunnah for men only.`}
            </span>
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}

function Step({ n, color, title, body, isAr, dua, image, alt }) {
  return (
    <div className="rounded-2xl bg-white border border-[#E8E5DD] overflow-hidden">
      {image && (
        <div className="relative w-full h-32 bg-[#1C1D1B]">
          <img
            src={image}
            alt={alt || title}
            className="absolute inset-0 w-full h-full object-cover"
            loading="lazy"
            decoding="async"
          />
          <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-black/55 to-transparent pointer-events-none" />
        </div>
      )}
      <div className="p-4">
        <div className="flex items-start gap-3">
          <div
            className="flex-shrink-0 w-7 h-7 rounded-full grid place-items-center text-[12px] font-bold text-white"
            style={{ background: color }}
          >
            {n}
          </div>
          <div className="flex-1 min-w-0">
            <div className={`text-[14px] font-semibold text-[#1C1D1B] ${isAr ? "text-right font-arabic" : ""}`}>
              {title}
            </div>
            <div className={`mt-0.5 text-[13px] text-[#5C5D58] leading-relaxed ${isAr ? "text-right font-arabic" : ""}`}>
              {body}
            </div>
          </div>
        </div>
        {dua && (
          <div className="mt-3 rounded-xl bg-[#F8F6F0] border border-[#E8E5DD] p-3">
            <div className="flex items-start justify-between gap-2">
              <p className="font-arabic text-[18px] leading-[1.9] text-right text-[#1C1D1B] flex-1">
                {dua.ar}
              </p>
              <button
                onClick={() => speak(dua.ar)}
                className="tap-pulse w-9 h-9 flex-shrink-0 grid place-items-center rounded-full bg-white border border-[#E8E5DD]"
                aria-label="listen"
              >
                <Volume2 className="w-4 h-4 text-[#1C1D1B]" />
              </button>
            </div>
            <p className="mt-2 text-[11px] italic text-[#5C5D58]">{dua.tr}</p>
            <p className="mt-0.5 text-[11px] text-[#1C1D1B]">{dua.en}</p>
          </div>
        )}
      </div>
    </div>
  );
}
