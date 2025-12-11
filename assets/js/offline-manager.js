// offline-manager.js - Gestión de funcionalidad offline

/**
 * OfflineManager
 * Maneja el estado offline, almacenamiento local y sincronización
 */
class OfflineManager {
  constructor() {
    this.dbName = "PWA_Sistema_DB";
    this.dbVersion = 2;
    this.db = null;
    this.isOnline = true; // Asumimos online inicialmente
    this.syncInProgress = false;
    this.heartbeatInterval = null;
    this.heartbeatFrequency = 5000; // Verificar cada 5 segundos
    this.connectionTimeout = 5000; // Timeout de 5 segundos para peticiones

    this.init();
  }

  /**
   * Inicializa el gestor offline
   */
  async init() {
    // Inicializar IndexedDB
    await this.initDB();

    // Cargar estado offline desde sessionStorage
    const storedOfflineState = sessionStorage.getItem("appIsOffline");
    if (storedOfflineState === "true") {
      this.isOnline = false;
    }

    // Aplicar UI según el estado almacenado
    this.applyOfflineUI();

    // Configurar listeners de conectividad del navegador (como indicador rápido)
    this.setupConnectivityListeners();

    // Realizar verificación inicial de conexión real
    await this.verifyConnection();

    // Iniciar heartbeat para verificación periódica
    this.startHeartbeat();

    // Verificar cuando la página gana foco
    window.addEventListener("focus", async () => {
      await this.verifyConnection();
    });

    // Verificar cuando la página se vuelve visible
    document.addEventListener("visibilitychange", async () => {
      if (!document.hidden) {
        await this.verifyConnection();
      }
    });

    // Aplicar UI al cargar el DOM
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", () => {
        this.applyOfflineUI();
      });
    }
  }

  /**
   * Inicializa IndexedDB
   */
  async initDB() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.dbVersion);

      request.onerror = () => {
        console.error("❌ Error al abrir IndexedDB:", request.error);
        reject(request.error);
      };

      request.onsuccess = () => {
        this.db = request.result;
        console.log("✅ IndexedDB inicializada correctamente");
        resolve(this.db);
      };

      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        console.log("🔄 Actualizando estructura de IndexedDB...");

        // Store para tiendas (caché local)
        if (!db.objectStoreNames.contains("stores")) {
          const storesStore = db.createObjectStore("stores", { keyPath: "id" });
          storesStore.createIndex("lastUpdate", "lastUpdate", {
            unique: false,
          });
          console.log("✅ Object store 'stores' creado");
        }

        // Store para productos (caché local)
        if (!db.objectStoreNames.contains("products")) {
          const productsStore = db.createObjectStore("products", {
            keyPath: "id",
          });
          productsStore.createIndex("active", "active", { unique: false });
          console.log("✅ Object store 'products' creado");
        }

        // Store para pedidos pendientes (offline queue)
        if (!db.objectStoreNames.contains("pendingOrders")) {
          const ordersStore = db.createObjectStore("pendingOrders", {
            keyPath: "localId",
            autoIncrement: true,
          });
          ordersStore.createIndex("timestamp", "timestamp", { unique: false });
          ordersStore.createIndex("status", "status", { unique: false });
          console.log("✅ Object store 'pendingOrders' creado");
        }

        // Store para imágenes pendientes
        if (!db.objectStoreNames.contains("pendingImages")) {
          const imagesStore = db.createObjectStore("pendingImages", {
            keyPath: "localOrderId",
          });
          imagesStore.createIndex("timestamp", "timestamp", { unique: false });
          console.log("✅ Object store 'pendingImages' creado");
        }

        // Store para datos del empleado (caché local)
        if (!db.objectStoreNames.contains("employee")) {
          const employeeStore = db.createObjectStore("employee", {
            keyPath: "id",
          });
          employeeStore.createIndex("email", "email", { unique: false });
          employeeStore.createIndex("lastUpdate", "lastUpdate", {
            unique: false,
          });
          console.log("✅ Object store 'employee' creado");
        }
      };
    });
  }

  /**
   * Configura listeners de conectividad del navegador
   */
  setupConnectivityListeners() {
    // Estos eventos son solo indicadores rápidos, no definitivos
    window.addEventListener("online", async () => {
      console.log("🌐 Navegador detectó conexión - verificando...");
      await this.verifyConnection();
    });

    window.addEventListener("offline", async () => {
      console.log("📴 Navegador detectó desconexión");
      this.setOfflineState(true);
    });
  }

  /**
   * Inicia el heartbeat para verificar conexión periódicamente
   */
  startHeartbeat() {
    // Limpiar heartbeat anterior si existe
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
    }

    // Verificar conexión periódicamente
    this.heartbeatInterval = setInterval(async () => {
      await this.verifyConnection();
    }, this.heartbeatFrequency);

    console.log(`💓 Heartbeat iniciado (cada ${this.heartbeatFrequency}ms)`);
  }

  /**
   * Verifica la conexión real haciendo una petición al servidor
   */
  async verifyConnection() {
    // Si no hay navigator.onLine, definitivamente estamos offline
    if (!navigator.onLine) {
      this.setOfflineState(true);
      return false;
    }

    try {
      // Intentar hacer una petición HEAD pequeña al servidor
      const controller = new AbortController();
      const timeoutId = setTimeout(
        () => controller.abort(),
        this.connectionTimeout
      );

      // Usar una petición simple a la raíz de la API o un endpoint de health check
      const response = await fetch(
        API_CONFIG.BASE_URL || "https://apiwebpwa.website",
        {
          method: "HEAD",
          mode: "no-cors", // Para evitar problemas de CORS en el HEAD
          cache: "no-store",
          signal: controller.signal,
        }
      );

      clearTimeout(timeoutId);

      // Si llegamos aquí, hay conexión
      this.setOfflineState(false);
      return true;
    } catch (error) {
      // Error de red = sin conexión real
      console.log("⚠️ Verificación de conexión falló:", error.message);
      this.setOfflineState(true);
      return false;
    }
  }

  /**
   * Establece el estado offline y actualiza UI
   */
  setOfflineState(isOffline) {
    const wasOffline = !this.isOnline;
    this.isOnline = !isOffline;

    // Guardar estado en sessionStorage
    if (isOffline) {
      sessionStorage.setItem("appIsOffline", "true");
    } else {
      sessionStorage.removeItem("appIsOffline");
    }

    // Actualizar UI
    this.applyOfflineUI();

    // Si cambiamos de offline a online, intentar sincronizar
    if (wasOffline && !isOffline) {
      console.log("🔄 Conexión restaurada - iniciando sincronización...");
      this.syncPendingOrders();
    }

    // Log del cambio de estado
    if (wasOffline !== isOffline) {
      console.log(
        isOffline ? "📴 Modo OFFLINE activado" : "🌐 Modo ONLINE activado"
      );
    }
  }

  /**
   * Aplica la UI de offline si corresponde
   */
  applyOfflineUI() {
    const isOffline = !this.isOnline;

    if (isOffline) {
      // Crear o mostrar banner offline
      let indicator = document.getElementById("offlineIndicator");

      if (!indicator) {
        indicator = document.createElement("div");
        indicator.id = "offlineIndicator";
        indicator.style.cssText = `
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 9999;
          background-color: #f59e0b;
          color: white;
          padding: 10px 12px;
          text-align: center;
          font-size: 13px;
          font-weight: 500;
          box-shadow: 0 2px 8px rgba(0,0,0,0.2);
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        `;
        indicator.innerHTML = `
          <i class="fas fa-wifi-slash"></i>
          <span>Modo Offline</span>
          <span style="font-size: 11px; opacity: 0.9;">• Sin conexión a Internet</span>
        `;
        document.body.prepend(indicator);
      }

      // Ajustar navbar si existe
      const navbar = document.querySelector(".mobile-header");
      if (navbar) {
        navbar.style.top = "34px";
        navbar.style.transition = "top 0.3s ease";
      }
    } else {
      // Remover banner offline
      const indicator = document.getElementById("offlineIndicator");
      if (indicator) {
        indicator.remove();
      }

      // Restaurar navbar
      const navbar = document.querySelector(".mobile-header");
      if (navbar) {
        navbar.style.top = "0";
      }
    }
  }

  /**
   * Verifica si hay conexión a internet
   * @returns {boolean} true si hay conexión, false si está offline
   */
  checkOnlineStatus() {
    return navigator.onLine;
  }

  /**
   * Guarda tiendas en caché local (CP-06.1)
   */
  async cacheStores(stores) {
    if (!this.db) await this.initDB();

    const transaction = this.db.transaction(["stores"], "readwrite");
    const store = transaction.objectStore("stores");

    for (const storeData of stores) {
      const cachedStore = {
        ...storeData,
        lastUpdate: Date.now(),
      };
      await store.put(cachedStore);
    }

    console.log(`✅ ${stores.length} tiendas guardadas en caché local`);
  }

  /**
   * Obtiene tiendas desde caché local (CP-06.1)
   */
  async getCachedStores() {
    if (!this.db) await this.initDB();

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(["stores"], "readonly");
      const store = transaction.objectStore("stores");
      const request = store.getAll();

      request.onsuccess = () => {
        console.log(`📦 ${request.result.length} tiendas cargadas desde caché`);
        resolve(request.result);
      };

      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Guarda productos en caché local
   */
  async cacheProducts(products) {
    if (!this.db) {
      console.log("🔄 DB no inicializada, inicializando...");
      await this.initDB();
    }

    if (!products || products.length === 0) {
      console.warn("⚠️ No hay productos para cachear");
      return;
    }

    console.log(`💾 Guardando ${products.length} productos en IndexedDB...`);

    const transaction = this.db.transaction(["products"], "readwrite");
    const store = transaction.objectStore("products");

    let savedCount = 0;
    for (const product of products) {
      const cachedProduct = {
        ...product,
        lastUpdate: Date.now(),
      };
      try {
        await store.put(cachedProduct);
        savedCount++;
      } catch (error) {
        console.error(`❌ Error guardando producto ${product.id}:`, error);
      }
    }

    console.log(
      `✅ ${savedCount}/${products.length} productos guardados en caché local`
    );

    // Verificar que se guardaron
    const verifyTransaction = this.db.transaction(["products"], "readonly");
    const verifyStore = verifyTransaction.objectStore("products");
    const countRequest = verifyStore.count();

    countRequest.onsuccess = () => {
      console.log(`📊 Total productos en IndexedDB: ${countRequest.result}`);
    };
  }

  /**
   * Obtiene productos desde caché local
   */
  async getCachedProducts() {
    if (!this.db) {
      console.log("🔄 DB no inicializada, inicializando...");
      await this.initDB();
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(["products"], "readonly");
      const store = transaction.objectStore("products");
      const request = store.getAll();

      request.onsuccess = () => {
        const products = request.result;
        console.log(`📦 ${products.length} productos cargados desde caché`);

        if (products.length > 0) {
          console.log("🔍 Primer producto:", products[0]);
        } else {
          console.warn(
            "⚠️ No hay productos en caché. ¿Se ejecutó la precarga?"
          );
        }

        resolve(products);
      };

      request.onerror = () => {
        console.error(
          "❌ Error al cargar productos desde caché:",
          request.error
        );
        reject(request.error);
      };
    });
  }

  /**
   * Guarda datos del empleado en caché local
   */
  async cacheEmployee(employeeData) {
    if (!this.db) await this.initDB();

    const transaction = this.db.transaction(["employee"], "readwrite");
    const store = transaction.objectStore("employee");

    const cachedEmployee = {
      ...employeeData,
      lastUpdate: Date.now(),
    };

    return new Promise((resolve, reject) => {
      const request = store.put(cachedEmployee);

      request.onsuccess = () => {
        console.log(
          `✅ Datos del empleado guardados en caché:`,
          employeeData.name || employeeData.email
        );
        resolve(request.result);
      };

      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Obtiene datos del empleado desde caché local
   */
  async getCachedEmployee() {
    if (!this.db) await this.initDB();

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(["employee"], "readonly");
      const store = transaction.objectStore("employee");
      const request = store.getAll();

      request.onsuccess = () => {
        const employees = request.result;
        if (employees.length > 0) {
          console.log(
            `👤 Empleado cargado desde caché:`,
            employees[0].name || employees[0].email
          );
          resolve(employees[0]);
        } else {
          console.log(`⚠️ No hay datos de empleado en caché`);
          resolve(null);
        }
      };

      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Guarda pedido pendiente en modo offline (CP-06.2, CP-08.2, CP-10.1)
   */
  async savePendingOrder(orderData) {
    if (!this.db) await this.initDB();

    const pendingOrder = {
      ...orderData,
      timestamp: Date.now(),
      status: "pending", // pending, syncing, synced, error
      attempts: 0,
      lastError: null,
    };

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(["pendingOrders"], "readwrite");
      const store = transaction.objectStore("pendingOrders");
      const request = store.add(pendingOrder);

      request.onsuccess = () => {
        const localId = request.result;
        console.log(`✅ Pedido guardado localmente con ID: ${localId}`);
        showNotification(
          "Pedido guardado. Se enviará cuando haya conexión",
          "info"
        );
        resolve(localId);
      };

      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Guarda imagen pendiente asociada a pedido offline (CP-9.1, CP-10.1)
   */
  async savePendingImage(localOrderId, imageBase64) {
    if (!this.db) await this.initDB();

    const pendingImage = {
      localOrderId: localOrderId,
      imageBase64: imageBase64,
      timestamp: Date.now(),
      status: "pending",
    };

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(["pendingImages"], "readwrite");
      const store = transaction.objectStore("pendingImages");
      const request = store.put(pendingImage);

      request.onsuccess = () => {
        console.log(
          `✅ Imagen guardada localmente para pedido ${localOrderId}`
        );
        resolve(request.result);
      };

      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Obtiene todos los pedidos pendientes (CP-06.2)
   */
  async getPendingOrders() {
    if (!this.db) await this.initDB();

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(["pendingOrders"], "readonly");
      const store = transaction.objectStore("pendingOrders");
      const index = store.index("status");
      const request = index.getAll("pending");

      request.onsuccess = () => {
        console.log(
          `📋 ${request.result.length} pedidos pendientes de sincronizar`
        );
        resolve(request.result);
      };

      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Sincroniza pedidos pendientes con el servidor (CP-10.1)
   */
  async syncPendingOrders() {
    console.log("🔄 syncPendingOrders() llamado");
    console.log("  - isOnline:", this.isOnline);
    console.log("  - syncInProgress:", this.syncInProgress);

    if (!this.isOnline || this.syncInProgress) {
      console.log(
        "⏸️ Sincronización cancelada: " +
          (!this.isOnline ? "Sin conexión" : "Sincronización en progreso")
      );
      return;
    }

    this.syncInProgress = true;
    console.log("========================================");
    console.log("🚀 INICIANDO SINCRONIZACIÓN DE PEDIDOS");
    console.log("========================================");

    try {
      const pendingOrders = await this.getPendingOrders();
      console.log(`📋 Pedidos pendientes encontrados: ${pendingOrders.length}`);

      if (pendingOrders.length === 0) {
        console.log("✅ No hay pedidos pendientes para sincronizar");
        this.syncInProgress = false;
        return;
      }

      // Verificar que apiFetch esté disponible
      if (typeof apiFetch === "undefined") {
        console.error("❌ apiFetch no está disponible");
        this.syncInProgress = false;
        return;
      }

      console.log("✅ apiFetch disponible");
      console.log("📤 Iniciando envío de pedidos al servidor...");

      showNotification(
        `Sincronizando ${pendingOrders.length} pedido(s) pendiente(s)...`,
        "info"
      );

      let successCount = 0;
      let errorCount = 0;

      for (const order of pendingOrders) {
        try {
          console.log(`📦 Procesando pedido local ID: ${order.localId}`);

          // Actualizar estado a "syncing"
          await this.updateOrderStatus(order.localId, "syncing");

          const orderPayload = {
            courierId: order.courierId,
            storeId: order.storeId,
            items: order.items,
            location: order.location,
          };

          console.log(`📡 Enviando pedido:`, orderPayload);

          // Intentar enviar el pedido al servidor
          const response = await apiFetch(API_CONFIG.ENDPOINTS.ORDERS, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(orderPayload),
          });

          console.log(
            `📡 Respuesta del servidor:`,
            response.status,
            response.ok
          );

          console.log(
            `📡 Respuesta del servidor:`,
            response.status,
            response.ok
          );

          if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            console.error(`❌ Error HTTP ${response.status}:`, errorData);
            throw new Error(
              errorData.message || "Error al crear pedido en servidor"
            );
          }

          const result = await response.json();
          const serverOrderId = result.data?.id || result.id;

          console.log(
            `✅ Pedido local ${order.localId} sincronizado como orden ${serverOrderId}`
          );

          // Verificar si hay imagen pendiente
          const pendingImage = await this.getPendingImage(order.localId);
          if (pendingImage) {
            console.log(
              `📷 Sincronizando imagen para pedido ${serverOrderId}...`
            );
            await this.syncPendingImage(
              serverOrderId,
              pendingImage.imageBase64
            );
          }

          // Marcar como sincronizado
          await this.updateOrderStatus(order.localId, "synced");
          successCount++;
          console.log(`✅ Pedido ${order.localId} marcado como sincronizado`);
        } catch (error) {
          console.error(
            `❌ Error al sincronizar pedido ${order.localId}:`,
            error
          );
          await this.updateOrderStatus(order.localId, "error", error.message);
          errorCount++;
        }
      }

      // Limpiar pedidos sincronizados (opcional)
      await this.cleanSyncedOrders();

      console.log("========================================");
      console.log(`✅ SINCRONIZACIÓN COMPLETADA`);
      console.log(`  - Exitosos: ${successCount}`);
      console.log(`  - Errores: ${errorCount}`);
      console.log("========================================");

      showNotification(
        `Sincronización completada: ${successCount} exitosos, ${errorCount} con error`,
        errorCount > 0 ? "warning" : "success"
      );
    } catch (error) {
      console.error("❌ Error en sincronización:", error);
      showNotification("Error al sincronizar pedidos", "error");
    } finally {
      this.syncInProgress = false;
    }
  }

  /**
   * Sincroniza imagen pendiente con el servidor
   */
  async syncPendingImage(orderId, imageBase64) {
    try {
      const base64Puro = imageBase64.includes("base64,")
        ? imageBase64.split("base64,")[1]
        : imageBase64;

      // Convertir a Blob
      const blob = this.base64ToBlob(base64Puro);
      const formData = new FormData();
      formData.append("file", blob, "estante.jpg");

      const response = await apiFetch(
        `${API_CONFIG.ENDPOINTS.ORDERS}/img/${orderId}`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("Error al subir imagen");
      }

      console.log(`✅ Imagen sincronizada para orden ${orderId}`);
      await this.deletePendingImage(orderId);
    } catch (error) {
      console.error("❌ Error al sincronizar imagen:", error);
      throw error;
    }
  }

  /**
   * Convierte base64 a Blob
   */
  base64ToBlob(base64, mimeType = "image/jpeg") {
    const byteCharacters = atob(base64);
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += 512) {
      const slice = byteCharacters.slice(offset, offset + 512);
      const byteNumbers = new Array(slice.length);

      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }

      byteArrays.push(new Uint8Array(byteNumbers));
    }

    return new Blob(byteArrays, { type: mimeType });
  }

  /**
   * Obtiene imagen pendiente por ID de orden local
   */
  async getPendingImage(localOrderId) {
    if (!this.db) await this.initDB();

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(["pendingImages"], "readonly");
      const store = transaction.objectStore("pendingImages");
      const request = store.get(localOrderId);

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Elimina imagen pendiente
   */
  async deletePendingImage(localOrderId) {
    if (!this.db) await this.initDB();

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(["pendingImages"], "readwrite");
      const store = transaction.objectStore("pendingImages");
      const request = store.delete(localOrderId);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Actualiza estado de pedido pendiente
   */
  async updateOrderStatus(localId, status, errorMessage = null) {
    if (!this.db) await this.initDB();

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(["pendingOrders"], "readwrite");
      const store = transaction.objectStore("pendingOrders");
      const getRequest = store.get(localId);

      getRequest.onsuccess = () => {
        const order = getRequest.result;
        if (order) {
          order.status = status;
          order.attempts = (order.attempts || 0) + 1;
          order.lastError = errorMessage;

          const putRequest = store.put(order);
          putRequest.onsuccess = () => resolve();
          putRequest.onerror = () => reject(putRequest.error);
        } else {
          resolve();
        }
      };

      getRequest.onerror = () => reject(getRequest.error);
    });
  }

  /**
   * Limpia pedidos sincronizados exitosamente
   */
  async cleanSyncedOrders() {
    if (!this.db) await this.initDB();

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(["pendingOrders"], "readwrite");
      const store = transaction.objectStore("pendingOrders");
      const index = store.index("status");
      const request = index.openCursor("synced");

      request.onsuccess = (event) => {
        const cursor = event.target.result;
        if (cursor) {
          cursor.delete();
          cursor.continue();
        } else {
          console.log("🧹 Pedidos sincronizados eliminados");
          resolve();
        }
      };

      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Verifica si hay conexión (helper)
   */
  checkOnlineStatus() {
    return this.isOnline;
  }
}

// Instancia global
window.offlineManager = new OfflineManager();
