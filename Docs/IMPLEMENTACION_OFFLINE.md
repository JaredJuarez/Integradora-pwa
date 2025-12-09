# Implementación de Funcionalidad Offline - Módulo Empleado

## ✅ Archivos Creados

### 1. `assets/js/offline-manager.js`

**Gestor principal de funcionalidad offline**

**Características:**

- ✅ IndexedDB para almacenamiento local
- ✅ Caché de tiendas y productos (CP-06.1)
- ✅ Queue de pedidos pendientes (CP-06.2, CP-08.2, CP-10.1)
- ✅ Almacenamiento de imágenes offline (CP-9.1)
- ✅ Sincronización automática al recuperar conexión
- ✅ Indicador visual de estado offline (CP-06.3, CP-07.3, CP-08.3, CP-09.4, CP-10.2)

**Stores IndexedDB creados:**

- `stores` - Caché de tiendas asignadas
- `products` - Caché de productos activos
- `pendingOrders` - Cola de pedidos offline
- `pendingImages` - Imágenes pendientes de subir

---

## 🔧 Cambios Necesarios en Archivos Existentes

### 1. **API_BASE.js** ✅ YA MODIFICADO

```javascript
// Detecta FormData automáticamente
// No envía Content-Type para multipart/form-data
```

### 2. **Todas las páginas de empleado** (dashboard.html, qr-scanner.html, productos-visita.html, camara-estante.html)

**Agregar en el `<head>` ANTES de app.js:**

```html
<script src="../../assets/js/offline-manager.js"></script>
```

---

## 📋 Cambios por Página

### **A. dashboard.html** - CP-06.1, CP-06.2, CP-06.3

**Modificar función `initDashboard()`:**

```javascript
async function initDashboard() {
  empleadoActual = getCurrentUser();

  try {
    showLoader();

    // CP-06.3: Verificar si hay conexión
    if (!offlineManager.checkOnlineStatus()) {
      console.log("📴 Modo offline: Cargando tiendas desde caché...");
      showNotification("Mostrando datos almacenados (modo offline)", "warning");

      // CP-06.1: Cargar desde caché local
      tiendas = await offlineManager.getCachedStores();

      // CP-06.2: Obtener pedidos pendientes para mostrar badge
      const pendingOrders = await offlineManager.getPendingOrders();
      if (pendingOrders.length > 0) {
        showNotification(
          `Tienes ${pendingOrders.length} pedido(s) pendiente(s) de sincronizar`,
          "info"
        );
      }
    } else {
      // Con conexión: Obtener desde API
      const response = await apiFetch(API_CONFIG.ENDPOINTS.STORES_COURIER, {
        method: "GET",
      });

      if (!response.ok) {
        throw new Error("Error al cargar tiendas");
      }

      const result = await response.json();
      tiendas = result.data;

      // CP-06.1: Guardar en caché para uso offline
      await offlineManager.cacheStores(tiendas);
      console.log("✅ Tiendas guardadas en caché local");
    }

    hideLoader();
    cargarTiendas();
  } catch (error) {
    hideLoader();
    console.error("Error al cargar tiendas:", error);

    // Intentar cargar desde caché como fallback
    try {
      tiendas = await offlineManager.getCachedStores();
      if (tiendas.length > 0) {
        cargarTiendas();
        showNotification("Mostrando datos almacenados", "warning");
      } else {
        showNotification("No hay datos disponibles offline", "error");
      }
    } catch (cacheError) {
      showNotification("Error al cargar datos: " + error.message, "error");
    }
  }
}
```

**Agregar badge de pedidos pendientes en el HTML:**

```html
<!-- Agregar dentro del header -->
<button
  onclick="mostrarPedidosPendientes()"
  id="btnPendientes"
  class="relative p-2 text-gray-600 hover:text-gray-800 hidden"
>
  <i class="fas fa-clock text-xl"></i>
  <span
    id="badgePendientes"
    class="absolute -top-1 -right-1 bg-yellow-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center"
  >
    0
  </span>
</button>
```

**Agregar función para mostrar pedidos pendientes:**

```javascript
async function mostrarPedidosPendientes() {
  const pendingOrders = await offlineManager.getPendingOrders();

  if (pendingOrders.length === 0) {
    showNotification("No hay pedidos pendientes", "info");
    return;
  }

  const mensaje = pendingOrders
    .map(
      (order, index) =>
        `${index + 1}. Tienda ID: ${order.storeId} - ${
          order.items.length
        } producto(s)`
    )
    .join("\\n");

  alert(`Pedidos pendientes de sincronizar:\\n\\n${mensaje}`);
}
```

---

### **B. qr-scanner.html** - CP-07.1, CP-07.2, CP-07.3

