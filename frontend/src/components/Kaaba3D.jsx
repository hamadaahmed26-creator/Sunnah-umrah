import React from "react";
import { motion } from "framer-motion";

/*
 Isometric 3D-style Ka'bah illustration.
 - Cube with the black Kiswa, gold inscription band, and the door.
 - Highlights can be: "blackStone" | "yemeniCorner" | "maqamIbrahim" | null.
 - The pilgrim dot orbits subtly when no highlight is given (to imply Tawaf motion).
*/

export default function Kaaba3D({ highlight = null, label = true }) {
  // Cube vertices in isometric projection
  // Centered roughly at (200, 200) of a 400x400 viewBox.
  // Top face is a diamond, front & right faces are parallelograms.
  // Front-left corner = Black Stone (visible, near viewer)
  // Front-right corner = Yemeni Corner (hidden side, but we show its label peeking)
  // We'll arrange so the Black Stone is at the visible right corner, and the door is on the front face left.

  const isBS = highlight === "blackStone";
  const isYC = highlight === "yemeniCorner";
  const isMI = highlight === "maqamIbrahim";

  return (
    <div className="relative w-full h-72 rounded-3xl bg-gradient-to-b from-[#fbeed1] via-[#f3e1b5] to-[#e6c98a] overflow-hidden" data-testid="kaaba-3d">
      {/* Sky / mosque hint */}
      <div
        className="absolute inset-0 opacity-60"
        style={{
          backgroundImage:
            'radial-gradient(circle at 50% 0%, rgba(255,255,255,0.7), transparent 55%), url("data:image/svg+xml;utf8,<svg xmlns=%27http://www.w3.org/2000/svg%27 width=%27160%27 height=%27160%27><filter id=%27n%27><feTurbulence type=%27fractalNoise%27 baseFrequency=%270.7%27/></filter><rect width=%27100%25%27 height=%27100%25%27 filter=%27url(%23n)%27 opacity=%270.06%27/></svg>")',
        }}
      />

      <svg viewBox="0 0 400 400" className="absolute inset-0 w-full h-full">
        <defs>
          <linearGradient id="kiswaFront" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1f1f1d" />
            <stop offset="100%" stopColor="#0a0a09" />
          </linearGradient>
          <linearGradient id="kiswaSide" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#161614" />
            <stop offset="100%" stopColor="#070706" />
          </linearGradient>
          <linearGradient id="kiswaTop" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#2a2a26" />
            <stop offset="100%" stopColor="#0e0e0c" />
          </linearGradient>
          <linearGradient id="goldBand" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#e8c068" />
            <stop offset="50%" stopColor="#b3884d" />
            <stop offset="100%" stopColor="#7c5b2c" />
          </linearGradient>
          <linearGradient id="marble" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#f8f6f0" />
            <stop offset="100%" stopColor="#d9d4c4" />
          </linearGradient>
          <radialGradient id="glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(255,220,120,0.85)" />
            <stop offset="100%" stopColor="rgba(255,220,120,0)" />
          </radialGradient>
        </defs>

        {/* Marble base (mataf floor) */}
        <ellipse cx="200" cy="320" rx="170" ry="34" fill="url(#marble)" />
        <ellipse cx="200" cy="320" rx="150" ry="26" fill="none" stroke="#cdc6b1" strokeWidth="1" strokeDasharray="3 5" />

        {/* === Ka'bah cube (isometric) === */}
        {/* Top face (diamond) */}
        <polygon points="200,90 310,150 200,210 90,150" fill="url(#kiswaTop)" />
        {/* Front face (left parallelogram, our viewer-facing side) */}
        <polygon points="90,150 200,210 200,310 90,250" fill="url(#kiswaFront)" />
        {/* Right face */}
        <polygon points="200,210 310,150 310,250 200,310" fill="url(#kiswaSide)" />

        {/* Gold band (Hizam) on both visible faces */}
        <polygon points="90,196 200,256 200,272 90,212" fill="url(#goldBand)" />
        <polygon points="200,256 310,196 310,212 200,272" fill="url(#goldBand)" />

        {/* Door on the front face (right side of the front face, near the corner closest to viewer) */}
        <g>
          <rect
            x="0" y="0"
            width="22" height="46"
            rx="2"
            fill="url(#goldBand)"
            transform="matrix(1 0.55 0 1 152 218)"
          />
        </g>

        {/* === Corner glow when highlighted === */}
        {isBS && (
          <motion.circle
            cx="200" cy="310" r="40" fill="url(#glow)"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.4, repeat: Infinity }}
          />
        )}
        {isYC && (
          <motion.circle
            cx="90" cy="250" r="38" fill="url(#glow)"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.4, repeat: Infinity }}
          />
        )}

        {/* Black Stone marker (front-bottom corner of the cube, where front and right faces meet) */}
        <g>
          <motion.circle
            cx="200" cy="282" r={isBS ? 9 : 6}
            fill="#2A5A4A" stroke="#FFFFFF" strokeWidth="2.5"
            animate={isBS ? { scale: [1, 1.25, 1] } : { scale: 1 }}
            transition={{ duration: 1, repeat: isBS ? Infinity : 0 }}
          />
          {label && (
            <g>
              <rect x="220" y="270" width="120" height="22" rx="11" fill="rgba(28,29,27,0.92)" />
              <text x="280" y="285" textAnchor="middle" fontSize="11" fontWeight="700" fill="#F8F6F0" letterSpacing="1">BLACK STONE</text>
              <line x1="206" y1="282" x2="220" y2="281" stroke="rgba(28,29,27,0.92)" strokeWidth="2" />
            </g>
          )}
        </g>

        {/* Yemeni Corner marker (left-bottom of the front face / back-left in 3D) */}
        <g>
          <motion.circle
            cx="90" cy="250" r={isYC ? 9 : 5}
            fill="#B3884D" stroke="#FFFFFF" strokeWidth="2.5"
            animate={isYC ? { scale: [1, 1.3, 1] } : { scale: 1 }}
            transition={{ duration: 1, repeat: isYC ? Infinity : 0 }}
          />
          {label && (
            <g>
              <rect x="6" y="240" width="80" height="22" rx="11" fill="rgba(28,29,27,0.92)" />
              <text x="46" y="255" textAnchor="middle" fontSize="10" fontWeight="700" fill="#F8F6F0" letterSpacing="0.5">YEMENI CORNER</text>
              <line x1="86" y1="252" x2="90" y2="251" stroke="rgba(28,29,27,0.92)" strokeWidth="2" />
            </g>
          )}
        </g>

        {/* Maqam Ibrahim — small dome to the right of the cube */}
        <g>
          {isMI && (
            <motion.circle cx="345" cy="252" r="28" fill="url(#glow)"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.4, repeat: Infinity }}
            />
          )}
          <rect x="332" y="252" width="26" height="14" fill="#cdc6b1" />
          <path d="M332,252 Q345,234 358,252 Z" fill="#d4af6f" />
          <circle cx="345" cy="234" r="2.5" fill="#7c5b2c" />
          {label && (
            <text x="345" y="282" textAnchor="middle" fontSize="9" fontWeight="600" fill="#1C1D1B">Maqam Ibrahim</text>
          )}
        </g>

        {/* Direction arrow indicating CCW Tawaf motion (front-left to right) */}
        <g opacity="0.85">
          <path d="M 75 270 Q 200 350 325 270" fill="none" stroke="#8B4540" strokeWidth="2.5" strokeDasharray="4 5" strokeLinecap="round" />
          <path d="M 322 268 l -10 -2 l 6 8" fill="none" stroke="#8B4540" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      </svg>

      {/* Caption */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 inline-flex items-center gap-1.5 rounded-full bg-white/85 backdrop-blur px-3 py-1 text-[10px] font-semibold tracking-[0.2em] uppercase text-[#1C1D1B]">
        Ka'bah · 3D view
      </div>
    </div>
  );
}
