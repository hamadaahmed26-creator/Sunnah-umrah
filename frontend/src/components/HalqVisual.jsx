import React from "react";

/* Halq vs Taqsir illustration. */
export default function HalqVisual() {
  return (
    <div className="rounded-3xl bg-[#F8F6F0] border border-[#E8E5DD] p-4" data-testid="halq-visual">
      <div className="text-[10px] uppercase tracking-[0.22em] text-[#B3884D] mb-2">Halq vs Taqsir</div>
      <div className="grid grid-cols-3 gap-2">
        {/* Halq - shave */}
        <div className="rounded-2xl bg-white border border-[#E8E5DD] p-2 flex flex-col items-center">
          <svg viewBox="0 0 100 100" className="w-full h-auto">
            {/* head */}
            <ellipse cx="50" cy="55" rx="28" ry="32" fill="#E8D9B8" />
            {/* face features */}
            <circle cx="42" cy="55" r="1.5" fill="#1C1D1B" />
            <circle cx="58" cy="55" r="1.5" fill="#1C1D1B" />
            <path d="M44 68 Q50 72 56 68" stroke="#1C1D1B" strokeWidth="1" fill="none" />
            {/* shaved scalp shine */}
            <ellipse cx="50" cy="32" rx="20" ry="6" fill="#F0E0BA" />
            <text x="50" y="95" textAnchor="middle" fontSize="9" fill="#2A5A4A" fontWeight="700">PREFERRED</text>
          </svg>
          <div className="mt-1 text-[11px] font-semibold text-[#1C1D1B]">Halq</div>
          <div className="text-[9px] text-[#5C5D58] text-center">Shave entire head (men)</div>
        </div>
        {/* Taqsir - trim */}
        <div className="rounded-2xl bg-white border border-[#E8E5DD] p-2 flex flex-col items-center">
          <svg viewBox="0 0 100 100" className="w-full h-auto">
            <ellipse cx="50" cy="55" rx="28" ry="32" fill="#E8D9B8" />
            {/* hair */}
            <path d="M22 35 Q50 18 78 35 L78 50 L22 50 Z" fill="#1C1D1B" />
            {/* scissors */}
            <g stroke="#B3884D" strokeWidth="1.6" fill="none">
              <line x1="68" y1="22" x2="84" y2="14" />
              <circle cx="68" cy="22" r="3" />
              <circle cx="63" cy="28" r="3" />
            </g>
            <circle cx="42" cy="55" r="1.5" fill="#1C1D1B" />
            <circle cx="58" cy="55" r="1.5" fill="#1C1D1B" />
            <path d="M44 68 Q50 72 56 68" stroke="#1C1D1B" strokeWidth="1" fill="none" />
          </svg>
          <div className="mt-1 text-[11px] font-semibold text-[#1C1D1B]">Taqsir</div>
          <div className="text-[9px] text-[#5C5D58] text-center">Trim evenly (alt. for men)</div>
        </div>
        {/* Women */}
        <div className="rounded-2xl bg-white border border-[#E8E5DD] p-2 flex flex-col items-center">
          <svg viewBox="0 0 100 100" className="w-full h-auto">
            <ellipse cx="50" cy="55" rx="28" ry="32" fill="#E8D9B8" />
            <path d="M22 35 Q50 8 78 35 L82 80 L18 80 Z" fill="#1C1D1B" />
            {/* fingertip mark */}
            <line x1="76" y1="78" x2="86" y2="78" stroke="#B3884D" strokeWidth="2" strokeLinecap="round" />
            <circle cx="86" cy="78" r="3" fill="#B3884D" />
            <circle cx="42" cy="55" r="1.5" fill="#FFFFFF" />
            <circle cx="58" cy="55" r="1.5" fill="#FFFFFF" />
          </svg>
          <div className="mt-1 text-[11px] font-semibold text-[#1C1D1B]">Women</div>
          <div className="text-[9px] text-[#5C5D58] text-center">Cut a fingertip's length from ends</div>
        </div>
      </div>
      <p className="mt-3 text-[12px] text-[#1C1D1B]">
        With this, your Umrah is complete — Ihram restrictions are lifted. Alhamdulillah!
      </p>
    </div>
  );
}