**Sin cambios mayores en lógica**

- El QR validation funciona sin conexión (solo compara IDs)
- CP-07.3: El indicador offline se muestra automáticamente

**Opcional: Agregar mensaje informativo**

```javascript
async function initQRScanner() {
  // ... código existente ...

  // CP-07.3: Notificar si está offline
  if (!offlineManager.checkOnlineStatus()) {
    showNotification("Modo offline: El escaneo funciona sin conexión", "info");
  }
}
```

---

### **C. productos-visita.html** - CP-08.1, CP-08.2, CP-08.3

**Modificar función `initProductos()`:**

```javascript
async function initProductos() {
  empleadoActual = getCurrentUser();
  const tiendaId = sessionStorage.getItem("tiendaEnVisita");

  if (!tiendaId) {
    showNotification("No hay una visita activa", "error");
    setTimeout(() => {
      window.location.href = "./dashboard.html";
    }, 2000);
    return;
  }

  try {
    showLoader();

    // CP-08.3: Verificar conexión
    const isOnline = offlineManager.checkOnlineStatus();

    if (!isOnline) {
      showNotification("Modo offline: Usando datos almacenados", "warning");
    }

    // Obtener tienda (desde API o caché)
    if (isOnline) {
      const storeResponse = await apiFetch(
        API_CONFIG.ENDPOINTS.STORE_BY_ID(tiendaId),
        { method: "GET" }
      );

      if (!storeResponse.ok) {
        throw new Error("Error al cargar la tienda");
      }

      const storeResult = await storeResponse.json();
      tiendaActual = storeResult.data;
    } else {
      // Cargar desde caché
      const cachedStores = await offlineManager.getCachedStores();
      tiendaActual = cachedStores.find((s) => s.id == tiendaId);

      if (!tiendaActual) {
        throw new Error("Tienda no disponible offline");
      }
    }

    // Obtener productos (desde API o caché)
    if (isOnline) {
      const productsResponse = await apiFetch(API_CONFIG.ENDPOINTS.PRODUCTS, {
        method: "GET",
      });

      if (!productsResponse.ok) {
        throw new Error("Error al cargar productos");
      }

      const productsResult = await productsResponse.json();
      productos = productsResult.data.filter((p) => p.active);

      // Guardar en caché
      await offlineManager.cacheProducts(productos);
    } else {
      // CP-08.1: Cargar desde caché
      productos = await offlineManager.getCachedProducts();
      productos = productos.filter((p) => p.active);
    }

    hideLoader();

    // Actualizar UI
    document.getElementById("nombreTienda").textContent = tiendaActual.name;
    document.getElementById("tiendaNombre").textContent = tiendaActual.name;

    cargarProductos();
  } catch (error) {
    hideLoader();
    console.error("Error al inicializar:", error);
    showNotification("Error al cargar datos: " + error.message, "error");

    setTimeout(() => {
      window.location.href = "./dashboard.html";
    }, 2000);
  }
}
```

**Modificar función `guardarDatosYContinuar()`:**

```javascript
async function guardarDatosYContinuar() {
  const courierId = tiendaActual.assignedCourier?.id;

  if (!courierId) {
    showNotification("Error: No se pudo identificar al empleado", "error");
    return;
  }

  try {
    showLoader();

    // Obtener ubicación
    let location = "0,0";
    try {
      const position = await obtenerUbicacion();
      location = `${position.coords.latitude},${position.coords.longitude}`;
    } catch (geoError) {
      console.warn("⚠️ No se pudo obtener ubicación:", geoError.message);
    }

    // Preparar items
    const items = Object.values(productosSeleccionados).map((item) => ({
      productId: item.producto.id,
      quantity: item.cantidad,
    }));

    // CP-08.2: Verificar conexión
    const isOnline = offlineManager.checkOnlineStatus();

    if (isOnline) {
      // CON CONEXIÓN: Crear pedido normalmente
      const orderData = {
        courierId: parseInt(courierId),
        storeId: parseInt(tiendaActual.id),
        items: items,
        location: location,
      };

      const response = await apiFetch(API_CONFIG.ENDPOINTS.ORDERS, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      });

      hideLoader();

      if (!response.ok) {
        throw new Error("Error al crear el pedido");
      }

      const result = await response.json();
      const orderId = result.data?.id || result.id;

      // Guardar datos para siguiente pantalla
      const datosVisita = {
        orderId: orderId,
        tiendaId: parseInt(tiendaActual.id),
        tiendaNombre: tiendaActual.name,
        empleadoId: courierId,
        productos: Object.values(productosSeleccionados).map((item) => ({
          id: item.producto.id,
          nombre: item.producto.name,
          cantidad: item.cantidad,
        })),
      };

      sessionStorage.setItem("datosVisitaActual", JSON.stringify(datosVisita));
      window.location.href = "./camara-estante.html";
    } else {
      // SIN CONEXIÓN: Guardar pedido offline (CP-08.2, CP-10.1)
      hideLoader();

      const orderData = {
        courierId: parseInt(courierId),
        storeId: parseInt(tiendaActual.id),
        items: items,
        location: location,
      };

      // Guardar en IndexedDB
      const localId = await offlineManager.savePendingOrder(orderData);

      // Guardar datos para siguiente pantalla (con localId)
      const datosVisita = {
        localOrderId: localId, // ID local, no de servidor
        isOffline: true,
        tiendaId: parseInt(tiendaActual.id),
        tiendaNombre: tiendaActual.name,
        empleadoId: courierId,
        productos: Object.values(productosSeleccionados).map((item) => ({
          id: item.producto.id,
          nombre: item.producto.name,
          cantidad: item.cantidad,
        })),
      };

      sessionStorage.setItem("datosVisitaActual", JSON.stringify(datosVisita));
      window.location.href = "./camara-estante.html";
    }
  } catch (error) {
    hideLoader();
    console.error("❌ Error:", error);
    showNotification("Error al guardar pedido: " + error.message, "error");
  }
}
```

