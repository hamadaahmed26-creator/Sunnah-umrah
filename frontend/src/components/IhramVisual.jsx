import React from "react";

/* Two-sheet Ihram illustration for men + modest reminder for women. */
export default function IhramVisual() {
  return (
    <div className="rounded-3xl bg-[#F8F6F0] border border-[#E8E5DD] p-4" data-testid="ihram-visual">
      <div className="text-[10px] uppercase tracking-[0.22em] text-[#B3884D] mb-2">Ihram garments</div>
      <div className="grid grid-cols-2 gap-3">
        {/* Men */}
        <div className="rounded-2xl bg-white border border-[#E8E5DD] p-3 flex flex-col items-center">
          <svg viewBox="0 0 120 160" className="w-full h-auto">
            {/* head */}
            <circle cx="60" cy="22" r="12" fill="#1C1D1B" />
            {/* upper sheet (Rida) */}
            <path d="M30 36 Q60 28 90 36 L96 90 Q60 98 24 90 Z" fill="#FFFFFF" stroke="#B3884D" strokeWidth="1.5" />
            {/* exposed right shoulder hint */}
            <path d="M60 36 Q78 32 92 38 L80 50" fill="none" stroke="#E8E5DD" strokeWidth="1" />
            {/* lower sheet (Izar) */}
            <path d="M28 92 L92 92 L96 150 L24 150 Z" fill="#FFFFFF" stroke="#B3884D" strokeWidth="1.5" />
            {/* feet */}
            <rect x="38" y="148" width="14" height="6" rx="2" fill="#1C1D1B" />
            <rect x="68" y="148" width="14" height="6" rx="2" fill="#1C1D1B" />
            {/* labels */}
            <text x="60" y="68" textAnchor="middle" fontSize="8" fill="#5C5D58" fontWeight="600">RIDA</text>
            <text x="60" y="124" textAnchor="middle" fontSize="8" fill="#5C5D58" fontWeight="600">IZAR</text>
          </svg>
          <div className="mt-1 text-[12px] font-semibold text-[#1C1D1B]">Men</div>
          <div className="text-[10px] text-[#5C5D58] text-center leading-tight">
            Two unstitched white sheets · sandals showing ankle bone
          </div>
        </div>
        {/* Women */}
        <div className="rounded-2xl bg-white border border-[#E8E5DD] p-3 flex flex-col items-center">
          <svg viewBox="0 0 120 160" className="w-full h-auto">
            <circle cx="60" cy="22" r="12" fill="#1C1D1B" />
            {/* hijab/abaya */}
            <path d="M40 18 Q60 6 80 18 L84 36 Q60 32 36 36 Z" fill="#1C1D1B" />
            <path d="M28 36 L92 36 L98 150 L22 150 Z" fill="#FFFFFF" stroke="#B3884D" strokeWidth="1.5" />
            {/* hands hint */}
            <circle cx="36" cy="100" r="4" fill="#E8E5DD" />
            <circle cx="84" cy="100" r="4" fill="#E8E5DD" />
            <text x="60" y="98" textAnchor="middle" fontSize="8" fill="#5C5D58" fontWeight="600">MODEST</text>
          </svg>
          <div className="mt-1 text-[12px] font-semibold text-[#1C1D1B]">Women</div>
          <div className="text-[10px] text-[#5C5D58] text-center leading-tight">
            Any modest clothing · face & hands uncovered (no niqab/gloves in ihram)
          </div>
        </div>
      </div>

      <ul className="mt-3 space-y-1.5 text-[12px] text-[#1C1D1B]">
        <li>• Ghusl or wudu before wearing ihram</li>
        <li>• Apply unscented oil to body before (men), not after</li>
        <li>• Pray two raka'ah, then make intention for Umrah</li>
        <li>• Begin reciting the Talbiyah continuously</li>
      </ul>
    </div>
  );
}
