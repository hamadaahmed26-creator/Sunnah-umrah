import React from "react";
import { Link, useParams, Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, MapPin, Volume2 } from "lucide-react";
import { LangContext } from "../components/Layout";
import { placeBySlug, CITY_LABELS } from "../lib/places";

const TAB_ACCENT = {
  makkah: "#B3884D",
  miqat: "#8B4540",
  madinah: "#2A5A4A",
};

function speak(text, lang = "ar-SA") {
  if (!text) return;
  try {
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = lang;
    u.rate = 0.85;
    window.speechSynthesis.speak(u);
  } catch (_) {}
}

export default function PlaceDetail() {
  const { slug } = useParams();
  const { lang } = React.useContext(LangContext);
  const isAr = lang === "ar";
  const place = placeBySlug(slug);

  if (!place) return <Navigate to="/places" replace />;

  const accent = TAB_ACCENT[place.city];
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${place.lat},${place.lng}`;

  return (
    <div className="max-w-md mx-auto pb-12" data-testid="place-detail-page">
      <Link
        to="/places"
        className="mt-2 inline-flex items-center gap-1.5 text-[12px] text-[#5C5D58] hover:text-[#1C1D1B]"
        data-testid="place-back"
      >
        <ArrowLeft className={`w-3.5 h-3.5 ${isAr ? "rotate-180" : ""}`} />
        <span className={isAr ? "font-arabic" : ""}>
          {isAr ? "كل الأماكن" : "All places"}
        </span>
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-3 rounded-3xl overflow-hidden bg-white border border-[#E8E5DD]"
      >
        {/* Hero photo */}
        <div className="relative aspect-[4/3] bg-[#1C1D1B]">
          <img
            src={`/images/places/${place.slug}.jpg`}
            alt={isAr ? place.name_ar : place.name_en}
            className="absolute inset-0 w-full h-full object-cover"
            loading="lazy"
            decoding="async"
          />
          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/75 to-transparent" />
          <div
            className="absolute top-3 left-3 inline-flex items-center gap-1.5 rounded-full bg-white/90 backdrop-blur px-2.5 py-1 text-[10px] font-semibold tracking-[0.2em] uppercase text-[#1C1D1B]"
          >
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: accent }} />
            {CITY_LABELS[lang][place.city]}
          </div>
        </div>

        {/* Title block */}
        <div className="p-5">
          <div className="flex items-start gap-3">
            <div className="flex-1 min-w-0">
              <h1 className={`text-[24px] font-semibold text-[#1C1D1B] leading-tight ${isAr ? "font-arabic text-right" : ""}`} data-testid="place-name">
                {isAr ? place.name_ar : place.name_en}
              </h1>
              <p className={`mt-1 text-[13px] text-[#8E8F8A] ${isAr ? "font-arabic text-right" : ""}`}>
                {isAr ? place.subtitle_ar : place.subtitle_en}
              </p>
            </div>
            <button
              onClick={() => speak(place.name_ar, "ar-SA")}
              className="tap-pulse w-10 h-10 flex-shrink-0 grid place-items-center rounded-full bg-[#F8F6F0] border border-[#E8E5DD]"
              aria-label="listen"
              data-testid="place-listen"
            >
              <Volume2 className="w-4 h-4 text-[#1C1D1B]" />
            </button>
          </div>

          {/* "Why visit" — purpose / spiritual significance, shown if defined.
              Particularly useful for Mīqāts (where pilgrims need to know they
              must enter iḥrām here, not in Makkah). */}
          {(place.why_en || place.why_ar) && (
            <div
              className="mt-4 rounded-2xl border p-4"
              style={{ background: `${accent}0F`, borderColor: `${accent}40` }}
              data-testid="place-why"
            >
              <div
                className={`text-[10px] uppercase tracking-[0.22em] mb-1.5 ${isAr ? "font-arabic" : ""}`}
                style={{ color: accent }}
              >
                {place.city === "miqat"
                  ? (isAr ? "لماذا الإحرام هنا" : "Why enter iḥrām here")
                  : (isAr ? "لماذا تزور هذا المكان" : "Why visit")}
              </div>
              <p className={`text-[13px] text-[#1C1D1B] leading-[1.85] ${isAr ? "font-arabic text-right text-[14px] leading-[2]" : ""}`}>
                {isAr ? (place.why_ar || place.why_en) : (place.why_en || place.why_ar)}
              </p>
            </div>
          )}

          {/* Description */}
          <p className={`mt-4 text-[14px] text-[#3A3B36] leading-[1.85] ${isAr ? "font-arabic text-right text-[15px] leading-[2]" : ""}`} data-testid="place-description">
            {isAr ? place.description_ar : place.description_en}
          </p>

          {/* GPS */}
          <div className="mt-5 rounded-2xl bg-[#F8F6F0] border border-[#E8E5DD] p-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <div className={`text-[10px] uppercase tracking-[0.22em] text-[#8E8F8A] ${isAr ? "font-arabic" : ""}`}>
                  {isAr ? "الإحداثيات" : "Coordinates"}
                </div>
                <div className="mt-1 text-[13px] tabular-nums text-[#1C1D1B]" data-testid="place-coords">
                  {place.lat.toFixed(4)}°, {place.lng.toFixed(4)}°
                </div>
              </div>
              <a
                href={mapsUrl}
                target="_blank"
                rel="noreferrer"
                className="tap-pulse inline-flex items-center gap-1.5 rounded-full text-white px-4 py-2 text-[12px] font-medium"
                style={{ background: accent }}
                data-testid="place-open-maps"
              >
                <MapPin className="w-3.5 h-3.5" />
                <span className={isAr ? "font-arabic" : ""}>
                  {isAr ? "افتح في الخرائط" : "Open in Maps"}
                </span>
              </a>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
