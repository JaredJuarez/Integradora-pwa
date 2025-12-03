# TODO - Cliente 🛒

## 📋 Tareas Específicas para el Rol de Cliente

**Responsabilidades**: Navegación del catálogo, compras, gestión de perfil y seguimiento de pedidos  
**Ubicación**: `/pages/cliente/`

---

## 🏠 DASHBOARD DEL CLIENTE

### ✅ Archivo: `cliente-dashboard.html`
- [ ] **Estructura HTML**
  - [ ] Header personalizado con saludo al cliente
  - [ ] Navegación principal (inicio, productos, carrito, perfil)
  - [ ] Layout responsive para móviles
  - [ ] Footer con enlaces útiles

- [ ] **Bienvenida Personalizada**
  - [ ] Saludo con nombre del cliente
  - [ ] Resumen de actividad reciente
  - [ ] Accesos rápidos a funciones principales
  - [ ] Estado de pedidos actuales

- [ ] **Sección de Recomendaciones**
  - [ ] Productos recomendados basados en historial
  - [ ] Productos más vendidos
  - [ ] Ofertas especiales
  - [ ] Nuevos productos

- [ ] **Accesos Rápidos**
  - [ ] Botón: "Ver Catálogo"
  - [ ] Botón: "Mi Carrito"
  - [ ] Botón: "Mis Pedidos"
  - [ ] Botón: "Mi Perfil"
  - [ ] Botón: "Favoritos"

- [ ] **Actividad Reciente**
  - [ ] Últimos productos vistos
  - [ ] Últimas compras realizadas
  - [ ] Estado de pedidos pendientes
  - [ ] Notificaciones importantes

### ✅ JavaScript Específico
- [ ] `cliente-dashboard.js`
  - [ ] Función cargarDatosPersonalizados()
  - [ ] Función mostrarRecomendaciones()
  - [ ] Función cargarActividadReciente()
  - [ ] Función actualizarEstadoPedidos()

---

## 🛍️ CATÁLOGO DE PRODUCTOS

### ✅ Archivo: `productos.html`
- [ ] **Estructura de la Página**
  - [ ] Header con barra de búsqueda prominente
  - [ ] Sidebar con filtros y categorías
  - [ ] Grid principal de productos
  - [ ] Paginación en la parte inferior

- [ ] **Barra de Búsqueda**
  - [ ] Campo de búsqueda por nombre/descripción
  - [ ] Botón de búsqueda avanzada
  - [ ] Autocompletado de sugerencias
  - [ ] Historial de búsquedas recientes

- [ ] **Sistema de Filtros**
  - [ ] Filtro por categoría
  - [ ] Filtro por rango de precio
  - [ ] Filtro por marca
  - [ ] Filtro por disponibilidad
  - [ ] Filtro por calificación
  - [ ] Botón "Limpiar filtros"

- [ ] **Grid de Productos**
  - [ ] Cards de producto con imagen principal
  - [ ] Información: nombre, precio, calificación
  - [ ] Botón "Agregar al carrito"
  - [ ] Botón corazón para favoritos
  - [ ] Indicador de stock disponible
  - [ ] Vista rápida del producto

- [ ] **Opciones de Vista**
  - [ ] Vista grid (3-4 columnas)
  - [ ] Vista lista (información extendida)
  - [ ] Ordenamiento por: precio, nombre, popularidad
  - [ ] Productos por página (12, 24, 48)

### ✅ Vista Detallada del Producto
- [ ] **Modal/Página de Detalle**
  - [ ] Galería de imágenes con zoom
  - [ ] Información detallada del producto
  - [ ] Opciones de cantidad
  - [ ] Botón "Agregar al carrito"
  - [ ] Botón "Agregar a favoritos"
  - [ ] Compartir en redes sociales
  - [ ] Productos relacionados

### ✅ JavaScript Específico
- [ ] `productos.js`
  - [ ] Función cargarProductos()
  - [ ] Función filtrarProductos()
  - [ ] Función buscarProductos()
  - [ ] Función ordenarProductos()
  - [ ] Función verDetalleProducto()
  - [ ] Función agregarAFavoritos()
  - [ ] Función paginarResultados()

---

## 🛒 CARRITO DE COMPRAS

### ✅ Archivo: `carrito.html`
- [ ] **Estructura del Carrito**
  - [ ] Lista de productos en el carrito
  - [ ] Información de cada item (imagen, nombre, precio, cantidad)
  - [ ] Controles de cantidad (+, -, eliminar)
  - [ ] Resumen de totales en sidebar

- [ ] **Items del Carrito**
  - [ ] Imagen miniatura del producto
  - [ ] Nombre y descripción breve
  - [ ] Precio unitario
  - [ ] Selector de cantidad
  - [ ] Subtotal por item
  - [ ] Botón eliminar item

