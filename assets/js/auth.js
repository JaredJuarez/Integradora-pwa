// auth.js - Gestión de autenticación

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

    // Hacer petición a la API
    const response = await apiFetch(API_CONFIG.ENDPOINTS.LOGIN, {
      method: "POST",
      body: JSON.stringify({
        email: email,
        password: password,
      }),
    });

    const result = await response.json();

    if (typeof hideLoader === "function") hideLoader();

    // Verificar si hubo error
    if (result.error || !response.ok) {
      console.log("Error en login:", result.message);
      showNotificationSafe(
        result.message || "Credenciales incorrectas",
        "error"
      );
      return;
    }

    console.log("Login exitoso:", result.data);

    // Crear sesión con los datos de la respuesta
    const session = {
      user: {
        email: email,
        rol: result.data.role.toLowerCase(), // EMPLOYEE -> employee, ADMIN -> admin
      },
      token: result.data.token,
      remember: remember,
      loginTime: new Date().toISOString(),
    };

    // Mapear roles de la API a roles del sistema
    if (result.data.role === "EMPLOYEE") {
      session.user.rol = "empleado";
    } else if (result.data.role === "ADMIN") {
      session.user.rol = "administrador";
    }

    Storage.set("session", session);
    console.log("Sesión creada exitosamente");

    showNotificationSafe(`¡Bienvenido!`, "success");

    // Redirigir según el rol
    console.log("Redirigiendo a dashboard...", session.user.rol);
    setTimeout(() => {
      redirectToDashboard(session.user.rol);
    }, 1000);
  } catch (error) {
    if (typeof hideLoader === "function") hideLoader();
    console.error("Error en login:", error);
    showNotificationSafe(
      "Error al conectar con el servidor: " + error.message,
      "error"
    );
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

    // Hacer petición a la API
    const response = await apiFetch(API_CONFIG.ENDPOINTS.REGISTER, {
      method: "POST",
      body: JSON.stringify({
        name: nombre,
        phone: telefono,
        email: email,
        password: password,
        status: true,
        rol: {
          id: 1, // Por defecto se registra como empleado (rol id 1)
        },
      }),
    });

    const result = await response.json();

    hideLoader();

    // Verificar si hubo error
    if (result.error || !response.ok) {
      console.log("Error en registro:", result.message);

      // Mostrar error específico según el mensaje
      if (result.message && result.message.includes("email")) {
        showError("emailError", result.message);
      } else {
        showNotification(result.message || "Error al crear la cuenta", "error");
      }
      return;
    }

    console.log("Registro exitoso:", result);
    showNotification("Cuenta creada exitosamente", "success");

    // Redirigir al login
    setTimeout(() => {
      window.location.href = "login.html";
    }, 1500);
  } catch (error) {
    hideLoader();
    console.error("Error en registro:", error);
    showNotification(
      "Error al conectar con el servidor: " + error.message,
      "error"
    );
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
    administrador: "../admin/empleados-management.html",
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
