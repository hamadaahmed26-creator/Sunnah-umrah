import React from "react";
import { motion } from "framer-motion";
import { BookOpen, X } from "lucide-react";
import { GLOSSARY } from "../lib/glossary";

// Glossary sheet — plain-English definitions of the Arabic terms used
// throughout the ʿUmrah tour. Opens as a bottom sheet so the pilgrim
// never loses their place in the step. Tap a term to expand it.
export default function GlossarySheet({ open, onClose, isAr }) {
  const [expandedIdx, setExpandedIdx] = React.useState(null);

  React.useEffect(() => {
    if (!open) setExpandedIdx(null);
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[80]" data-testid="glossary-sheet">
      <button
        type="button"
        aria-label={isAr ? "إغلاق" : "Close"}
        onClick={onClose}
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
      />
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        transition={{ type: "spring", damping: 30, stiffness: 320 }}
        className="absolute left-0 right-0 bottom-0 bg-[#F8F6F0] rounded-t-[28px] shadow-[0_-20px_60px_rgba(0,0,0,0.3)] max-w-md mx-auto max-h-[85vh] flex flex-col"
      >
        <div className="w-12 h-1 rounded-full bg-[#E8E5DD] mx-auto mt-2.5 flex-shrink-0" />

        <div className="px-5 pt-4 pb-3 border-b border-[#E8E5DD] flex-shrink-0">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-white grid place-items-center border border-[#E8E5DD]">
                <BookOpen className="w-4 h-4 text-[#7B5C24]" />
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-[0.22em] text-[#B3884D]">
                  {isAr ? "قاموس المصطلحات" : "Arabic terms"}
                </p>
                <h3 className={`text-[16px] font-medium text-[#1C1D1B] leading-tight ${isAr ? "font-arabic" : ""}`}>
                  {isAr ? "ما معنى هذه الكلمات؟" : "What do these words mean?"}
                </h3>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-white border border-[#E8E5DD] grid place-items-center tap-pulse"
              aria-label={isAr ? "إغلاق" : "Close"}
              data-testid="glossary-close"
            >
              <X className="w-4 h-4 text-[#1C1D1B]" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-3 pb-[calc(env(safe-area-inset-bottom)+16px)] space-y-2">
          {GLOSSARY.map((g, i) => {
            const expanded = expandedIdx === i;
            return (
              <button
                key={g.term_en}
                onClick={() => setExpandedIdx(expanded ? null : i)}
                className={`w-full text-left rounded-2xl border transition-all ${
                  expanded
                    ? "bg-white border-[#B3884D] shadow-sm"
                    : "bg-white border-[#E8E5DD] hover:border-[#B3884D]"
                } p-4 tap-pulse`}
                data-testid={`glossary-term-${g.term_en.toLowerCase().replace(/[^a-z]/g, "")}`}
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-baseline gap-2 flex-1 min-w-0">
                    <span className={`text-[15px] font-semibold text-[#1C1D1B] ${isAr ? "font-arabic" : ""}`}>
                      {isAr ? g.term_ar : g.term_en}
                    </span>
                    <span className={`text-[12px] text-[#8E8F8A] ${isAr ? "" : "font-arabic"}`}>
                      {isAr ? g.term_en : g.term_ar}
                    </span>
                  </div>
                  <span className="text-[10px] uppercase tracking-[0.2em] text-[#B3884D] flex-shrink-0">
                    {expanded ? (isAr ? "إغلاق" : "Close") : (isAr ? "اعرف" : "Learn")}
                  </span>
                </div>
                {expanded && (
                  <motion.p
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className={`mt-2.5 text-[13px] leading-[1.65] text-[#5C5D58] ${isAr ? "font-arabic text-right" : ""}`}
                  >
                    {isAr ? g.def_ar : g.def_en}
                  </motion.p>
                )}
              </button>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}
