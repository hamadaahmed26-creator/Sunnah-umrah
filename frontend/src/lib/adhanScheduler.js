import { useEffect, useState } from "react";
import { loadLastKnownGeo, loadPrayerMode } from "./prayerPreferences";
const ADHAN_URL = "/audio/adhan-makkah.mp3";
const STORAGE_KEY = "umrah_adhan_settings";
const FIRED_KEY = "umrah_adhan_fired"; // {Fajr: '2026-05-01', ...} prevent double-fire



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
  window.dispatchEvent(new Event("umrah-prayer-settings"));
}

// Foreground reminders only. The provider's local Gregorian day and time zone
// apply even when the device clock is set to another country.
export function useAdhanScheduler() {
  const [revision, refresh] = useState(0);
  const [notice, setNotice] = useState(null);
  useEffect(() => {
    const changed = () => refresh(n => n + 1);
    const storage = e => {
      if ([STORAGE_KEY, "umrah_prayer_mode", "umrah_last_known_geo", null].includes(e.key)) changed();
    };
    window.addEventListener("storage", storage);
    window.addEventListener("umrah-prayer-settings", changed);
    return () => {
      window.removeEventListener("storage", storage);
      window.removeEventListener("umrah-prayer-settings", changed);
    };
  }, []);
  useEffect(() => {
    const settings = loadSettings();
    setNotice(null);
    if (!settings.enabled) return;
    const abort = new AbortController();
    let busy = false, table, media, delivered;
    const tick = async () => {
      if (busy || document.hidden || abort.signal.aborted) return;
      busy = true;
      try {
        const {zonedClock, fetchTimetable} = await import(/* webpackIgnore: true */ "/companion/prayer-clock.js");
        if (abort.signal.aborted) return;
        if (!table || table.day !== zonedClock(new Date(), table.timezone).day) {
          const local = loadPrayerMode() === "auto";
          const coordinates = local ? loadLastKnownGeo() : undefined;
          if (local && !coordinates) {
            setNotice({reason:"location"});
            return;
          }
          table = await fetchTimetable({city:"Makkah", country:"SA", coordinates,
            zone:local ? Intl.DateTimeFormat().resolvedOptions().timeZone : "Asia/Riyadh"}, abort.signal);
          if (abort.signal.aborted) return;
          setNotice(null);
        }
        const now = zonedClock(new Date(), table.timezone);
        const prayer = Object.keys(table.times).find(p => settings.prayers[p] && table.times[p] === now.minute);
        if (!prayer || document.hidden) return;
        const key = [table.timezone, now.day, prayer].join("/");
        if (delivered === key || localStorage.getItem(FIRED_KEY) === key) return;
        delivered = key;
        setNotice({reason:"due", prayer});
        media ??= new Audio(ADHAN_URL);
        try {
          await media.play();
          if (!abort.signal.aborted) localStorage.setItem(FIRED_KEY, key);
        } catch {
          if (!abort.signal.aborted) setNotice({reason:"sound", prayer});
        }
      } catch {
        if (!abort.signal.aborted) setNotice({reason:"timetable"});
      } finally { busy = false; }
    };
    tick();
    const timer = setInterval(tick, 20000);
    document.addEventListener("visibilitychange", tick);
    return () => {
      abort.abort(); clearInterval(timer); media?.pause();
      document.removeEventListener("visibilitychange", tick);
    };
  }, [revision]);
  return notice;
}
