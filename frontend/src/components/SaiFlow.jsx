import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Volume2, ArrowRight } from "lucide-react";
import { SaiMap } from "./RitualMaps";

/*
 SaiFlow — walks the pilgrim through ALL 7 trips, ONE TRIP AT A TIME.
 Trip 1: Safa → Marwah (with first-time verse on Safa)
 Trips 2..6 alternate
 Trip 7: ends on Marwah, no takbir — heartfelt du'a + complete
*/

const TAKBIR_TAHLIL = {
  ar:
    "اللَّهُ أَكْبَر، اللَّهُ أَكْبَر، اللَّهُ أَكْبَر، لَا إِلَهَ إِلاَّ اللَّهُ وَحْدَهُ لاَ شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ يُحْيِي وَيُمِيتُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِير، لاَ إِلَهَ إِلاَّ اللَّهُ وَحْدَهُ، أَنْجَزَ وَعْدَهُ وَنَصَرَ عَبْدَهُ وَهَزَمَ الأَحْزَابَ وَحْدَهُ",
  tr:
    "Allāhu Akbar (×3). Lā ilāha illallāhu waḥdahu lā sharīka lah, lahul-mulku wa lahul-ḥamdu, yuḥyī wa yumītu, wa huwa ʿalā kulli shayʾin qadīr.",
  en: "Allah is the Greatest (×3). There is no god but Allah alone…",
};
const SAFA_VERSE = {
  ar: "إِنَّ الصَّفَا وَالْمَرْوَةَ مِنْ شَعَائِرِ اللَّهِ ۖ نَبْدَأُ بِمَا بَدَأَ اللَّهُ بِه",
  tr: "Innaṣ-Ṣafā wal-Marwata min shaʿāʾirillāh. Nabdaʾu bimā badaʾallāhu bih.",
  en: "Indeed, Safa and Marwah are among the symbols of Allah. We begin with what Allah began with.",
};

