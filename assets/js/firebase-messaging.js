// firebase-messaging.js - Gestión de notificaciones push con Firebase

// Importamos las funciones necesarias del SDK de Firebase desde CDN
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getMessaging,
  getToken,
  onMessage,
  isSupported,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging.js";

// Configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyAsKtVn__KbM1BhBRtNEgz5qRkyGKfcKcI",
  authDomain: "pwa-i20223tn132.firebaseapp.com",
  projectId: "pwa-i20223tn132",
  storageBucket: "pwa-i20223tn132.firebasestorage.app",
  messagingSenderId: "740907690280",
  appId: "1:740907690280:web:bb5f46f2343d3165eec81d",
};

// Clave pública VAPID (obtenida desde Firebase Console → Cloud Messaging)
const VAPID_KEY =
  "BLLgOrWmpOx7pxUDchb4grvZWTppH16a6JxBafRrhIdtipsKcPJHp2HImf6fPe_i1-HEb4ezvWB4t1Y0TjwX-UI";

// Inicializar Firebase
let app;
let messaging = null;
let swReg = null;

/**
 * Inicializa Firebase Cloud Messaging
 */
async function initFirebaseMessaging() {
  try {
    console.log("🔥 Inicializando Firebase Cloud Messaging...");

    // Inicializar Firebase app
    app = initializeApp(firebaseConfig);
    console.log("✅ Firebase app inicializada");

    // Registrar Service Worker para FCM
    if ("serviceWorker" in navigator) {
      // Primero registrar el service worker de Firebase
      try {
        swReg = await navigator.serviceWorker.register(
          "/firebase-messaging-sw.js"
        );
        console.log("✅ Firebase Service Worker registrado:", swReg.scope);
      } catch (error) {
        console.error("❌ Error al registrar Firebase Service Worker:", error);
        // Continuar con el service worker principal si existe
        swReg = await navigator.serviceWorker.ready;
        console.log("ℹ️ Usando Service Worker principal");
      }
    }

    // Verificar compatibilidad con FCM
    const supported = await isSupported();

    if (!supported) {
      console.warn("⚠️ Este navegador no soporta Firebase Cloud Messaging");
      return null;
    }

    // Inicializar messaging
    messaging = getMessaging(app);
    console.log("✅ Firebase Cloud Messaging inicializado");

    // Escuchar mensajes cuando la app está en primer plano
    onMessage(messaging, (payload) => {
      console.log("📨 Mensaje recibido en primer plano:", payload);

      // Mostrar notificación personalizada
      if (payload.notification) {
        showNotification(
          payload.notification.title || "Nueva notificación",
          "info"
        );

        // También mostrar la notificación del sistema si hay permiso
        if (Notification.permission === "granted") {
          new Notification(payload.notification.title || "Notificación", {
            body: payload.notification.body || "",
            icon: "/icons/icon-192x192.png",
            badge: "/icons/icon-96x96.png",
          });
        }
      }
    });

    return messaging;
  } catch (error) {
    console.error("❌ Error al inicializar Firebase Messaging:", error);
    return null;
  }
}

/**
 * Solicita permisos de notificación y obtiene el token FCM
 * @returns {Promise<string|null>} Token FCM o null si se deniega
 */
async function requestNotificationPermission() {
  try {
    console.log("🔔 Solicitando permisos de notificación...");
    console.log("📊 Estado actual del permiso:", Notification.permission);

    // Si ya está concedido, obtener token directamente
    if (Notification.permission === "granted") {
      console.log("✅ Permiso ya concedido previamente");
      return await getFirebaseToken();
    }

    // Si fue denegado previamente
    if (Notification.permission === "denied") {
      console.error("❌ Permiso de notificaciones denegado previamente");
      return null;
    }

    // Solicitar permiso
    const permission = await Notification.requestPermission();
    console.log("📊 Resultado del permiso:", permission);

    if (permission !== "granted") {
      console.error("❌ Permiso de notificaciones denegado por el usuario");
      return null;
    }

    console.log("✅ Permiso de notificaciones concedido");

    // Obtener token FCM
    return await getFirebaseToken();
  } catch (error) {
    console.error("❌ Error al solicitar permisos:", error);
    return null;
  }
}

/**
 * Obtiene el token FCM
 * @returns {Promise<string|null>} Token FCM
 */
async function getFirebaseToken() {
  try {
    if (!messaging) {
      await initFirebaseMessaging();
    }

    if (!messaging) {
      console.error("❌ Firebase Messaging no está disponible");
      return null;
    }

    console.log("🔑 Obteniendo token FCM...");

    const token = await getToken(messaging, {
      vapidKey: VAPID_KEY,
      serviceWorkerRegistration: swReg,
    });

    if (token) {
      console.log("✅ Token FCM obtenido exitosamente");
      console.log("🔑 FCM Token:", token);
      return token;
    } else {
      console.warn("⚠️ No se pudo obtener el token FCM");
      return null;
    }
  } catch (error) {
    console.error("❌ Error al obtener token FCM:", error);
    return null;
  }
}

