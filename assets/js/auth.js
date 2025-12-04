// auth.js - Gestión de autenticación

// Usuario administrador por defecto
const ADMIN_USER = {
  id: "ADMIN001",
  nombre: "Administrador Sistema",
  email: "admin@empresa.com",
  password: "Admin123",
  rol: "administrador",
  telefono: "7771234567",
  activo: true,
  fechaRegistro: "2025-01-01",
};

// Inicializar usuarios en localStorage si no existen
// Los usuarios se sincronizan con los empleados de admin-data.js
function initDemoUsers() {
  const storage = new Storage();

  // Siempre incluir usuario admin
  let users = [ADMIN_USER];

  // Si existe adminDataManager, sincronizar empleados como usuarios
  if (typeof adminDataManager !== "undefined") {
    const employees = adminDataManager.getAllEmployees();

    // Convertir empleados a usuarios con contraseña por defecto
    const employeeUsers = employees.map((emp) => ({
      id: emp.id,
      nombre: emp.nombre,
      email: emp.email,
      password: "Empleado123", // Contraseña por defecto
      rol: "empleado",
      telefono: emp.telefono,
      activo: emp.activo,
      fechaRegistro: emp.fechaRegistro,
    }));

    users = [...users, ...employeeUsers];
  }

  // Guardar usuarios sincronizados
  if (!storage.getItem("users") || storage.getItem("users").length === 0) {
    storage.setItem("users", users);
  }

  return users;
}

// Sincronizar usuarios con empleados (llamar cuando se crea/actualiza un empleado)
function syncUsersWithEmployees() {
  if (typeof adminDataManager !== "undefined") {
    const storage = new Storage();
    const currentUsers = storage.getItem("users") || [];
    const admin =
      currentUsers.find((u) => u.rol === "administrador") || ADMIN_USER;

    const employees = adminDataManager.getAllEmployees();
    const employeeUsers = employees.map((emp) => {
      // Mantener contraseña existente si ya existe el usuario
      const existingUser = currentUsers.find((u) => u.id === emp.id);
      return {
        id: emp.id,
        nombre: emp.nombre,
        email: emp.email,
        password: existingUser ? existingUser.password : "Empleado123",
        rol: "empleado",
        telefono: emp.telefono,
        activo: emp.activo,
        fechaRegistro: emp.fechaRegistro,
      };
    });

    storage.setItem("users", [admin, ...employeeUsers]);
  }
}

// Verificar si el usuario está autenticado
function isAuthenticated() {
  const session = Storage.get("session");
  return session && session.user && session.token;
}

// Obtener usuario actual
function getCurrentUser() {
  const session = Storage.get("session");
  return session ? session.user : null;
}

// Verificar rol del usuario
function hasRole(roles) {
  const user = getCurrentUser();
  if (!user) return false;

  if (Array.isArray(roles)) {
    return roles.includes(user.rol);
  }
  return user.rol === roles;
}

// Login
async function handleLogin(event) {
  event.preventDefault();

  console.log("Iniciando proceso de login...");

  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");
  const rememberInput = document.getElementById("remember");

  if (!emailInput || !passwordInput) {
    console.error("Campos de formulario no encontrados");
    alert("Error: Campos del formulario no disponibles");
    return;
  }

  const email = emailInput.value.trim();
  const password = passwordInput.value;
  const remember = rememberInput ? rememberInput.checked : false;

  console.log("Email ingresado:", email);

  // Validaciones
  if (!email || email === "") {
    showErrorSafe("emailError", "Email requerido");
    return;
  }

  if (!Validators.email(email)) {
    showErrorSafe("emailError", "Email inválido");
    return;
  }

  if (!password || password === "") {
    showErrorSafe("passwordError", "Contraseña requerida");
    return;
  }

  // Limpiar errores
  clearErrors();

  try {
    // Mostrar loader
    if (typeof showLoader === "function") {
      showLoader();
    }

    // Simular delay de API
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Obtener usuarios
    initDemoUsers();
    const users = Storage.get("users") || [];
    console.log("Usuarios disponibles:", users.length);

    // Buscar usuario
    const user = users.find(
      (u) => u.email === email && u.password === password
    );

    if (!user) {
      if (typeof hideLoader === "function") hideLoader();
      console.log("Usuario no encontrado");
      showNotificationSafe("Credenciales incorrectas", "error");
      return;
    }

    console.log("Usuario encontrado:", user.nombre);

    if (!user.activo) {
      if (typeof hideLoader === "function") hideLoader();
      showNotificationSafe("Usuario inactivo", "error");
      return;
    }

    // Crear sesión
    const token = Date.now().toString(36) + Math.random().toString(36);
    const session = {
      user: {
        id: user.id,
        nombre: user.nombre,
        email: user.email,
        rol: user.rol,
        telefono: user.telefono,
      },
      token: token,
      remember: remember,
      loginTime: new Date().toISOString(),
    };

    Storage.set("session", session);
    console.log("Sesión creada exitosamente");

    if (typeof hideLoader === "function") hideLoader();
    showNotificationSafe(`¡Bienvenido ${user.nombre}!`, "success");

    // Redirigir según el rol
    console.log("Redirigiendo a dashboard...", user.rol);
    setTimeout(() => {
      redirectToDashboard(user.rol);
    }, 1000);
  } catch (error) {
    if (typeof hideLoader === "function") hideLoader();
    console.error("Error en login:", error);
    showNotificationSafe("Error al iniciar sesión: " + error.message, "error");
  }
}

