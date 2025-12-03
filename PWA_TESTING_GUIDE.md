# 📱 Guía de Prueba PWA - Sistema de Empleados

## 🚀 Configuración y Prueba Local

### 1. Iniciar Servidor Local

```bash
cd "ruta/a/tu/proyecto"
python -m http.server 3000
```

### 2. Acceder desde el Navegador

- **Desktop**: `http://localhost:3000`
- **Móvil**: `http://[IP_DE_TU_PC]:3000`

Para obtener tu IP:

```bash
ipconfig  # Windows
ifconfig  # Mac/Linux
```

## 📱 Prueba en Móvil

### Paso 1: Acceder desde Chrome Móvil

1. Abrir Chrome en tu móvil
2. Ir a `http://[IP_DE_TU_PC]:3000`
3. Esperar a que aparezca el banner de instalación

### Paso 2: Instalar PWA

1. Buscar el banner "Instalar app" o
2. Menú ⋮ → "Instalar aplicación" → "Instalar"
3. La app aparecerá en tu pantalla de inicio

### Paso 3: Verificar Funcionamiento

1. **Abrir desde pantalla de inicio** (no desde Chrome)
2. Verificar que se vea como app nativa
3. Probar navegación offline

## 🔧 Soluciones a Problemas Comunes

### ❌ Error 404 al abrir PWA

**Causa**: Rutas absolutas en manifest o service worker

**Solución**: Verificar que el manifest.json tenga:

```json
{
  "start_url": "./index.html",
  "scope": "./"
}
```

### ❌ PWA no aparece para instalar

**Causas posibles**:

1. No se accede via HTTPS (excepto localhost)
2. Manifest.json mal configurado
3. Service Worker no registrado

**Solución**:

1. Verificar consola del navegador
2. Ir a Chrome → DevTools → Application → Manifest
3. Verificar Service Worker en DevTools

### ❌ Funciona en navegador pero no como PWA

**Causa**: Diferencias entre navegador web y standalone

**Solución**: Verificar rutas relativas en todos los archivos

## 🧪 Lista de Verificación

### ✅ Funcionalidades a Probar

- [ ] Instalación desde Chrome móvil
- [ ] Apertura como app independiente
- [ ] Login con usuarios de prueba
- [ ] Dashboard de empleado funcional
- [ ] Navegación entre páginas
- [ ] Escaneo QR (simulado)
- [ ] Selección de productos
- [ ] Captura de foto (simulado)
- [ ] Logout correcto
- [ ] Funcionalidad offline básica

### 🔐 Usuarios de Prueba

**Empleado**:

- Email: `empleado@test.com`
- Password: `123456`

**Admin**:

- Email: `admin@test.com`
- Password: `123456`

## 📋 Características PWA Implementadas

### ✅ Manifest Web App

- Nombre y descripción
- Iconos SVG embebidos (no requieren archivos externos)
- Configuración standalone
- Theme colors
- Shortcuts de acceso rápido

### ✅ Service Worker

- Cache de recursos estáticos
- Estrategia Cache First para offline
- Manejo de actualizaciones
- Notificaciones push (preparado)
- Sincronización background

### ✅ Experiencia de Usuario

- Diseño mobile-first
- Instalación con un click
- Funcionamiento offline
- Navegación fluida
- UI nativa en móvil

## 🐛 Debug en Móvil

### Chrome DevTools Remoto

1. Conectar móvil con USB
2. Chrome Desktop → `chrome://inspect`
3. Inspeccionar device y abrir PWA
4. Ver consola y errores

### Verificaciones Importantes

- Console logs del Service Worker
- Network tab para verificar cache
- Application tab → Manifest
- Application tab → Service Workers

## 🎯 Próximos Pasos

Si la PWA funciona correctamente:

1. ✅ Instalación exitosa
2. ✅ Funcionamiento como app nativa
3. ✅ Sin errores 404
4. ✅ Login y navegación fluida

Entonces la PWA está lista para producción con servidor HTTPS.

---

**Nota**: Para producción, asegurar servidor HTTPS y rutas absolutas correctas.
