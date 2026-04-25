import React from "react";
import { Loader2 } from "lucide-react";

/*
 Persistent inline landmark photo.

 The <img> swaps src per step but stays in the same DOM slot, so the
 browser fades the new image in without unmounting/remounting the box.
 We also keep the prior image visible until the new one loads, so
 there's never a black flash between steps.
*/

export default function Inline3DModel({
  src,
  alt = "",
  height = "h-[280px]",
  caption,
  testid = "inline-photo",
}) {
  // Preload + cross-fade
  const [shown, setShown] = React.useState(src);
  const [incoming, setIncoming] = React.useState(null);

  React.useEffect(() => {
    if (!src || src === shown) return;
    setIncoming(src);
    const img = new Image();
    img.src = src;
    img.onload = () => {
      setShown(src);
      setIncoming(null);
    };
    img.onerror = () => setIncoming(null);
  }, [src, shown]);

  return (
    <div
      className={`relative w-full ${height} rounded-3xl overflow-hidden bg-[#1C1D1B]`}
      data-testid={testid}
    >
      {!shown && (
        <div className="absolute inset-0 grid place-items-center text-white/80 z-10 bg-[#1C1D1B]">
          <Loader2 className="w-7 h-7 animate-spin text-[#B3884D]" />
        </div>
      )}

      {shown && (
        <img
          src={shown}
          alt={alt}
          className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500"
          loading="eager"
          decoding="async"
          data-testid={`${testid}-img`}
        />
      )}

      {incoming && incoming !== shown && (
        <img
          src={incoming}
          alt=""
          className="absolute inset-0 w-full h-full object-cover opacity-0"
          aria-hidden="true"
        />
      )}

      <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/70 to-transparent pointer-events-none" />

      {caption && (
        <div
          className="absolute bottom-3 left-1/2 -translate-x-1/2 inline-flex items-center gap-1.5 rounded-full bg-[#1C1D1B]/85 backdrop-blur px-3 py-1 text-[10px] font-semibold tracking-[0.18em] uppercase text-white pointer-events-none max-w-[90%] truncate"
          data-testid={`${testid}-caption`}
        >
          {caption}
        </div>
      )}
    </div>
  );
}
