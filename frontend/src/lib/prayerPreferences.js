// Prayer-times preference helpers. Stored in localStorage so the choice
// persists. Exposes: read/write the user's preferred mode (auto vs Makkah).
//
//   "auto"   — use the device's geolocation (default for everyone except
//              the in-Makkah persona, who always sees Makkah times anyway)
//   "makkah" — always show Makkah times, even when the user is in another
//              country. Useful for the diaspora who want to feel connected.
const KEY = "umrah_prayer_mode";

export function loadPrayerMode() {
  try {
    return localStorage.getItem(KEY) || "auto";
  } catch {
    return "auto";
  }
}

export function savePrayerMode(mode) {
  try {
    localStorage.setItem(KEY, mode);
  } catch {}
}

// Cached last-known location so repeat geo lookups aren't slow on every
// page load. Refreshed silently on a 24h interval.
const LOC_KEY = "umrah_last_known_geo";

export function loadLastKnownGeo() {
  try {
    const raw = localStorage.getItem(LOC_KEY);
    if (!raw) return null;
    const v = JSON.parse(raw);
    if (!v.lat || !v.lng) return null;
    // Expire after 24h
    if (Date.now() - (v.ts || 0) > 24 * 60 * 60 * 1000) return null;
    return v;
  } catch {
    return null;
  }
}

export function saveLastKnownGeo(geo) {
  try {
    localStorage.setItem(
      LOC_KEY,
      JSON.stringify({ ...geo, ts: Date.now() })
    );
  } catch {}
}
