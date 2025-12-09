// app.js - Archivo principal de la aplicación

// Detectar modo offline/online
window.addEventListener("online", () => {
  hideOfflineIndicator();
  showNotification("Conexión restaurada", "success");
});

window.addEventListener("offline", () => {
  showOfflineIndicator();
  showNotification("Sin conexión a internet", "warning");
});

// Mostrar/ocultar indicador offline
function showOfflineIndicator() {
  const indicator = document.getElementById("offline-indicator");
  if (!indicator) {
    const div = document.createElement("div");
    div.id = "offline-indicator";
    div.className = "offline-indicator show";
    div.innerHTML =
      '<i class="fas fa-wifi-slash mr-2"></i> Sin conexión a internet';
    document.body.prepend(div);
  } else {
    indicator.classList.add("show");
  }
}

function hideOfflineIndicator() {
  const indicator = document.getElementById("offline-indicator");
  if (indicator) {
    indicator.classList.remove("show");
  }
}

// Botón de instalación PWA
window.addEventListener("beforeinstallprompt", (e) => {
  e.preventDefault();
  deferredPrompt = e;
  const installBtn = document.getElementById("installBtn");
  if (installBtn) {
    installBtn.classList.remove("hidden");
    installBtn.addEventListener("click", installApp);
  }
});

function installApp() {
  const installBtn = document.getElementById("installBtn");
  if (deferredPrompt) {
    deferredPrompt.prompt();
    deferredPrompt.userChoice.then((choiceResult) => {
      if (choiceResult.outcome === "accepted") {
        console.log("Usuario aceptó instalar la PWA");
        if (installBtn) installBtn.classList.add("hidden");
      }
      deferredPrompt = null;
    });
  }
}

// Detectar si la app está instalada
window.addEventListener("appinstalled", () => {
  console.log("PWA instalada correctamente");
  showNotification("Aplicación instalada exitosamente", "success");
});

// Loader
function showLoader() {
  const loader = document.getElementById("loader");
  if (loader) {
    loader.classList.remove("hidden");
  }
}

function hideLoader() {
  const loader = document.getElementById("loader");
  if (loader) {
    loader.classList.add("hidden");
  }
}

// Sistema de notificaciones Toast
function showNotification(message, type = "info", duration = 3000) {
  const colors = {
    success: "bg-green-500",
    error: "bg-red-500",
    warning: "bg-yellow-500",
    info: "bg-blue-500",
  };

  const icons = {
    success: "fa-check-circle",
    error: "fa-exclamation-circle",
    warning: "fa-exclamation-triangle",
    info: "fa-info-circle",
  };

  const toast = document.createElement("div");
  toast.className = `notification-toast ${colors[type]} text-white px-6 py-4 rounded-lg shadow-lg flex items-center`;
  toast.innerHTML = `
        <i class="fas ${icons[type]} text-xl mr-3"></i>
        <span>${message}</span>
        <button class="ml-auto text-white hover:text-gray-200" onclick="this.parentElement.remove()">
            <i class="fas fa-times"></i>
        </button>
    `;

  document.body.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = "0";
    setTimeout(() => toast.remove(), 300);
  }, duration);
}

// Solicitar permiso de notificaciones
function requestNotificationPermission() {
  if ("Notification" in window && Notification.permission === "default") {
    Notification.requestPermission().then((permission) => {
      if (permission === "granted") {
        console.log("Permisos de notificación concedidos");
      }
    });
  }
}

// Mostrar notificación push
function showPushNotification(title, options = {}) {
  if ("Notification" in window && Notification.permission === "granted") {
    navigator.serviceWorker.ready.then((registration) => {
      registration.showNotification(title, {
        body: options.body || "",
        icon: options.icon || "/assets/images/icons/icon-192x192.png",
        badge: options.badge || "/assets/images/icons/icon-96x96.png",
        vibrate: options.vibrate || [200, 100, 200],
        data: options.data || {},
        ...options,
      });
    });
  }
}

