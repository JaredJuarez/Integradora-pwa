# 🚀 Instrucciones de Prueba - PWA Sistema

## ✅ Correcciones Realizadas

### Problemas Solucionados:
1. ✅ **Loader agregado** - El elemento loader estaba faltando en login.html y registro.html
2. ✅ **Orden de scripts corregido** - app.js ahora se carga ANTES de auth.js en todas las páginas
3. ✅ **Rutas corregidas** - Cambiadas de absolutas a relativas para funcionar en cualquier servidor
4. ✅ **Manejo de errores mejorado** - Funciones auxiliares seguras con fallbacks
5. ✅ **Layout CSS arreglado** - Clases flex corregidas en los dashboards
6. ✅ **Debugging agregado** - Console.log para rastrear el flujo del login

## 🧪 Cómo Probar

### 1. Abrir con Servidor Local

**Opción A - Live Server (Recomendado):**
- Abre VS Code
- Click derecho en `index.html`
- Selecciona "Open with Live Server"
- O presiona `Alt + L` + `Alt + O`

**Opción B - Python:**
```powershell
# En la carpeta del proyecto:
python -m http.server 8000
# Luego abre: http://localhost:8000
```

**Opción C - Node.js:**
```powershell
npx http-server -p 8000
# Luego abre: http://localhost:8000
```

### 2. Probar el Login

1. **Ve a la página de login:**
   - Desde index.html → Click en "Iniciar Sesión"
   - O directo: `http://localhost:XXXX/pages/auth/login.html`

2. **Usa uno de estos usuarios de prueba:**

   **👨‍💼 ADMINISTRADOR:**
   - Email: `admin@pwa.com`
   - Password: `Admin123`
   - Click en el botón morado "Admin" o ingresa manualmente

   **🛒 CLIENTE:**
   - Email: `cliente@pwa.com`
   - Password: `Cliente123`
   - Click en el botón azul "Cliente" o ingresa manualmente

   **👔 EMPLEADO:**
   - Email: `empleado@pwa.com`
   - Password: `Empleado123`
   - Click en el botón verde "Empleado" o ingresa manualmente

3. **Click en "Iniciar Sesión"**
   - Deberías ver el loader (spinner)
   - Luego una notificación de bienvenida
   - Y ser redirigido al dashboard correspondiente

### 3. Verificar Funcionalidad

**Dashboard Administrador:**
- ✅ Ver estadísticas (Ventas, Pedidos, Productos, Usuarios)
- ✅ Gráficas de ventas (Chart.js)
- ✅ Tabla de pedidos recientes
- ✅ Navegar a "Productos" desde el sidebar
- ✅ Crear, editar y eliminar productos

**Dashboard Cliente:**
- ✅ Ver tus estadísticas (pedidos, carrito, favoritos)
- ✅ Ver productos destacados
- ✅ Navegar a "Productos"
- ✅ Agregar productos al carrito
- ✅ Ver y modificar el carrito
- ✅ Hacer un pedido (checkout)

**Dashboard Empleado:**
- ✅ Ver métricas operativas
- ✅ Alertas de productos bajo stock
- ✅ Procesar pedidos pendientes

### 4. Verificar en la Consola

Abre las DevTools (F12) y revisa la consola:
```
✅ "Iniciando proceso de login..."
✅ "Email ingresado: admin@pwa.com"
✅ "Usuarios disponibles: 3"
✅ "Usuario encontrado: Administrador"
✅ "Sesión creada exitosamente"
✅ "Redirigiendo a dashboard... administrador"
✅ "Protección de página OK"
```

## 🐛 Si algo NO funciona

### Problema: No aparece el loader
**Solución:** Refresca la página (Ctrl+F5) para limpiar cache

### Problema: Error "showNotification is not defined"
**Solución:** Verifica que app.js se esté cargando ANTES de auth.js

### Problema: "Usuario no autenticado"
**Solución:** 
1. Abre DevTools (F12)
2. Ve a Application → Local Storage
3. Verifica que exista la clave "session"
4. Si no existe, intenta el login de nuevo

### Problema: Página en blanco después del login
**Solución:**
1. Verifica la consola por errores
2. Checa que el archivo dashboard.html exista en la carpeta correcta
3. Asegúrate que las rutas sean relativas (../ no /)

### Problema: Los estilos no se ven
**Solución:**
1. Verifica conexión a internet (usa CDN de Tailwind)
2. Refresca la página (Ctrl+F5)
3. Revisa la consola por errores 404

## 📋 Checklist de Prueba Completo

- [ ] Servidor local corriendo
- [ ] index.html carga correctamente
- [ ] Página de login se ve bien
- [ ] Botones de usuarios demo funcionan
- [ ] Login con admin funciona
- [ ] Dashboard admin se carga
- [ ] Gráficas se muestran
- [ ] Sidebar funciona
- [ ] Gestión de productos funciona
- [ ] Logout funciona
- [ ] Login con cliente funciona
- [ ] Dashboard cliente se carga
- [ ] Catálogo de productos funciona
- [ ] Carrito funciona
- [ ] Checkout crea pedido
- [ ] Login con empleado funciona
- [ ] Dashboard empleado se carga

## 🎯 Flujo de Prueba Completo

1. **Inicio → Login → Admin Dashboard → Productos → Crear Producto → Logout**
2. **Login → Cliente → Productos → Agregar al Carrito → Ver Carrito → Checkout → Logout**
3. **Login → Empleado → Ver Alertas → Procesar Pedido → Logout**

## 💡 Notas Importantes

- **LocalStorage:** Todos los datos se guardan en el navegador
- **Datos Demo:** 3 usuarios y 10 productos precargados
- **PWA:** Service Worker se registra automáticamente
- **Offline:** Funciona sin internet después de la primera carga
- **Responsive:** Funciona en móvil, tablet y desktop

## 📞 Debugging Avanzado

Si necesitas debugging más detallado:

```javascript
// En la consola del navegador:
localStorage.getItem('session')  // Ver sesión actual
localStorage.getItem('users')    // Ver todos los usuarios
localStorage.getItem('products') // Ver productos
localStorage.getItem('cart')     // Ver carrito
localStorage.clear()             // Limpiar todo (logout forzado)
```

## ✨ Características Implementadas

- ✅ Sistema de autenticación completo
- ✅ 3 roles de usuario con permisos
- ✅ Dashboards personalizados por rol
- ✅ CRUD de productos (admin)
- ✅ Catálogo con filtros (cliente)
- ✅ Carrito de compras funcional
- ✅ Sistema de pedidos
- ✅ Gestión de inventario (empleado)
- ✅ Notificaciones toast
- ✅ Modales de confirmación
- ✅ Responsive design
- ✅ PWA con Service Worker
- ✅ Funcionalidad offline

¡La aplicación está lista para usar! 🎉
