import React from "react";
import { Loader2, Maximize2 } from "lucide-react";

/*
 Hybrid 3D + photo viewer.
 - Primary view: real high-res photo of the actual landmark with optional annotations.
 - Optional "View in 3D" button opens an interactive Sketchfab model in a fullscreen modal.
 This guarantees a real, recognizable image always loads (instant), with the option to
 explore an actual 3D model when the user wants more.
*/

const SKETCHFAB_MODELS = {
  kaaba: "43041d42a0ae4cb58e20a86edc572688",
  grandMosque: "74f86a1f7e9d4f7882c390d2ef58c10f",
};

// Real photographs (Unsplash, all license-free for app use)
export const REAL_PHOTOS = {
  kaabaAerial:
    "https://images.unsplash.com/photo-1591604157118-b94e2684f857?auto=format&fit=crop&w=1200&q=85",
  kaabaPilgrims:
    "https://images.unsplash.com/photo-1591604517160-7d05fdb55d12?auto=format&fit=crop&w=1200&q=85",
  kaabaCorner:
    "https://images.unsplash.com/photo-1719194981461-fa0ec450999e?auto=format&fit=crop&w=1200&q=85",
  masaa:
    "https://images.unsplash.com/photo-1591375631710-93b3a39e0852?auto=format&fit=crop&w=1200&q=85",
  greenMarkers:
    "https://images.unsplash.com/photo-1652882697618-7ddca08b15bf?auto=format&fit=crop&w=1200&q=85",
};

export default function Landmark({
  photo,
  alt = "Holy site",
  badge,
  caption,
  annotation, // { x: 0..100, y: 0..100, color, label }
  modelKey, // optional sketchfab key
  height = "h-64",
  testid = "landmark",
}) {
  const [open3D, setOpen3D] = React.useState(false);

  return (
    <>
      <div
        className={`relative w-full ${height} rounded-3xl overflow-hidden bg-[#1C1D1B]`}
        data-testid={testid}
      >
        <img
          src={photo}
          alt={alt}
          className="absolute inset-0 w-full h-full object-cover"
          loading="eager"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/15 to-transparent" />

        {/* Annotation marker */}
        {annotation && (
          <div
            className="absolute pointer-events-none"
            style={{
              left: `${annotation.x}%`,
              top: `${annotation.y}%`,
              transform: "translate(-50%, -50%)",
            }}
          >
            <div className="relative">
              <span
                className="block w-5 h-5 rounded-full border-[3px] border-white animate-pulse"
                style={{ background: annotation.color || "#B3884D", boxShadow: "0 0 0 4px rgba(255,255,255,0.18)" }}
              />
              <span
                className="absolute left-7 top-0 whitespace-nowrap rounded-full px-2.5 py-1 text-[10px] font-bold tracking-[0.16em] text-white"
                style={{ background: "rgba(28,29,27,0.9)" }}
              >
                {annotation.label}
              </span>
            </div>
          </div>
        )}

        {badge && (
          <div className="absolute top-3 left-3 inline-flex items-center gap-1.5 rounded-full bg-white/95 backdrop-blur px-3 py-1 text-[11px] font-semibold tracking-wide text-[#1C1D1B] z-20 pointer-events-none">
            {badge}
          </div>
        )}
        {caption && (
          <div className="absolute bottom-3 left-3 right-3 flex justify-between items-center pointer-events-none">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#1C1D1B]/85 backdrop-blur px-3 py-1 text-[10px] font-semibold tracking-[0.18em] uppercase text-white">
              {caption}
            </span>
          </div>
        )}

        {modelKey && (
          <button
            onClick={() => setOpen3D(true)}
            className="absolute top-3 right-3 tap-pulse inline-flex items-center gap-1.5 rounded-full bg-[#B3884D] hover:bg-[#997441] px-3 py-1.5 text-[11px] font-semibold text-white shadow-md"
            data-testid={`${testid}-3d-btn`}
          >
            <Maximize2 className="w-3.5 h-3.5" /> View in 3D
          </button>
        )}
      </div>

      {open3D && modelKey && (
        <Modal3D modelKey={modelKey} onClose={() => setOpen3D(false)} />
      )}
    </>
  );
}

function Modal3D({ modelKey, onClose }) {
  const [loaded, setLoaded] = React.useState(false);
  const id = SKETCHFAB_MODELS[modelKey] || modelKey;
  const url = `https://sketchfab.com/models/${id}/embed?autostart=1&autospin=0.4&ui_infos=0&ui_inspector=0&ui_settings=0&ui_help=0&ui_stop=0&ui_watermark=0&ui_loading=0&dnt=1`;
  return (
    <div
      className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-sm grid place-items-center p-4"
      onClick={onClose}
      data-testid="modal-3d"
    >
      <div
        className="relative w-full max-w-3xl aspect-[3/4] sm:aspect-video rounded-3xl overflow-hidden bg-[#1C1D1B]"
        onClick={(e) => e.stopPropagation()}
      >
        {!loaded && (
          <div className="absolute inset-0 grid place-items-center text-white/80 z-10">
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="w-7 h-7 animate-spin text-[#B3884D]" />
              <span className="text-xs uppercase tracking-[0.22em]">Loading 3D model…</span>
            </div>
          </div>
        )}
        <iframe
          title="3D model"
          src={url}
          className="absolute inset-0 w-full h-full"
          frameBorder="0"
          allow="autoplay; fullscreen; xr-spatial-tracking"
          allowFullScreen
          onLoad={() => setLoaded(true)}
        />
        <button
          onClick={onClose}
          className="absolute top-3 right-3 rounded-full bg-white/90 px-3 py-1.5 text-xs font-semibold text-[#1C1D1B]"
          data-testid="modal-3d-close"
        >
          Close
        </button>
      </div>
    </div>
  );
}
