import React from "react";
import { motion } from "framer-motion";

// Timeline jumper for the ʿUmrah tour.
//
// Replaces the previous static progress bar with a tappable strip of dots
// + chapter markers, so a pilgrim can jump directly to any step instead of
// pressing Next 9 times to get from step 3 to step 12. Auto-scrolls the
// current step into view as the user advances.
//
// Designed to feel calm at glance (one bar, faint dots) but powerful on
// tap (any dot jumps you there). Chapter "ticks" sit above the strip to
// show where the major rituals break — Ihram, Tawaf, Post-Tawaf, Sa'i, Halq.

export default function TourTimeline({
  steps,
  current,
  onJump,
  chapterColors,
  isAr,
}) {
  const total = steps.length;
  const stripRef = React.useRef(null);
  const dotRefs = React.useRef([]);

  // Auto-scroll the current dot into view so it never falls off-screen
  // when the user is far along (step 13+) on small phones.
  React.useEffect(() => {
    const dot = dotRefs.current[current];
    if (!dot || !stripRef.current) return;
    dot.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "center",
    });
  }, [current]);

  // Compute chapter boundaries (the first index where each chapter starts).
  // Used to render the chapter pill above the strip so the user always knows
  // which section of the journey they're in (e.g. "Tawaf 5/15").
  const chapterStarts = React.useMemo(() => {
    const map = {};
    steps.forEach((s, i) => {
      if (map[s.chapter] === undefined) map[s.chapter] = i;
    });
    return map;
  }, [steps]);

  const currentChapter = steps[current]?.chapter;

  return (
    <div className="mt-3" data-testid="tour-timeline">
      {/* Chapter label + step counter */}
      <div className={`flex items-center justify-between mb-1.5 text-[10px] uppercase tracking-[0.18em] text-[#5C5D58] ${isAr ? "flex-row-reverse" : ""}`}>
        <span className={isAr ? "font-arabic" : ""}>
          {isAr ? `الخطوة ${current + 1} من ${total}` : `Step ${current + 1} of ${total}`}
        </span>
        <span className="text-[#8E8F8A]">{isAr ? "اضغط للتّنقّل" : "Tap any dot to jump"}</span>
      </div>

      {/* Scrollable dot strip — direction:ltr forced so the visual order stays
          consistent even for Arabic users (so dot 1 is always leftmost). */}
      <div
        ref={stripRef}
        className="relative w-full overflow-x-auto no-scrollbar"
        style={{ direction: "ltr", WebkitOverflowScrolling: "touch" }}
      >
        <div className="flex items-center gap-1.5 py-1.5 px-0.5 min-w-full">
          {steps.map((s, i) => {
            const isPast = i < current;
            const isCurrent = i === current;
            const color = chapterColors[s.chapter] || "#B3884D";
            const chapterStart = chapterStarts[s.chapter] === i;
            return (
              <button
                key={i}
                ref={(el) => (dotRefs.current[i] = el)}
                onClick={() => onJump(i)}
                aria-label={`Go to step ${i + 1}: ${s.chapter}`}
                aria-current={isCurrent ? "step" : undefined}
                data-testid={`tour-tl-dot-${i}`}
                className={`relative flex-shrink-0 grid place-items-center transition-transform active:scale-90 ${
                  isCurrent ? "w-7 h-7" : "w-3.5 h-3.5"
                }`}
              >
                {/* Tiny chapter-change tick — sits just above the dot when this
                    dot starts a new chapter (helps eyes find the sections). */}
                {chapterStart && (
                  <span
                    className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-0.5 h-1.5 rounded-full"
                    style={{ background: color }}
                  />
                )}
                {isCurrent ? (
                  <motion.span
                    layoutId="tl-current"
                    className="absolute inset-0 rounded-full shadow-sm"
                    style={{ background: color }}
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                ) : null}
                <span
                  className={`relative rounded-full transition-colors ${
                    isCurrent
                      ? "w-2 h-2 bg-white"
                      : isPast
                        ? "w-2 h-2"
                        : "w-1.5 h-1.5 bg-[#E0DBCD]"
                  }`}
                  style={isPast && !isCurrent ? { background: color, opacity: 0.55 } : undefined}
                />
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
