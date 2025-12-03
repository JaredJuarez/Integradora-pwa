// Service Worker - PWA Sistema de Empleados
const CACHE_NAME = "pwa-sistema-empleados-v1.0.0";

// URLs que se cachearán automáticamente al instalar el Service Worker
const urlsToCache = [
  "./",
  "./index.html",
  "./pages/auth/login.html",
  "./pages/auth/registro.html",
  "./pages/empleado/dashboard.html",
  "./pages/empleado/qr-scanner.html",
  "./pages/empleado/productos-visita.html",
  "./pages/empleado/camara-estante.html",
  "./pages/admin/dashboard.html",
  "./pages/admin/productos-management.html",
  "./assets/css/styles.css",
  "./assets/js/app.js",
  "./assets/js/auth.js",
  "./assets/js/data.js",
  "./assets/js/utils.js",
  "./assets/js/employee-data.js",
  "./components/components.js",
  "./manifest.json",
  // CDN resources
  "https://cdn.tailwindcss.com",
  "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css",
];

// Instalación del Service Worker
self.addEventListener("install", (event) => {
  console.log("Service Worker: Instalando...");
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => {
        console.log("Service Worker: Cacheando archivos");
        return cache.addAll(
          urlsToCache.map((url) => {
            // Para URLs externas, las devolvemos tal como están
            if (url.startsWith("http")) {
              return url;
            }
            // Para URLs locales, nos aseguramos de que sean relativas
            return url;
          })
        );
      })
      .then(() => {
        console.log("Service Worker: Archivos cacheados exitosamente");
        return self.skipWaiting(); // Forzar activación inmediata
      })
      .catch((error) => {
        console.error("Service Worker: Error al cachear archivos:", error);
      })
  );
});

// Activación del Service Worker
self.addEventListener("activate", (event) => {
  console.log("Service Worker: Activando...");
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            // Eliminar cachés antiguos
            if (cacheName !== CACHE_NAME) {
              console.log(
                "Service Worker: Eliminando caché antiguo:",
                cacheName
              );
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log("Service Worker: Activado exitosamente");
        return self.clients.claim(); // Tomar control inmediato
      })
  );
});

// Interceptar peticiones de red - Estrategia Cache First para mejor rendimiento offline
self.addEventListener("fetch", (event) => {
  // Solo manejar peticiones GET
  if (event.request.method !== "GET") {
    return;
  }

  // Ignorar peticiones a chrome-extension://
  if (event.request.url.startsWith("chrome-extension://")) {
    return;
  }

  console.log("Service Worker: Interceptando petición:", event.request.url);

  event.respondWith(
    caches.match(event.request).then((response) => {
      // Si encontramos el recurso en caché, lo devolvemos
      if (response) {
        console.log(
          "Service Worker: Sirviendo desde caché:",
          event.request.url
        );
        return response;
      }

      // Si no está en caché, intentamos obtenerlo de la red
      console.log("Service Worker: Obteniendo de la red:", event.request.url);
      return fetch(event.request)
        .then((response) => {
          // Verificar si la respuesta es válida
          if (
            !response ||
            response.status !== 200 ||
            response.type !== "basic"
          ) {
            return response;
          }

          // Clonar la respuesta para poder cachearla
          const responseToCache = response.clone();

          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
            console.log(
              "Service Worker: Recurso añadido al caché:",
              event.request.url
            );
          });

          return response;
        })
        .catch((error) => {
          console.error("Service Worker: Error al obtener recurso:", error);

          // Si es una página HTML y estamos offline, mostrar página de fallback
          if (event.request.headers.get("accept").includes("text/html")) {
            return caches.match("./index.html");
          }

          throw error;
        });
    })
  );
});

// Manejar mensajes del cliente
self.addEventListener("message", (event) => {
  console.log("Service Worker: Mensaje recibido:", event.data);

  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }

  if (event.data && event.data.type === "GET_VERSION") {
    event.ports[0].postMessage({
      version: CACHE_NAME,
    });
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
    event.waitUntil(clients.openWindow("./"));
  } else if (event.action === "close") {
    // No hacer nada, solo cerrar
  } else {
    event.waitUntil(clients.openWindow("./"));
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
