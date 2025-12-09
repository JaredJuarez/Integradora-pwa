// Service Worker - PWA Sistema de Empleados
const CACHE_NAME = "pwa-sistema-v1.0.2";
const API_CACHE = "pwa-api-cache-v1";

// URLs esenciales para funcionar offline (rutas relativas)
const urlsToCache = [
  "./",
  "./index.html",
  "./pages/auth/login.html",
  "./pages/empleado/dashboard.html",
  "./pages/empleado/qr-scanner.html",
  "./pages/empleado/productos-visita.html",
  "./pages/empleado/camara-estante.html",
  "./assets/css/styles.css",
  "./assets/js/app.js",
  "./assets/js/auth.js",
  "./assets/js/utils.js",
  "./assets/js/API_BASE.js",
  "./assets/js/offline-manager.js",
  "./components/components.js",
  "./manifest.json",
];

// Instalación
self.addEventListener("install", (event) => {
  console.log("✅ SW: Instalando...");

  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => {
        console.log("📦 SW: Cacheando archivos esenciales");
        return cache.addAll(urlsToCache);
      })
      .then(() => {
        console.log("✅ SW: Instalación completada");
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error("❌ SW: Error en instalación:", error);
      })
  );
});

// Activación
self.addEventListener("activate", (event) => {
  console.log("🔄 SW: Activando...");

  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME && cacheName !== API_CACHE) {
              console.log("🧹 SW: Eliminando caché antiguo:", cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log("✅ SW: Activado correctamente");
        return self.clients.claim();
      })
  );
});

// Fetch - Estrategias de caché
self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Solo GET
  if (request.method !== "GET") {
    return;
  }

  // Ignorar extensiones
  if (
    url.protocol === "chrome-extension:" ||
    url.protocol === "moz-extension:"
  ) {
    return;
  }

  // Estrategia según tipo de recurso
  if (url.pathname.startsWith("/api/")) {
    // APIs: Network First
    event.respondWith(networkFirst(request));
  } else if (url.hostname !== self.location.hostname) {
    // CDNs externos: Cache First
    event.respondWith(cacheFirst(request));
  } else {
    // Recursos locales: Cache First
    event.respondWith(cacheFirst(request));
  }
});

// Cache First Strategy
async function cacheFirst(request) {
  try {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }

    const networkResponse = await fetch(request);
    if (networkResponse && networkResponse.status === 200) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    // Fallback para HTML
    if (request.headers.get("accept")?.includes("text/html")) {
      const fallback = await caches.match("./index.html");
      if (fallback) return fallback;
    }
    throw error;
  }
}

// Network First Strategy
async function networkFirst(request) {
  try {
    const networkResponse = await fetch(request);
    if (networkResponse && networkResponse.status === 200) {
      const cache = await caches.open(API_CACHE);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    throw error;
  }
}

// Mensajes
self.addEventListener("message", (event) => {
  if (event.data?.type === "SKIP_WAITING") {
    self.skipWaiting();
  }

  if (event.data?.type === "GET_VERSION") {
    event.ports[0].postMessage({ version: CACHE_NAME });
  }
});
