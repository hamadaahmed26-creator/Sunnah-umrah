import React from "react";

/*
 Tour scenes — one SVG illustration per Umrah step.
 Designed to look like a clean tour-guide diagram: a small figure
 in front of the relevant landmark (Ka'bah, Safa hill, Maqam, etc.)
 doing the action for that step. All on a calm sand background
 with brass/yellow accents.
*/

const INK = "#1C1D1B";
const GOLD = "#B3884D";
const YELLOW = "#F5C44A";
const GREEN = "#2A5A4A";
const SAND = "#F8F6F0";
const STONE = "#E8E5DD";

// Reusable little person figure (standing). x,y = feet position.
function Pilgrim({ x, y, color = "white", action = "stand", scale = 1, faceLeft = false }) {
  const s = scale;
  const flip = faceLeft ? -1 : 1;
  const armUp = action === "raise-right" || action === "talbiyah" || action === "takbir";
  return (
    <g transform={`translate(${x},${y}) scale(${s},${s})`}>
      {/* Body (ihram robe) */}
      <path d={`M -10 0 L 10 0 L 7 -28 L -7 -28 Z`} fill={color} stroke={INK} strokeWidth="1.2" />
      {/* Head */}
      <circle cx="0" cy="-34" r="5.5" fill="#E8C9A1" stroke={INK} strokeWidth="1" />
      {/* Right arm — raised when needed */}
      {armUp ? (
        <path d={`M ${4 * flip} -26 L ${10 * flip} -42 L ${8 * flip} -44`} stroke={INK} strokeWidth="2" strokeLinecap="round" fill="none" />
      ) : (
        <path d={`M ${4 * flip} -26 L ${10 * flip} -10`} stroke={INK} strokeWidth="2" strokeLinecap="round" fill="none" />
      )}
      {/* Left arm */}
      {action === "takbir" ? (
        <path d={`M ${-4 * flip} -26 L ${-10 * flip} -42 L ${-8 * flip} -44`} stroke={INK} strokeWidth="2" strokeLinecap="round" fill="none" />
      ) : (
        <path d={`M ${-4 * flip} -26 L ${-10 * flip} -10`} stroke={INK} strokeWidth="2" strokeLinecap="round" fill="none" />
      )}
      {/* Legs */}
      <line x1="-3" y1="0" x2="-4" y2="9" stroke={INK} strokeWidth="2.2" strokeLinecap="round" />
      <line x1="3" y1="0" x2="4" y2="9" stroke={INK} strokeWidth="2.2" strokeLinecap="round" />
    </g>
  );
}

// Top-down Ka'bah block (used in side-on scenes)
function Kaaba({ x, y, w = 80, h = 80 }) {
  return (
    <g transform={`translate(${x},${y})`}>
      <rect x={-w / 2} y={-h} width={w} height={h} fill={INK} stroke="#000" strokeWidth="0.5" />
      <rect x={-w / 2} y={-h + h * 0.28} width={w} height="6" fill={GOLD} />
      <rect x={w / 2 - 14} y={-h + h * 0.45} width="6" height="14" fill={GOLD} opacity="0.7" />
    </g>
  );
}

// Hill silhouette
function Hill({ x, y, w = 60, h = 32, label, labelColor = "white" }) {
  return (
    <g>
      <path d={`M ${x - w / 2} ${y} L ${x} ${y - h} L ${x + w / 2} ${y} Z`} fill={INK} stroke={GOLD} strokeWidth="1" />
      {label && (
        <text x={x} y={y + 13} textAnchor="middle" fill={labelColor} fontSize="9" fontWeight="600" letterSpacing="1.2">
          {label}
        </text>
      )}
    </g>
  );
}