const PHOTOS = {
  safa:
    "https://upload.wikimedia.org/wikipedia/commons/thumb/0/03/Mount_Safa_Mecca.jpg/1280px-Mount_Safa_Mecca.jpg",
  marwah:
    "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c8/Mount_Marwah%2C_Mecca_mosque.JPG/1280px-Mount_Marwah%2C_Mecca_mosque.JPG",
  masaa:
    "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ef/Mas%27aa2.jpg/1280px-Mas%27aa2.jpg",
  greenMarkers:
    "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e3/Mas%27aa3.jpg/1280px-Mas%27aa3.jpg",
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

export default function SaiFlow({ trip, setTrip, isAr, onComplete }) {
  const onSafa = trip % 2 === 0;
  const startEn = onSafa ? "Safa" : "Marwah";
  const startAr = onSafa ? "الصفا" : "المروة";
  const endEn = onSafa ? "Marwah" : "Safa";
  const endAr = onSafa ? "المروة" : "الصفا";
  const isFirstTrip = trip === 0;
  const isLastTrip = trip === 6;

  const completeTrip = () => {
    if (navigator.vibrate) navigator.vibrate([40, 60, 40]);
    if (trip >= 6) {
      setTrip(7);
      setTimeout(() => onComplete && onComplete(), 280);
    } else {
      setTrip(trip + 1);
    }
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={`trip-${trip}`}
        initial={{ opacity: 0, x: 24 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -24 }}
        transition={{ duration: 0.32 }}
        className="space-y-4"
      >
        <div className="rounded-3xl bg-[#1C1D1B] text-white px-5 py-5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <div className="text-[10px] uppercase tracking-[0.28em] text-[#B3884D]">
                {isAr ? "الشوط" : "Trip"}
              </div>
              <div className="mt-0.5 flex items-baseline gap-2">
                <span className="text-[44px] leading-none font-medium" data-testid="sai-flow-trip">
                  {trip + 1}
                </span>
                <span className="text-[16px] text-white/55">/ 7</span>
              </div>
              <div className="mt-1 text-[11px] tracking-[0.18em] uppercase text-white/70">
                {isAr ? "متّجه إلى" : "Heading to"}{" "}
                <span className="text-white font-medium">{isAr ? endAr : endEn}</span>
              </div>
            </div>
            <div className="w-[170px]">
              <SaiMap trip={trip} />
            </div>
          </div>
          <div className="mt-3 grid grid-cols-7 gap-1">
            {Array.from({ length: 7 }).map((_, i) => (
              <div
                key={i}
                className={`h-1 rounded-full ${i < trip ? "bg-[#B3884D]" : i === trip ? "bg-[#F5C44A]" : "bg-white/15"}`}
              />
            ))}
          </div>
        </div>

        {isFirstTrip && (
          <Step
            n="✦"
            color="#5C5D58"
            title={isAr ? "آية على الصفا — مرّة فقط" : "Verse on Safa — once only"}
            body={
              isAr
                ? "عند اقترابك من الصفا للمرّة الأولى، اقرأ هذه الآية مرّة واحدة."
                : "As you approach Safa for the first time, recite this verse — once only."
            }
            isAr={isAr}
            dua={SAFA_VERSE}
            image={PHOTOS.safa}
            alt="Mount Safa inside Masjid al-Haram"
          />
        )}

        <Step
          n="1"
          color="#B3884D"
          title={isAr ? `على ${startAr}` : `On ${startEn}`}
          body={
            isAr
              ? "اصعد، استقبل الكعبة، ارفع يديك. اقرأ التكبير ثلاث مرات. ادعُ بعد الأولى والثانية. لا دعاء بعد الثالثة."
              : "Climb the hill, face the Ka'bah, raise both hands. Recite the takbir 3 times. Make du'a after the 1st & 2nd. NO du'a after the 3rd."
          }
          isAr={isAr}
          dua={TAKBIR_TAHLIL}
          image={onSafa ? PHOTOS.safa : PHOTOS.marwah}
          alt={onSafa ? "Mount Safa" : "Mount Marwah"}
        />

        <Step
          n="2"
          color="#5C5D58"
          title={isAr ? `المشي إلى ${endAr}` : `Walking to ${endEn}`}
          body={
            isAr
              ? "امشِ بمشيك المعتاد. ادعُ بأي لغة. وانتبه للعَلَمين الأخضرين."
              : "Walk normally. Make du'a in any language. Watch for the two GREEN markers."
          }
          isAr={isAr}
          image={PHOTOS.masaa}
          alt="The Mas'a corridor between Safa and Marwah"
        />

        <Step
          n="3"
          color="#2A5A4A"
          title={isAr ? "العَلَمان الأخضران" : "Green markers"}
          body={
            isAr
              ? "الرجال: يَهرولون بسرعة بين العمودين الأخضرين. النساء: المشي العادي."
              : "MEN: jog briskly between the green pillars. WOMEN: walk normally."
          }
          isAr={isAr}
          image={PHOTOS.greenMarkers}
          alt="The two green markers in the Mas'a where men jog"
        />

        {isLastTrip ? (
          <Step
            n="4"
            color="#8B4540"
            title={isAr ? "على المروة — الأخيرة" : "On Marwah — final time"}
            body={
              isAr
                ? "لا تُكرّر التكبير هذه المرّة. ادعُ دعاءً مطوّلًا من القلب، ثم اضغط الزر."
                : "DO NOT recite the takbir this time. Make a long, heartfelt du'a, then tap the button."
            }
            isAr={isAr}
            image={PHOTOS.marwah}
            alt="Mount Marwah"
          />
        ) : (
          <Step
            n="4"
            color="#B3884D"
            title={isAr ? `على ${endAr}` : `On ${endEn}`}
            body={
              isAr
                ? "كما في السابق: التكبير ثلاث مرات، دعاء بعد الأولى والثانية، ولا دعاء بعد الثالثة."
                : "Same as before: takbir 3 times, du'a after 1st & 2nd, no du'a after 3rd."
            }
            isAr={isAr}
            dua={TAKBIR_TAHLIL}
            image={onSafa ? PHOTOS.marwah : PHOTOS.safa}
            alt={onSafa ? "Mount Marwah" : "Mount Safa"}
          />
        )}

        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={completeTrip}
          className={`w-full rounded-full text-white py-5 mt-2 shadow-[0_18px_40px_-10px_rgba(28,29,27,0.55)] flex flex-col items-center justify-center ${
            isLastTrip ? "bg-[#2A5A4A] hover:bg-[#1f4438]" : "bg-[#1C1D1B] hover:bg-black"
          }`}
          data-testid="sai-trip-complete"
        >
          <span className="text-[10px] uppercase tracking-[0.28em] text-[#B3884D]">
            {isAr ? `الشوط ${trip + 1}` : `Trip ${trip + 1}`}
          </span>
          <span className="mt-0.5 text-[18px] font-medium inline-flex items-center gap-2">
            {isLastTrip
              ? (isAr ? "أنهيت السعي" : "I finished Sa'i")
              : (isAr ? `وصلت إلى ${endAr}` : `I reached ${endEn}`)}
            <ArrowRight className="w-5 h-5" />
          </span>
        </motion.button>
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
              <p className="font-arabic text-[17px] leading-[1.9] text-right text-[#1C1D1B] flex-1">
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
