// Service Worker - PWA
const CACHE_NAME = 'pwa-sistema-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/pages/auth/login.html',
  '/pages/auth/registro.html',
  '/assets/css/styles.css',
  '/assets/js/app.js',
  '/assets/js/auth.js',
  '/assets/js/utils.js',
  'https://cdn.tailwindcss.com',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css'
];

// Instalación del Service Worker
self.addEventListener('install', event => {
  console.log('Service Worker: Instalando...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Service Worker: Archivos en caché');
        return cache.addAll(urlsToCache);
      })
      .catch(err => console.log('Service Worker: Error al cachear', err))
  );
});

// Activación del Service Worker
self.addEventListener('activate', event => {
  console.log('Service Worker: Activando...');
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if (cache !== CACHE_NAME) {
            console.log('Service Worker: Limpiando caché antiguo');
            return caches.delete(cache);
          }
        })
      );
    })
  );
});

// Estrategia de caché: Network First, fallback a Cache
self.addEventListener('fetch', event => {
  event.respondWith(
    fetch(event.request)
      .then(response => {
        // Si la respuesta es válida, la clonamos y guardamos en caché
        if (response && response.status === 200) {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, responseClone);
          });
        }
        return response;
      })
      .catch(() => {
        // Si falla la red, buscamos en caché
        return caches.match(event.request).then(response => {
          if (response) {
            return response;
          }
          // Si no está en caché, mostramos página offline
          if (event.request.mode === 'navigate') {
            return caches.match('/index.html');
          }
        });
      })
  );
});

// Sincronización en background
self.addEventListener('sync', event => {
  console.log('Service Worker: Sincronizando datos...');
  if (event.tag === 'sync-data') {
    event.waitUntil(syncData());
  }
});

// Notificaciones Push
self.addEventListener('push', event => {
  const options = {
    body: event.data ? event.data.text() : 'Nueva notificación',
    icon: '/assets/images/icons/icon-192x192.png',
    badge: '/assets/images/icons/icon-96x96.png',
    vibrate: [200, 100, 200],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    }
  };

  event.waitUntil(
    self.registration.showNotification('PWA Sistema', options)
  );
});

// Click en notificación
self.addEventListener('notificationclick', event => {
  event.notification.close();
  event.waitUntil(
    clients.openWindow('/')
  );
});

// Función para sincronizar datos
async function syncData() {
  try {
    // Aquí iría la lógica de sincronización con el backend
    console.log('Datos sincronizados exitosamente');
  } catch (error) {
    console.error('Error al sincronizar datos:', error);
  }
}