// ─── SCENE: Miqat boundary ───────────────────────────────────
function Scene_Miqat() {
  return (
    <svg viewBox="0 0 280 160" className="w-full h-full">
      <rect width="280" height="160" fill={SAND} />
      {/* Sky band */}
      <rect width="280" height="60" fill="#F2EEE2" />
      {/* Ground */}
      <line x1="0" y1="120" x2="280" y2="120" stroke={STONE} strokeWidth="2" />
      {/* Boundary post */}
      <line x1="140" y1="40" x2="140" y2="120" stroke={GOLD} strokeWidth="3" strokeDasharray="3 3" />
      <rect x="120" y="38" width="40" height="14" rx="2" fill={INK} />
      <text x="140" y="48" textAnchor="middle" fill="white" fontSize="7" fontWeight="700" letterSpacing="1.3">MIQĀT</text>
      {/* Pilgrim on right side, facing left */}
      <Pilgrim x={200} y={120} faceLeft />
      <Pilgrim x={220} y={120} faceLeft />
      {/* Direction arrow */}
      <path d="M 195 90 L 165 90 M 165 90 L 170 86 M 165 90 L 170 94" stroke={YELLOW} strokeWidth="1.8" strokeLinecap="round" fill="none" />
      <text x="180" y="80" textAnchor="middle" fill={INK} fontSize="7.5" fontWeight="600" letterSpacing="1">TO MECCA</text>
    </svg>
  );
}

// ─── SCENE: Niyyah ───────────────────────────────────────────
function Scene_Niyyah() {
  return (
    <svg viewBox="0 0 280 160" className="w-full h-full">
      <rect width="280" height="160" fill={SAND} />
      <line x1="0" y1="125" x2="280" y2="125" stroke={STONE} strokeWidth="2" />
      <Pilgrim x={140} y={125} action="raise-right" scale={1.5} />
      {/* Speech bubble */}
      <g>
        <path d="M 55 50 L 200 50 Q 215 50 215 65 L 215 80 Q 215 95 200 95 L 80 95 L 70 105 L 70 95 L 55 95 Q 40 95 40 80 L 40 65 Q 40 50 55 50 Z" fill="white" stroke={STONE} strokeWidth="1" />
        <text x="127" y="78" textAnchor="middle" fill={INK} fontSize="13" fontWeight="600">لَبَّيْكَ اللَّهُمَّ عُمْرَة</text>
      </g>
    </svg>
  );
}

// ─── SCENE: Talbiyah (group walking) ─────────────────────────
function Scene_Talbiyah() {
  return (
    <svg viewBox="0 0 280 160" className="w-full h-full">
      <rect width="280" height="160" fill={SAND} />
      <line x1="0" y1="130" x2="280" y2="130" stroke={STONE} strokeWidth="2" />
      <Pilgrim x={70} y={130} />
      <Pilgrim x={120} y={130} action="raise-right" />
      <Pilgrim x={170} y={130} />
      <Pilgrim x={220} y={130} action="raise-right" />
      {/* Walking arrow */}
      <path d="M 30 70 L 250 70" stroke={YELLOW} strokeWidth="2" strokeLinecap="round" strokeDasharray="4 4" />
      <path d="M 250 70 L 244 65 M 250 70 L 244 75" stroke={YELLOW} strokeWidth="2" strokeLinecap="round" fill="none" />
      <text x="140" y="55" textAnchor="middle" fill={INK} fontSize="9" fontWeight="600" letterSpacing="2">TO MASJID AL-HARAM</text>
    </svg>
  );
}

// ─── SCENE: Enter Masjid ─────────────────────────────────────
function Scene_EnterMasjid() {
  return (
    <svg viewBox="0 0 280 160" className="w-full h-full">
      <rect width="280" height="160" fill={SAND} />
      <line x1="0" y1="130" x2="280" y2="130" stroke={STONE} strokeWidth="2" />
      {/* Mosque arch */}
      <g>
        <path d="M 150 130 L 150 60 Q 150 30 195 30 Q 240 30 240 60 L 240 130 Z" fill="#F2EEE2" stroke={INK} strokeWidth="1.5" />
        <path d="M 165 130 L 165 70 Q 165 50 195 50 Q 225 50 225 70 L 225 130 Z" fill={INK} />
        <circle cx="195" cy="35" r="3" fill={GOLD} />
      </g>
      {/* Pilgrim entering with right foot first */}
      <Pilgrim x={120} y={130} />
      <path d="M 130 130 L 155 130" stroke={YELLOW} strokeWidth="2" strokeLinecap="round" />
      <path d="M 155 130 L 149 126 M 155 130 L 149 134" stroke={YELLOW} strokeWidth="2" strokeLinecap="round" fill="none" />
      <text x="142" y="120" textAnchor="middle" fill={GREEN} fontSize="7" fontWeight="700" letterSpacing="1.4">RIGHT FOOT</text>
    </svg>
  );
}

