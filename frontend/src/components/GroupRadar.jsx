import React from "react";
import { haversine, bearing, formatDistance } from "../lib/geo";

/**
 * Radar-style relative map. Centred on the current user (you).
 * - 3 concentric range rings (auto-scaled to the farthest member)
 * - One coloured dot per group member who is sharing location
 * - Cardinal labels (N / E / S / W)
 *
 * Why a radar instead of a tile-map? Inside the Haram, GPS jitters and tiles
 * fail on weak signal. A relative radar works offline, has zero external
 * dependencies, and answers the only question pilgrims need: "where are they
 * relative to me, and how far?"
 */
export default function GroupRadar({ me, members, isAr }) {
  const located = (members || []).filter(
    (m) => m.lat != null && m.lng != null && m.user_id !== me?.user_id
  );

  // Compute distances relative to "me"
  const points = me
    ? located.map((m) => ({
        ...m,
        dist: haversine(me.lat, me.lng, m.lat, m.lng),
        brg: bearing(me.lat, me.lng, m.lat, m.lng),
      }))
    : [];

  const maxDist = Math.max(50, ...points.map((p) => p.dist));
  // Round up to a friendly ring size
  const ring3 = niceRange(maxDist);
  const ring2 = ring3 * 0.66;
  const ring1 = ring3 * 0.33;

  const SIZE = 280;
  const CX = SIZE / 2;
  const CY = SIZE / 2;
  const RADIUS = (SIZE / 2) - 22;

  if (!me) {
    return (
      <div className="rounded-2xl border border-[#E8E5DD] bg-[#F8F6F0] p-6 text-center text-[12px] text-[#5C5D58]">
        {isAr
          ? "فعّل مشاركة موقعك لرؤية رفاقك على الرادار."
          : "Enable location sharing to see your group on the radar."}
      </div>
    );
  }

  if (points.length === 0) {
    return (
      <div className="rounded-2xl border border-[#E8E5DD] bg-[#F8F6F0] p-6 text-center text-[12px] text-[#5C5D58]">
        {isAr
          ? "لا أحد في مجموعتك يشارك موقعه الآن."
          : "No one in your group is sharing their location yet."}
      </div>
    );
  }

  return (
    <div className="rounded-3xl border border-[#E8E5DD] bg-white p-4" data-testid="group-radar">
      <div className="flex items-center justify-between mb-2">
        <div className="text-[10px] uppercase tracking-[0.22em] text-[#B3884D]">
          {isAr ? "الرادار" : "Radar"}
        </div>
        <div className="text-[10px] text-[#8E8F8A]">
          {isAr ? "النطاق" : "Range"}: {formatDistance(ring3, isAr)}
        </div>
      </div>
      <svg viewBox={`0 0 ${SIZE} ${SIZE}`} className="w-full h-auto">
        {/* Range rings */}
        {[ring1, ring2, ring3].map((r, i) => (
          <circle
            key={i}
            cx={CX}
            cy={CY}
            r={(r / ring3) * RADIUS}
            fill="none"
            stroke="#E8E5DD"
            strokeWidth="1"
            strokeDasharray={i === 2 ? "0" : "3 3"}
          />
        ))}
        {/* Cross hairs */}
        <line x1={CX} y1={CY - RADIUS} x2={CX} y2={CY + RADIUS} stroke="#EFEAE0" />
        <line x1={CX - RADIUS} y1={CY} x2={CX + RADIUS} y2={CY} stroke="#EFEAE0" />
        {/* Cardinal labels */}
        <text x={CX} y={CY - RADIUS - 6} textAnchor="middle" fontSize="11" fill="#8E8F8A">N</text>
        <text x={CX} y={CY + RADIUS + 14} textAnchor="middle" fontSize="11" fill="#8E8F8A">S</text>
        <text x={CX + RADIUS + 8} y={CY + 4} textAnchor="middle" fontSize="11" fill="#8E8F8A">E</text>
        <text x={CX - RADIUS - 8} y={CY + 4} textAnchor="middle" fontSize="11" fill="#8E8F8A">W</text>
        {/* Range tick label */}
        <text x={CX + 4} y={CY - (ring2 / ring3) * RADIUS - 3} fontSize="9" fill="#B3A88A">
          {formatDistance(ring2, isAr)}
        </text>
        <text x={CX + 4} y={CY - RADIUS + 11} fontSize="9" fill="#B3A88A">
          {formatDistance(ring3, isAr)}
        </text>
        {/* You — gold pulse */}
        <circle cx={CX} cy={CY} r="9" fill="#B3884D" opacity="0.25">
          <animate attributeName="r" values="9;14;9" dur="2.4s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.35;0;0.35" dur="2.4s" repeatCount="indefinite" />
        </circle>
        <circle cx={CX} cy={CY} r="6" fill="#B3884D" stroke="white" strokeWidth="2" />
        {/* Members */}
        {points.map((p) => {
          const r = (p.dist / ring3) * RADIUS;
          const θ = (p.brg - 90) * (Math.PI / 180); // bearing 0 = up
          const x = CX + r * Math.cos(θ);
          const y = CY + r * Math.sin(θ);
          const initial = (p.name || "?").trim().charAt(0).toUpperCase();
          return (
            <g key={p.user_id} data-testid={`radar-dot-${p.user_id}`}>
              <circle cx={x} cy={y} r="14" fill="#1C1D1B" stroke="white" strokeWidth="2" />
              <text x={x} y={y + 4} textAnchor="middle" fontSize="11" fontWeight="600" fill="white">
                {initial}
              </text>
              <text x={x} y={y + 28} textAnchor="middle" fontSize="10" fill="#5C5D58">
                {formatDistance(p.dist, isAr)}
              </text>
            </g>
          );
        })}
      </svg>
      <div className="mt-2 flex items-center justify-center gap-4 text-[10px] text-[#8E8F8A]">
        <span className="inline-flex items-center gap-1.5">
          <span className="inline-block w-2.5 h-2.5 rounded-full bg-[#B3884D]" />
          {isAr ? "أنت" : "You"}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="inline-block w-2.5 h-2.5 rounded-full bg-[#1C1D1B]" />
          {isAr ? "رفقاؤك" : "Group"}
        </span>
      </div>
    </div>
  );
}

// Round a metre value up to a "friendly" radar range
function niceRange(d) {
  const steps = [50, 100, 200, 500, 1000, 2000, 5000, 10000, 20000, 50000];
  for (const s of steps) if (d <= s) return s;
  return Math.ceil(d / 10000) * 10000;
}
