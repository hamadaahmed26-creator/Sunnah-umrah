import React from "react";
import { Loader2 } from "lucide-react";

/*
 Persistent inline landmark photo.
 One static, official-looking image stays mounted at the top of the page while
 the step text and du'as flow below it. The img element never re-mounts when
 the parent's step state changes (parent only swaps a sibling caption + body),
 so there is no flicker between Tawaf laps or Sa'i trips.
*/

const PHOTOS = {
  // Iconic Kaaba photo (Unsplash, Haidan — free to use, 11M+ views)
  kaaba: {
    src:
      "https://images.unsplash.com/photo-1554794470-42d3cd193ecc?w=1600&q=80&auto=format&fit=crop",
    alt: "The Ka'bah inside the Grand Mosque, Mecca",
  },
  // Mas'a corridor between Safa and Marwah (Wikimedia Commons, public)
  grandMosque: {
    src:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ef/Mas%27aa2.jpg/1280px-Mas%27aa2.jpg",
    alt: "The Mas'a corridor between Safa and Marwah, Masjid al-Haram",
  },
};

export default function Inline3DModel({
  model = "kaaba",
  height = "h-[280px]",
  caption,
  testid = "inline-photo",
}) {
  const [loaded, setLoaded] = React.useState(false);
  const photo = PHOTOS[model] || PHOTOS.kaaba;

  return (
    <div
      className={`relative w-full ${height} rounded-3xl overflow-hidden bg-[#1C1D1B]`}
      data-testid={testid}
    >
      {!loaded && (
        <div className="absolute inset-0 grid place-items-center text-white/80 z-10 bg-[#1C1D1B]">
          <Loader2 className="w-7 h-7 animate-spin text-[#B3884D]" />
        </div>
      )}
      <img
        src={photo.src}
        alt={photo.alt}
        className="absolute inset-0 w-full h-full object-cover"
        loading="eager"
        decoding="async"
        onLoad={() => setLoaded(true)}
        data-testid={`${testid}-img`}
      />
      {/* Subtle bottom gradient so the caption stays legible over any photo */}
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