/**
 * Actualiza el token FCM del usuario en el servidor
 * @param {string} token - Token FCM a guardar
 * @returns {Promise<boolean>} true si se actualizó correctamente
 */
async function updateUserFCMToken(token) {
  try {
    console.log("💾 Actualizando token FCM en el servidor...");

    // Obtener datos del usuario actual desde la sesión
    const session = Storage.get("session");
    if (!session || !session.user || !session.token) {
      console.error("❌ No hay sesión activa");
      return false;
    }

    const currentUser = session.user;
    console.log("👤 Usuario actual:", currentUser);

    // Primero obtener los datos completos del usuario desde el servidor
    console.log("📥 Obteniendo datos completos del usuario...");
    const getUserResponse = await apiFetch(
      API_CONFIG.ENDPOINTS.USER_BY_ID(currentUser.id),
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${session.token}`,
        },
      }
    );

    if (!getUserResponse.ok) {
      console.error("❌ Error al obtener datos del usuario");
      return false;
    }

    const userDataResponse = await getUserResponse.json();
    const userData = userDataResponse.data || userDataResponse;
    console.log("📦 Datos completos del usuario:", userData);

    // Construir el objeto de actualización con TODOS los campos del usuario
    const updateData = {
      id: userData.id,
      name: userData.name,
      phone: userData.phone || "",
      email: userData.email,
      password: userData.password, // Enviar la contraseña que viene del servidor
      status: userData.status !== undefined ? userData.status : true,
      roleId:
        userData.roleId ||
        userData.role?.id ||
        (currentUser.rol === "empleado" ? 2 : 1),
      tokenFcm: token,
    };

    console.log("📤 Datos a enviar al PUT:", updateData);

    // Hacer la petición PUT al endpoint
    const response = await apiFetch(API_CONFIG.ENDPOINTS.USER, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.token}`,
      },
      body: JSON.stringify(updateData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("❌ Error al actualizar token:", errorData);
      return false;
    }

    const result = await response.json();
    console.log("✅ Token FCM actualizado en el servidor:", result);

    return true;
  } catch (error) {
    console.error("❌ Error al actualizar token FCM:", error);
    return false;
  }
}

/**
 * Inicializa las notificaciones para el empleado
 * Solicita permisos automáticamente y redirige si se niega
 */
async function initEmployeeNotifications() {
  try {
    console.log("========================================");
    console.log("🔥 INICIALIZANDO NOTIFICACIONES EMPLEADO");
    console.log("========================================");

    // Inicializar Firebase Messaging
    await initFirebaseMessaging();

    // Solicitar permisos y obtener token
    const token = await requestNotificationPermission();

    if (!token) {
      console.error("❌ No se pudieron obtener permisos de notificaciones");
      console.log("🔙 Redirigiendo al login...");

      // Mostrar mensaje al usuario
      if (typeof showNotification === "function") {
        showNotification(
          "Se requieren permisos de notificaciones para usar la aplicación",
          "error",
          5000
        );
      }

      // Esperar 2 segundos antes de redirigir para que vea el mensaje
      setTimeout(() => {
        window.location.href = "../auth/login.html";
      }, 2000);

      return null;
    }

    console.log("========================================");
    console.log("✅ NOTIFICACIONES CONFIGURADAS EXITOSAMENTE");
    console.log("🔑 Token guardado en consola");
    console.log("========================================");

    // Guardar token en localStorage para uso posterior
    if (typeof Storage !== "undefined") {
      localStorage.setItem("fcm_token", token);
      console.log("💾 Token guardado en localStorage");
    }

    // Actualizar el token FCM en el servidor
    const updated = await updateUserFCMToken(token);
    if (updated) {
      console.log("✅ Token FCM actualizado exitosamente en el servidor");
    } else {
      console.warn("⚠️ No se pudo actualizar el token en el servidor");
    }

    return token;
  } catch (error) {
    console.error("❌ Error al inicializar notificaciones:", error);

    // Redirigir al login en caso de error
    setTimeout(() => {
      window.location.href = "../auth/login.html";
    }, 2000);

    return null;
  }
}

// Exportar funciones
window.initFirebaseMessaging = initFirebaseMessaging;
window.requestNotificationPermission = requestNotificationPermission;
window.getFirebaseToken = getFirebaseToken;
window.updateUserFCMToken = updateUserFCMToken;
window.initEmployeeNotifications = initEmployeeNotifications;
