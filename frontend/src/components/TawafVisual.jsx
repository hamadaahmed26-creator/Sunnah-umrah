import React from "react";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";

/*
 Controlled Tawaf visual.
 - Receives `segment` prop (0..3) and animates the dot to that position smoothly.
 - Segment 0: Black Stone (start of lap) — top-right
 - Segment 1: Walking far side — bottom-right of circle (between Iraqi and Shami corners conceptually)
 - Segment 2: Yemeni Corner — bottom-left
 - Segment 3: Between Yemeni and Black Stone — top-left going right
 The diagram is supplementary; the page itself shows the big guidance.
*/
const TARGET_ANGLES = {
  0: -45,    // Black Stone (NE)
  1: -180,   // Far side (W)
  2: 135,    // Yemeni Corner (SW)  -- equivalent to -225
  3: 60,     // Between Yemeni & Black Stone (SE-ish, closer to Black Stone)
};

export default function TawafVisual({ count = 0, total = 7, segment = 0 }) {
  const cx = 150;
  const cy = 150;
  const R = 95;

  const angle = useMotionValue(TARGET_ANGLES[0]);

  React.useEffect(() => {
    // Smooth motion to the target. CCW interpolation: pick the nearest angle below current.
    const target = TARGET_ANGLES[segment] ?? TARGET_ANGLES[0];
    const cur = angle.get();
    // shift target downward in increments of 360 until it's <= cur (CCW path)
    let t = target;
    while (t > cur) t -= 360;
    if (cur - t > 360) t += 360; // don't go more than one revolution
    animate(angle, t, { type: "spring", stiffness: 60, damping: 18 });
  }, [segment, angle]);

  const dotX = useTransform(angle, (a) => cx + R * Math.cos((a * Math.PI) / 180));
  const dotY = useTransform(angle, (a) => cy + R * Math.sin((a * Math.PI) / 180));

  const C = 2 * Math.PI * R;
  const progress = Math.min(count / total, 1);
  const lapDisplay = Math.min(count + 1, total);

  return (
    <div className="rounded-3xl bg-[#F8F6F0] border border-[#E8E5DD] p-4" data-testid="tawaf-visual">
      <div className="flex items-center justify-between mb-2">
        <div className="text-[10px] uppercase tracking-[0.22em] text-[#B3884D]">Mataf · Top View</div>
        <div className="text-[10px] uppercase tracking-[0.18em] text-[#8E8F8A]">
          {count >= total ? "Complete" : count < 3 ? "Raml (lap 1–3)" : "Walk normally"}
        </div>
      </div>

      <svg viewBox="0 0 300 300" className="w-full h-auto">
        <circle cx={cx} cy={cy} r={R + 22} fill="#FFFFFF" stroke="#E8E5DD" strokeWidth="1" />
        <circle cx={cx} cy={cy} r={R + 8} fill="none" stroke="#E8E5DD" strokeWidth="1" strokeDasharray="2 4" />
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

        {/* 7 lap pips */}
        {Array.from({ length: total }).map((_, i) => {
          const a = -90 + (360 / total) * i;
          const r = R + 16;
          const x = cx + r * Math.cos((a * Math.PI) / 180);
          const y = cy + r * Math.sin((a * Math.PI) / 180);
          const done = i < count;
          return <circle key={i} cx={x} cy={y} r="3.5" fill={done ? "#B3884D" : "#E8E5DD"} />;
        })}

        {/* CCW arrow */}
        <g opacity="0.7">
          <path d={`M ${cx + R + 6} ${cy - 8} l -6 8 l 6 8`} fill="none" stroke="#B3884D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </g>

        {/* Ka'bah */}
        <rect x={cx - 24} y={cy - 24} width="48" height="48" fill="#1C1D1B" rx="2" />
        <rect x={cx - 24} y={cy + 8} width="48" height="16" fill="#B3884D" rx="1" opacity="0.85" />
        <text x={cx} y={cy + 2} textAnchor="middle" fill="#F8F6F0" fontSize="9" fontWeight="600" letterSpacing="1">KA'BAH</text>

        {/* Black Stone */}
        <motion.circle
          cx={cx + 24}
          cy={cy - 24}
          r={segment === 0 ? 9 : 6}
          fill="#2A5A4A"
          stroke="#FFFFFF"
          strokeWidth="2"
          animate={segment === 0 ? { scale: [1, 1.25, 1] } : { scale: 1 }}
          transition={{ duration: 1, repeat: segment === 0 ? Infinity : 0 }}
        />
        <text x={cx + 34} y={cy - 26} fontSize="9" fill="#1C1D1B" fontWeight="600">Black Stone</text>

        {/* Yemeni */}
        <motion.circle
          cx={cx - 24}
          cy={cy + 24}
          r={segment === 2 ? 9 : 5}
          fill="#B3884D"
          stroke="#FFFFFF"
          strokeWidth="2"
          animate={segment === 2 ? { scale: [1, 1.3, 1] } : { scale: 1 }}
          transition={{ duration: 1, repeat: segment === 2 ? Infinity : 0 }}
        />
        <text x={cx - 90} y={cy + 40} fontSize="9" fill="#1C1D1B" fontWeight="600">Yemeni Corner</text>

        {/* Maqam Ibrahim */}
        <rect x={cx + 40} y={cy - 6} width="12" height="12" fill="#FFFFFF" stroke="#B3884D" strokeWidth="1.5" />
        <text x={cx + 55} y={cy + 3} fontSize="9" fill="#1C1D1B" fontWeight="500">Maqam Ibrahim</text>

        {/* Pilgrim dot */}
        <motion.circle cx={dotX} cy={dotY} r="9" fill="#8B4540" stroke="#FFFFFF" strokeWidth="2.5" />

        <text x={cx} y={cy + 50} textAnchor="middle" fontSize="11" fill="#5C5D58" fontWeight="600" letterSpacing="2">
          {count >= total ? "ALHAMDULILLAH" : `LAP ${lapDisplay} / ${total}`}
        </text>
      </svg>
    </div>
  );
}
