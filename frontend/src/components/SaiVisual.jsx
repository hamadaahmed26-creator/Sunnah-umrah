import React from "react";
import { motion } from "framer-motion";

/*
 Controlled Sa'i visual.
 segment: 0=Safa, 1=Walking toward other hill, 2=Between green markers, 3=Marwah
 trips: 0..7 completed
*/
const SEGMENT_X = { 0: 50, 1: 110, 2: 150, 3: 250 };

export default function SaiVisual({ trips = 0, segment = 0, total = 7 }) {
  const x = SEGMENT_X[segment] ?? 50;

  return (
    <div className="rounded-3xl bg-[#F8F6F0] border border-[#E8E5DD] p-4" data-testid="sai-visual">
      <div className="flex items-center justify-between mb-2">
        <div className="text-[10px] uppercase tracking-[0.22em] text-[#B3884D]">Mas'a corridor</div>
        <div className="text-[10px] uppercase tracking-[0.18em] text-[#8E8F8A]">
          Trip {Math.min(trips + (segment === 3 || segment === 0 ? 0 : 1), total)} / {total}
        </div>
      </div>

      <svg viewBox="0 0 300 140" className="w-full h-auto">
        {/* Corridor */}
        <rect x="20" y="55" width="260" height="32" rx="16" fill="#FFFFFF" stroke="#E8E5DD" />
        <line x1="50" y1="71" x2="250" y2="71" stroke="#E8E5DD" strokeWidth="2" strokeDasharray="3 4" />

        {/* Green markers */}
        <rect x="125" y="51" width="3" height="40" fill="#2A5A4A" />
        <rect x="172" y="51" width="3" height="40" fill="#2A5A4A" />
        <text x="148" y="46" textAnchor="middle" fontSize="8" fill="#2A5A4A" fontWeight="700" letterSpacing="1">
          MEN JOG
        </text>

        {/* Safa */}
        <motion.circle
          cx="50" cy="71" r="14" fill="#1C1D1B"
          animate={segment === 0 ? { scale: [1, 1.18, 1] } : { scale: 1 }}
          transition={{ duration: 1, repeat: segment === 0 ? Infinity : 0 }}
        />
        <text x="50" y="74" textAnchor="middle" fontSize="8" fill="#F8F6F0" fontWeight="700">SAFA</text>
        <text x="50" y="108" textAnchor="middle" fontSize="9" fill="#1C1D1B" fontWeight="600">الصفا</text>

        {/* Marwah */}
        <motion.circle
          cx="250" cy="71" r="14" fill="#B3884D"
          animate={segment === 3 ? { scale: [1, 1.18, 1] } : { scale: 1 }}
          transition={{ duration: 1, repeat: segment === 3 ? Infinity : 0 }}
        />
        <text x="250" y="74" textAnchor="middle" fontSize="8" fill="#FFFFFF" fontWeight="700">MARWAH</text>
        <text x="250" y="108" textAnchor="middle" fontSize="9" fill="#1C1D1B" fontWeight="600">المروة</text>

        {/* Pilgrim dot */}
        <motion.circle
          cx={x} cy={71} r="7" fill="#8B4540" stroke="#FFFFFF" strokeWidth="2"
          animate={{ cx: x }}
          transition={{ type: "spring", stiffness: 70, damping: 16 }}
        />

        {/* Trip pips */}
        {Array.from({ length: total }).map((_, i) => (
          <rect
            key={i}
            x={40 + i * 32}
            y={20}
            width="22"
            height="3"
            rx="1.5"
            fill={i < trips ? "#B3884D" : "#E8E5DD"}
          />
        ))}
      </svg>
    </div>
  );
}