// ─── SCENE: Tawaf start at Black Stone ───────────────────────
function Scene_TawafStart() {
  return (
    <svg viewBox="0 0 280 160" className="w-full h-full">
      <rect width="280" height="160" fill={SAND} />
      <line x1="0" y1="130" x2="280" y2="130" stroke={STONE} strokeWidth="1.5" />
      <Kaaba x={170} y={130} w={86} h={94} />
      {/* Black Stone marker on near corner */}
      <g>
        <circle cx="129" cy="105" r="6" fill={YELLOW} stroke={INK} strokeWidth="1.4" />
        <line x1="129" y1="100" x2="105" y2="78" stroke={INK} strokeWidth="0.8" />
        <text x="60" y="76" fill={INK} fontSize="8" fontWeight="700" letterSpacing="1.3">BLACK STONE</text>
      </g>
      <Pilgrim x={88} y={130} action="raise-right" />
    </svg>
  );
}

// ─── SCENE: Yemeni Corner ────────────────────────────────────
function Scene_YemeniCorner() {
  return (
    <svg viewBox="0 0 280 160" className="w-full h-full">
      <rect width="280" height="160" fill={SAND} />
      <line x1="0" y1="130" x2="280" y2="130" stroke={STONE} strokeWidth="1.5" />
      <Kaaba x={170} y={130} w={86} h={94} />
      {/* Yemeni Corner — left near corner */}
      <circle cx="129" cy="120" r="5" fill={GOLD} />
      <line x1="129" y1="120" x2="100" y2="55" stroke={INK} strokeWidth="0.8" />
      <text x="40" y="54" fill={INK} fontSize="8" fontWeight="700" letterSpacing="1.2">YEMENI CORNER</text>
      {/* Hand reaching out */}
      <Pilgrim x={88} y={130} action="raise-right" />
      {/* Du'a hint */}
      <text x="222" y="50" textAnchor="end" fill={GOLD} fontSize="7.5" fontWeight="700" letterSpacing="1.2">RABBANĀ ĀTINĀ…</text>
      <path d="M 222 55 Q 200 65 175 95" stroke={GOLD} strokeWidth="1" strokeDasharray="2 2" fill="none" />
    </svg>
  );
}

// ─── SCENE: Maqam Ibrahim ────────────────────────────────────
function Scene_Maqam() {
  return (
    <svg viewBox="0 0 280 160" className="w-full h-full">
      <rect width="280" height="160" fill={SAND} />
      <line x1="0" y1="130" x2="280" y2="130" stroke={STONE} strokeWidth="1.5" />
      <Kaaba x={210} y={130} w={68} h={76} />
      {/* Maqam — small gold dome */}
      <g>
        <rect x="105" y="108" width="32" height="22" fill={INK} stroke={GOLD} strokeWidth="1.5" />
        <path d="M 105 108 Q 121 90 137 108" fill={GOLD} stroke={INK} strokeWidth="1" />
      </g>
      <text x="121" y="148" textAnchor="middle" fill={INK} fontSize="7.5" fontWeight="700" letterSpacing="1.2">MAQAM IBRAHIM</text>
      {/* Pilgrim praying (kneeling shape) */}
      <g transform="translate(60,130)">
        <ellipse cx="0" cy="-3" rx="14" ry="6" fill="white" stroke={INK} strokeWidth="1.2" />
        <circle cx="-2" cy="-13" r="5" fill="#E8C9A1" stroke={INK} strokeWidth="1" />
      </g>
      <text x="60" y="148" textAnchor="middle" fill={GREEN} fontSize="7.5" fontWeight="700" letterSpacing="1.2">2 RAKAʿAH</text>
    </svg>
  );
}

