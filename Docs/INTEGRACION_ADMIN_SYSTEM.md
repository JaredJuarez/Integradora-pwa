# Integración del Sistema de Administración

## 📋 Resumen de Cambios

### Sistema Centralizado de Datos Mock

Se ha implementado un sistema centralizado de gestión de datos mock en `assets/js/admin-data.js` que simula el comportamiento de un backend real.

## 🗂️ Archivos Modificados

### 1. **assets/js/admin-data.js** ✨ NUEVO

**Propósito**: Sistema centralizado de mock data con lógica de negocio

**Características principales**:

- Gestión de 3 entidades: Empleados, Tiendas, Productos
- Sistema de IDs auto-incrementales (EMP001, STORE001, PROD001)
- Lógica de frecuencia de visitas basada en fechas
- Integración con localStorage via Storage class
- Validaciones de negocio (ej: no eliminar empleado si tiene tiendas asignadas)

**Funciones clave**:

```javascript
// Empleados
adminDataManager.getAllEmployees();
adminDataManager.addEmployee(data);
adminDataManager.updateEmployee(id, data);
adminDataManager.deleteEmployee(id);

// Tiendas
adminDataManager.getAllStores();
adminDataManager.addStore(data);
adminDataManager.updateStore(id, data);
adminDataManager.deleteStore(id);
adminDataManager.getStoresToVisitToday(employeeId);
adminDataManager.shouldVisitToday(store);
adminDataManager.completeVisit(storeId);

// Productos
adminDataManager.getAllProducts();
adminDataManager.addProduct(data);
adminDataManager.updateProduct(id, data);
adminDataManager.deleteProduct(id);

// Estadísticas
adminDataManager.getAdminStats();
```

**Lógica de visitas**:

```javascript
// Una tienda debe visitarse HOY si:
// 1. (Hoy - ultimaVisita) >= frecuenciaVisita
// 2. O si nunca ha sido visitada (ultimaVisita === null)

shouldVisitToday(store) {
  if (!store.ultimaVisita) return true;
  const lastVisit = new Date(store.ultimaVisita);
  const today = new Date();
  const daysDiff = Math.floor((today - lastVisit) / (1000 * 60 * 60 * 24));
  return daysDiff >= store.frecuenciaVisita;
}
```

---

### 2. **assets/js/employee-data.js** 🔄 REFACTORIZADO

**Cambios**:

- ❌ Eliminadas arrays hardcodeadas: `DEMO_TIENDAS`, `EMPLEADO_RUTAS`, `PRODUCTOS_SURTIR`
- ✅ Integrado con `adminDataManager`
- ✅ Función `getTiendasAsignadasEmpleado()` ahora usa `adminDataManager.getStoresToVisitToday(user.id)`
- ✅ Productos vienen de `adminDataManager.getAllProducts()`
- ✅ Sistema de visitas actualizado con localStorage por empleado

**Nueva estructura de getTiendasAsignadasEmpleado()**:

```javascript
function getTiendasAsignadasEmpleado() {
  const user = getCurrentUser();
  if (!user || user.rol !== 'empleado') return [];

  // Obtener tiendas que se deben visitar HOY
  const storesToVisitToday = adminDataManager.getStoresToVisitToday(user.id);

  // Agregar estado de completado del día actual
  const storage = new Storage();
  const visitStatus = storage.getItem(`visit_status_${user.id}`) || {};
  const today = new Date().toISOString().split('T')[0];

  return storesToVisitToday.map(store => ({
    ...store,
    qrCode: `QR_${store.id}`,
    completada: visitStatus[store.id]?.fecha === today &&
                visitStatus[store.id]?.completada || false,
    estado: /* completada o pendiente */
  }));
}
```

**Flujo de visita**:

1. Empleado llama `getTiendasAsignadasEmpleado()` → Recibe solo tiendas que debe visitar HOY
2. Empleado completa visita → `completeVisit(storeId)` actualiza `ultimaVisita` a hoy
3. Próxima llamada a `shouldVisitToday(store)` devuelve `false` hasta que pasen `frecuenciaVisita` días

---

### 3. **pages/admin/productos-management.html** 🔄 ACTUALIZADO

**Cambios**:

