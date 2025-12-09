// Service Worker - PWA Sistema de Empleados
const CACHE_NAME = "pwa-sistema-empleados-v1.0.1";
const API_CACHE = "pwa-api-cache-v1";

// URLs que se cachearán automáticamente al instalar el Service Worker
const urlsToCache = [
  "/Integradora-pwa/",
  "/Integradora-pwa/index.html",
  "/Integradora-pwa/pages/auth/login.html",
  "/Integradora-pwa/pages/empleado/dashboard.html",
  "/Integradora-pwa/pages/empleado/qr-scanner.html",
  "/Integradora-pwa/pages/empleado/productos-visita.html",
  "/Integradora-pwa/pages/empleado/camara-estante.html",
  "/Integradora-pwa/assets/css/styles.css",
  "/Integradora-pwa/assets/js/app.js",
  "/Integradora-pwa/assets/js/auth.js",
  "/Integradora-pwa/assets/js/utils.js",
  "/Integradora-pwa/assets/js/API_BASE.js",
  "/Integradora-pwa/assets/js/offline-manager.js",
  "/Integradora-pwa/components/components.js",
  "/Integradora-pwa/manifest.json",
];

// Instalación del Service Worker
self.addEventListener("install", (event) => {
  console.log("SW: Instalando...");
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log("SW: Cacheando archivos esenciales");
        return cache.addAll(urlsToCache);
      })
      .then(() => {
        console.log("SW: Instalación completada");
        return self.skipWaiting(); // Activar inmediatamente
      })
      .catch((error) => {
        console.error("SW: Error al cachear archivos:", error);
      })
  );
});

// Activación del Service Worker
self.addEventListener("activate", (event) => {
  console.log("SW: Activando...");
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME && cacheName !== API_CACHE) {
              console.log("SW: Eliminando caché antiguo:", cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log("SW: Activación completada");
        return self.clients.claim(); // Tomar control inmediato
      })
  );
});

// Interceptar peticiones de red
self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Solo manejar peticiones GET
  if (request.method !== "GET") {
    return;
  }

  // Ignorar extensiones del navegador
  if (url.protocol === "chrome-extension:" || url.protocol === "moz-extension:") {
    return;
  }

  // Estrategia: Network First para APIs, Cache First para recursos estáticos
  if (url.pathname.startsWith("/api/") || url.hostname !== location.hostname) {
    // API: Network First (intentar red, fallback a caché)
    event.respondWith(networkFirstStrategy(request));
  } else {
    // Recursos estáticos: Cache First (caché primero, fallback a red)
    event.respondWith(cacheFirstStrategy(request));
  }
});

