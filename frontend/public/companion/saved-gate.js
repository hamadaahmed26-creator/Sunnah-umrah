// A personally saved gate is a stationary point. Only a new capture has an age limit.
const maxCaptureAgeMs = 30_000;
const maxCaptureAccuracyMetres = 50;

function isGatePoint(point) {
  return point && Number.isFinite(point.lat) && Math.abs(point.lat) <= 90 &&
    Number.isFinite(point.lng) && Math.abs(point.lng) <= 180 &&
    Number.isFinite(point.accuracy) && point.accuracy > 0 && point.accuracy <= maxCaptureAccuracyMetres &&
    Number.isSafeInteger(point.captured) && point.captured > 0;
}

export function captureGate(position, now = Date.now()) {
  const coords = position?.coords;
  const point = {
    lat: coords?.latitude,
    lng: coords?.longitude,
    accuracy: coords?.accuracy,
    captured: Math.floor(position?.timestamp),
  };
  if (!isGatePoint(point) || point.captured > now || now - point.captured > maxCaptureAgeMs) return null;
  return point;
}

export function readSavedGate(storage, key) {
  const raw = storage.getItem(key);
  if (raw === null) return null;
  let point;
  try { point = JSON.parse(raw); } catch { return null; }
  return isGatePoint(point) ? point : null;
}

export function writeSavedGate(storage, key, point) {
  if (point === null) { storage.removeItem(key); return; }
  if (!isGatePoint(point)) throw new Error('Invalid gate point');
  const {lat,lng,accuracy,captured} = point;
  storage.setItem(key,JSON.stringify({lat,lng,accuracy,captured}));
}
