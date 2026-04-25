import React from "react";

/*
 Two SVG mini-maps used inside the big Tawaf / Sa'i counter card.
 Both replicate the diagram style of the "Umrah Simplified" reference video:
   • Real-shape landmarks (Kaaba cube, Safa & Marwah hills)
   • Brass-gold path
   • Bright yellow "active" highlight
   • Clear labels
   • Animated current-position dot
*/

const GOLD = "#B3884D";
const YELLOW = "#F5C44A";
const INK = "#1C1D1B";
const STONE = "#E8E5DD";
const GREEN = "#2A5A4A";

// ─────────────────────────────────────────────────────────────
// TAWAF MAP — top-down Kaaba, counter-clockwise 7-lap arc
// ─────────────────────────────────────────────────────────────
export function TawafMap({ lap }) {
  const cx = 120;
  const cy = 120;
  const r = 80;

  // Black Stone is at the EAST corner (top-right of Kaaba in our top-down view).
  // Tawaf goes counter-clockwise. We draw 7 arc segments starting from the
  // Black Stone, sweeping anti-clockwise around the Ka'bah.
  const start = -45; // east corner direction (degrees, 0 = east, +y = down)
  const segments = Array.from({ length: 7 }).map((_, i) => {
    const a0 = start - i * (360 / 7);
    const a1 = start - (i + 1) * (360 / 7);
    return { a0, a1, done: i < lap, active: i === lap };
  });

  const pol = (a, rad = r) => {
    const t = (a * Math.PI) / 180;
    return [cx + rad * Math.cos(t), cy + rad * Math.sin(t)];
  };

  const arcPath = (a0, a1) => {
    const [x0, y0] = pol(a0);
    const [x1, y1] = pol(a1);
    // Sweep flag 0 = anti-clockwise (matches Tawaf direction)
    return `M ${x0.toFixed(2)} ${y0.toFixed(2)} A ${r} ${r} 0 0 0 ${x1.toFixed(2)} ${y1.toFixed(2)}`;
  };

  // Animated head-of-progress dot at the leading edge of the active arc
  const headAngle = segments[Math.min(lap, 6)].a0;
  const [hx, hy] = pol(headAngle);

  // Black Stone marker (east corner of Kaaba)
  const [bsx, bsy] = pol(-45, r + 14);
  // Yemeni Corner marker (south-east → roughly south-west of east; 90° anti-clockwise from Black Stone in tawaf direction)
  const [ycx, ycy] = pol(-45 - 90, r + 14);

  return (
    <svg
      viewBox="0 0 240 240"
      className="w-full max-w-[230px] mx-auto"
      data-testid="tawaf-map"
      aria-label="Top-down map of Tawaf around the Ka'bah"
    >
      {/* Outer faint guide ring */}
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="14" />

      {/* 7 lap arcs */}
      {segments.map((seg, i) => (
        <path
          key={i}
          d={arcPath(seg.a0, seg.a1)}
          fill="none"
          stroke={seg.done ? GOLD : seg.active ? YELLOW : "rgba(255,255,255,0.18)"}
          strokeWidth="6"
          strokeLinecap="round"
        />
      ))}

      {/* Counter-clockwise direction hint chevron at top */}
      <g opacity="0.5">
        <path
          d={`M ${cx - 6} ${cy - r - 10} L ${cx} ${cy - r - 16} L ${cx + 6} ${cy - r - 10}`}
          fill="none"
          stroke="white"
          strokeWidth="1.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>

      {/* Ka'bah cube — top-down with golden band */}
      <g>
        <rect x={cx - 24} y={cy - 24} width="48" height="48" rx="2" fill={INK} stroke="#000" strokeWidth="0.5" />
        <rect x={cx - 24} y={cy - 14} width="48" height="4" fill={GOLD} />
        {/* Door hint */}
        <rect x={cx + 14} y={cy - 8} width="6" height="14" fill={GOLD} opacity="0.55" />
      </g>

      {/* Black Stone marker */}
      <circle cx={pol(-45, r)[0]} cy={pol(-45, r)[1]} r="5" fill={YELLOW} stroke={INK} strokeWidth="1.2" />
      <text
        x={bsx}
        y={bsy + 3}
        fill="white"
        fontSize="7.5"
        fontWeight="600"
        letterSpacing="0.8"
        textAnchor="middle"
      >
        BLACK STONE
      </text>

      {/* Yemeni Corner marker */}
      <circle cx={pol(-135, r)[0]} cy={pol(-135, r)[1]} r="4" fill={GOLD} />
      <text
        x={ycx}
        y={ycy + 3}
        fill="white"
        fontSize="7.5"
        fontWeight="600"
        letterSpacing="0.8"
        textAnchor="middle"
        opacity="0.85"
      >
        YEMENI
      </text>

      {/* Animated head-of-progress pulse */}
      {lap < 7 && (
        <g>
          <circle cx={hx} cy={hy} r="9" fill={YELLOW} opacity="0.18">
            <animate attributeName="r" values="6;13;6" dur="1.6s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.4;0;0.4" dur="1.6s" repeatCount="indefinite" />
          </circle>
          <circle cx={hx} cy={hy} r="4.5" fill={YELLOW} stroke={INK} strokeWidth="1" />
        </g>
      )}
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────
// SA'I MAP — side view of Safa & Marwah corridor with green markers
// ─────────────────────────────────────────────────────────────
export function SaiMap({ trip }) {
  // Even trips (0,2,4,6) start on Safa, odd start on Marwah
  const onSafa = trip % 2 === 0;
  const headingX = onSafa ? 250 : 30; // direction of motion
  const startX = onSafa ? 30 : 250;

  return (
    <svg
      viewBox="0 0 280 90"
      className="w-full max-w-[280px] mx-auto"
      data-testid="sai-map"
      aria-label="Side view of Sa'i between Safa and Marwah"
    >
      {/* Floor line */}
      <line x1="14" y1="68" x2="266" y2="68" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />

      {/* Dotted path between hills */}
      <line
        x1="50"
        y1="68"
        x2="230"
        y2="68"
        stroke={GOLD}
        strokeWidth="2"
        strokeDasharray="4 5"
        opacity="0.7"
      />

      {/* Green markers (the two famous green pillars in the Mas'a) */}
      <line x1="120" y1="50" x2="120" y2="74" stroke={GREEN} strokeWidth="3" strokeLinecap="round" />
      <line x1="160" y1="50" x2="160" y2="74" stroke={GREEN} strokeWidth="3" strokeLinecap="round" />
      <text x="140" y="46" textAnchor="middle" fill={GREEN} fontSize="6.5" fontWeight="700" letterSpacing="1.4">
        JOG
      </text>

      {/* Safa hill (left) */}
      <g>
        <path d="M 14 68 L 30 38 L 50 68 Z" fill={INK} stroke={GOLD} strokeWidth="1" />
        <text x="30" y="84" textAnchor="middle" fill="white" fontSize="9" fontWeight="600" letterSpacing="1.2">
          SAFA
        </text>
      </g>

      {/* Marwah hill (right) */}
      <g>
        <path d="M 230 68 L 250 38 L 266 68 Z" fill={INK} stroke={GOLD} strokeWidth="1" />
        <text x="250" y="84" textAnchor="middle" fill="white" fontSize="9" fontWeight="600" letterSpacing="1.2">
          MARWAH
        </text>
      </g>

      {/* Direction arrow */}
      <g opacity="0.85">
        <line
          x1={onSafa ? 70 : 210}
          y1="60"
          x2={onSafa ? 100 : 180}
          y2="60"
          stroke={YELLOW}
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <path
          d={onSafa
            ? `M 100 60 L 95 57 M 100 60 L 95 63`
            : `M 180 60 L 185 57 M 180 60 L 185 63`}
          stroke={YELLOW}
          strokeWidth="1.5"
          strokeLinecap="round"
          fill="none"
        />
      </g>

      {/* Pilgrim dot — animates from start hill toward target hill */}
      <g>
        <circle cx={startX + 2} cy="68" r="7" fill={YELLOW} opacity="0.18">
          <animate attributeName="r" values="5;10;5" dur="1.6s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.45;0;0.45" dur="1.6s" repeatCount="indefinite" />
        </circle>
        <circle cx={startX + 2} cy="68" r="4" fill={YELLOW} stroke={INK} strokeWidth="1" />
      </g>
    </svg>
  );
}
