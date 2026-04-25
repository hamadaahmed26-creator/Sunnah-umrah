import React from "react";
import { Play, Pause, Volume2 } from "lucide-react";

/*
 Talbiyah loop player.
 Uses Web Speech API to recite, loops continuously while playing.
 Renders animated waveform bars driven by CSS keyframes when playing.
*/
const TALBIYAH_AR =
  "لَبَّيْكَ اللَّهُمَّ لَبَّيْكَ، لَبَّيْكَ لاَ شَرِيكَ لَكَ لَبَّيْكَ، إِنَّ الْحَمْدَ وَالنِّعْمَةَ لَكَ وَالْمُلْكَ، لاَ شَرِيكَ لَكَ";

export default function TalbiyahPlayer() {
  const [playing, setPlaying] = React.useState(false);
  const utterRef = React.useRef(null);

  const speakOnce = React.useCallback(() => {
    const u = new SpeechSynthesisUtterance(TALBIYAH_AR);
    u.lang = "ar-SA";
    u.rate = 0.85;
    u.onend = () => {
      // restart while still playing
      if (utterRef.current && utterRef.current === u) {
        const next = new SpeechSynthesisUtterance(TALBIYAH_AR);
        next.lang = "ar-SA";
        next.rate = 0.85;
        next.onend = u.onend;
        utterRef.current = next;
        window.speechSynthesis.speak(next);
      }
    };
    utterRef.current = u;
    window.speechSynthesis.speak(u);
  }, []);

  const toggle = () => {
    if (playing) {
      utterRef.current = null;
      window.speechSynthesis.cancel();
      setPlaying(false);
    } else {
      setPlaying(true);
      speakOnce();
    }
  };

  React.useEffect(() => {
    return () => {
      utterRef.current = null;
      window.speechSynthesis.cancel();
    };
  }, []);

  return (
    <div className="rounded-3xl bg-[#1C1D1B] text-[#F8F6F0] p-5" data-testid="talbiyah-player">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-[10px] uppercase tracking-[0.22em] text-[#B3884D]">Talbiyah · loop</div>
          <div className="mt-1 text-[15px] font-medium">{playing ? "Reciting…" : "Press play to recite"}</div>
        </div>
        <button
          onClick={toggle}
          className="tap-pulse w-12 h-12 rounded-full bg-[#B3884D] hover:bg-[#997441] grid place-items-center"
          aria-label={playing ? "pause" : "play"}
          data-testid="talbiyah-toggle"
        >
          {playing ? <Pause className="w-5 h-5 text-white" /> : <Play className="w-5 h-5 text-white ms-0.5" />}
        </button>
      </div>

      {/* waveform */}
      <div className="mt-4 flex items-end gap-1 h-12" data-testid="talbiyah-wave" style={{ direction: "ltr" }}>
        {Array.from({ length: 24 }).map((_, i) => (
          <span
            key={i}
            className="flex-1 rounded-full bg-[#B3884D]"
            style={{
              height: playing ? "100%" : "12%",
              animation: playing ? `wavePulse 1s ease-in-out ${i * 0.06}s infinite alternate` : "none",
              opacity: playing ? 1 : 0.35,
              transition: "height 200ms ease",
            }}
          />
        ))}
      </div>
      <style>{`
        @keyframes wavePulse {
          0%   { height: 18%; }
          25%  { height: 70%; }
          50%  { height: 35%; }
          75%  { height: 90%; }
          100% { height: 50%; }
        }
      `}</style>

      <p className="mt-4 font-arabic text-[18px] text-right leading-[2]">{TALBIYAH_AR}</p>
      <p className="mt-2 text-[12px] italic text-white/70">
        Labbayk Allahumma labbayk, labbayka la sharika laka labbayk, innal-hamda wan-ni'mata laka wal-mulk, la sharika lak.
      </p>
      <div className="mt-3 inline-flex items-center gap-1 text-[11px] text-white/60">
        <Volume2 className="w-3 h-3" /> Uses your device voice — works best with Arabic TTS installed.
      </div>
    </div>
  );
}