// ─── SCENE: Zamzam ───────────────────────────────────────────
function Scene_Zamzam() {
  return (
    <svg viewBox="0 0 280 160" className="w-full h-full">
      <rect width="280" height="160" fill={SAND} />
      <line x1="0" y1="130" x2="280" y2="130" stroke={STONE} strokeWidth="1.5" />
      {/* Zamzam dispenser */}
      <g>
        <rect x="60" y="60" width="60" height="70" rx="6" fill={INK} stroke={GOLD} strokeWidth="2" />
        <text x="90" y="85" textAnchor="middle" fill={GOLD} fontSize="9" fontWeight="700" letterSpacing="1.4">ZAMZAM</text>
        <rect x="78" y="100" width="24" height="6" fill={GOLD} />
        {/* Tap */}
        <rect x="86" y="106" width="8" height="8" fill={GOLD} />
        {/* Water */}
        <line x1="90" y1="115" x2="90" y2="125" stroke={YELLOW} strokeWidth="2" />
      </g>
      {/* Person drinking */}
      <Pilgrim x={170} y={130} action="raise-right" />
      <circle cx="180" cy="92" r="6" fill="white" stroke={INK} strokeWidth="1.2" />
      <text x="220" y="90" textAnchor="middle" fill={GREEN} fontSize="8" fontWeight="700" letterSpacing="1.2">DRINK FULLY</text>
    </svg>
  );
}

// ─── SCENE: Safa start ───────────────────────────────────────
function Scene_SafaStart() {
  return (
    <svg viewBox="0 0 280 160" className="w-full h-full">
      <rect width="280" height="160" fill={SAND} />
      <line x1="0" y1="130" x2="280" y2="130" stroke={STONE} strokeWidth="1.5" />
      <Hill x={70} y={130} w={80} h={50} label="SAFA" />
      <Hill x={210} y={130} w={80} h={50} label="MARWAH" />
      {/* dotted path */}
      <line x1="110" y1="130" x2="170" y2="130" stroke={GOLD} strokeDasharray="3 3" strokeWidth="1.5" opacity="0.7" />
      {/* Start mark on Safa */}
      <circle cx="70" cy="80" r="5" fill={YELLOW} stroke={INK} strokeWidth="1.2">
        <animate attributeName="r" values="4;7;4" dur="1.6s" repeatCount="indefinite" />
      </circle>
      <text x="70" y="62" textAnchor="middle" fill={INK} fontSize="8" fontWeight="700" letterSpacing="1.4">START HERE</text>
    </svg>
  );
}

// ─── SCENE: Takbir on hill ───────────────────────────────────
function Scene_HillTakbir() {
  return (
    <svg viewBox="0 0 280 160" className="w-full h-full">
      <rect width="280" height="160" fill={SAND} />
      <line x1="0" y1="135" x2="280" y2="135" stroke={STONE} strokeWidth="1.5" />
      <Hill x={140} y={135} w={120} h={56} />
      {/* Pilgrim at top, both arms up */}
      <Pilgrim x={140} y={79} action="takbir" scale={1.2} />
      {/* 3x markers */}
      <g>
        <text x="40" y="40" fill={GOLD} fontSize="11" fontWeight="800" letterSpacing="1.4">×3</text>
        <text x="240" y="40" textAnchor="end" fill={GOLD} fontSize="8" fontWeight="700" letterSpacing="1.2">RAISE HANDS</text>
      </g>
    </svg>
  );
}

// ─── SCENE: Halq / Taqsir ────────────────────────────────────
function Scene_Halq() {
  return (
    <svg viewBox="0 0 280 160" className="w-full h-full">
      <rect width="280" height="160" fill={SAND} />
      <line x1="0" y1="130" x2="280" y2="130" stroke={STONE} strokeWidth="1.5" />
      <Pilgrim x={110} y={130} scale={1.4} />
      {/* Scissors */}
      <g transform="translate(160,75) rotate(-20)">
        <circle cx="-10" cy="0" r="7" fill="none" stroke={INK} strokeWidth="2" />
        <circle cx="10" cy="0" r="7" fill="none" stroke={INK} strokeWidth="2" />
        <line x1="-4" y1="-3" x2="32" y2="-12" stroke={INK} strokeWidth="2" strokeLinecap="round" />
        <line x1="4" y1="-3" x2="32" y2="-8" stroke={INK} strokeWidth="2" strokeLinecap="round" />
      </g>
      <text x="220" y="110" textAnchor="middle" fill={GREEN} fontSize="9" fontWeight="700" letterSpacing="1.2">SHAVE</text>
      <text x="220" y="125" textAnchor="middle" fill={GOLD} fontSize="7" fontWeight="700" letterSpacing="1.2">OR TRIM</text>
    </svg>
  );
}