// Modal genérico
function showModal(title, content, buttons = []) {
  const overlay = document.createElement("div");
  overlay.className = "modal-overlay";
  overlay.id = "modal-overlay";
  overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 9999;
    `;

  const buttonHTML = buttons
    .map(
      (btn) => `
        <button 
            class="btn-${btn.type || "primary"} px-4 py-2 rounded-md ${
        btn.type === "secondary"
          ? "bg-gray-500 hover:bg-gray-600 text-white"
          : "bg-blue-500 hover:bg-blue-600 text-white"
      }" 
            onclick="${btn.onclick || "closeModal()"}"
        >
            ${btn.text}
        </button>
    `
    )
    .join("");

  overlay.innerHTML = `
        <div class="modal-content bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4">
            <div class="flex justify-between items-center mb-4">
                <h3 class="text-xl font-bold text-gray-900">${title}</h3>
                <button onclick="closeModal()" class="text-gray-400 hover:text-gray-600">
                    <i class="fas fa-times text-xl"></i>
                </button>
            </div>
            <div class="mb-6">
                ${content}
            </div>
            <div class="flex justify-end space-x-3">
                ${buttonHTML}
            </div>
        </div>
    `;

  document.body.appendChild(overlay);

  // Cerrar al hacer click fuera del modal
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) {
      closeModal();
    }
  });
}

function closeModal() {
  const overlay = document.getElementById("modal-overlay");
  if (overlay) {
    overlay.remove();
  }
}

// Confirmar acción
function confirmAction(message, onConfirm) {
  // Crear un ID único para la función callback
  const callbackId =
    "callback_" + Date.now() + "_" + Math.random().toString(36).substr(2, 9);

  // Almacenar temporalmente la función en window
  window[callbackId] = () => {
    onConfirm();
    // Limpiar la función temporal
    delete window[callbackId];
  };

  showModal("Confirmar acción", `<p class="text-gray-600">${message}</p>`, [
    {
      text: "Cancelar",
      type: "secondary",
      onclick: "closeModal()",
    },
    {
      text: "Confirmar",
      type: "primary",
      onclick: `closeModal(); window.${callbackId}()`,
    },
  ]);
}

// Gestión de sidebar en móvil
function toggleSidebar() {
  const sidebar = document.getElementById("sidebar");
  if (sidebar) {
    sidebar.classList.toggle("open");
  }
}

// Toggle user menu dropdown
function toggleUserMenu() {
  const dropdown = document.getElementById("userDropdown");
  if (dropdown) {
    dropdown.classList.toggle("hidden");
  }
}

// Toggle notifications dropdown
function toggleNotifications() {
  const dropdown = document.getElementById("notificationsDropdown");
  if (dropdown) {
    dropdown.classList.toggle("hidden");
  }
}

// Cerrar dropdowns al hacer clic fuera
document.addEventListener("click", (e) => {
  const userDropdown = document.getElementById("userDropdown");
  const notificationsDropdown = document.getElementById(
    "notificationsDropdown"
  );

  // Cerrar user dropdown si está abierto y el click es fuera
  if (userDropdown && !userDropdown.classList.contains("hidden")) {
    const userButton = e.target.closest('[onclick="toggleUserMenu()"]');
    if (!userButton && !userDropdown.contains(e.target)) {
      userDropdown.classList.add("hidden");
    }
  }

  // Cerrar notifications dropdown si está abierto y el click es fuera
  if (
    notificationsDropdown &&
    !notificationsDropdown.classList.contains("hidden")
  ) {
    const notifButton = e.target.closest('[onclick="toggleNotifications()"]');
    if (!notifButton && !notificationsDropdown.contains(e.target)) {
      notificationsDropdown.classList.add("hidden");
    }
  }
});

// Cerrar sidebar al hacer clic fuera
document.addEventListener("click", (e) => {
  const sidebar = document.getElementById("sidebar");
  const menuBtn = document.getElementById("menu-btn");

  if (sidebar && sidebar.classList.contains("open")) {
    if (!sidebar.contains(e.target) && !menuBtn?.contains(e.target)) {
      sidebar.classList.remove("open");
    }
  }
});

// Inicialización
document.addEventListener("DOMContentLoaded", async () => {
  // Registrar Service Worker
  if ("serviceWorker" in navigator) {
    try {
      // Determinar la ruta base correcta
      const pathSegments = window.location.pathname.split("/");
      const baseIndex = pathSegments.indexOf("Integradora-pwa");
      const basePath =
        baseIndex !== -1
          ? "/" + pathSegments.slice(1, baseIndex + 1).join("/") + "/"
          : "/";

      const swPath = basePath + "sw.js";
      const swScope = basePath;

      console.log("🔧 Registrando SW en:", swPath, "Scope:", swScope);

      const registration = await navigator.serviceWorker.register(swPath, {
        scope: swScope,
      });

      console.log("✅ Service Worker registrado:", registration.scope);

      // Verificar actualizaciones
      registration.addEventListener("updatefound", () => {
        const newWorker = registration.installing;
        console.log("🔄 Nueva versión del Service Worker encontrada");

        newWorker.addEventListener("statechange", () => {
          if (
            newWorker.state === "installed" &&
            navigator.serviceWorker.controller
          ) {
            console.log(
              "✨ Nueva versión disponible. Recarga la página para actualizar."
            );
            showNotification(
              "Nueva versión disponible. Recarga la página.",
              "info"
            );
          }
        });
      });
    } catch (error) {
      console.error("❌ Error al registrar Service Worker:", error);
    }
  } else {
    console.warn("⚠️ Service Workers no soportados en este navegador");
  }

  // Inicializar datos de usuarios y sincronizar con empleados
  if (typeof initDemoUsers === "function") {
    await initDemoUsers();
  }

  // Sincronizar usuarios con empleados si adminDataManager está disponible
  if (typeof syncUsersWithEmployees === "function") {
    await syncUsersWithEmployees();
  }

  // Solicitar permisos de notificaciones después de 5 segundos
  setTimeout(requestNotificationPermission, 5000);

  // Verificar estado de conexión inicial
  if (!navigator.onLine) {
    showOfflineIndicator();
  }

  console.log("PWA Sistema inicializado correctamente");
});

// Exportar funciones globalmente
window.showNotification = showNotification;
window.showModal = showModal;
window.closeModal = closeModal;
window.confirmAction = confirmAction;
window.showLoader = showLoader;
window.hideLoader = hideLoader;
window.toggleSidebar = toggleSidebar;
window.toggleUserMenu = toggleUserMenu;
window.toggleNotifications = toggleNotifications;
