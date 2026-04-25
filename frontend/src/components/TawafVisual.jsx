import React from "react";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";

/*
 Top-down stylised Ka'bah with the pilgrim dot doing FULL circles around it.
 Each tap = one full counter-clockwise revolution = one complete lap.
 Progress arc shows N/7 laps completed.
*/
export default function TawafVisual({ count = 0, total = 7 }) {
  const cx = 150;
  const cy = 150;
  const R = 95;

  // Animated angle in degrees. CCW around Ka'bah → angle decreases.
  // Start at the Black Stone corner (top-right ≈ -45deg in SVG coords).
  const START = -45;
  const angle = useMotionValue(START);
  const prevCount = React.useRef(count);

  React.useEffect(() => {
    if (count > prevCount.current) {
      // Spin one full CCW revolution per new lap.
      const from = angle.get();
      const to = from - 360 * (count - prevCount.current);
      animate(angle, to, { duration: 1.4, ease: "easeInOut" });
    } else if (count < prevCount.current) {
      // reset to start
      angle.set(START);
    }
    prevCount.current = count;
  }, [count, angle]);

  const dotX = useTransform(angle, (a) => cx + R * Math.cos((a * Math.PI) / 180));
  const dotY = useTransform(angle, (a) => cy + R * Math.sin((a * Math.PI) / 180));

  // Static progress arc representing N/7 complete laps.
  const C = 2 * Math.PI * R;
  const progress = Math.min(count / total, 1);

  const isRamlLap = count < 3;
  const lapDisplay = Math.min(count + 1, total);

  return (
    <div className="rounded-3xl bg-[#F8F6F0] border border-[#E8E5DD] p-4" data-testid="tawaf-visual">
      <div className="flex items-center justify-between mb-2">
        <div className="text-[10px] uppercase tracking-[0.22em] text-[#B3884D]">Mataf · Top View</div>
        <div className="text-[10px] uppercase tracking-[0.18em] text-[#8E8F8A]">
          {count >= total ? "Complete" : isRamlLap ? "Raml (lap 1–3)" : "Walk normally"}
        </div>
      </div>

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
          return (
            <circle
              key={i}
              cx={x}
              cy={y}
              r="3.5"
              fill={done ? "#B3884D" : "#E8E5DD"}
            />
          );
        })}

        {/* CCW direction arrow */}
        <g opacity="0.7">
          <path d={`M ${cx + R + 6} ${cy - 8} l -6 8 l 6 8`} fill="none" stroke="#B3884D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </g>

        {/* Ka'bah */}
        <rect x={cx - 24} y={cy - 24} width="48" height="48" fill="#1C1D1B" rx="2" />
        <rect x={cx - 24} y={cy + 8} width="48" height="16" fill="#B3884D" rx="1" opacity="0.85" />
        <text x={cx} y={cy + 2} textAnchor="middle" fill="#F8F6F0" fontSize="9" fontWeight="600" letterSpacing="1">KA'BAH</text>

        {/* Corners */}
        <g>
          <circle cx={cx + 24} cy={cy - 24} r="6" fill="#2A5A4A" stroke="#FFFFFF" strokeWidth="2" />
          <text x={cx + 34} y={cy - 28} fontSize="9" fill="#1C1D1B" fontWeight="600">Black Stone</text>
          <text x={cx + 34} y={cy - 18} fontSize="8" fill="#5C5D58">Say Allāhu Akbar</text>
        </g>
        <g>
          <circle cx={cx - 24} cy={cy + 24} r="5" fill="#B3884D" stroke="#FFFFFF" strokeWidth="2" />
          <text x={cx - 90} y={cy + 40} fontSize="9" fill="#1C1D1B" fontWeight="600">Yemeni Corner</text>
          <text x={cx - 90} y={cy + 50} fontSize="8" fill="#5C5D58">Touch (no kiss)</text>
        </g>
        <g>
          <rect x={cx + 40} y={cy - 6} width="12" height="12" fill="#FFFFFF" stroke="#B3884D" strokeWidth="1.5" />
          <text x={cx + 55} y={cy + 3} fontSize="9" fill="#1C1D1B" fontWeight="500">Maqam Ibrahim</text>
        </g>

        {/* Pilgrim dot - animates a full CCW lap on each tap */}
        <motion.circle
          cx={dotX}
          cy={dotY}
          r="8"
          fill="#8B4540"
          stroke="#FFFFFF"
          strokeWidth="2.5"
        />

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
    { color: "#B3884D", title: "Yemeni Corner (Rukn Yamani)", text: "South-west corner. Touch with right hand if easy — do NOT kiss it and do NOT say takbir." },
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
