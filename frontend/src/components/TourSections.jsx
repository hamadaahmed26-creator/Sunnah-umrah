import React from "react";

// Renders a tour step's `sections` array — bullet-and-icon layout that
// scans in 10 seconds, not 90. Each section has:
//   icon       (emoji string — emoji by user preference)
//   title_en   title_ar
//   body_en?   body_ar?        paragraph lead
//   bullets_en? bullets_ar?    list of short lines (supports **bold**)
//   note_en?   note_ar?        small "👉 one-line" hint
//   accent?    "warning" renders as red alert card; default = neutral
//
// Religious content is preserved verbatim from tourSteps.js — this
// component only changes how the existing words are laid out.

// Mini markdown: turn **word** into <strong>word</strong>. Keeps the data
// file clean (no JSX in tourSteps.js).
function renderBold(text) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((p, i) => {
    if (p.startsWith("**") && p.endsWith("**")) {
      return <strong key={i} className="font-semibold text-[#1C1D1B]">{p.slice(2, -2)}</strong>;
    }
    return <React.Fragment key={i}>{p}</React.Fragment>;
  });
}

export default function TourSections({ sections, isAr }) {
  if (!sections || sections.length === 0) return null;

  return (
    <div className="mt-4 space-y-3" data-testid="tour-sections">
      {sections.map((s, i) => {
        const title = isAr ? s.title_ar : s.title_en;
        const body = isAr ? s.body_ar : s.body_en;
        const bullets = isAr ? s.bullets_ar : s.bullets_en;
        const note = isAr ? s.note_ar : s.note_en;
        const isWarning = s.accent === "warning";

        return (
          <div
            key={i}
            className={`rounded-2xl p-4 border ${
              isWarning
                ? "bg-[#FFF8F3] border-[#EBD5B0]"
                : "bg-white border-[#E8E5DD]"
            }`}
            data-testid={`tour-section-${i}`}
          >
            {/* Header — icon + title */}
            <div className={`flex items-center gap-2 ${isAr ? "flex-row-reverse" : ""}`}>
              <span className="text-[18px] leading-none select-none" aria-hidden="true">
                {s.icon}
              </span>
              <h3
                className={`text-[14px] font-semibold ${
                  isWarning ? "text-[#7A4A1A]" : "text-[#1C1D1B]"
                } ${isAr ? "font-arabic text-right" : ""}`}
              >
                {title}
              </h3>
            </div>

            {/* Lead body */}
            {body && (
              <p
                className={`mt-2 text-[13.5px] leading-[1.7] ${
                  isWarning ? "text-[#5C4218]" : "text-[#5C5D58]"
                } ${isAr ? "font-arabic text-right" : ""}`}
              >
                {renderBold(body)}
              </p>
            )}

            {/* Bullets */}
            {bullets && bullets.length > 0 && (
              <ul
                className={`mt-2 space-y-1.5 ${
                  isAr ? "pr-1 text-right" : "pl-1"
                }`}
              >
                {bullets.map((b, j) => (
                  <li
                    key={j}
                    className={`flex items-start gap-2 text-[13.5px] leading-[1.65] text-[#5C5D58] ${
                      isAr ? "flex-row-reverse font-arabic" : ""
                    }`}
                  >
                    <span className="text-[#B3884D] mt-[7px] flex-shrink-0">
                      <span className="block w-1.5 h-1.5 rounded-full bg-[#B3884D]" />
                    </span>
                    <span className="flex-1 min-w-0">{renderBold(b)}</span>
                  </li>
                ))}
              </ul>
            )}

            {/* Sub-note (soft "👉 hint") */}
            {note && (
              <p
                className={`mt-2.5 text-[12px] leading-snug text-[#7B5C24] ${
                  isAr ? "font-arabic text-right" : ""
                }`}
              >
                👉 {renderBold(note)}
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}
