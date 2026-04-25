import React from "react";
import { motion } from "framer-motion";

/*
 Real CSS-3D rotating Ka'bah.
 - 6 faces, real depth with `transform-style: preserve-3d`.
 - Camera tilts to show the active corner facing the viewer.
 - Walking step = continuous slow CCW rotation (mimics Tawaf motion).
 - Markers float in 3D space, labels stay readable.

 Highlights: "blackStone" | "yemeniCorner" | "between" | "walking" | "maqamIbrahim" | null
*/

const TILT = -22;
const TARGETS = {
  blackStone: -45,    // front-right edge faces viewer
  yemeniCorner: 45,   // front-left edge faces viewer
  between: 0,         // front (SE) wall flat
  maqamIbrahim: -75,  // shift right to reveal Maqam Ibrahim beside
  null: -25,
};

const FACE = "absolute inset-0 grid place-items-center";

export default function Kaaba3D({ highlight = null }) {
  const isWalking = highlight === "walking";
  const targetY = TARGETS[highlight] ?? TARGETS.null;

  // Bring active corner toward viewer
  return (
    <div
      className="relative w-full h-72 rounded-3xl overflow-hidden"
      style={{
        background:
          "radial-gradient(circle at 50% 0%, #fbeed1 0%, #f3e1b5 50%, #e6c98a 100%)",
      }}
      data-testid="kaaba-3d"
    >
      {/* Decorative arches silhouette */}
      <svg className="absolute inset-x-0 top-0 w-full h-20 opacity-25" viewBox="0 0 400 80" preserveAspectRatio="none">
        <path d="M0,80 L0,40 Q20,10 40,40 Q60,10 80,40 Q100,10 120,40 Q140,10 160,40 Q180,10 200,40 Q220,10 240,40 Q260,10 280,40 Q300,10 320,40 Q340,10 360,40 Q380,10 400,40 L400,80 Z" fill="#b3884d" />
      </svg>

      {/* Mataf marble disc */}
      <div className="absolute left-1/2 -translate-x-1/2 bottom-3 w-[90%] h-10 rounded-full bg-gradient-to-b from-[#f8f6f0] to-[#cdc6b1] border border-[#cdc6b1]" />

      {/* 3D scene */}
      <div
        className="absolute inset-0 grid place-items-center"
        style={{ perspective: 900 }}
      >
        <motion.div
          className="relative"
          style={{ width: 168, height: 168, transformStyle: "preserve-3d" }}
          animate={
            isWalking
              ? { rotateX: TILT, rotateY: [0, -360] }
              : { rotateX: TILT, rotateY: targetY }
          }
          transition={
            isWalking
              ? { rotateY: { duration: 14, repeat: Infinity, ease: "linear" }, rotateX: { duration: 0.6 } }
              : { type: "spring", stiffness: 35, damping: 14 }
          }
        >
          {/* 6 faces: half-size offset = 84 */}
          <Face transform="translateZ(84px)" hasDoor />
          <Face transform="rotateY(180deg) translateZ(84px)" />
          <Face transform="rotateY(90deg) translateZ(84px)" />
          <Face transform="rotateY(-90deg) translateZ(84px)" />
          <FaceTop transform="rotateX(90deg) translateZ(84px)" />
          <Face transform="rotateX(-90deg) translateZ(84px)" dim />

          {/* Black Stone gem on the front-right edge */}
          <div
            className="absolute"
            style={{
              top: "calc(100% - 36px)",
              left: "calc(100% - 8px)",
              transform: "translateZ(84px) rotateY(-45deg) translateZ(2px)",
              transformStyle: "preserve-3d",
            }}
          >
            <motion.span
              className="block w-4 h-4 rounded-full bg-[#2A5A4A] border-[2.5px] border-white shadow-[0_0_18px_rgba(255,220,120,0.8)]"
              animate={highlight === "blackStone" ? { scale: [1, 1.4, 1] } : { scale: 1 }}
              transition={{ duration: 1.1, repeat: highlight === "blackStone" ? Infinity : 0 }}
            />
          </div>

          {/* Yemeni Corner gem on the front-left edge */}
          <div
            className="absolute"
            style={{
              top: "calc(100% - 36px)",
              left: "8px",
              transform: "translateZ(84px) rotateY(45deg) translateZ(2px)",
              transformStyle: "preserve-3d",
            }}
          >
            <motion.span
              className="block w-3.5 h-3.5 rounded-full bg-[#B3884D] border-[2.5px] border-white"
              animate={highlight === "yemeniCorner" ? { scale: [1, 1.4, 1] } : { scale: 1 }}
              transition={{ duration: 1.1, repeat: highlight === "yemeniCorner" ? Infinity : 0 }}
            />
          </div>
        </motion.div>
      </div>

      {/* Floating Maqam Ibrahim dome (right side) */}
      <div className="absolute right-6 bottom-12 flex flex-col items-center" data-testid="maqam-ibrahim">
        <motion.div
          className="relative w-10 h-10"
          animate={highlight === "maqamIbrahim" ? { y: [-2, 2, -2] } : { y: 0 }}
          transition={{ duration: 1.5, repeat: highlight === "maqamIbrahim" ? Infinity : 0 }}
        >
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-9 h-3 bg-[#cdc6b1] rounded-sm" />
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 w-7 h-5 rounded-t-full bg-gradient-to-b from-[#e8c068] to-[#7c5b2c]" />
          <div className="absolute bottom-7 left-1/2 -translate-x-1/2 w-1 h-2 bg-[#7c5b2c] rounded-full" />
        </motion.div>
        <div className="mt-1 text-[8px] uppercase tracking-[0.2em] text-[#5C5D58] font-semibold">Maqam Ibrahim</div>
      </div>

      {/* Floating labels (always readable, point to active corner) */}
      <CornerLabel
        visible={highlight === "blackStone" || highlight === null || highlight === "between"}
        text="BLACK STONE"
        ar="الحجر الأسود"
        color="#2A5A4A"
        side="right"
        active={highlight === "blackStone"}
      />
      <CornerLabel
        visible={highlight === "yemeniCorner" || highlight === null || highlight === "between"}
        text="YEMENI CORNER"
        ar="الركن اليماني"
        color="#B3884D"
        side="left"
        active={highlight === "yemeniCorner"}
      />

      {/* Caption */}
      <div className="absolute top-3 left-1/2 -translate-x-1/2 inline-flex items-center gap-1.5 rounded-full bg-white/90 backdrop-blur px-3 py-1 text-[10px] font-semibold tracking-[0.2em] uppercase text-[#1C1D1B]">
        Ka'bah · 3D
      </div>

      {/* Direction hint when walking */}
      {isWalking && (
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 inline-flex items-center gap-1.5 rounded-full bg-[#1C1D1B]/90 px-3 py-1 text-[10px] font-semibold tracking-[0.2em] uppercase text-white">
          Walking · counter-clockwise
        </div>
      )}
    </div>
  );
}

function Face({ transform, hasDoor = false, dim = false }) {
  return (
    <div
      className={FACE}
      style={{
        width: 168,
        height: 168,
        transform,
        background:
          "linear-gradient(180deg, #1f1f1d 0%, #0a0a09 100%)",
        boxShadow: dim ? "inset 0 0 60px rgba(0,0,0,0.7)" : "inset 0 0 30px rgba(0,0,0,0.6)",
      }}
    >
      {/* Gold inscription band */}
      <div
        className="absolute left-0 right-0 h-7"
        style={{
          top: "55%",
          background:
            "linear-gradient(180deg, #e8c068 0%, #b3884d 50%, #7c5b2c 100%)",
          boxShadow:
            "0 1px 0 rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.2)",
        }}
      >
        {/* faux calligraphy strokes */}
        <svg viewBox="0 0 200 24" className="w-full h-full" preserveAspectRatio="none">
          {Array.from({ length: 16 }).map((_, i) => (
            <path
              key={i}
              d={`M${5 + i * 12},6 Q${10 + i * 12},${i % 2 ? 18 : 4} ${15 + i * 12},10`}
              fill="none"
              stroke="rgba(28,29,27,0.45)"
              strokeWidth="1.2"
              strokeLinecap="round"
            />
          ))}
        </svg>
      </div>
      {/* Door */}
      {hasDoor && (
        <div
          className="absolute"
          style={{
            top: "30%",
            left: "62%",
            width: 22,
            height: 56,
            background:
              "linear-gradient(180deg, #e8c068 0%, #b3884d 50%, #7c5b2c 100%)",
            border: "1.5px solid #5a4220",
            boxShadow: "0 0 4px rgba(0,0,0,0.5)",
          }}
        />
      )}
    </div>
  );
}

function FaceTop({ transform }) {
  return (
    <div
      className={FACE}
      style={{
        width: 168,
        height: 168,
        transform,
        background:
          "linear-gradient(135deg, #2a2a26 0%, #0e0e0c 100%)",
        boxShadow: "inset 0 0 40px rgba(0,0,0,0.6)",
      }}
    />
  );
}

function CornerLabel({ visible, text, ar, color, side, active }) {
  if (!visible) return null;
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: active ? 1 : 0.7 }}
      className={`absolute bottom-16 ${side === "right" ? "right-3" : "left-3"} flex items-center gap-1.5 rounded-full bg-[#1C1D1B] px-2.5 py-1 text-white shadow-lg`}
    >
      <span className="block w-2 h-2 rounded-full" style={{ background: color }} />
      <span className="text-[9px] font-bold tracking-[0.18em]">{text}</span>
      {active && (
        <motion.span
          className="absolute inset-0 rounded-full border-2"
          style={{ borderColor: color }}
          animate={{ scale: [1, 1.15, 1], opacity: [0.8, 0, 0.8] }}
          transition={{ duration: 1.4, repeat: Infinity }}
        />
      )}
    </motion.div>
  );
}
