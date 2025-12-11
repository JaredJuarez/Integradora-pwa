// firebase-messaging-sw.js - Service Worker para Firebase Cloud Messaging

// Importar Firebase (versión compat, compatible con Service Worker)
importScripts(
  "https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js"
);

// Configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyAsKtVn__KbM1BhBRtNEgz5qRkyGKfcKcI",
  authDomain: "pwa-i20223tn132.firebaseapp.com",
  projectId: "pwa-i20223tn132",
  storageBucket: "pwa-i20223tn132.firebasestorage.app",
  messagingSenderId: "740907690280",
  appId: "1:740907690280:web:bb5f46f2343d3165eec81d",
};

// Inicializar Firebase en el Service Worker
firebase.initializeApp(firebaseConfig);

// Inicializar el servicio de mensajería
const messaging = firebase.messaging();

console.log("🔥 Firebase Messaging Service Worker inicializado");

// Recibir mensajes en segundo plano (cuando la app no está en primer plano)
messaging.onBackgroundMessage((payload) => {
  console.log("📨 Mensaje recibido en segundo plano:", payload);

  const notificationTitle = payload.notification?.title || "Nueva Notificación";
  const notificationOptions = {
    body: payload.notification?.body || "Tienes una nueva notificación",
    icon: "/icons/icon-192x192.png",
    badge: "/icons/icon-96x96.png",
    vibrate: [200, 100, 200],
    tag: "notification-" + Date.now(),
    requireInteraction: false,
    data: payload.data || {},
  };

  // Mostrar la notificación
  self.registration.showNotification(notificationTitle, notificationOptions);
});

// Manejar clics en notificaciones
self.addEventListener("notificationclick", (event) => {
  console.log("🖱️ Clic en notificación:", event.notification);

  event.notification.close();

  // Abrir o enfocar la aplicación
  event.waitUntil(
    clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then((clientList) => {
        // Si ya hay una ventana abierta, enfocarla
        for (const client of clientList) {
          if (client.url.includes("/pages/empleado/") && "focus" in client) {
            return client.focus();
          }
        }
        // Si no hay ventana abierta, abrir el dashboard
        if (clients.openWindow) {
          return clients.openWindow("/pages/empleado/dashboard.html");
        }
      })
  );
});

// Manejar cierre de notificaciones
self.addEventListener("notificationclose", (event) => {
  console.log("❌ Notificación cerrada:", event.notification);
});

console.log("✅ Firebase Messaging SW configurado correctamente");
