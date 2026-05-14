// Cross-platform geolocation helper.
// On the website -> uses browser's navigator.geolocation.
// On iOS/Android (Capacitor) -> uses @capacitor/geolocation which properly
//   surfaces permission prompts + works inside the native WebView (where
//   navigator.geolocation is unreliable).

import { Capacitor } from "@capacitor/core";
import { Geolocation as CapGeo } from "@capacitor/geolocation";

const isNative = () => {
  try { return Capacitor.isNativePlatform(); } catch { return false; }
};

// Promise-based one-shot location fetch.
// Resolves with {lat, lng, accuracy} on success.
// Rejects with {code, message} on failure — codes match W3C: 1=denied, 2=unavail, 3=timeout.
export async function getCurrentPosition({ timeoutMs = 12000 } = {}) {
  if (isNative()) {
    try {
      const perm = await CapGeo.checkPermissions();
      if (perm.location !== "granted") {
        const req = await CapGeo.requestPermissions();
        if (req.location !== "granted") {
          throw { code: 1, message: "Permission denied" };
        }
      }
      const pos = await CapGeo.getCurrentPosition({
        enableHighAccuracy: true,
        timeout: timeoutMs,
        maximumAge: 30000,
      });
      return {
        lat: pos.coords.latitude,
        lng: pos.coords.longitude,
        accuracy: pos.coords.accuracy,
      };
    } catch (e) {
      // Normalise Capacitor errors to W3C-style codes
      const msg = (e && e.message) || "";
      if (e?.code === 1 || /denied/i.test(msg)) throw { code: 1, message: msg };
      if (/unavailable|disabled/i.test(msg))     throw { code: 2, message: msg };
      if (/timeout/i.test(msg))                   throw { code: 3, message: msg };
      throw { code: 2, message: msg || "Location unavailable" };
    }
  }
  // Web fallback
  if (typeof navigator === "undefined" || !navigator.geolocation) {
    throw { code: 2, message: "Geolocation not supported" };
  }
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      (pos) => resolve({
        lat: pos.coords.latitude,
        lng: pos.coords.longitude,
        accuracy: pos.coords.accuracy,
      }),
      (err) => reject({ code: err.code, message: err.message }),
      { enableHighAccuracy: true, timeout: timeoutMs, maximumAge: 30000 }
    );
  });
}

// Continuous watch — returns a "stop" function. cb gets {lat,lng,accuracy} or null.
// errCb gets W3C-style {code,message}.
export function watchPosition(cb, errCb) {
  if (isNative()) {
    let watchId = null;
    CapGeo.watchPosition(
      { enableHighAccuracy: true, timeout: 12000 },
      (pos, err) => {
        if (err) {
          errCb?.({ code: 2, message: err.message || "Watch error" });
          return;
        }
        if (pos) {
          cb({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
            accuracy: pos.coords.accuracy,
          });
        }
      }
    ).then((id) => { watchId = id; }).catch((e) => {
      errCb?.({ code: 1, message: e?.message || "Watch failed" });
    });
    return () => {
      if (watchId != null) CapGeo.clearWatch({ id: watchId }).catch(() => {});
    };
  }
  if (typeof navigator === "undefined" || !navigator.geolocation) {
    errCb?.({ code: 2, message: "Geolocation not supported" });
    return () => {};
  }
  const id = navigator.geolocation.watchPosition(
    (pos) => cb({
      lat: pos.coords.latitude,
      lng: pos.coords.longitude,
      accuracy: pos.coords.accuracy,
    }),
    (err) => errCb?.({ code: err.code, message: err.message }),
    { enableHighAccuracy: true, maximumAge: 8000, timeout: 12000 }
  );
  return () => navigator.geolocation.clearWatch(id);
}
