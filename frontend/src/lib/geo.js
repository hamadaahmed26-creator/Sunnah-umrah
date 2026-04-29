// Geo helpers — kept dependency-free so they work offline inside the Haram.

const R = 6371000; // Earth radius in metres

export function haversine(lat1, lng1, lat2, lng2) {
  const toRad = (d) => (d * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(a));
}

// Initial bearing in degrees (0 = N, 90 = E, 180 = S, 270 = W)
export function bearing(lat1, lng1, lat2, lng2) {
  const toRad = (d) => (d * Math.PI) / 180;
  const toDeg = (r) => (r * 180) / Math.PI;
  const φ1 = toRad(lat1);
  const φ2 = toRad(lat2);
  const λ1 = toRad(lng1);
  const λ2 = toRad(lng2);
  const y = Math.sin(λ2 - λ1) * Math.cos(φ2);
  const x =
    Math.cos(φ1) * Math.sin(φ2) -
    Math.sin(φ1) * Math.cos(φ2) * Math.cos(λ2 - λ1);
  return (toDeg(Math.atan2(y, x)) + 360) % 360;
}

export function compass8(deg) {
  const dirs = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
  return dirs[Math.round(deg / 45) % 8];
}

// Localised compass abbreviation
export function compass8Localised(deg, isAr) {
  if (!isAr) return compass8(deg);
  const ar = ["شمال", "ش‑شرق", "شرق", "ج‑شرق", "جنوب", "ج‑غرب", "غرب", "ش‑غرب"];
  return ar[Math.round(deg / 45) % 8];
}

export function formatDistance(metres, isAr) {
  if (metres == null || Number.isNaN(metres)) return "";
  if (metres < 1000) return `${Math.round(metres)} m`;
  const km = metres / 1000;
  return `${km.toFixed(km < 10 ? 1 : 0)} km`;
}
