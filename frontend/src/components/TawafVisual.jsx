import React from "react";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";

/*
 Tawaf live-coach visual.
 - One tap = one full CCW revolution of the dot around the Ka'bah.
 - During the animation, a prompt banner above the diagram updates per segment:
   1. Start: "At the Black Stone — say Allāhu Akbar"
   2. Walking the far side: "Walk / dhikr / du'a"
   3. Approaching Yemeni Corner: dot pauses + "Touch with right hand (no kiss, no takbir)"
   4. Yemeni → Black Stone: "Recite Rabbanā ātinā…"
   5. End: "Lap N complete — Allāhu Akbar"
 - 7 outer pips fill in gold per completed lap. Center label = "LAP n / 7".
*/

const START_ANGLE = -45; // Black Stone corner, NE in our SVG coordinates.

const PROMPTS = [
  { id: 0, label_en: "At the Black Stone", body_en: "Face it, raise right hand, say «اللَّهُ أَكْبَر»", color: "#2A5A4A" },
  { id: 1, label_en: "Walking the far side",  body_en: "Make du'a, recite Qur'an, send salawāt on the Prophet ﷺ", color: "#1C1D1B" },
  { id: 2, label_en: "Yemeni Corner",          body_en: "Touch with right hand if easy — NO kiss, NO takbir, NO du'a here", color: "#B3884D" },
  { id: 3, label_en: "Yemeni → Black Stone",  body_en: "Recite: «رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ»", color: "#B3884D" },
  { id: 4, label_en: "Lap complete",            body_en: "Say «اللَّهُ أَكْبَر» again — start the next lap", color: "#2A5A4A" },
];