// Función auxiliar segura para mostrar errores
function showErrorSafe(fieldId, message) {
  if (typeof showError === "function") {
    showError(fieldId, message);
  } else {
    const errorElement = document.getElementById(fieldId);
    if (errorElement) {
      errorElement.textContent = message;
      errorElement.classList.remove("hidden");
    }
    console.error(fieldId + ":", message);
  }
}

// Función auxiliar segura para mostrar notificaciones
function showNotificationSafe(message, type = "info") {
  if (typeof showNotification === "function") {
    showNotification(message, type);
  } else {
    alert(message);
    console.log("Notification:", message, type);
  }
}

// Registro
async function handleRegister(event) {
  event.preventDefault();

  const nombre = document.getElementById("nombre").value;
  const email = document.getElementById("email").value;
  const telefono = document.getElementById("telefono").value;
  const password = document.getElementById("password").value;
  const confirmPassword = document.getElementById("confirmPassword").value;
  const terms = document.getElementById("terms").checked;

  // Validaciones
  let hasErrors = false;

  if (!Validators.required(nombre) || !Validators.minLength(nombre, 3)) {
    showError("nombreError", "Nombre debe tener al menos 3 caracteres");
    hasErrors = true;
  }

  if (!Validators.email(email)) {
    showError("emailError", "Email inválido");
    hasErrors = true;
  }

  if (!Validators.phone(telefono)) {
    showError("telefonoError", "Teléfono debe tener 10 dígitos");
    hasErrors = true;
  }

  if (!Validators.password(password)) {
    showError("passwordError", "Contraseña no cumple los requisitos");
    hasErrors = true;
  }

  if (password !== confirmPassword) {
    showError("confirmPasswordError", "Las contraseñas no coinciden");
    hasErrors = true;
  }

  if (!terms) {
    showNotification("Debes aceptar los términos y condiciones", "error");
    hasErrors = true;
  }

  if (hasErrors) return;

  // Limpiar errores
  clearErrors();

  try {
    showLoader();
    await HTTP.mockAPI(null, 500);

    // Obtener usuarios
    initDemoUsers();
    const users = Storage.get("users") || [];

    // Verificar si el email ya existe
    if (users.find((u) => u.email === email)) {
      hideLoader();
      showError("emailError", "Este email ya está registrado");
      return;
    }

    // Crear nuevo usuario (por defecto como empleado)
    const newUser = {
      id: Generators.numericId(),
      nombre: nombre,
      email: email,
      password: password,
      rol: "empleado",
      telefono: telefono,
      activo: true,
      fechaRegistro: new Date().toISOString(),
      zona: "Pendiente asignar",
      vehiculo: "Pendiente asignar",
    };

    users.push(newUser);
    Storage.set("users", users);

    hideLoader();
    showNotification("Cuenta creada exitosamente", "success");

    // Redirigir al login
    setTimeout(() => {
      window.location.href = "login.html";
    }, 1500);
  } catch (error) {
    hideLoader();
    console.error("Error en registro:", error);
    showNotification("Error al crear cuenta", "error");
  }
}