- ✅ Agregado import: `<script src="../../assets/js/admin-data.js"></script>`
- ✅ Función `loadProducts()` usa `adminDataManager.getAllProducts()`
- ✅ Función `showProductModal()` usa adminDataManager para obtener producto
- ✅ Evento submit usa `adminDataManager.addProduct()` o `updateProduct()`
- ✅ Función `deleteProductConfirm()` usa `adminDataManager.deleteProduct()`
- ✅ Categorías dinámicas basadas en productos existentes

**Antes**:

```javascript
const products = getProducts({ search, categoria, sortBy });
saveProduct(productData);
deleteProduct(id);
```

**Después**:

```javascript
const products = adminDataManager.getAllProducts();
adminDataManager.addProduct(productData);
adminDataManager.updateProduct(id, productData);
adminDataManager.deleteProduct(id);
```

---

### 4. **pages/admin/empleados-management.html** ✅ YA INTEGRADO

- Ya tiene `admin-data.js` importado (línea 174)
- Usa `adminDataManager` para CRUD de empleados
- Validación de eliminación si tiene tiendas asignadas

---

### 5. **pages/admin/tiendas-management.html** ✅ YA INTEGRADO

- Ya tiene `admin-data.js` importado (línea 194)
- Usa `adminDataManager` para CRUD de tiendas
- Muestra indicadores visuales de tiendas que necesitan visita HOY
- Asignación de empleados con dropdown dinámico
- Cálculo de próxima visita: `getNextVisitDate(store)`

---

## 🔗 Flujo de Datos

```
┌─────────────────────────────────────────────────────────────┐
│                      ADMIN DASHBOARD                         │
│  (empleados-management / tiendas-management / productos)    │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────┐
│              adminDataManager (admin-data.js)                │
│  • Gestiona Empleados, Tiendas, Productos                   │
│  • Lógica de frecuencia de visitas                          │
│  • Persistencia en localStorage                             │
│  • IDs auto-incrementales                                   │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────┐
│            localStorage (via Storage class)                  │
│  • app_employees: Array de empleados                        │
│  • app_stores: Array de tiendas                             │
│  • app_products: Array de productos                         │
│  • visit_status_${employeeId}: Estado de visitas           │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────┐
│          EMPLOYEE DASHBOARD (employee-data.js)               │
│  • getTiendasAsignadasEmpleado()                            │
│  • Muestra SOLO tiendas que debe visitar HOY                │
│  • Marca visitas como completadas                           │
└─────────────────────────────────────────────────────────────┘
```

---

## 📊 Esquema de Datos

### Empleado

```javascript
{
  id: "EMP001",            // Auto-generado
  nombre: "Juan Pérez",
  email: "juan@example.com",
  telefono: "5551234567",
  activo: true,
  fechaRegistro: "2025-12-04"
}
```

### Tienda

```javascript
{
  id: "STORE001",          // Auto-generado
  nombre: "SuperMercado Centro",
  direccion: "Av. Plan de Ayala #123",
  empleadoAsignado: "EMP001",  // ID del empleado
  frecuenciaVisita: 3,     // Cada cuántos días debe visitarse
  ultimaVisita: "2025-12-01",  // Fecha última visita (YYYY-MM-DD)
  activa: true
}
```

### Producto

```javascript
{
  id: "PROD001",           // Auto-generado
  nombre: "Coca Cola 600ml",
  categoria: "Bebidas",
  precioSugerido: 15.00,
  unidad: "pieza",
  codigoBarras: "7501055300014",
  descripcion: "Refresco de cola 600ml"
}
```

---

## 🎯 Lógica de Negocio Clave

### 1. Cálculo de Visitas por Día

```javascript
// En adminDataManager
getStoresToVisitToday(employeeId) {
  const stores = this.getAllStores()
    .filter(store => store.empleadoAsignado === employeeId && store.activa);

  return stores.filter(store => this.shouldVisitToday(store));
}

shouldVisitToday(store) {
  if (!store.ultimaVisita) return true; // Nunca visitada

  const lastVisit = new Date(store.ultimaVisita);
  const today = new Date();
  const daysDiff = Math.floor((today - lastVisit) / (1000 * 60 * 60 * 24));

  return daysDiff >= store.frecuenciaVisita;
}
```

### 2. Completar Visita

