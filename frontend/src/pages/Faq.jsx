import React from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ChevronDown, HelpCircle, BookOpen } from "lucide-react";
import { LangContext } from "../components/Layout";
import { FAQ_CATEGORIES, FAQ_ITEMS } from "../lib/faq";

// Mini markdown — same helper idea as TourSections: **word** → <strong>
function renderBold(text) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((p, i) => {
    if (p.startsWith("**") && p.endsWith("**")) {
      return <strong key={i} className="font-semibold text-[#1C1D1B]">{p.slice(2, -2)}</strong>;
    }
    // preserve line breaks from the data
    const lines = p.split("\n");
    return lines.map((ln, j) => (
      <React.Fragment key={`${i}-${j}`}>
        {ln}
        {j < lines.length - 1 && <br />}
      </React.Fragment>
    ));
  });
}

// FAQ — Salafi-vetted answers to common pilgrim worries. Accordion UI —
// one card per Q. Category filter chips at the top.
export default function Faq() {
  const { lang } = React.useContext(LangContext);
  const isAr = lang === "ar";

  const [activeCat, setActiveCat] = React.useState("all");
  const [openIdx, setOpenIdx] = React.useState(null);

  const visible = activeCat === "all"
    ? FAQ_ITEMS
    : FAQ_ITEMS.filter((f) => f.category === activeCat);

  return (
    <div className="max-w-md mx-auto pb-12" data-testid="faq-page">
      <Link
        to="/"
        className="inline-flex items-center gap-1 text-[12px] text-[#8E8F8A] no-underline mb-3 mt-2"
        data-testid="faq-back"
      >
        <ArrowLeft className={`w-3.5 h-3.5 ${isAr ? "rotate-180" : ""}`} />
        <span className={isAr ? "font-arabic" : ""}>{isAr ? "الرّجوع" : "Back"}</span>
      </Link>

      <p className="text-xs uppercase tracking-[0.22em] text-[#8B4540]">
        {isAr ? "الأسئلة الشّائعة" : "FAQs"}
      </p>
      <h1 className={`mt-2 text-[28px] font-medium tracking-tight text-[#1C1D1B] ${isAr ? "font-arabic text-right" : ""}`}>
        {isAr ? "أسئلة كلّ حاجّ ومعتمر" : "Every pilgrim's questions"}
      </h1>
      <p className={`mt-2 text-[14px] text-[#5C5D58] max-w-[38ch] leading-relaxed ${isAr ? "font-arabic text-right" : ""}`}>
        {isAr
          ? "أجوبة موثّقة من كبار علماء السنّة (ابن باز، ابن عثيمين، الألباني) على المخاوف التي يسأل عنها الحجّاج دائمًا."
          : "Salafi-sourced answers (Ibn Bāz, Ibn ʿUthaymīn, al-Albānī) to the worries pilgrims ask about most."}
      </p>

      {/* Category chips */}
      <div
        className="mt-5 flex gap-2 overflow-x-auto pb-1 -mx-4 px-4 snap-x scrollbar-hide"
        style={{ WebkitOverflowScrolling: "touch" }}
        data-testid="faq-categories"
      >
        <CatChip
          active={activeCat === "all"}
          onClick={() => { setActiveCat("all"); setOpenIdx(null); }}
          label_en="All"
          label_ar="الكلّ"
          icon="📋"
          isAr={isAr}
          testid="faq-cat-all"
        />
        {FAQ_CATEGORIES.map((c) => (
          <CatChip
            key={c.id}
            active={activeCat === c.id}
            onClick={() => { setActiveCat(c.id); setOpenIdx(null); }}
            label_en={c.name_en}
            label_ar={c.name_ar}
            icon={c.icon}
            isAr={isAr}
            testid={`faq-cat-${c.id}`}
          />
        ))}
      </div>

      {/* Q&A list */}
      <div className="mt-4 space-y-2.5">
        {visible.map((item, i) => {
          const isOpen = openIdx === i;
          return (
            <div
              key={`${activeCat}-${i}`}
              className={`rounded-2xl border bg-white transition ${
                isOpen ? "border-[#B3884D] shadow-sm" : "border-[#E8E5DD]"
              }`}
              data-testid={`faq-item-${i}`}
            >
              <button
                onClick={() => setOpenIdx(isOpen ? null : i)}
                className="w-full text-left p-4 tap-pulse"
                data-testid={`faq-q-${i}`}
              >
                <div className={`flex items-start gap-2.5 ${isAr ? "flex-row-reverse" : ""}`}>
                  <HelpCircle className="w-4 h-4 text-[#8B4540] mt-0.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className={`text-[14px] font-semibold text-[#1C1D1B] leading-snug ${isAr ? "font-arabic text-right" : ""}`}>
                      {isAr ? item.q_ar : item.q_en}
                    </p>
                  </div>
                  <ChevronDown
                    className={`w-4 h-4 text-[#8E8F8A] flex-shrink-0 transition-transform ${isOpen ? "rotate-180" : ""}`}
                  />
                </div>
              </button>
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.22 }}
                    className="overflow-hidden"
                  >
                    <div className="px-4 pb-4">
                      <div className={`pt-1 border-t border-[#F0EBDD] text-[13.5px] leading-[1.75] text-[#3C3D38] ${isAr ? "font-arabic text-right" : ""}`}>
                        <div className="mt-3">{renderBold(isAr ? item.a_ar : item.a_en)}</div>
                        <div
                          className={`mt-3 inline-flex items-start gap-1.5 text-[11.5px] text-[#7B5C24] ${isAr ? "flex-row-reverse font-arabic" : ""}`}
                          data-testid={`faq-source-${i}`}
                        >
                          <BookOpen className="w-3 h-3 mt-0.5 flex-shrink-0" />
                          <span>{isAr ? item.a_ar && item.source_ar : item.source_en}</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>

      {/* Footer — can't find your question? */}
      <div
        className="mt-6 rounded-2xl bg-[#F8F6F0] border border-[#E8E5DD] p-4"
        data-testid="faq-cant-find"
      >
        <p className={`text-[13px] font-semibold text-[#1C1D1B] ${isAr ? "font-arabic text-right" : ""}`}>
          {isAr ? "لم تجد سؤالك؟" : "Can't find your question?"}
        </p>
        <p className={`mt-1.5 text-[12.5px] text-[#5C5D58] leading-snug ${isAr ? "font-arabic text-right" : ""}`}>
          {isAr
            ? "اسأل رفيق الذّكاء الاصطناعي — يعتمد على أقوال علماء السنّة (ابن باز، ابن عثيمين، الألباني)."
            : "Ask the AI Companion — it draws on the major Salafi scholars (Ibn Bāz, Ibn ʿUthaymīn, al-Albānī)."}
        </p>
        <Link
          to="/chat"
          className="mt-3 inline-flex items-center gap-2 rounded-full bg-[#1C1D1B] text-white text-[12.5px] font-medium px-4 py-2 tap-pulse"
          data-testid="faq-ask-ai"
        >
          {isAr ? "اسأل الرّفيق الذّكيّ ←" : "Ask the Companion →"}
        </Link>
      </div>
    </div>
  );
}

function CatChip({ active, onClick, label_en, label_ar, icon, isAr, testid }) {
  return (
    <button
      onClick={onClick}
      className={`flex-shrink-0 snap-start inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[12px] font-medium tap-pulse transition ${
        active
          ? "bg-[#1C1D1B] text-white"
          : "bg-white border border-[#E8E5DD] text-[#5C5D58]"
      }`}
      data-testid={testid}
    >
      <span className="text-[13px] leading-none">{icon}</span>
      <span className={isAr ? "font-arabic" : ""}>{isAr ? label_ar : label_en}</span>
    </button>
  );
}
