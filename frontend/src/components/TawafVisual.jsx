import React from "react";
import { motion } from "framer-motion";

/*
 Top-down stylised Ka'bah surrounded by Mataf area.
 - Ka'bah is a small black square at center.
 - Black Stone (Hajar al-Aswad) corner at NE (top-right).
 - Yemeni Corner at SW (bottom-left).
 - Maqam Ibrahim small marker outside NE-ish.
 - A pilgrim "dot" walks counter-clockwise around the Ka'bah.

 Progress: 0..7 (laps completed). Dot position is interpolated within current lap.
*/
export default function TawafVisual({ count = 0, total = 7 }) {
  const cx = 150;
  const cy = 150;
  const R = 95; // path radius

  // Position in lap progression: integer laps complete + fractional within current.
  // While idle (no animation per-lap-progress), show dot at start of current lap (Black Stone).
  const lapStartAngle = -45; // Black Stone corner is at top-right (-45deg in our coords)
  // counter-clockwise: angle decreases in screen coords (because mataf is CCW around Ka'bah)
  const angle = lapStartAngle; // dot rests at Black Stone between laps

  const rad = (deg) => (deg * Math.PI) / 180;
  const dotX = cx + R * Math.cos(rad(angle));
  const dotY = cy + R * Math.sin(rad(angle));

  // Animate dot around the path on each tap to give a sense of motion.
  const lapProgress = Math.min(count / total, 1);

  const isRamlLap = count < 3;

  return (
    <div className="rounded-3xl bg-[#F8F6F0] border border-[#E8E5DD] p-4" data-testid="tawaf-visual">
      <div className="flex items-center justify-between mb-2">
        <div className="text-[10px] uppercase tracking-[0.22em] text-[#B3884D]">Mataf · Top View</div>
        <div className="text-[10px] uppercase tracking-[0.18em] text-[#8E8F8A]">
          {isRamlLap ? "Raml (lap 1–3)" : "Walk normally"}
        </div>
      </div>
      <svg viewBox="0 0 300 300" className="w-full h-auto">
        {/* Mataf circle */}
        <circle cx={cx} cy={cy} r={R + 22} fill="#FFFFFF" stroke="#E8E5DD" strokeWidth="1" />
        <circle cx={cx} cy={cy} r={R + 8} fill="none" stroke="#E8E5DD" strokeWidth="1" strokeDasharray="2 4" />

        {/* Path circle (counter-clockwise direction) */}
        <circle
          cx={cx}
          cy={cy}
          r={R}
          fill="none"
          stroke="#B3884D"
          strokeWidth="2"
          strokeDasharray={2 * Math.PI * R}
          strokeDashoffset={(1 - lapProgress) * 2 * Math.PI * R}
          transform={`rotate(-90 ${cx} ${cy})`}
          opacity="0.55"
        />

        {/* Direction arrow (CCW) */}
        <g opacity="0.7">
          <path d={`M ${cx + R + 6} ${cy - 8} l -6 8 l 6 8`} fill="none" stroke="#B3884D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </g>

        {/* Ka'bah */}
        <rect x={cx - 22} y={cy - 22} width="44" height="44" fill="#1C1D1B" rx="2" />
        <rect x={cx - 22} y={cy + 8} width="44" height="14" fill="#B3884D" rx="1" opacity="0.85" />
        <text x={cx} y={cy + 2} textAnchor="middle" fill="#F8F6F0" fontSize="9" fontWeight="600" letterSpacing="1">
          KA'BAH
        </text>

        {/* Corner markers */}
        {/* Black Stone (Hajar al-Aswad) — eastern corner / start */}
        <g>
          <circle cx={cx + 22} cy={cy - 22} r="6" fill="#2A5A4A" stroke="#FFFFFF" strokeWidth="2" />
          <text x={cx + 32} y={cy - 26} fontSize="9" fill="#1C1D1B" fontWeight="600">Black Stone</text>
          <text x={cx + 32} y={cy - 16} fontSize="8" fill="#5C5D58">Start each lap</text>
        </g>

        {/* Yemeni Corner — southwestern */}
        <g>
          <circle cx={cx - 22} cy={cy + 22} r="5" fill="#B3884D" stroke="#FFFFFF" strokeWidth="2" />
          <text x={cx - 90} y={cy + 38} fontSize="9" fill="#1C1D1B" fontWeight="600">Yemeni Corner</text>
          <text x={cx - 90} y={cy + 48} fontSize="8" fill="#5C5D58">Touch (no kiss)</text>
        </g>

        {/* Maqam Ibrahim */}
        <g>
          <rect x={cx + 38} y={cy - 6} width="12" height="12" fill="#FFFFFF" stroke="#B3884D" strokeWidth="1.5" />
          <text x={cx + 53} y={cy + 3} fontSize="9" fill="#1C1D1B" fontWeight="500">Maqam Ibrahim</text>
        </g>

        {/* Pilgrim dot (animated subtly) */}
        <motion.circle
          cx={dotX}
          cy={dotY}
          r="7"
          fill="#8B4540"
          stroke="#FFFFFF"
          strokeWidth="2"
          animate={{ scale: [1, 1.18, 1] }}
          transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
        />
      </svg>

      <div className="grid grid-cols-3 gap-2 mt-2 text-[10px]">
        <Legend dot="#8B4540" label="You" />
        <Legend dot="#2A5A4A" label="Black Stone" />
        <Legend dot="#B3884D" label="Yemeni Corner" />
      </div>

      <LandmarkInfo
        items={[
          { color: "#2A5A4A", title: "Black Stone (Hajar al-Aswad)", text: "Eastern corner of the Ka'bah. Each lap starts and ends here. Face it, raise your right hand, and say takbir." },
          { color: "#B3884D", title: "Yemeni Corner (Rukn Yamani)", text: "South-west corner. Touch with right hand if easy — do NOT kiss it and do NOT say takbir. Make du'a between this corner and Black Stone." },
          { color: "#FFFFFF", border: "#B3884D", title: "Maqam Ibrahim", text: "The Station of Ibrahim ﷺ. After 7 laps, pray 2 short raka'ah behind it if possible." },
        ]}
      />
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

function LandmarkInfo({ items }) {
  const [open, setOpen] = React.useState(false);
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
              <span
                className="flex-shrink-0 w-3 h-3 mt-1 rounded-full"
                style={{ background: it.color, border: it.border ? `1.5px solid ${it.border}` : "none" }}
              />
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