---

### **D. camara-estante.html** - CP-9.1, CP-9.2, CP-9.3, CP-09.4, CP-10.1

**Modificar función `confirmarFinalizacion()`:**

```javascript
async function confirmarFinalizacion() {
  // CP-9.2: Validar que haya foto
  if (!fotoCapturada) {
    showNotification("Debes tomar una foto primero", "error");
    return;
  }

  try {
    showLoader();

    const datosVisita = JSON.parse(sessionStorage.getItem("datosVisitaActual"));

    // CP-09.4: Verificar conexión
    const isOnline = offlineManager.checkOnlineStatus();

    if (datosVisita.isOffline || !isOnline) {
      // MODO OFFLINE: Guardar imagen localmente (CP-9.1, CP-10.1)
      hideLoader();

      const localOrderId = datosVisita.localOrderId;

      if (!localOrderId) {
        showNotification(
          "Error: No se encontró el ID local del pedido",
          "error"
        );
        return;
      }

      // Guardar imagen en IndexedDB asociada al pedido local
      await offlineManager.savePendingImage(localOrderId, fotoCapturada);

      // Cerrar modal
      document.getElementById("modalConfirmacion").classList.add("hidden");

      // Limpiar sesión
      sessionStorage.removeItem("tiendaEnVisita");
      sessionStorage.removeItem("datosVisitaActual");
      sessionStorage.removeItem("tiendaAVisitar");

      showNotification(
        "Pedido guardado localmente. Se sincronizará cuando haya conexión.",
        "success"
      );

      // Redirigir al dashboard
      setTimeout(() => {
        window.location.href = "./dashboard.html";
      }, 2000);
    } else {
      // CON CONEXIÓN: Subir imagen normalmente
      const orderId = datosVisita.orderId;

      if (!orderId) {
        hideLoader();
        showNotification("Error: No se encontró el ID del pedido", "error");
        return;
      }

      // Extraer base64 puro
      const base64Puro = extraerBase64Puro(fotoCapturada);
      const blob = base64ToBlob(base64Puro);

      // Crear FormData
      const formData = new FormData();
      formData.append("file", blob, "estante.jpg");

      // Subir imagen
      const response = await apiFetch(
        `${API_CONFIG.ENDPOINTS.ORDERS}/img/${orderId}`,
        {
          method: "POST",
          body: formData,
        }
      );

      hideLoader();

      if (!response.ok) {
        throw new Error("Error al subir imagen");
      }

      // Cerrar modal
      document.getElementById("modalConfirmacion").classList.add("hidden");

      // Limpiar sesión
      sessionStorage.removeItem("tiendaEnVisita");
      sessionStorage.removeItem("datosVisitaActual");
      sessionStorage.removeItem("tiendaAVisitar");

      showNotification("¡Visita completada exitosamente!", "success");

      // Redirigir al dashboard
      setTimeout(() => {
        window.location.href = "./dashboard.html";
      }, 2000);
    }
  } catch (error) {
    hideLoader();
    console.error("❌ Error al enviar pedido:", error);
    showNotification("Error al enviar pedido: " + error.message, "error");
    document.getElementById("modalConfirmacion").classList.add("hidden");
  }
}
```

**Modificar función `iniciarCamaraReal()` para CP-9.3:**

