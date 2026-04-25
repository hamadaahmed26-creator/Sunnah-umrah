import React from "react";
import { motion } from "framer-motion";

/*
 Stylised Safa <-> Marwah corridor.
 - Safa on the LEFT, Marwah on the RIGHT.
 - Two green markers in the middle (the "men jog" zone).
 - Pilgrim icon position moves along the corridor based on count.

 count = 0  -> at Safa (just arrived, about to begin)
 count = 1  -> arrived at Marwah after trip 1
 count = 2  -> back at Safa
 etc.

 Even count = at Safa, Odd count = at Marwah.
*/
export default function SaiVisual({ count = 0, total = 7 }) {
  const atMarwah = count % 2 === 1;
  // 0 .. 1 across the corridor
  const x = atMarwah ? 250 : 50;

  return (
    <div className="rounded-3xl bg-[#F8F6F0] border border-[#E8E5DD] p-4" data-testid="sai-visual">
      <div className="flex items-center justify-between mb-2">
        <div className="text-[10px] uppercase tracking-[0.22em] text-[#B3884D]">Mas'a corridor</div>
        <div className="text-[10px] uppercase tracking-[0.18em] text-[#8E8F8A]">Trip {Math.min(count, total)}/{total}</div>
      </div>

      <svg viewBox="0 0 300 140" className="w-full h-auto">
        {/* Corridor */}
        <rect x="20" y="55" width="260" height="32" rx="16" fill="#FFFFFF" stroke="#E8E5DD" />

        {/* Path line */}
        <line x1="50" y1="71" x2="250" y2="71" stroke="#E8E5DD" strokeWidth="2" strokeDasharray="3 4" />

        {/* Green markers */}
        <rect x="125" y="51" width="3" height="40" fill="#2A5A4A" />
        <rect x="172" y="51" width="3" height="40" fill="#2A5A4A" />
        <text x="148" y="46" textAnchor="middle" fontSize="8" fill="#2A5A4A" fontWeight="700" letterSpacing="1">
          MEN JOG
        </text>

        {/* Safa */}
        <g>
          <circle cx="50" cy="71" r="14" fill="#1C1D1B" />
          <text x="50" y="74" textAnchor="middle" fontSize="8" fill="#F8F6F0" fontWeight="700">SAFA</text>
          <text x="50" y="108" textAnchor="middle" fontSize="9" fill="#1C1D1B" fontWeight="600">الصفا</text>
          <text x="50" y="120" textAnchor="middle" fontSize="8" fill="#5C5D58">Start here</text>
        </g>

        {/* Marwah */}
        <g>
          <circle cx="250" cy="71" r="14" fill="#B3884D" />
          <text x="250" y="74" textAnchor="middle" fontSize="8" fill="#FFFFFF" fontWeight="700">MARWAH</text>
          <text x="250" y="108" textAnchor="middle" fontSize="9" fill="#1C1D1B" fontWeight="600">المروة</text>
          <text x="250" y="120" textAnchor="middle" fontSize="8" fill="#5C5D58">End here</text>
        </g>

        {/* Pilgrim dot */}
        <motion.circle
          cx={x}
          cy={71}
          r="6"
          fill="#8B4540"
          stroke="#FFFFFF"
          strokeWidth="2"
          animate={{ cx: x, scale: [1, 1.2, 1] }}
          transition={{ cx: { type: "spring", stiffness: 80, damping: 16 }, scale: { duration: 1.4, repeat: Infinity } }}
        />

        {/* Pip indicators (7 trips) */}
        {Array.from({ length: total }).map((_, i) => (
          <rect
            key={i}
            x={40 + i * 32}
            y={20}
            width="22"
            height="3"
            rx="1.5"
            fill={i < count ? "#B3884D" : "#E8E5DD"}
          />
        ))}
      </svg>

      <p className="mt-2 text-[11px] text-[#5C5D58]">
        {atMarwah
          ? "Currently on Marwah side — face the Ka'bah, takbir 3x, du'a 3x."
          : count === 0
            ? "Start on Safa: face Ka'bah, recite the verse, then walk toward Marwah."
            : "Currently on Safa side — face the Ka'bah, takbir 3x, du'a 3x."}
      </p>

      <SaiLandmarkInfo />
    </div>
  );
}

function SaiLandmarkInfo() {
  const [open, setOpen] = React.useState(false);
  const items = [
    { color: "#1C1D1B", title: "Safa", text: "Small hill on the southern end. Sa'i begins here. Recite verse 2:158 once, then takbir 3x and du'a 3x facing the Ka'bah." },
    { color: "#B3884D", title: "Marwah", text: "Hill on the northern end. Sa'i ends here on the 7th trip. Same takbir + du'a (no Safa verse)." },
    { color: "#2A5A4A", title: "Green markers", text: "Two green lights mark the area where Hajar (AS) ran. Men jog briskly between them; women walk normally." },
  ];
  return (
    <div className="mt-3" data-testid="sai-landmark-info">
      <button
        onClick={() => setOpen((v) => !v)}
        className="tap-pulse w-full text-left text-[11px] uppercase tracking-[0.18em] text-[#B3884D] inline-flex items-center justify-between"
        data-testid="sai-landmark-toggle"
      >
        <span>{open ? "Hide landmarks" : "What are these landmarks?"}</span>
        <span className={`transition-transform ${open ? "rotate-180" : ""}`}>⌄</span>
      </button>
      {open && (
        <ul className="mt-2 space-y-2" data-testid="sai-landmark-list">
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
