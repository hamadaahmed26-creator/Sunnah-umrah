// Live Haram audio — small embedded player on the Home page so users can
// hear the live Qur'ān recitation from Makkah whenever they want, regardless
// of where in the world they are.
//
// Source: Quran Kareem live stream (qurango.net) — a long-running, free,
// publicly-embeddable Qur'ān radio broadcast. We do NOT autoplay (mobile
// browsers block it and it'd be intrusive); user explicitly taps Play.
import React from "react";
import { Play, Pause, Loader2, Radio } from "lucide-react";

// Two backup streams — fallback if the first one fails (network, region).
const STREAMS = [
  "https://qurango.net/radio/quran_kareem",
  "https://Qurango.net/radio/tarateel",
];

export default function HaramLive({ isAr }) {
  const audioRef = React.useRef(null);
  const [playing, setPlaying] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [streamIdx, setStreamIdx] = React.useState(0);

  // Build a fresh <audio> element on demand — keeps memory clean when not
  // playing, important on mobile where background audio drains battery.
  const toggle = () => {
    if (playing) {
      audioRef.current?.pause();
      audioRef.current = null;
      setPlaying(false);
      setLoading(false);
      return;
    }
    setLoading(true);
    const a = new Audio(STREAMS[streamIdx]);
    a.preload = "none";
    a.crossOrigin = "anonymous";
    a.addEventListener("playing", () => {
      setLoading(false);
      setPlaying(true);
    });
    a.addEventListener("error", () => {
      setLoading(false);
      setPlaying(false);
      // Try the next backup stream on next tap
      setStreamIdx((i) => (i + 1) % STREAMS.length);
    });
    a.addEventListener("ended", () => setPlaying(false));
    audioRef.current = a;
    a.play().catch(() => {
      setLoading(false);
      setPlaying(false);
    });
  };

  // Cleanup on unmount
  React.useEffect(() => () => audioRef.current?.pause(), []);

  return (
    <div
      className="rounded-2xl bg-gradient-to-br from-[#0F2A24] to-[#1C1D1B] text-white p-4 flex items-center gap-3"
      data-testid="home-haram-live"
    >
      <button
        onClick={toggle}
        className="w-12 h-12 rounded-full bg-white/12 hover:bg-white/22 grid place-items-center flex-shrink-0 tap-pulse transition"
        aria-label={playing ? "pause" : "play"}
        data-testid="haram-live-toggle"
      >
        {loading ? (
          <Loader2 className="w-5 h-5 animate-spin text-white" />
        ) : playing ? (
          <Pause className="w-5 h-5 text-white" />
        ) : (
          <Play className="w-5 h-5 text-white ml-0.5" />
        )}
      </button>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <Radio className={`w-3 h-3 ${playing ? "text-emerald-400 animate-pulse" : "text-[#B3884D]"}`} />
          <p className="text-[10px] uppercase tracking-[0.22em] text-[#B3884D]">
            {isAr ? "بثّ مباشر" : "Live"}
          </p>
        </div>
        <p className={`mt-0.5 text-[15px] font-medium leading-tight ${isAr ? "font-arabic text-right" : ""}`}>
          {isAr ? "إذاعة القرآن من مكّة" : "Qur'ān from Makkah"}
        </p>
        <p className={`text-[11px] text-white/55 leading-snug ${isAr ? "font-arabic text-right" : ""}`}>
          {playing
            ? (isAr ? "يبثّ الآن" : "Streaming now")
            : (isAr ? "اضغط للاستماع" : "Tap to listen")}
        </p>
      </div>
    </div>
  );
}
