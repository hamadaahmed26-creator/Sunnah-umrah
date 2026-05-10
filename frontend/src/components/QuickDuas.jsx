// Quick Du'ā — floating sheet with the 5 most-needed daily du'ās. Mounted
// from Layout so it sits over every page where it's enabled.
//
// Sources (all authentic):
//   • Morning adhkār — Bukhārī 6307 (Sayyid al-Istighfār)
//   • Entering the masjid — Muslim 713
//   • Travel — Muslim 1342
//   • Worry / distress — Bukhārī 6369
//   • Forgiveness — Bukhārī 6306

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, X } from "lucide-react";
import { useLocation } from "react-router-dom";

const DUAS = [
  {
    id: "istighfar",
    en_title: "Sayyid al-Istighfār — master of seeking forgiveness",
    ar_title: "سيّد الاستغفار",
    arabic:
      "اللَّهُمَّ أَنْتَ رَبِّي لَا إِلَهَ إِلَّا أَنْتَ، خَلَقْتَنِي وَأَنَا عَبْدُكَ، وَأَنَا عَلَى عَهْدِكَ وَوَعْدِكَ مَا اسْتَطَعْتُ، أَعُوذُ بِكَ مِنْ شَرِّ مَا صَنَعْتُ، أَبُوءُ لَكَ بِنِعْمَتِكَ عَلَيَّ، وَأَبُوءُ لَكَ بِذَنْبِي، فَاغْفِرْ لِي، فَإِنَّهُ لَا يَغْفِرُ الذُّنُوبَ إِلَّا أَنْتَ.",
    translit:
      "Allāhumma anta rabbī, lā ilāha illā ant. Khalaqtanī wa anā ʿabduk, wa anā ʿalā ʿahdika wa waʿdika mā-stataʿt. Aʿūdhu bika min sharri mā ṣanaʿt, abū'u laka bi-niʿmatika ʿalayya, wa abū'u laka bi-dhanbī faghfir lī fa-innahu lā yaghfiru-dh-dhunūba illā ant.",
    en:
      "O Allah, You are my Lord, none has the right to be worshipped except You. You created me and I am Your servant. I am upon Your covenant and promise as much as I am able. I seek refuge in You from the evil of what I have done. I acknowledge Your favour upon me, and I acknowledge my sin — so forgive me, for none forgives sins except You.",
    when_en: "Morning · evening",
    when_ar: "الصّباح · المساء",
    source: "Bukhārī 6306",
  },
  {
    id: "enter-masjid",
    en_title: "Entering the masjid",
    ar_title: "عند دخول المسجد",
    arabic: "اللَّهُمَّ افْتَحْ لِي أَبْوَابَ رَحْمَتِكَ.",
    translit: "Allāhumma-ftaḥ lī abwāba raḥmatik.",
    en: "O Allah, open for me the gates of Your mercy.",
    when_en: "Stepping into a masjid (right foot first)",
    when_ar: "عند الدّخول (بالقدم اليمنى)",
    source: "Muslim 713",
  },
  {
    id: "travel",
    en_title: "When you start a journey",
    ar_title: "دعاء السّفر",
    arabic:
      "سُبْحَانَ الَّذِي سَخَّرَ لَنَا هَذَا وَمَا كُنَّا لَهُ مُقْرِنِينَ، وَإِنَّا إِلَى رَبِّنَا لَمُنْقَلِبُونَ.",
    translit:
      "Subḥāna-lladhī sakhkhara lanā hādhā wa mā kunnā lahu muqrinīn, wa innā ilā rabbinā la-munqalibūn.",
    en: "Glory to Him who has subjected this to us, for we could never have done it ourselves — and surely to our Lord we shall return.",
    when_en: "On boarding any transport — car, plane, train",
    when_ar: "عند ركوب وسيلة سفر",
    source: "Muslim 1342",
  },
  {
    id: "anxiety",
    en_title: "When you feel worry or distress",
    ar_title: "عند الهمّ والحزن",
    arabic:
      "اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْهَمِّ وَالْحَزَنِ، وَالْعَجْزِ وَالْكَسَلِ، وَالْبُخْلِ وَالْجُبْنِ، وَضَلَعِ الدَّيْنِ وَغَلَبَةِ الرِّجَالِ.",
    translit:
      "Allāhumma innī aʿūdhu bika mina-l-hammi wal-ḥazan, wal-ʿajzi wal-kasal, wal-bukhli wal-jubn, wa ḍalaʿi-d-dayni wa ghalabati-r-rijāl.",
    en: "O Allah, I seek refuge in You from worry and grief, weakness and laziness, miserliness and cowardice, the burden of debt, and being overpowered by men.",
    when_en: "Anytime stress hits",
    when_ar: "عند ضيق الصّدر",
    source: "Bukhārī 6369",
  },
  {
    id: "evening",
    en_title: "Evening adhkār — short version",
    ar_title: "أذكار المساء — مختصرة",
    arabic:
      "أَمْسَيْنَا وَأَمْسَى الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ، لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ.",
    translit:
      "Amsaynā wa amsā-l-mulku lillāh, wal-ḥamdu lillāh, lā ilāha illā-llāhu waḥdahu lā sharīka lah.",
    en: "We have entered the evening and the entire kingdom belongs to Allah; all praise is due to Allah; none has the right to be worshipped except Allah, alone, without partner.",
    when_en: "Said at sunset",
    when_ar: "بعد غروب الشّمس",
    source: "Muslim 2723",
  },
];