// Logout
function logout() {
  // Usar confirmAction si está disponible, sino usar confirm nativo
  const executeLogout = () => {
    // Limpiar datos de sesión
    Storage.remove("session");

    // Limpiar datos temporales del empleado
    sessionStorage.removeItem("tiendaAVisitar");
    sessionStorage.removeItem("tiendaEnVisita");
    sessionStorage.removeItem("datosVisitaActual");
    sessionStorage.removeItem("visitaActual");

    // Mostrar notificación si la función está disponible
    if (typeof showNotification === "function") {
      showNotification("Sesión cerrada exitosamente", "success");
    } else if (typeof showNotificationSafe === "function") {
      showNotificationSafe("Sesión cerrada exitosamente", "success");
    } else {
      console.log("Sesión cerrada exitosamente");
    }

    setTimeout(() => {
      // Determinar la ruta correcta según la ubicación actual
      const currentPath = window.location.pathname;
      if (
        currentPath.includes("/pages/admin/") ||
        currentPath.includes("/pages/cliente/") ||
        currentPath.includes("/pages/empleado/")
      ) {
        window.location.href = "../auth/login.html";
      } else {
        window.location.href = "../../pages/auth/login.html";
      }
    }, 1000);
  };

  // Usar confirmAction si está disponible, sino usar confirm nativo
  if (typeof confirmAction === "function") {
    confirmAction("¿Estás seguro que deseas cerrar sesión?", executeLogout);
  } else {
    const confirmed = confirm("¿Estás seguro que deseas cerrar sesión?");
    if (confirmed) {
      executeLogout();
    }
  }
}

// Redirigir al dashboard según rol
function redirectToDashboard(rol) {
  const dashboards = {
    administrador: "../admin/dashboard.html",
    empleado: "../empleado/dashboard.html",
  };

  const defaultPath = "./login.html";
  window.location.href = dashboards[rol] || defaultPath;
}

// Proteger página (solo usuarios autenticados)
function protectPage(allowedRoles = null) {
  if (!isAuthenticated()) {
    console.log("Usuario no autenticado, redirigiendo al login...");
    alert("Debes iniciar sesión para acceder a esta página");
    setTimeout(() => {
      window.location.href = "../auth/login.html";
    }, 500);
    return false;
  }

  if (allowedRoles && !hasRole(allowedRoles)) {
    console.log("Usuario sin permisos, redirigiendo...");
    alert("No tienes permisos para acceder a esta página");
    setTimeout(() => {
      const user = getCurrentUser();
      if (user && user.rol) {
        redirectToDashboard(user.rol);
      } else {
        window.location.href = "../auth/login.html";
      }
    }, 500);
    return false;
  }

  console.log("Protección de página OK");
  return true;
}

// Mostrar error en campo
function showError(fieldId, message) {
  const errorElement = document.getElementById(fieldId);
  if (errorElement) {
    errorElement.textContent = message;
    errorElement.classList.remove("hidden");
  }
}

// Limpiar todos los errores
function clearErrors() {
  const errorElements = document.querySelectorAll('[id$="Error"]');
  errorElements.forEach((element) => {
    element.textContent = "";
    element.classList.add("hidden");
  });
}

// Actualizar información del usuario en el header
function updateUserInfo() {
  const user = getCurrentUser();
  if (!user) return;

  const userNameElement = document.getElementById("userName");
  const userRoleElement = document.getElementById("userRole");
  const userEmailElement = document.getElementById("userEmail");

  if (userNameElement) userNameElement.textContent = user.nombre;
  if (userRoleElement)
    userRoleElement.textContent = Format.capitalize(user.rol);
  if (userEmailElement) userEmailElement.textContent = user.email;
}

// Inicializar en DOMContentLoaded
document.addEventListener("DOMContentLoaded", () => {
  initDemoUsers();

  // Si estamos en una página protegida, actualizar info del usuario
  if (isAuthenticated()) {
    updateUserInfo();
  }
});

// Exportar funciones
window.isAuthenticated = isAuthenticated;
window.getCurrentUser = getCurrentUser;
window.hasRole = hasRole;
window.handleLogin = handleLogin;
window.handleRegister = handleRegister;
window.logout = logout;
window.protectPage = protectPage;
window.updateUserInfo = updateUserInfo;
window.showErrorSafe = showErrorSafe;
window.showNotificationSafe = showNotificationSafe;
window.redirectToDashboard = redirectToDashboard;
