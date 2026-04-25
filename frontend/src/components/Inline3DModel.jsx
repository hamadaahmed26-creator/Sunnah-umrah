import React from "react";
import { Loader2 } from "lucide-react";

/*
 Persistent inline 3D model viewer.
 Loads ONCE and stays mounted while the parent's step text flows below.
 Uses Sketchfab's free embed for a real photorealistic model.
*/

const MODELS = {
  kaaba: "43041d42a0ae4cb58e20a86edc572688",
  grandMosque: "74f86a1f7e9d4f7882c390d2ef58c10f",
};

export default function Inline3DModel({
  model = "kaaba",
  height = "h-[300px]",
  caption,
  testid = "inline-3d",
}) {
  const [loaded, setLoaded] = React.useState(false);
  const id = MODELS[model] || model;
  const params = new URLSearchParams({
    autostart: "1",
    autospin: "0.4",
    ui_infos: "0",
    ui_inspector: "0",
    ui_settings: "0",
    ui_help: "0",
    ui_stop: "0",
    ui_watermark: "0",
    ui_loading: "0",
    ui_hint: "2",
    preload: "1",
    dnt: "1",
  });
  const url = `https://sketchfab.com/models/${id}/embed?${params.toString()}`;

  return (
    <div
      className={`relative w-full ${height} rounded-3xl overflow-hidden bg-[#1C1D1B]`}
      data-testid={testid}
    >
      {!loaded && (
        <div className="absolute inset-0 grid place-items-center text-white/80 z-10 bg-[#1C1D1B]">
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="w-7 h-7 animate-spin text-[#B3884D]" />
            <span className="text-[11px] uppercase tracking-[0.22em]">Loading 3D model…</span>
          </div>
        </div>
      )}
      <iframe
        title={`3D ${model}`}
        src={url}
        className="absolute inset-0 w-full h-full"
        frameBorder="0"
        allow="autoplay; fullscreen; xr-spatial-tracking"
        allowFullScreen
        onLoad={() => setLoaded(true)}
      />
      {caption && (
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 inline-flex items-center gap-1.5 rounded-full bg-[#1C1D1B]/85 backdrop-blur px-3 py-1 text-[10px] font-semibold tracking-[0.18em] uppercase text-white pointer-events-none">
          {caption}
        </div>
      )}
    </div>
  );
}