// Pages we should NOT show the floater on (it would distract from focus tasks).
const HIDE_ON = new Set(["/tour", "/chat", "/quiz", "/qibla"]);

export default function QuickDuas({ isAr }) {
  const [open, setOpen] = React.useState(false);
  const [activeId, setActiveId] = React.useState(null);
  const loc = useLocation();

  // Hide on focus pages and on PlaceDetail (slug starts with /places/)
  if (
    HIDE_ON.has(loc.pathname) ||
    loc.pathname.startsWith("/places/") ||
    loc.pathname.startsWith("/tour")
  ) {
    return null;
  }

  const active = DUAS.find((d) => d.id === activeId);

  return (
    <>
      {/* Floating button — pill with icon + "Du'ās" label so it's clear what
          this is. Sits above the bottom nav (which is bottom-16 on mobile / 6
          on desktop). */}
      <button
        onClick={() => setOpen(true)}
        className="fixed right-4 z-[55] inline-flex items-center gap-1.5 rounded-full bg-[#1C1D1B] text-white pl-3 pr-3.5 py-2.5 shadow-[0_10px_24px_-6px_rgba(28,29,27,0.5)] hover:bg-[#2A2D29] active:scale-95 transition tap-pulse"
        style={{ bottom: "calc(env(safe-area-inset-bottom, 0px) + 88px)" }}
        aria-label={isAr ? "أدعية سريعة" : "Quick du'ās"}
        data-testid="quick-duas-fab"
      >
        <BookOpen className="w-4 h-4 text-[#B3884D]" />
        <span className={`text-[12px] font-medium tracking-wide ${isAr ? "font-arabic" : ""}`}>
          {isAr ? "أدعية" : "Du'ās"}
        </span>
      </button>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-[80] bg-black/55 backdrop-blur-sm"
              onClick={() => {
                setOpen(false);
                setActiveId(null);
              }}
              data-testid="quick-duas-overlay"
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 290 }}
              className="fixed left-0 right-0 bottom-0 z-[81] bg-[#F8F6F0] rounded-t-[28px] shadow-[0_-20px_60px_rgba(0,0,0,0.25)] max-h-[88vh] overflow-y-auto"
              data-testid="quick-duas-sheet"
            >
              <div className="sticky top-0 bg-[#F8F6F0]/95 backdrop-blur-sm flex items-center justify-between px-5 pt-4 pb-3 border-b border-[#E8E5DD]">
                <div className="w-12 h-1 rounded-full bg-[#E8E5DD] mx-auto absolute left-1/2 -translate-x-1/2 top-2" />
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-[#B3884D]" />
                  <h3 className={`text-[15px] font-semibold text-[#1C1D1B] ${isAr ? "font-arabic" : ""}`}>
                    {isAr ? "أدعية يوميّة" : "Daily du'ās"}
                  </h3>
                </div>
                <button
                  onClick={() => {
                    setOpen(false);
                    setActiveId(null);
                  }}
                  className="w-8 h-8 rounded-full bg-white border border-[#E8E5DD] grid place-items-center"
                  aria-label="close"
                  data-testid="quick-duas-close"
                >
                  <X className="w-3.5 h-3.5 text-[#1C1D1B]" />
                </button>
              </div>

              {!active && (
                <div className="px-5 py-4">
                  <p className={`text-[12px] text-[#5C5D58] mb-3 ${isAr ? "font-arabic text-right" : ""}`}>
                    {isAr
                      ? "خمسة من أكثر الأدعية حاجةً في يومك — كلّها صحيحة من السنّة."
                      : "Five of the most-needed du'ās for your day — all authentic from the Sunnah."}
                  </p>
                  <ul className="space-y-2" data-testid="quick-duas-list">
                    {DUAS.map((d) => (
                      <li key={d.id}>
                        <button
                          onClick={() => setActiveId(d.id)}
                          className="w-full text-left rounded-2xl bg-white border border-[#E8E5DD] hover:border-[#B3884D] hover:shadow-[0_6px_14px_-10px_rgba(179,136,77,0.4)] transition p-3.5 active:scale-[0.99]"
                          data-testid={`quick-dua-${d.id}`}
                        >
                          <div className={`text-[14px] font-semibold text-[#1C1D1B] leading-tight ${isAr ? "font-arabic text-right" : ""}`}>
                            {isAr ? d.ar_title : d.en_title}
                          </div>
                          <div className={`mt-0.5 text-[11px] text-[#8E8F8A] ${isAr ? "font-arabic text-right" : ""}`}>
                            {isAr ? d.when_ar : d.when_en}
                          </div>
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {active && (
                <div className="px-5 py-4" data-testid="quick-dua-detail">
                  <button
                    onClick={() => setActiveId(null)}
                    className="text-[11px] uppercase tracking-[0.18em] text-[#8E8F8A] mb-3"
                  >
                    {isAr ? "← العودة" : "← Back"}
                  </button>
                  <h4 className={`text-[18px] font-medium text-[#1C1D1B] leading-tight ${isAr ? "font-arabic text-right" : ""}`}>
                    {isAr ? active.ar_title : active.en_title}
                  </h4>
                  <p className={`mt-1 text-[11px] text-[#8E8F8A] ${isAr ? "font-arabic text-right" : ""}`}>
                    {isAr ? active.when_ar : active.when_en}
                  </p>

                  <div
                    dir="rtl"
                    className="mt-4 rounded-2xl bg-white border border-[#E8E5DD] p-4 font-arabic text-[20px] leading-[2] text-[#1C1D1B]"
                  >
                    {active.arabic}
                  </div>

                  <div className="mt-3 rounded-2xl bg-[#FBF8F1] border border-[#E8E5DD] p-3.5">
                    <div className="text-[10px] uppercase tracking-[0.18em] text-[#B3884D] mb-1">
                      {isAr ? "النّقحرة" : "Transliteration"}
                    </div>
                    <p className="text-[13px] italic text-[#3F3722] leading-relaxed">
                      {active.translit}
                    </p>
                  </div>

                  <div className="mt-3 rounded-2xl bg-white border border-[#E8E5DD] p-3.5">
                    <div className="text-[10px] uppercase tracking-[0.18em] text-[#2A5A4A] mb-1">
                      {isAr ? "المعنى" : "Meaning"}
                    </div>
                    <p className={`text-[13px] text-[#3F3722] leading-relaxed ${isAr ? "font-arabic text-right" : ""}`}>
                      {active.en}
                    </p>
                  </div>

                  <div className="mt-3 inline-flex items-center gap-1.5 text-[11px] text-[#8E8F8A]">
                    <BookOpen className="w-3 h-3" />
                    <span>{active.source}</span>
                  </div>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