export default function TawafVisual({ count = 0, total = 7 }) {
  const cx = 150;
  const cy = 150;
  const R = 95;

  const angle = useMotionValue(START_ANGLE);
  const [segment, setSegment] = React.useState(0);
  const [animating, setAnimating] = React.useState(false);
  const prevCount = React.useRef(count);

  React.useEffect(() => {
    let cancelled = false;

    async function runLap() {
      setAnimating(true);
      const from = angle.get();
      // Segment A: Black Stone → 3/4 of the way around (just before Yemeni Corner)
      setSegment(0);
      await new Promise((r) => setTimeout(r, 600));
      if (cancelled) return;
      setSegment(1);
      const yemeniAngle = from - 270; // 3/4 CCW
      await animate(angle, yemeniAngle, { duration: 1.6, ease: "easeInOut" }).then();
      if (cancelled) return;

      // Segment B: pause at Yemeni Corner
      setSegment(2);
      await new Promise((r) => setTimeout(r, 900));
      if (cancelled) return;

      // Segment C: Yemeni → Black Stone (between corners)
      setSegment(3);
      const endAngle = from - 360;
      await animate(angle, endAngle, { duration: 1.4, ease: "easeInOut" }).then();
      if (cancelled) return;

      // Segment D: lap complete
      setSegment(4);
      await new Promise((r) => setTimeout(r, 600));
      if (cancelled) return;

      setSegment(0);
      setAnimating(false);
    }

    if (count > prevCount.current) {
      runLap();
    } else if (count < prevCount.current) {
      angle.set(START_ANGLE);
      setSegment(0);
      setAnimating(false);
    }
    prevCount.current = count;

    return () => {
      cancelled = true;
    };
  }, [count, angle]);

  const dotX = useTransform(angle, (a) => cx + R * Math.cos((a * Math.PI) / 180));
  const dotY = useTransform(angle, (a) => cy + R * Math.sin((a * Math.PI) / 180));

  const C = 2 * Math.PI * R;
  const progress = Math.min(count / total, 1);
  const isRamlLap = count < 3;
  const lapDisplay = Math.min(count + 1, total);
  const prompt = PROMPTS[segment];

  return (
    <div className="rounded-3xl bg-[#F8F6F0] border border-[#E8E5DD] p-4" data-testid="tawaf-visual">
      <div className="flex items-center justify-between mb-2">
        <div className="text-[10px] uppercase tracking-[0.22em] text-[#B3884D]">Mataf · Top View</div>
        <div className="text-[10px] uppercase tracking-[0.18em] text-[#8E8F8A]">
          {count >= total ? "Complete" : isRamlLap ? "Raml (lap 1–3)" : "Walk normally"}
        </div>
      </div>

      {/* Live coach banner */}
      <motion.div
        key={`p-${segment}-${animating}`}
        initial={{ opacity: 0, y: -6 }}
        animate={{ opacity: animating ? 1 : 0.85, y: 0 }}
        transition={{ duration: 0.25 }}
        className="mb-3 rounded-2xl border border-[#E8E5DD] bg-white p-3"
        data-testid="tawaf-prompt"
      >
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full" style={{ background: prompt.color }} />
          <div className="text-[10px] uppercase tracking-[0.22em] text-[#8E8F8A]" data-testid="tawaf-prompt-label">
            {animating ? prompt.label_en : "Ready — tap counter"}
          </div>
        </div>
        <div className="mt-1.5 text-[13px] text-[#1C1D1B] leading-relaxed" data-testid="tawaf-prompt-body">
          {animating ? prompt.body_en : "Press the round counter above to begin a lap. The dot will guide you."}
        </div>
      </motion.div>

      <svg viewBox="0 0 300 300" className="w-full h-auto">
        {/* Mataf circle */}
        <circle cx={cx} cy={cy} r={R + 22} fill="#FFFFFF" stroke="#E8E5DD" strokeWidth="1" />
        <circle cx={cx} cy={cy} r={R + 8} fill="none" stroke="#E8E5DD" strokeWidth="1" strokeDasharray="2 4" />

        {/* Full path circle */}
        <circle cx={cx} cy={cy} r={R} fill="none" stroke="#E8E5DD" strokeWidth="2" />

        {/* Completed laps progress arc */}
        <circle
          cx={cx}
          cy={cy}
          r={R}
          fill="none"
          stroke="#B3884D"
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray={C}
          strokeDashoffset={(1 - progress) * C}
          transform={`rotate(-90 ${cx} ${cy})`}
        />

        {/* 7 lap pips around the ring */}
        {Array.from({ length: total }).map((_, i) => {
          const a = -90 + (360 / total) * i;
          const r = R + 16;
          const x = cx + r * Math.cos((a * Math.PI) / 180);
          const y = cy + r * Math.sin((a * Math.PI) / 180);
          const done = i < count;
          return <circle key={i} cx={x} cy={y} r="3.5" fill={done ? "#B3884D" : "#E8E5DD"} />;
        })}

        {/* CCW direction arrow */}
        <g opacity="0.7">
          <path d={`M ${cx + R + 6} ${cy - 8} l -6 8 l 6 8`} fill="none" stroke="#B3884D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </g>

        {/* Ka'bah */}
        <rect x={cx - 24} y={cy - 24} width="48" height="48" fill="#1C1D1B" rx="2" />
        <rect x={cx - 24} y={cy + 8} width="48" height="16" fill="#B3884D" rx="1" opacity="0.85" />
        <text x={cx} y={cy + 2} textAnchor="middle" fill="#F8F6F0" fontSize="9" fontWeight="600" letterSpacing="1">KA'BAH</text>

        {/* Black Stone — pulse when prompt id 0 or 4 */}
        <g>
          <motion.circle
            cx={cx + 24}
            cy={cy - 24}
            r={segment === 0 || segment === 4 ? 8 : 6}
            fill="#2A5A4A"
            stroke="#FFFFFF"
            strokeWidth="2"
            animate={segment === 0 || segment === 4 ? { scale: [1, 1.25, 1] } : { scale: 1 }}
            transition={{ duration: 0.9, repeat: segment === 0 || segment === 4 ? Infinity : 0 }}
          />
          <text x={cx + 34} y={cy - 28} fontSize="9" fill="#1C1D1B" fontWeight="600">Black Stone</text>
        </g>

        {/* Yemeni Corner — pulse when prompt id 2 */}
        <g>
          <motion.circle
            cx={cx - 24}
            cy={cy + 24}
            r={segment === 2 ? 8 : 5}
            fill="#B3884D"
            stroke="#FFFFFF"
            strokeWidth="2"
            animate={segment === 2 ? { scale: [1, 1.3, 1] } : { scale: 1 }}
            transition={{ duration: 0.9, repeat: segment === 2 ? Infinity : 0 }}
          />
          <text x={cx - 90} y={cy + 40} fontSize="9" fill="#1C1D1B" fontWeight="600">Yemeni Corner</text>
        </g>

        {/* Maqam Ibrahim */}
        <g>
          <rect x={cx + 40} y={cy - 6} width="12" height="12" fill="#FFFFFF" stroke="#B3884D" strokeWidth="1.5" />
          <text x={cx + 55} y={cy + 3} fontSize="9" fill="#1C1D1B" fontWeight="500">Maqam Ibrahim</text>
        </g>

        {/* Pilgrim dot */}
        <motion.circle cx={dotX} cy={dotY} r="8" fill="#8B4540" stroke="#FFFFFF" strokeWidth="2.5" />

        {/* Center lap label */}
        <text x={cx} y={cy + 50} textAnchor="middle" fontSize="11" fill="#5C5D58" fontWeight="600" letterSpacing="2">
          {count >= total ? "ALHAMDULILLAH" : `LAP ${lapDisplay} / ${total}`}
        </text>
      </svg>

      <div className="grid grid-cols-3 gap-2 mt-2 text-[10px]">
        <Legend dot="#8B4540" label="You (full circle)" />
        <Legend dot="#2A5A4A" label="Black Stone" />
        <Legend dot="#B3884D" label="Yemeni Corner" />
      </div>

      <LandmarkInfo />
    </div>
  );
}

