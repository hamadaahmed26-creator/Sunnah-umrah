// Adhan audio scheduler — quietly fetches today's Makkah prayer times once a
// day and triggers an audio cue when the wall-clock matches a prayer time.
//
// Design choices:
//   • Single bundled MP3 (~450KB, public-domain Makkah adhan from archive.org)
//   • Plays only when the app is foreground (Capacitor doesn't need background
//     audio entitlement → simpler App Store review)
//   • User can mute globally OR per-prayer via Settings
//   • A single "session" guard prevents double-playing if the user navigates
//     between pages while adhan is firing

import { useEffect, useRef, useState, useCallback } from "react";
import axios from "axios";

const ADHAN_URL = "/audio/adhan-makkah.mp3";
const STORAGE_KEY = "umrah_adhan_settings";
const FIRED_KEY = "umrah_adhan_fired"; // {Fajr: '2026-05-01', ...} prevent double-fire

const PRAYERS = ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"];

export const DEFAULT_SETTINGS = {
  enabled: false, // OFF by default — user opts in
  prayers: { Fajr: true, Dhuhr: true, Asr: true, Maghrib: true, Isha: true },
};

export function loadSettings() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...DEFAULT_SETTINGS };
    const parsed = JSON.parse(raw);
    return {
      enabled: !!parsed.enabled,
      prayers: { ...DEFAULT_SETTINGS.prayers, ...(parsed.prayers || {}) },
    };
  } catch {
    return { ...DEFAULT_SETTINGS };
  }
}

export function saveSettings(s) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(s));
}

function todayKey() {
  return new Date().toISOString().slice(0, 10);
}

function loadFired() {
  try {
    const raw = localStorage.getItem(FIRED_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function markFired(prayer) {
  const map = loadFired();
  map[prayer] = todayKey();
  localStorage.setItem(FIRED_KEY, JSON.stringify(map));
}

function alreadyFired(prayer) {
  const map = loadFired();
  return map[prayer] === todayKey();
}

// Public hook — mount once at the app shell.
export function useAdhanScheduler() {
  const [settings, setSettings] = useState(() => loadSettings());
  const audioRef = useRef(null);
  const timesRef = useRef(null); // { Fajr: "04:29", ... } in 24h
  const lastFetchRef = useRef(null);

  // Re-read settings if another tab updates localStorage
  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === STORAGE_KEY) setSettings(loadSettings());
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  // Fetch times once per UTC day
  const fetchTimes = useCallback(async () => {
    const day = todayKey();
    if (lastFetchRef.current === day && timesRef.current) return;
    try {
      const r = await axios.get("https://api.aladhan.com/v1/timingsByCity", {
        params: { city: "Makkah", country: "SA", method: 4 },
        timeout: 8000,
      });
      const t = r.data?.data?.timings || {};
      timesRef.current = {
        Fajr: t.Fajr,
        Dhuhr: t.Dhuhr,
        Asr: t.Asr,
        Maghrib: t.Maghrib,
        Isha: t.Isha,
      };
      lastFetchRef.current = day;
    } catch {
      // Aladhan offline — silently retry next tick.
    }
  }, []);

  // Tick every 30 s; cheap.
  useEffect(() => {
    if (!settings.enabled) return;
    let mounted = true;
    fetchTimes();

    const tick = async () => {
      if (!mounted) return;
      await fetchTimes();
      const times = timesRef.current;
      if (!times) return;
      const now = new Date();
      const hh = String(now.getHours()).padStart(2, "0");
      const mm = String(now.getMinutes()).padStart(2, "0");
      const cur = `${hh}:${mm}`;
      for (const p of PRAYERS) {
        if (
          times[p] === cur &&
          settings.prayers[p] &&
          !alreadyFired(p)
        ) {
          markFired(p);
          playAdhan();
        }
      }
    };

    tick();
    const id = setInterval(tick, 30000);
    return () => {
      mounted = false;
      clearInterval(id);
    };
  }, [settings, fetchTimes]);

  const playAdhan = () => {
    try {
      if (!audioRef.current) {
        audioRef.current = new Audio(ADHAN_URL);
        audioRef.current.preload = "auto";
      }
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(() => {
        // iOS Safari: may need user gesture. We've already been visited so
        // usually fine, but silent failure is acceptable.
      });
    } catch {
      // best-effort; never throw from here
    }
  };

  const stopAdhan = () => {
    try {
      audioRef.current?.pause();
      if (audioRef.current) audioRef.current.currentTime = 0;
    } catch {}
  };

  // Test playback (used by the Settings page so the user can hear it once)
  const testPlay = () => playAdhan();

  return { settings, setSettings, playAdhan, stopAdhan, testPlay };
}

export { PRAYERS };