- [ ] **Resumen de Compra**
  - [ ] Subtotal de productos
  - [ ] Costo de envío (si aplica)
  - [ ] Impuestos (si aplica)
  - [ ] Total a pagar
  - [ ] Botón "Proceder al Pago"

- [ ] **Funcionalidades Adicionales**
  - [ ] Carrito persistente (localStorage)
  - [ ] Validación de stock antes del pago
  - [ ] Sugerencias de productos relacionados
  - [ ] Opción "Guardar para después"
  - [ ] Compartir carrito

### ✅ Proceso de Checkout
- [ ] **Información de Envío**
  - [ ] Formulario de dirección de entrega
  - [ ] Validación de campos obligatorios
  - [ ] Opción "Usar dirección del perfil"
  - [ ] Múltiples direcciones guardadas

- [ ] **Método de Pago**
  - [ ] Simulación de métodos de pago
  - [ ] Tarjeta de crédito (formulario básico)
  - [ ] Transferencia bancaria
  - [ ] Pago contra entrega

- [ ] **Confirmación de Pedido**
  - [ ] Resumen final del pedido
  - [ ] Términos y condiciones
  - [ ] Botón confirmar compra
  - [ ] Número de pedido generado

### ✅ JavaScript Específico
- [ ] `carrito.js`
  - [ ] Función agregarAlCarrito()
  - [ ] Función eliminarDelCarrito()
  - [ ] Función actualizarCantidad()
  - [ ] Función calcularTotales()
  - [ ] Función validarStock()
  - [ ] Función procesarPedido()
  - [ ] Función guardarCarrito() (localStorage)
  - [ ] Función cargarCarrito() (localStorage)

---

## 📋 HISTORIAL DE PEDIDOS

### ✅ Archivo: `historial-pedidos.html`
- [ ] **Lista de Pedidos**
  - [ ] Lista cronológica de todos los pedidos
  - [ ] Información: número, fecha, total, estado
  - [ ] Filtros por estado y fecha
  - [ ] Búsqueda por número de pedido

- [ ] **Estados de Pedidos**
  - [ ] Indicadores visuales para cada estado
  - [ ] Estados: Pendiente, Procesando, Enviado, Entregado, Cancelado
  - [ ] Timeline de progreso del pedido
  - [ ] Notificaciones de cambios de estado

- [ ] **Detalle del Pedido**
  - [ ] Modal con información completa
  - [ ] Productos incluidos en el pedido
  - [ ] Información de envío
  - [ ] Método de pago utilizado
  - [ ] Número de seguimiento (si aplica)

- [ ] **Acciones Disponibles**
  - [ ] Recomprar productos del pedido
  - [ ] Cancelar pedido (si está permitido)
  - [ ] Contactar soporte
  - [ ] Calificar productos comprados

### ✅ JavaScript Específico
- [ ] `historial-pedidos.js`
  - [ ] Función cargarPedidos()
  - [ ] Función filtrarPorEstado()
  - [ ] Función verDetallePedido()
  - [ ] Función recomprarPedido()
  - [ ] Función cancelarPedido()

---

## ❤️ LISTA DE FAVORITOS

### ✅ Archivo: `favoritos.html`
- [ ] **Grid de Favoritos**
  - [ ] Vista similar al catálogo de productos
  - [ ] Cards con productos favoritos
  - [ ] Botón "Eliminar de favoritos"
  - [ ] Botón "Agregar al carrito"

- [ ] **Gestión de Favoritos**
  - [ ] Lista persistente de productos favoritos
  - [ ] Organización por categorías
  - [ ] Compartir lista de favoritos
  - [ ] Crear listas temáticas

- [ ] **Funcionalidades Adicionales**
  - [ ] Notificaciones de cambios de precio
  - [ ] Alertas cuando un producto favorito esté en oferta
  - [ ] Disponibilidad de stock de favoritos

### ✅ JavaScript Específico
- [ ] `favoritos.js`
  - [ ] Función cargarFavoritos()
  - [ ] Función eliminarFavorito()
  - [ ] Función agregarAlCarritoDesdeF avoritos()
  - [ ] Función organizarPorCategoria()

---

## 👤 PERFIL PERSONAL

### ✅ Archivo: `perfil.html`
- [ ] **Información Personal**
  - [ ] Formulario editable con datos del usuario
  - [ ] Foto de perfil (opcional)
  - [ ] Información básica: nombre, email, teléfono
  - [ ] Fecha de nacimiento, género (opcional)