```javascript
completeVisit(storeId) {
  const store = this.getAllStores().find(s => s.id === storeId);
  if (store) {
    store.ultimaVisita = new Date().toISOString().split('T')[0];
    this.storage.setItem('app_stores', this.getAllStores());
  }
}
```

### 3. Validación de Eliminación

```javascript
deleteEmployee(employeeId) {
  // Verificar si tiene tiendas asignadas
  const assignedStores = this.getAllStores()
    .filter(s => s.empleadoAsignado === employeeId);

  if (assignedStores.length > 0) {
    throw new Error(
      `No se puede eliminar. Tiene ${assignedStores.length} tienda(s) asignada(s)`
    );
  }

  // Proceder con eliminación
  // ...
}
```

---

## 🚀 Próximos Pasos

### Pendientes:

1. ✅ **employee-data.js**: Integrado con adminDataManager
2. ✅ **productos-management.html**: Actualizado para usar adminDataManager
3. ⏳ **Dashboard empleado**: Actualizar para mostrar tiendas con nueva lógica
4. ⏳ **Admin dashboard**: Página de overview con estadísticas
5. ⏳ **Service Worker**: Actualizar cache para nuevos archivos

### Mejoras Futuras:

- Agregar campo `unidad` y `codigoBarras` al formulario de productos
- Sistema de notificaciones toast en lugar de `alert()`
- Validación de códigos de barras únicos
- Exportar/Importar datos (JSON)
- Historial de visitas con gráficas
- Reportes por empleado/tienda/periodo

---

## 🧪 Testing

### Para probar el sistema:

1. **Admin - Crear Empleado**:

   - Ir a `/pages/admin/empleados-management.html`
   - Crear empleado "Juan Pérez"
   - ID auto-generado: `EMP001`

2. **Admin - Crear Tienda**:

   - Ir a `/pages/admin/tiendas-management.html`
   - Crear tienda "SuperMercado Centro"
   - Asignar a "Juan Pérez" (EMP001)
   - Frecuencia: 3 días
   - ID auto-generado: `STORE001`

3. **Admin - Crear Productos**:

   - Ir a `/pages/admin/productos-management.html`
   - Crear varios productos
   - IDs auto-generados: `PROD001`, `PROD002`, etc.

4. **Empleado - Ver Tiendas Asignadas**:

   - Login como empleado (email vinculado a EMP001)
   - Dashboard empleado debe mostrar SOLO "SuperMercado Centro" si:
     - Nunca ha sido visitada (ultimaVisita === null)
     - O han pasado 3+ días desde ultimaVisita

5. **Empleado - Completar Visita**:
   - Visitar tienda
   - Completar visita → actualiza `ultimaVisita` a hoy
   - Refrescar dashboard → tienda ya NO aparece
   - Esperar 3 días o cambiar fecha en localStorage → tienda vuelve a aparecer

---

## 📝 Notas Técnicas

### Formato de Fechas

- Todas las fechas se guardan como strings `YYYY-MM-DD`
- Conversión: `new Date().toISOString().split('T')[0]`

### IDs Auto-incrementales

```javascript
_getNextId(prefix, items) {
  if (items.length === 0) return `${prefix}001`;

  const lastId = items[items.length - 1].id;
  const num = parseInt(lastId.replace(prefix, '')) + 1;
  return `${prefix}${String(num).padStart(3, '0')}`;
}
```

### Storage Keys

- `app_employees`: Array de empleados
- `app_stores`: Array de tiendas
- `app_products`: Array de productos
- `visit_status_${employeeId}`: Estado de visitas por empleado

---

## ✅ Checklist de Integración

- [x] Crear admin-data.js con AdminDataManager class
- [x] Implementar CRUD para Empleados
- [x] Implementar CRUD para Tiendas
- [x] Implementar CRUD para Productos
- [x] Implementar lógica de frecuencia de visitas
- [x] Refactorizar employee-data.js
- [x] Actualizar productos-management.html
- [x] Verificar empleados-management.html
- [x] Verificar tiendas-management.html
- [ ] Actualizar dashboard empleado
- [ ] Crear admin dashboard overview
- [ ] Actualizar service worker
- [ ] Testing end-to-end

---

**Fecha de última actualización**: 2025-12-04  
**Estado**: ✅ Sistema de mock data centralizado funcionando
