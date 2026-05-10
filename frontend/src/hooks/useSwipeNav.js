import React from "react";

// useSwipeNav — attaches horizontal swipe-to-navigate handlers to a DOM
// element. Designed for a step-by-step guide where the user expects to
// flick left/right between steps, like Instagram stories.
//
// Why this is its own hook (not inline in Tour.jsx):
//   - Keeps the page component clean
//   - Handles all the edge cases that break naive swipe code:
//       1. Distinguish swipe from scroll (vertical movement should NOT
//          trigger a step change)
//       2. Distinguish swipe from tap (a 30px finger jitter on a button
//          should NOT count as a swipe)
//       3. Ignore swipes that start inside interactive elements
//          (counters, audio players, accordions, maps, links, buttons)
//          so taps on those still work cleanly
//       4. Respect RTL — Arabic users swipe in the opposite direction
//
// Usage:
//   const ref = useSwipeNav({ onNext, onPrev, isAr, enabled: !flowStep });
//   <div ref={ref}> ... </div>

const SWIPE_THRESHOLD = 60;    // min horizontal pixels to count as a swipe
const VERTICAL_GUARD = 50;     // if vertical move > this, treat as scroll
const TIME_LIMIT = 600;        // ms — slower than this = drag, not flick

const INTERACTIVE_TAGS = new Set(["BUTTON", "A", "INPUT", "TEXTAREA", "SELECT", "AUDIO", "VIDEO", "LABEL"]);

function isInsideInteractive(el) {
  let n = el;
  let depth = 0;
  while (n && depth < 8) {
    if (n.tagName && INTERACTIVE_TAGS.has(n.tagName)) return true;
    // Common Leaflet / shadcn / radix wrappers that handle their own touch:
    if (n.classList && (
      n.classList.contains("leaflet-container") ||
      n.classList.contains("no-swipe") ||
      n.getAttribute && n.getAttribute("role") === "slider"
    )) return true;
    n = n.parentElement;
    depth++;
  }
  return false;
}

export default function useSwipeNav({ onNext, onPrev, isAr = false, enabled = true } = {}) {
  const elRef = React.useRef(null);
  const startRef = React.useRef(null);

  React.useEffect(() => {
    const el = elRef.current;
    if (!el || !enabled) return;

    const onStart = (e) => {
      if (isInsideInteractive(e.target)) {
        startRef.current = null;
        return;
      }
      const t = e.touches[0];
      startRef.current = { x: t.clientX, y: t.clientY, t: Date.now() };
    };

    const onEnd = (e) => {
      const start = startRef.current;
      startRef.current = null;
      if (!start) return;
      const t = e.changedTouches[0];
      const dx = t.clientX - start.x;
      const dy = t.clientY - start.y;
      const dt = Date.now() - start.t;
      if (dt > TIME_LIMIT) return;
      if (Math.abs(dy) > VERTICAL_GUARD) return; // scrolled, not swiped
      if (Math.abs(dx) < SWIPE_THRESHOLD) return; // too small, treat as tap

      // In LTR, swiping LEFT (negative dx) → go to NEXT step.
      // In RTL (Arabic), reverse: swiping RIGHT → next.
      const dir = isAr ? -1 : 1;
      if (dx * dir < 0) onNext && onNext();
      else onPrev && onPrev();
    };

    // passive: true keeps the page scrollable smoothly; we never call
    // preventDefault here.
    el.addEventListener("touchstart", onStart, { passive: true });
    el.addEventListener("touchend", onEnd, { passive: true });
    return () => {
      el.removeEventListener("touchstart", onStart);
      el.removeEventListener("touchend", onEnd);
    };
  }, [onNext, onPrev, isAr, enabled]);

  return elRef;
}
