// Barbie Cashier — Service Worker (manual, sin dependencias)
const CACHE_PREFIX = "barbie-cashier-";
const VERSION = "v1";
const RUNTIME = `${CACHE_PREFIX}${VERSION}-runtime`;

const PRECACHE = [
  "/",
  "/icons/icon-192.png",
  "/icons/icon-512.png",
  "/icons/icon-maskable-512.png",
  "/icons/apple-touch-icon.png",
];

self.addEventListener("install", (event) => {
  // No se llama a skipWaiting(): una actualización espera a que el usuario
  // confirme (mensaje SKIP_WAITING) para no interrumpir una venta en curso.
  event.waitUntil(
    caches.open(RUNTIME).then((cache) => cache.addAll(PRECACHE)),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(
        keys
          .filter((key) => key.startsWith(CACHE_PREFIX) && key !== RUNTIME)
          .map((key) => caches.delete(key)),
      );
      await self.clients.claim();
    })(),
  );
});

self.addEventListener("message", (event) => {
  if (event.data === "SKIP_WAITING") {
    self.skipWaiting();
  }
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") {
    return;
  }
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) {
    return;
  }

  // Navegación: red primero, con respaldo al shell cacheado.
  if (request.mode === "navigate") {
    event.respondWith(
      (async () => {
        const cache = await caches.open(RUNTIME);
        try {
          const response = await fetch(request);
          cache.put(request, response.clone());
          return response;
        } catch {
          return (await cache.match(request)) || (await cache.match("/"));
        }
      })(),
    );
    return;
  }

  // Recursos estáticos: stale-while-revalidate.
  event.respondWith(
    (async () => {
      const cache = await caches.open(RUNTIME);
      const cached = await cache.match(request);
      const network = fetch(request)
        .then((response) => {
          if (response && response.ok) {
            cache.put(request, response.clone());
          }
          return response;
        })
        .catch(() => cached);
      return cached || network;
    })(),
  );
});