// ─── SCENE: Done ─────────────────────────────────────────────
function Scene_Done() {
  return (
    <svg viewBox="0 0 280 160" className="w-full h-full">
      <rect width="280" height="160" fill={SAND} />
      <Kaaba x={140} y={120} w={70} h={78} />
      {/* Glow */}
      <circle cx="140" cy="80" r="60" fill={YELLOW} opacity="0.15">
        <animate attributeName="r" values="50;65;50" dur="2.8s" repeatCount="indefinite" />
      </circle>
      <text x="140" y="150" textAnchor="middle" fill={GREEN} fontSize="11" fontWeight="800" letterSpacing="2">ALHAMDULILLAH</text>
    </svg>
  );
}

// ─── SCENE: Intro — 4 numbered cards ─────────────────────────
function Scene_Intro() {
  const items = [
    { n: "1", k: "IHRAM", c: GREEN },
    { n: "2", k: "TAWAF", c: GOLD },
    { n: "3", k: "SA'I", c: "#8B4540" },
    { n: "4", k: "HALQ", c: INK },
  ];
  return (
    <svg viewBox="0 0 280 160" className="w-full h-full">
      <rect width="280" height="160" fill={SAND} />
      <text x="140" y="32" textAnchor="middle" fill={INK} fontSize="13" fontWeight="700" letterSpacing="2.2">UMRAH · 4 STEPS</text>
      {items.map((it, i) => {
        const x = 28 + i * 60;
        return (
          <g key={i}>
            <rect x={x} y="50" width="56" height="74" rx="8" fill="white" stroke={STONE} strokeWidth="1" />
            <circle cx={x + 28} cy="76" r="14" fill={it.c} />
            <text x={x + 28} y="81" textAnchor="middle" fill="white" fontSize="13" fontWeight="800">{it.n}</text>
            <text x={x + 28} y="110" textAnchor="middle" fill={INK} fontSize="8" fontWeight="700" letterSpacing="1.2">{it.k}</text>
          </g>
        );
      })}
    </svg>
  );
}

// ─── Tawaf walking — reuse the existing TawafMap ─────────────
import { TawafMap, SaiMap } from "./RitualMaps";

function Scene_TawafWalk({ lap }) {
  return (
    <div className="w-full h-full grid place-items-center bg-[#F8F6F0] py-2">
      <TawafMap lap={lap} />
    </div>
  );
}

function Scene_SaiWalk({ trip }) {
  return (
    <div className="w-full h-full grid place-items-center bg-[#F8F6F0] py-2">
      <SaiMap trip={trip} />
    </div>
  );
}

// ─── Public API ──────────────────────────────────────────────
const REGISTRY = {
  intro: Scene_Intro,
  miqat: Scene_Miqat,
  niyyah: Scene_Niyyah,
  talbiyah: Scene_Talbiyah,
  "enter-masjid": Scene_EnterMasjid,
  "tawaf-start": Scene_TawafStart,
  "tawaf-walk": Scene_TawafWalk,
  "yemeni-corner": Scene_YemeniCorner,
  maqam: Scene_Maqam,
  zamzam: Scene_Zamzam,
  "safa-start": Scene_SafaStart,
  "hill-takbir": Scene_HillTakbir,
  "sai-walk": Scene_SaiWalk,
  halq: Scene_Halq,
  done: Scene_Done,
};

export default function TourScene({ scene, lap, trip }) {
  const C = REGISTRY[scene];
  if (!C) {
    return (
      <div className="w-full h-full bg-[#F8F6F0] grid place-items-center text-[10px] tracking-[0.22em] uppercase text-[#B3884D]">
        {scene}
      </div>
    );
  }
  return <C lap={lap} trip={trip} />;
}
