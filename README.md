# PWA Sistema de Gestión 🚀

Progressive Web App desarrollada con **HTML5**, **JavaScript Vanilla** y **Tailwind CSS** para la gestión de un sistema con tres roles de usuario: Administrador, Cliente y Empleado.

## 📋 Características

- ✅ **Progressive Web App** - Instalable y funciona offline
- ✅ **3 Roles de Usuario** - Administrador, Cliente, Empleado
- ✅ **Responsive Design** - Optimizado para móvil, tablet y desktop
- ✅ **Service Workers** - Funcionalidad offline
- ✅ **LocalStorage** - Persistencia de datos en el navegador
- ✅ **Sin frameworks** - JavaScript Vanilla puro
- ✅ **Tailwind CSS** - Estilos modernos y responsivos
- ✅ **Chart.js** - Visualización de datos

## 🛠️ Tecnologías Utilizadas

- HTML5
- CSS3 / Tailwind CSS v4 (CDN)
- JavaScript Vanilla (ES6+)
- Service Workers
- Web App Manifest
- LocalStorage API
- Chart.js
- Font Awesome 6.4.0

## 📁 Estructura del Proyecto

```
Integradora-pwa/
├── index.html              # Página principal/landing
├── manifest.json           # Configuración PWA
├── sw.js                   # Service Worker
├── assets/
│   ├── css/
│   │   └── styles.css      # Estilos personalizados
│   ├── js/
│   │   ├── app.js          # Lógica principal de la app
│   │   ├── auth.js         # Sistema de autenticación
│   │   ├── data.js         # Datos de demostración
│   │   └── utils.js        # Funciones de utilidad
│   └── images/
│       └── icons/          # Iconos PWA (pendiente)
├── components/
│   └── components.js       # Componentes reutilizables
├── pages/
│   ├── auth/
│   │   ├── login.html      # Inicio de sesión
│   │   └── registro.html   # Registro de usuarios
│   ├── admin/
│   │   ├── dashboard.html              # Dashboard administrativo
│   │   ├── productos-management.html   # Gestión de productos
│   │   ├── usuarios-management.html    # (Pendiente)
│   │   ├── empleados-management.html   # (Pendiente)
│   │   ├── reportes.html               # (Pendiente)
│   │   └── configuracion.html          # (Pendiente)
│   ├── cliente/
│   │   ├── dashboard.html          # Dashboard del cliente
│   │   ├── productos.html          # Catálogo de productos
│   │   ├── carrito.html            # Carrito de compras
│   │   ├── historial-pedidos.html  # (Pendiente)
│   │   ├── perfil.html             # (Pendiente)
│   │   └── favoritos.html          # (Pendiente)
│   └── empleado/
│       ├── dashboard.html          # Dashboard del empleado
│       ├── inventario.html         # (Pendiente)
│       ├── ventas.html             # (Pendiente)
│       ├── atencion-cliente.html   # (Pendiente)
│       └── reportes-ventas.html    # (Pendiente)
└── Docs/                   # Documentación del proyecto
```

## 🚀 Instalación y Uso

### 1. Clonar o descargar el proyecto

```bash
# No requiere instalación de dependencias, todo es mediante CDN
```

### 2. Abrir con un servidor local

**Opción 1 - Live Server (VS Code):**
- Instala la extensión "Live Server" en VS Code
- Click derecho en `index.html` → "Open with Live Server"

**Opción 2 - Python:**
```bash
# Python 3
python -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000
```

**Opción 3 - Node.js:**
```bash
npx http-server -p 8000
```

### 3. Acceder a la aplicación

Abre tu navegador en: `http://localhost:8000`

## 👥 Usuarios de Demostración

### Administrador
- **Email:** admin@pwa.com
- **Contraseña:** Admin123
- **Rol:** Administrador

### Cliente
- **Email:** cliente@pwa.com
- **Contraseña:** Cliente123
- **Rol:** Cliente

### Empleado
- **Email:** empleado@pwa.com
- **Contraseña:** Empleado123
- **Rol:** Empleado

## 📱 Funcionalidades por Rol

### 🔐 Administrador
- ✅ Dashboard con estadísticas y gráficas
- ✅ Gestión completa de productos (CRUD)
- ⏳ Gestión de usuarios
- ⏳ Gestión de empleados
- ⏳ Reportes y análisis
- ⏳ Configuración del sistema

