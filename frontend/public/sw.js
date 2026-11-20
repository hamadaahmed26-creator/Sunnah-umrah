/* Sunnah Umrah — Service Worker
   Cache-first for the app shell, network-first for /api calls.
   Bump CACHE_VERSION to force clients to update.
*/
const CACHE_VERSION = "umrah-v1.61.0";
const APP_SHELL = [
  "/",
  "/manifest.json",
  "/icon.svg",
  "/apple-touch-icon.png",
  // Adhan audio — needed offline so notifications still work in poor signal
  "/audio/adhan-makkah.mp3",
  // Tawaf step photos — needed offline inside the Haram
  "/images/kaaba/01-black-stone.jpg",
  "/images/kaaba/02-walking.jpg",
  "/images/kaaba/03-yemeni-corner.jpg",
  "/images/kaaba/04-yemeni-to-stone.jpg",
  // Sa'i step photos
  "/images/sai/01-safa.jpg",
  "/images/sai/02-marwah.jpg",
  "/images/sai/03-masaa.jpg",
  "/images/sai/04-green-markers.jpg",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_VERSION).then((cache) =>
      // Use addAll best-effort; ignore failures on individual files
      Promise.allSettled(APP_SHELL.map((u) => cache.add(u)))
    )
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => /^umrah-v[0-9.]+$/.test(k) && k !== CACHE_VERSION).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;

  const url = new URL(req.url);

  // Keep user-specific responses and precise-location queries out of Cache Storage.
  if (url.origin !== self.location.origin || req.headers.has("Authorization") ||
      url.search || url.pathname.startsWith("/api/") || url.pathname.startsWith("/companion/")) return;

  if (req.mode === "navigate") {
    event.respondWith(fetch(req).catch(async () => {
      const cache = await caches.open(CACHE_VERSION);
      return await cache.match("/") || Response.error();
    }));
    return;
  }
  if (!APP_SHELL.includes(url.pathname) && !url.pathname.startsWith("/static/")) return;
  event.respondWith((async () => {
    const cache = await caches.open(CACHE_VERSION);
    const cached = await cache.match(req);
    if (cached) return cached;
    const response = await fetch(req);
    if (response.ok && response.status === 200 && !/no-store|private/i.test(response.headers.get("Cache-Control") || "")) {
      await cache.put(req, response.clone());
    }
    return response;
  })());
});
