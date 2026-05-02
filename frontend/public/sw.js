/* Sunnah Umrah — Service Worker
   Cache-first for the app shell, network-first for /api calls.
   Bump CACHE_VERSION to force clients to update.
*/
const CACHE_VERSION = "umrah-v1.33.0";
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
      Promise.all(keys.filter((k) => k !== CACHE_VERSION).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;

  const url = new URL(req.url);

  // Never cache API calls or analytics — always go to network.
  // If offline, gracefully fail.
  if (
    url.pathname.startsWith("/api/") ||
    url.host.includes("emergent.sh") ||
    url.host.includes("emergentagent.com") && url.pathname.includes("/api/")
  ) {
    event.respondWith(
      fetch(req).catch(
        () =>
          new Response(JSON.stringify({ offline: true }), {
            status: 503,
            headers: { "Content-Type": "application/json" },
          })
      )
    );
    return;
  }

  // For navigations: try network, fall back to cached shell.
  if (req.mode === "navigate") {
    event.respondWith(
      fetch(req)
        .then((res) => {
          const copy = res.clone();
          caches.open(CACHE_VERSION).then((c) => c.put(req, copy));
          return res;
        })
        .catch(() => caches.match("/").then((m) => m || caches.match(req)))
    );
    return;
  }

  // For everything else (JS, CSS, fonts, images): cache-first, then network.
  event.respondWith(
    caches.match(req).then((cached) => {
      if (cached) return cached;
      return fetch(req)
        .then((res) => {
          // Cache successful, basic-origin responses + cdn assets
          if (
            res &&
            res.status === 200 &&
            (res.type === "basic" || res.type === "cors")
          ) {
            const copy = res.clone();
            caches.open(CACHE_VERSION).then((c) => c.put(req, copy));
          }
          return res;
        })
        .catch(() => cached);
    })
  );
});