### 🛒 Cliente
- ✅ Dashboard personalizado
- ✅ Catálogo de productos con filtros
- ✅ Carrito de compras
- ✅ Agregar/eliminar productos del carrito
- ⏳ Historial de pedidos
- ⏳ Lista de favoritos
- ⏳ Perfil de usuario

### 👔 Empleado
- ✅ Dashboard con métricas
- ✅ Alertas de inventario bajo
- ✅ Gestión de pedidos pendientes
- ⏳ Control de inventario
- ⏳ Registro de ventas
- ⏳ Atención al cliente
- ⏳ Reportes de ventas

## 🔧 Funcionalidades Técnicas

### Service Worker
- Cache de archivos estáticos
- Estrategia Network First con fallback a Cache
- Sincronización en background
- Soporte para notificaciones push

### LocalStorage
- Persistencia de sesión de usuario
- Carrito de compras
- Lista de favoritos
- Datos de productos y pedidos

### Componentes Reutilizables
- Header con navegación y menú de usuario
- Sidebar dinámico según rol
- Sistema de notificaciones toast
- Modales personalizables
- Confirmaciones de acciones

### Utilidades
- Validaciones (email, password, teléfono)
- Formateo (moneda, fechas, texto)
- Manejo de LocalStorage
- Funciones de arrays
- Debounce y throttle
- Generadores de IDs

## 📊 Datos de Demostración

La aplicación incluye datos de demostración precargados:
- 3 usuarios (1 admin, 1 cliente, 1 empleado)
- 10 productos en diferentes categorías
- 2 pedidos de ejemplo
- 8 categorías de productos

## 🌐 PWA Features

### Instalación
- Botón de instalación en la página principal
- Funciona como app nativa una vez instalada
- Icono en el escritorio/pantalla de inicio

### Offline
- Funciona sin conexión a internet
- Cache de páginas y recursos
- Indicador visual de estado offline

### Notificaciones
- Soporte para notificaciones push
- Alertas de estado de pedidos
- Notificaciones de stock bajo

## 🎨 Personalización

### Colores (en `styles.css`)
```css
:root {
    --primary-color: #4F46E5;
    --secondary-color: #10B981;
    --danger-color: #EF4444;
    --warning-color: #F59E0B;
}
```

### Configuración PWA (en `manifest.json`)
```json
{
  "name": "PWA Sistema de Gestión",
  "short_name": "PWA Sistema",
  "theme_color": "#4F46E5",
  "background_color": "#ffffff"
}
```

## 📝 Próximas Mejoras

### Fase Pendiente - Páginas Faltantes
- [ ] Gestión de usuarios (admin)
- [ ] Gestión de empleados (admin)
- [ ] Reportes completos (admin)
- [ ] Configuración del sistema (admin)
- [ ] Historial de pedidos (cliente)
- [ ] Perfil de usuario (cliente)
- [ ] Lista de favoritos (cliente)
- [ ] Gestión de inventario (empleado)
- [ ] Registro de ventas (empleado)
- [ ] Atención al cliente (empleado)
- [ ] Reportes de ventas (empleado)

### Optimizaciones PWA
- [ ] Generar iconos PWA en todos los tamaños
- [ ] Mejorar estrategias de cache
- [ ] Implementar sincronización background
- [ ] Pruebas exhaustivas offline
- [ ] Optimización de rendimiento

### Features Adicionales
- [ ] Integración con backend real
- [ ] Pagos en línea
- [ ] Notificaciones push reales
- [ ] Modo oscuro
- [ ] Múltiples idiomas
- [ ] Exportación de reportes (PDF/Excel)
- [ ] Chat de soporte
- [ ] Sistema de calificaciones

## 🐛 Debugging

### Errores Comunes

**1. Service Worker no se registra:**
- Verificar que estés usando HTTPS o localhost
- Revisar la consola del navegador

**2. LocalStorage no persiste:**
- Verificar configuración de privacidad del navegador
- No usar modo incógnito para pruebas

**3. Los estilos no se cargan:**
- Verificar conexión a internet (CDN de Tailwind)
- Revisar rutas de archivos CSS

## 📄 Licencia

Este proyecto es de código abierto y está disponible para fines educativos.

## 👨‍💻 Autor

Proyecto desarrollado como parte de la Integradora - UTEZ

---

## 📞 Soporte

Para reportar bugs o sugerir mejoras, por favor consulta con tu instructor.

¡Gracias por usar PWA Sistema de Gestión! 🎉