```javascript
async function iniciarCamaraReal() {
  try {
    console.log("📷 Solicitando permisos de cámara...");

    const constraints = {
      video: {
        facingMode: usarCamaraFrontal ? "user" : "environment",
        width: { ideal: 1920 },
        height: { ideal: 1080 },
      },
    };

    stream = await navigator.mediaDevices.getUserMedia(constraints);

    // ... resto del código existente ...
  } catch (error) {
    console.error("❌ Error al iniciar cámara:", error);

    // CP-9.3: Mensaje específico para error de permisos
    let errorMessage = "Error al acceder a la cámara: " + error.message;

    if (
      error.name === "NotAllowedError" ||
      error.name === "PermissionDeniedError"
    ) {
      errorMessage =
        "Permiso de cámara denegado. Por favor, habilita el acceso a la cámara en la configuración de tu navegador.";
    } else if (error.name === "NotFoundError") {
      errorMessage = "No se encontró ninguna cámara en tu dispositivo.";
    }

    showNotification(errorMessage, "error");

    document.getElementById("cameraView").innerHTML = `
      <div class="text-white text-center p-6">
        <i class="fas fa-exclamation-triangle text-4xl mb-3 text-red-400"></i>
        <p class="text-sm mb-2">No se pudo acceder a la cámara</p>
        <p class="text-xs opacity-75">${errorMessage}</p>
        <button onclick="iniciarCamaraReal()" class="mt-4 bg-white text-gray-800 px-4 py-2 rounded-lg text-sm">
          Reintentar
        </button>
      </div>
    `;
  }
}
```

---

## 🎯 Resumen de Casos de Prueba Cubiertos

### ✅ CP-06: Dashboard Offline

- **CP-06.1**: Caché local de tiendas → `offlineManager.cacheStores()` / `getCachedStores()`
- **CP-06.2**: Badge con pedidos pendientes → `getPendingOrders()`
- **CP-06.3**: Indicador visual offline → Banner amarillo automático

### ✅ CP-07: QR Scanner Offline

- **CP-07.1**: Validación local (sin cambios, ya funciona)
- **CP-07.2**: QR inválido (sin cambios, ya funciona)
- **CP-07.3**: Notificación offline → Indicador automático

### ✅ CP-08: Productos Offline

- **CP-08.1**: Caché de productos → `cacheProducts()` / `getCachedProducts()`
- **CP-08.2**: Guardar pedido offline → `savePendingOrder()`
- **CP-08.3**: Notificación offline → Indicador automático

### ✅ CP-09: Cámara Offline

- **CP-9.1**: Captura funciona sin conexión (cámara es local)
- **CP-9.2**: Validación de foto obligatoria
- **CP-9.3**: Error permisos cámara → Mensaje específico
- **CP-09.4**: Notificación offline → Indicador automático

### ✅ CP-10: Sincronización

- **CP-10.1**: Almacenamiento local → IndexedDB con `pendingOrders` y `pendingImages`
- **CP-10.2**: Notificación offline → Indicador automático
- **Sincronización automática**: Al recuperar conexión → `syncPendingOrders()`

---

## 🚀 Próximos Pasos

1. ✅ **offline-manager.js creado**
2. ⏳ **Agregar `<script>` en todas las páginas de empleado**
3. ⏳ **Modificar funciones según código anterior**
4. ⏳ **Probar flujo completo offline**
5. ⏳ **Verificar sincronización automática**

---

## 🧪 Cómo Probar

1. **Simular Offline en DevTools**:

   - F12 → Network → Throttling → Offline

2. **Flujo de Prueba**:

   ```
   1. Login (online) ✅
   2. Ver dashboard (carga desde API + guarda caché) ✅
   3. Activar modo offline ⚠️
   4. Recargar dashboard (carga desde caché) ✅
   5. Seleccionar tienda
   6. Escanear QR (funciona offline) ✅
   7. Seleccionar productos (desde caché) ✅
   8. Crear pedido (guarda en IndexedDB) ✅
   9. Tomar foto (guarda en IndexedDB) ✅
   10. Ver dashboard (muestra badge de pendientes) ⏳
   11. Restaurar conexión 🌐
   12. Sincronización automática ✅
   ```

3. **Verificar IndexedDB**:
   - F12 → Application → Storage → IndexedDB → PWA_Sistema_DB
   - Revisar stores: `pendingOrders`, `pendingImages`, `stores`, `products`

---

## ⚠️ Notas Importantes

- El **login SIEMPRE requiere conexión** (según requisitos)
- Los pedidos se sincronizan automáticamente al recuperar conexión
- Las imágenes se sincronizan después de cada pedido exitoso
- El indicador offline aparece automáticamente en todas las páginas
- Los datos en caché NO expiran (persisten hasta limpiar navegador)
