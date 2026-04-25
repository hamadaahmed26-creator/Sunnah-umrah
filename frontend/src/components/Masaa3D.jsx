import React from "react";
import { motion } from "framer-motion";

/*
 Animated Mas'a corridor with camera pan + zoom on the active landmark.
 Highlights: "safa" | "marwah" | "greenMarkers" | "walking" | null
*/

const TARGETS = {
  safa: { x: 100, scale: 1.6 },
  marwah: { x: -100, scale: 1.6 },
  greenMarkers: { x: 0, scale: 1.6 },
  walking: { x: 0, scale: 1.0 },
  null: { x: 0, scale: 1.0 },
};

export default function Masaa3D({ highlight = null }) {
  const isSafa = highlight === "safa";
  const isMarwah = highlight === "marwah";
  const isGreen = highlight === "greenMarkers";
  const isWalking = highlight === "walking";
  const t = TARGETS[highlight] ?? TARGETS.null;

  return (
    <div
      className="relative w-full h-72 rounded-3xl overflow-hidden"
      style={{
        background:
          "radial-gradient(circle at 50% 0%, #fbeed1 0%, #f3e1b5 50%, #e6c98a 100%)",
      }}
      data-testid="masaa-3d"
    >
      <motion.svg
        viewBox="0 0 400 240"
        className="absolute inset-0 w-full h-full"
        animate={{ x: t.x, scale: t.scale }}
        transition={{ type: "spring", stiffness: 60, damping: 18 }}
      >
        <defs>
          <linearGradient id="hillL" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#5b5147" />
            <stop offset="100%" stopColor="#2c261f" />
          </linearGradient>
          <linearGradient id="hillR" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#c9a160" />
            <stop offset="100%" stopColor="#7c5b2c" />
          </linearGradient>
          <linearGradient id="floor" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#f8f6f0" />
            <stop offset="100%" stopColor="#d9d4c4" />
          </linearGradient>
          <linearGradient id="ceil" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#e9e3d3" />
            <stop offset="100%" stopColor="#cdc6b1" />
          </linearGradient>
          <radialGradient id="glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(255,220,120,0.85)" />
            <stop offset="100%" stopColor="rgba(255,220,120,0)" />
          </radialGradient>
        </defs>

        {/* Ceiling perspective */}
        <polygon points="40,40 360,40 320,80 80,80" fill="url(#ceil)" stroke="#bbb39b" strokeWidth="1" />
        <polygon points="80,200 320,200 360,230 40,230" fill="url(#floor)" stroke="#cdc6b1" strokeWidth="1" />
        <rect x="80" y="80" width="240" height="120" fill="#fbeed1" />
        <line x1="80" y1="80" x2="80" y2="200" stroke="#cdc6b1" />
        <line x1="320" y1="80" x2="320" y2="200" stroke="#cdc6b1" />
        <line x1="100" y1="170" x2="300" y2="170" stroke="#cdc6b1" strokeWidth="1" strokeDasharray="6 4" />

        {/* Safa */}
        {isSafa && (
          <motion.circle cx="100" cy="155" r="38" fill="url(#glow)"
            animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 1.4, repeat: Infinity }} />
        )}
        <g>
          <path d="M70,170 Q90,120 100,118 Q110,120 130,170 Z" fill="url(#hillL)" stroke="#1c1814" strokeWidth="1" />
          <rect x="86" y="155" width="28" height="12" fill="#1C1D1B" />
          <text x="100" y="164" textAnchor="middle" fontSize="7" fill="#F8F6F0" fontWeight="700">SAFA</text>
        </g>
        <text x="100" y="195" textAnchor="middle" fontSize="11" fontWeight="700" fill="#1C1D1B" letterSpacing="1.5">SAFA</text>
        <text x="100" y="208" textAnchor="middle" fontSize="9" fill="#5C5D58">الصفا</text>

        {/* Marwah */}
        {isMarwah && (
          <motion.circle cx="300" cy="155" r="38" fill="url(#glow)"
            animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 1.4, repeat: Infinity }} />
        )}
        <g>
          <path d="M270,170 Q290,120 300,118 Q310,120 330,170 Z" fill="url(#hillR)" stroke="#5a4220" strokeWidth="1" />
          <rect x="286" y="155" width="28" height="12" fill="#B3884D" />
          <text x="300" y="164" textAnchor="middle" fontSize="7" fill="#FFFFFF" fontWeight="700">MARWAH</text>
        </g>
        <text x="300" y="195" textAnchor="middle" fontSize="11" fontWeight="700" fill="#1C1D1B" letterSpacing="1.5">MARWAH</text>
        <text x="300" y="208" textAnchor="middle" fontSize="9" fill="#5C5D58">المروة</text>

        {/* Green markers */}
        {isGreen && (
          <motion.rect x="170" y="100" width="60" height="100" fill="url(#glow)"
            animate={{ opacity: [0.4, 0.9, 0.4] }} transition={{ duration: 1.4, repeat: Infinity }} />
        )}
        <g>
          <rect x="180" y="100" width="6" height="100" fill="#2A5A4A" />
          <rect x="214" y="100" width="6" height="100" fill="#2A5A4A" />
          <circle cx="183" cy="98" r="5" fill="#3a8a72">
            <animate attributeName="opacity" values="1;0.4;1" dur="1.4s" repeatCount="indefinite" />
          </circle>
          <circle cx="217" cy="98" r="5" fill="#3a8a72">
            <animate attributeName="opacity" values="1;0.4;1" dur="1.4s" repeatCount="indefinite" />
          </circle>
          <text x="200" y="92" textAnchor="middle" fontSize="9" fontWeight="700" fill="#2A5A4A" letterSpacing="1.5">MEN JOG</text>
        </g>

        {/* Walking pilgrim figure — moves along the corridor when "walking" */}
        <motion.g
          animate={
            isWalking
              ? { x: [0, 200, 0], y: [0, -2, 0] }
              : { x: 0, y: [0, -2, 0] }
          }
          transition={
            isWalking
              ? { x: { duration: 8, repeat: Infinity, ease: "easeInOut" }, y: { duration: 0.6, repeat: Infinity } }
              : { y: { duration: 0.6, repeat: Infinity } }
          }
        >
          <circle cx="140" cy="155" r="6" fill="#1C1D1B" />
          <rect x="136" y="160" width="8" height="14" rx="2" fill="#FFFFFF" stroke="#1C1D1B" strokeWidth="0.6" />
          <line x1="138" y1="174" x2="136" y2="184" stroke="#1C1D1B" strokeWidth="2" strokeLinecap="round" />
          <line x1="142" y1="174" x2="144" y2="184" stroke="#1C1D1B" strokeWidth="2" strokeLinecap="round" />
        </motion.g>
      </motion.svg>

      {/* Caption */}
      <div className="absolute top-3 left-1/2 -translate-x-1/2 inline-flex items-center gap-1.5 rounded-full bg-white/90 backdrop-blur px-3 py-1 text-[10px] font-semibold tracking-[0.2em] uppercase text-[#1C1D1B]">
        Mas'a · 3D
      </div>
      {isWalking && (
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 inline-flex items-center gap-1.5 rounded-full bg-[#1C1D1B]/90 px-3 py-1 text-[10px] font-semibold tracking-[0.2em] uppercase text-white">
          Walking · Safa ↔ Marwah
        </div>
      )}
    </div>
  );
}