- [ ] **Direcciones Guardadas**
  - [ ] Lista de direcciones de entrega
  - [ ] Agregar nueva dirección
  - [ ] Editar direcciones existentes
  - [ ] Marcar dirección como principal

- [ ] **Configuración de Cuenta**
  - [ ] Cambiar contraseña
  - [ ] Configuración de notificaciones
  - [ ] Preferencias de comunicación
  - [ ] Configuración de privacidad

- [ ] **Estadísticas Personales**
  - [ ] Total de pedidos realizados
  - [ ] Monto total de compras
  - [ ] Productos favoritos más frecuentes
  - [ ] Categorías preferidas

### ✅ Cambio de Contraseña
- [ ] **Formulario Seguro**
  - [ ] Contraseña actual
  - [ ] Nueva contraseña
  - [ ] Confirmar nueva contraseña
  - [ ] Validación de fortaleza
  - [ ] Confirmación por email

### ✅ JavaScript Específico
- [ ] `perfil.js`
  - [ ] Función cargarDatosUsuario()
  - [ ] Función actualizarPerfil()
  - [ ] Función cambiarContraseña()
  - [ ] Función gestionarDirecciones()
  - [ ] Función subirFotoPerfil()

---

## 🔔 NOTIFICACIONES

### ✅ Centro de Notificaciones
- [ ] **Tipos de Notificaciones**
  - [ ] Cambios de estado en pedidos
  - [ ] Ofertas y promociones
  - [ ] Productos favoritos en oferta
  - [ ] Recordatorios de carrito abandonado

- [ ] **Gestión de Notificaciones**
  - [ ] Marcar como leído/no leído
  - [ ] Eliminar notificaciones
  - [ ] Configurar frecuencia
  - [ ] Activar/desactivar tipos de notificaciones

### ✅ JavaScript Específico
- [ ] `notificaciones.js`
  - [ ] Función cargarNotificaciones()
  - [ ] Función marcarComoLeida()
  - [ ] Función eliminarNotificacion()
  - [ ] Función configurarPreferencias()

---

## 📱 RESPONSIVE DESIGN

### ✅ Adaptación Móvil
- [ ] **Navegación Móvil**
  - [ ] Menú hamburguesa
  - [ ] Navegación por tabs en la parte inferior
  - [ ] Búsqueda optimizada para móvil
  - [ ] Carrito flotante

- [ ] **UX Móvil Específica**
  - [ ] Scroll infinito en productos
  - [ ] Swipe para navegación en galería
  - [ ] Botones de tamaño táctil adecuado
  - [ ] Loading states optimizados

### ✅ Optimización Touch
- [ ] **Interacciones Táctiles**
  - [ ] Swipe para eliminar items del carrito
  - [ ] Pull-to-refresh en listas
  - [ ] Zoom en imágenes de productos
  - [ ] Tap largo para opciones rápidas

---

## 💾 PERSISTENCIA DE DATOS

### ✅ LocalStorage/SessionStorage
- [ ] **Datos a Persistir**
  - [ ] Carrito de compras
  - [ ] Lista de favoritos
  - [ ] Filtros aplicados
  - [ ] Historial de búsquedas
  - [ ] Preferencias de vista

### ✅ JavaScript Específico
- [ ] `storage.js`
  - [ ] Función guardarEnLocal()
  - [ ] Función cargarDeLocal()
  - [ ] Función limpiarStorage()
  - [ ] Función sincronizarConServidor()

---

## ✅ CRITERIOS DE ACEPTACIÓN

### ✅ Funcionalidad Completa
- [ ] Navegación fluida por el catálogo
- [ ] Proceso de compra completo funcionando
- [ ] Gestión de carrito operativa
- [ ] Perfil editable y funcional
- [ ] Historial de pedidos visible y útil

### ✅ UX/UI Cliente
- [ ] Interfaz intuitiva y amigable
- [ ] Proceso de compra simple (máximo 3 pasos)
- [ ] Búsqueda y filtros efectivos
- [ ] Feedback visual en todas las acciones
- [ ] Carrito persistente entre sesiones

### ✅ Performance
- [ ] Carga rápida de productos (< 2 segundos)
- [ ] Búsqueda instantánea
- [ ] Imágenes optimizadas con lazy loading
- [ ] Navegación sin interrupciones

### ✅ Seguridad Cliente
- [ ] Validación de inputs en formularios
- [ ] Protección de datos personales
- [ ] Sesión segura y logout automático
- [ ] Validación de stock en tiempo real

---

**Progreso del Cliente**: ⏳ 0% Completado  
**Archivos Requeridos**: 6 archivos HTML + JavaScript  
**Tiempo Estimado**: 7-9 días  
**Prioridad**: Alta - Core del negocio