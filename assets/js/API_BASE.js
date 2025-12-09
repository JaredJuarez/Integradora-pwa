// API_BASE.js - Configuración de endpoints de la API

const API_CONFIG = {
  BASE_URL: "http://localhost:8080",
  ENDPOINTS: {
    // Auth endpoints
    LOGIN: "/api/auth",
    REGISTER: "/api/auth/register",

    // User/Employee endpoints
    USERS: "/api/user",
    USER_BY_ID: (id) => `/api/user/${id}`,
    EMPLOYEES: "/api/user/employees",

    // Product endpoints
    PRODUCTS: "/api/products",
    PRODUCT_BY_ID: (id) => `/api/products/${id}`,

    // Store endpoints
    STORES: "/api/stores",
    STORE_BY_ID: (id) => `/api/stores/${id}`,
    STORES_COURIER: "/api/stores/courier",

    // Order endpoints
    ORDERS: "/api/orders",
    ORDER_BY_ID: (id) => `/api/orders/${id}`,
  },

  // Timeout en milisegundos
  TIMEOUT: 10000,

  // Headers por defecto
  DEFAULT_HEADERS: {
    "Content-Type": "application/json",
  },
};

// Helper function para construir URLs completas
function getApiUrl(endpoint) {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
}

// Helper function para hacer peticiones fetch con configuración por defecto
async function apiFetch(endpoint, options = {}) {
  const url = getApiUrl(endpoint);

  const defaultOptions = {
    headers: {
      ...API_CONFIG.DEFAULT_HEADERS,
      ...(options.headers || {}),
    },
    ...options,
  };

  // Agregar token si existe en la sesión
  const session = Storage.get("session");
  if (session && session.token) {
    defaultOptions.headers["Authorization"] = `Bearer ${session.token}`;
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.TIMEOUT);

    const response = await fetch(url, {
      ...defaultOptions,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    return response;
  } catch (error) {
    if (error.name === "AbortError") {
      throw new Error("La petición ha excedido el tiempo de espera");
    }
    throw error;
  }
}

// Exportar configuración y funciones
window.API_CONFIG = API_CONFIG;
window.getApiUrl = getApiUrl;
window.apiFetch = apiFetch;