function Legend({ dot, label }) {
  return (
    <div className="flex items-center gap-1.5">
      <span className="w-2.5 h-2.5 rounded-full" style={{ background: dot }} />
      <span className="text-[#5C5D58]">{label}</span>
    </div>
  );
}

function LandmarkInfo() {
  const [open, setOpen] = React.useState(false);
  const items = [
    { color: "#2A5A4A", title: "Black Stone (Hajar al-Aswad)", text: "Eastern corner. Each lap starts here. Face it, raise your right hand, and say «اللَّهُ أَكْبَر»." },
    { color: "#B3884D", title: "Yemeni Corner (Rukn Yamani)", text: "South-west corner. Touch with right hand if easy — NO kiss, NO takbir, NO du'a here." },
    { color: "#FFFFFF", title: "Maqam Ibrahim", text: "After 7 laps, pray 2 short raka'ah behind it if possible." },
  ];
  return (
    <div className="mt-3" data-testid="tawaf-landmark-info">
      <button
        onClick={() => setOpen((v) => !v)}
        className="tap-pulse w-full text-left text-[11px] uppercase tracking-[0.18em] text-[#B3884D] inline-flex items-center justify-between"
        data-testid="tawaf-landmark-toggle"
      >
        <span>{open ? "Hide landmarks" : "What are these landmarks?"}</span>
        <span className={`transition-transform ${open ? "rotate-180" : ""}`}>⌄</span>
      </button>
      {open && (
        <ul className="mt-2 space-y-2" data-testid="tawaf-landmark-list">
          {items.map((it, i) => (
            <li key={i} className="rounded-xl bg-white border border-[#E8E5DD] p-3 flex gap-3">
              <span className="flex-shrink-0 w-3 h-3 mt-1 rounded-full" style={{ background: it.color }} />
              <div>
                <div className="text-[12px] font-semibold text-[#1C1D1B]">{it.title}</div>
                <div className="text-[12px] text-[#5C5D58] leading-relaxed">{it.text}</div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