// Estrategia Cache First: Bueno para recursos estáticos
async function cacheFirstStrategy(request) {
  const cache = await caches.open(CACHE_NAME);
  const cachedResponse = await cache.match(request);

  if (cachedResponse) {
    console.log("SW: Sirviendo desde caché:", request.url);
    return cachedResponse;
  }

  try {
    console.log("SW: Obteniendo de red:", request.url);
    const networkResponse = await fetch(request);
    
    // Solo cachear respuestas exitosas
    if (networkResponse && networkResponse.status === 200) {
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.error("SW: Error de red:", error);
    
    // Fallback para páginas HTML
    if (request.headers.get("accept").includes("text/html")) {
      const fallback = await cache.match("/Integradora-pwa/index.html");
      if (fallback) return fallback;
    }
    
    throw error;
  }
}

// Estrategia Network First: Bueno para APIs
async function networkFirstStrategy(request) {
  const cache = await caches.open(API_CACHE);

  try {
    console.log("SW: Intentando obtener de red (API):", request.url);
    const networkResponse = await fetch(request);
    
    // Cachear respuestas exitosas de API
    if (networkResponse && networkResponse.status === 200) {
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.log("SW: Red falló, intentando caché (API):", request.url);
    const cachedResponse = await cache.match(request);
    
    if (cachedResponse) {
      console.log("SW: Sirviendo API desde caché:", request.url);
      return cachedResponse;
    }
    
    throw error;
  }
}

// Manejar mensajes del cliente
self.addEventListener("message", (event) => {
  console.log("SW: Mensaje recibido:", event.data);

  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }

  if (event.data && event.data.type === "GET_VERSION") {
    event.ports[0].postMessage({ version: CACHE_NAME });
  }
});

// Manejar sincronización en background
self.addEventListener("sync", (event) => {
  console.log("Service Worker: Evento de sincronización:", event.tag);

  if (event.tag === "background-sync") {
    event.waitUntil(syncEmployeeData());
  }
});

// Manejar notificaciones push
self.addEventListener("push", (event) => {
  console.log("Service Worker: Notificación push recibida:", event);

  const options = {
    body: event.data ? event.data.text() : "Nueva actualización disponible",
    icon: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTkyIiBoZWlnaHQ9IjE5MiIgdmlld0JveD0iMCAwIDE5MiAxOTIiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxOTIiIGhlaWdodD0iMTkyIiByeD0iNDAiIGZpbGw9IiM0RjQ2RTUiLz4KPHN2ZyB4PSI0OCIgeT0iNDgiIHdpZHRoPSI5NiIgaGVpZ2h0PSI5NiIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJ3aGl0ZSI+CjxwYXRoIGQ9Im0xOSAxNS02LTZMMiAyMGg5bDQtNXoiLz4KPC9wYXRoPgo8L3N2Zz4KPC9zdmc+",
    badge:
      "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNzIiIGhlaWdodD0iNzIiIHZpZXdCb3g9IjAgMCA3MiA3MiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjcyIiBoZWlnaHQ9IjcyIiByeD0iMTYiIGZpbGw9IiM0RjQ2RTUiLz4KPHN2ZyB4PSIxNiIgeT0iMTYiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJ3aGl0ZSI+CjxwYXRoIGQ9Im0xOSAxNS02LTZMMiAyMGg5bDQtNXoiLz4KPC9wYXRoPgo8L3N2Zz4KPC9zdmc+",
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1,
    },
    actions: [
      {
        action: "explore",
        title: "Abrir App",
        icon: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNzIiIGhlaWdodD0iNzIiIHZpZXdCb3g9IjAgMCA3MiA3MiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjcyIiBoZWlnaHQ9IjcyIiByeD0iMTYiIGZpbGw9IiM0RjQ2RTUiLz4KPHN2ZyB4PSIxNiIgeT0iMTYiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJ3aGl0ZSI+CjxwYXRoIGQ9Im0xOSAxNS02LTZMMiAyMGg5bDQtNXoiLz4KPC9wYXRoPgo8L3N2Zz4KPC9zdmc+",
      },
      {
        action: "close",
        title: "Cerrar",
        icon: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNzIiIGhlaWdodD0iNzIiIHZpZXdCb3g9IjAgMCA3MiA3MiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjcyIiBoZWlnaHQ9IjcyIiByeD0iMTYiIGZpbGw9IiM0RjQ2RTUiLz4KPHN2ZyB4PSIxNiIgeT0iMTYiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJ3aGl0ZSI+CjxwYXRoIGQ9Im0xOSAxNS02LTZMMiAyMGg5bDQtNXoiLz4KPC9wYXRoPgo8L3N2Zz4KPC9zdmc+",
      },
    ],
  };

  event.waitUntil(
    self.registration.showNotification("PWA Sistema Empleados", options)
  );
});

// Manejar clics en notificaciones
self.addEventListener("notificationclick", (event) => {
  console.log("Service Worker: Click en notificación:", event.notification.tag);
  event.notification.close();

  if (event.action === "explore") {
    event.waitUntil(clients.openWindow("/Integradora-pwa/"));
  } else if (event.action === "close") {
    // No hacer nada, solo cerrar
  } else {
    event.waitUntil(clients.openWindow("/Integradora-pwa/"));
  }
});

// Función para sincronizar datos del empleado
async function syncEmployeeData() {
  try {
    console.log("Service Worker: Sincronizando datos de empleado...");
    // Aquí se podría implementar lógica para sincronizar con el backend
    // Por ahora solo registramos el evento
    const storage = new Storage();
    const lastSync = Date.now();
    await storage.setItem("lastSync", lastSync);
    console.log("Service Worker: Datos sincronizados exitosamente");
  } catch (error) {
    console.error("Service Worker: Error al sincronizar datos:", error);
  }
}

// Función auxiliar para Storage (versión simplificada para SW)
class Storage {
  async setItem(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error("Storage: Error al guardar:", error);
      return false;
    }
  }

  async getItem(key) {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error("Storage: Error al leer:", error);
      return null;
    }
  }
}
