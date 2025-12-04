// admin-data.js - Sistema de gestión de datos mock para el administrador

// ============================================
// ESTRUCTURA DE DATOS MOCK
// ============================================

class AdminDataManager {
  constructor() {
    this.storage = new Storage();
    this.initializeMockData();
  }

  // ============================================
  // INICIALIZACIÓN DE DATOS MOCK
  // ============================================

  initializeMockData() {
    // Solo inicializar si no existen datos
    if (!this.storage.getItem("employees")) {
      this.storage.setItem("employees", this.getDefaultEmployees());
    }
    if (!this.storage.getItem("stores")) {
      this.storage.setItem("stores", this.getDefaultStores());
    }
    if (!this.storage.getItem("products")) {
      this.storage.setItem("products", this.getDefaultProducts());
    }
  }

  // ============================================
  // DATOS POR DEFECTO
  // ============================================

  getDefaultEmployees() {
    return [
      {
        id: "EMP001",
        nombre: "Carlos Mendoza",
        email: "empleado@test.com",
        password: "123456",
        telefono: "5551234567",
        fechaContratacion: "2024-01-15",
        activo: true,
        rol: "empleado",
      },
      {
        id: "EMP002",
        nombre: "María García",
        email: "maria.garcia@empresa.com",
        password: "123456",
        telefono: "5552345678",
        fechaContratacion: "2024-02-20",
        activo: true,
        rol: "empleado",
      },
      {
        id: "EMP003",
        nombre: "Juan Pérez",
        email: "juan.perez@empresa.com",
        password: "123456",
        telefono: "5553456789",
        fechaContratacion: "2024-03-10",
        activo: true,
        rol: "empleado",
      },
    ];
  }

  getDefaultStores() {
    const today = new Date();
    const threeDaysAgo = new Date(today);
    threeDaysAgo.setDate(today.getDate() - 3);

    const twoDaysAgo = new Date(today);
    twoDaysAgo.setDate(today.getDate() - 2);

    return [
      {
        id: "STORE001",
        nombre: "Tienda Centro",
        direccion: "Av. Principal #123, Col. Centro",
        frecuenciaVisita: 3, // días
        ultimaVisita: threeDaysAgo.toISOString().split("T")[0], // hace 3 días (debe aparecer hoy)
        empleadoAsignado: "EMP001",
        activa: true,
      },
      {
        id: "STORE002",
        nombre: "Sucursal Norte",
        direccion: "Calle Juárez #456, Col. Norte",
        frecuenciaVisita: 7,
        ultimaVisita: null, // Nueva tienda sin visitas (debe aparecer)
        empleadoAsignado: "EMP001",
        activa: true,
      },
      {
        id: "STORE003",
        nombre: "Plaza Sur",
        direccion: "Blvd. Sur #789, Plaza Comercial",
        frecuenciaVisita: 5,
        ultimaVisita: twoDaysAgo.toISOString().split("T")[0], // hace 2 días (no debe aparecer hasta dentro de 3 días)
        empleadoAsignado: "EMP002",
        activa: true,
      },
      {
        id: "STORE004",
        nombre: "Tienda Oriente",
        direccion: "Av. Oriente #321, Col. Este",
        frecuenciaVisita: 2,
        ultimaVisita: twoDaysAgo.toISOString().split("T")[0], // hace 2 días (debe aparecer hoy)
        empleadoAsignado: "EMP001",
        activa: true,
      },
      {
        id: "STORE005",
        nombre: "Sucursal Poniente",
        direccion: "Calle Poniente #654, Col. Oeste",
        frecuenciaVisita: 1,
        ultimaVisita: null, // Nueva tienda
        empleadoAsignado: "EMP003",
        activa: true,
      },
    ];
  }

  getDefaultProducts() {
    return [
      {
        id: "PROD001",
        nombre: "Refresco Coca-Cola 600ml",
        categoria: "Bebidas",
        precioSugerido: 15.5,
        activo: true,
      },
      {
        id: "PROD002",
        nombre: "Agua Mineral 1L",
        categoria: "Bebidas",
        precioSugerido: 12.0,
        activo: true,
      },
      {
        id: "PROD003",
        nombre: "Papas Fritas Sabritas",
        categoria: "Snacks",
        precioSugerido: 18.0,
        activo: true,
      },
      {
        id: "PROD004",
        nombre: "Galletas Oreo",
        categoria: "Snacks",
        precioSugerido: 22.0,
        activo: true,
      },
      {
        id: "PROD005",
        nombre: "Jugo Del Valle 1L",
        categoria: "Bebidas",
        precioSugerido: 25.0,
        activo: true,
      },
      {
        id: "PROD006",
        nombre: "Chocolate Milka",
        categoria: "Dulces",
        precioSugerido: 35.0,
        activo: true,
      },
      {
        id: "PROD007",
        nombre: "Chicles Trident",
        categoria: "Dulces",
        precioSugerido: 8.5,
        activo: true,
      },
      {
        id: "PROD008",
        nombre: "Cerveza Corona 355ml",
        categoria: "Bebidas Alcohólicas",
        precioSugerido: 28.0,
        activo: true,
      },
      {
        id: "PROD009",
        nombre: "Pan Bimbo Blanco",
        categoria: "Panadería",
        precioSugerido: 42.0,
        activo: true,
      },
      {
        id: "PROD010",
        nombre: "Leche Lala 1L",
        categoria: "Lácteos",
        precioSugerido: 23.5,
        activo: true,
      },
    ];
  }

  // ============================================
  // CRUD EMPLEADOS
  // ============================================

  getAllEmployees() {
    return this.storage.getItem("employees") || [];
  }

  getEmployeeById(id) {
    const employees = this.getAllEmployees();
    return employees.find((emp) => emp.id === id);
  }

  createEmployee(employeeData) {
    const employees = this.getAllEmployees();
    const newId = `EMP${String(employees.length + 1).padStart(3, "0")}`;

    const newEmployee = {
      id: newId,
      ...employeeData,
      fechaContratacion: new Date().toISOString().split("T")[0],
      activo: true,
      rol: "empleado",
    };

    employees.push(newEmployee);
    this.storage.setItem("employees", employees);
    return newEmployee;
  }

  updateEmployee(id, employeeData) {
    const employees = this.getAllEmployees();
    const index = employees.findIndex((emp) => emp.id === id);

    if (index !== -1) {
      employees[index] = {
        ...employees[index],
        ...employeeData,
      };
      this.storage.setItem("employees", employees);
      return employees[index];
    }
    return null;
  }

  deleteEmployee(id) {
    const employees = this.getAllEmployees();
    const filtered = employees.filter((emp) => emp.id !== id);

    if (filtered.length !== employees.length) {
      this.storage.setItem("employees", filtered);

      // Desasignar empleado de todas sus tiendas
      const stores = this.getAllStores();
      const updatedStores = stores.map((store) => {
        if (store.empleadoAsignado === id) {
          return { ...store, empleadoAsignado: null };
        }
        return store;
      });
      this.storage.setItem("stores", updatedStores);

      return true;
    }
    return false;
  }

  // ============================================
  // CRUD TIENDAS
  // ============================================

  getAllStores() {
    return this.storage.getItem("stores") || [];
  }

  getStoreById(id) {
    const stores = this.getAllStores();
    return stores.find((store) => store.id === id);
  }

  getStoresByEmployee(employeeId) {
    const stores = this.getAllStores();
    return stores.filter(
      (store) => store.empleadoAsignado === employeeId && store.activa
    );
  }

  createStore(storeData) {
    const stores = this.getAllStores();
    const newId = `STORE${String(stores.length + 1).padStart(3, "0")}`;

    const newStore = {
      id: newId,
      ...storeData,
      ultimaVisita: null,
      activa: true,
    };

    stores.push(newStore);
    this.storage.setItem("stores", stores);
    return newStore;
  }

  updateStore(id, storeData) {
    const stores = this.getAllStores();
    const index = stores.findIndex((store) => store.id === id);

    if (index !== -1) {
      stores[index] = {
        ...stores[index],
        ...storeData,
      };
      this.storage.setItem("stores", stores);
      return stores[index];
    }
    return null;
  }

  deleteStore(id) {
    const stores = this.getAllStores();
    const filtered = stores.filter((store) => store.id !== id);

    if (filtered.length !== stores.length) {
      this.storage.setItem("stores", filtered);
      return true;
    }
    return false;
  }

  assignEmployeeToStore(storeId, employeeId) {
    return this.updateStore(storeId, { empleadoAsignado: employeeId });
  }

  // ============================================
  // CRUD PRODUCTOS
  // ============================================

  getAllProducts() {
    return this.storage.getItem("products") || [];
  }

  getProductById(id) {
    const products = this.getAllProducts();
    return products.find((prod) => prod.id === id);
  }

  getActiveProducts() {
    const products = this.getAllProducts();
    return products.filter((prod) => prod.activo);
  }

  createProduct(productData) {
    const products = this.getAllProducts();
    const newId = `PROD${String(products.length + 1).padStart(3, "0")}`;

    const newProduct = {
      id: newId,
      ...productData,
      activo: true,
    };

    products.push(newProduct);
    this.storage.setItem("products", products);
    return newProduct;
  }

  updateProduct(id, productData) {
    const products = this.getAllProducts();
    const index = products.findIndex((prod) => prod.id === id);

    if (index !== -1) {
      products[index] = {
        ...products[index],
        ...productData,
      };
      this.storage.setItem("products", products);
      return products[index];
    }
    return null;
  }

  deleteProduct(id) {
    const products = this.getAllProducts();
    const filtered = products.filter((prod) => prod.id !== id);

    if (filtered.length !== products.length) {
      this.storage.setItem("products", filtered);
      return true;
    }
    return false;
  }

  // ============================================
  // LÓGICA DE VISITAS Y FECHAS
  // ============================================

  /**
   * Calcula si una tienda debe visitarse hoy
   * @param {Object} store - Objeto de tienda
   * @returns {boolean} - True si debe visitarse hoy
   */
  shouldVisitToday(store) {
    // Si no tiene última visita, debe visitarse (tienda nueva)
    if (!store.ultimaVisita) {
      return true;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const lastVisit = new Date(store.ultimaVisita);
    lastVisit.setHours(0, 0, 0, 0);

    const diffDays = Math.floor((today - lastVisit) / (1000 * 60 * 60 * 24));

    // Si han pasado los días de frecuencia o más, debe visitarse
    return diffDays >= store.frecuenciaVisita;
  }

  /**
   * Obtiene las tiendas que debe visitar un empleado HOY
   * @param {string} employeeId - ID del empleado
   * @returns {Array} - Array de tiendas a visitar hoy
   */
  getStoresToVisitToday(employeeId) {
    const allStores = this.getStoresByEmployee(employeeId);
    return allStores.filter((store) => this.shouldVisitToday(store));
  }

  /**
   * Calcula la próxima fecha de visita
   * @param {Object} store - Objeto de tienda
   * @returns {Date|null} - Fecha de próxima visita
   */
  getNextVisitDate(store) {
    if (!store.ultimaVisita) {
      return null; // Debe visitarse ya
    }

    const lastVisit = new Date(store.ultimaVisita);
    const nextVisit = new Date(lastVisit);
    nextVisit.setDate(lastVisit.getDate() + store.frecuenciaVisita);

    return nextVisit;
  }

  /**
   * Registra una visita completada
   * @param {string} storeId - ID de la tienda
   * @returns {Object} - Tienda actualizada
   */
  completeVisit(storeId) {
    const today = new Date().toISOString().split("T")[0];
    return this.updateStore(storeId, { ultimaVisita: today });
  }

  // ============================================
  // ESTADÍSTICAS Y REPORTES
  // ============================================

  getEmployeeStats(employeeId) {
    const stores = this.getStoresByEmployee(employeeId);
    const storesToVisitToday = this.getStoresToVisitToday(employeeId);

    const visitedStores = stores.filter((store) => store.ultimaVisita !== null);

    return {
      totalStores: stores.length,
      storesToVisitToday: storesToVisitToday.length,
      visitedStores: visitedStores.length,
      pendingStores: stores.length - visitedStores.length,
    };
  }

  getAdminStats() {
    const employees = this.getAllEmployees();
    const stores = this.getAllStores();
    const products = this.getAllProducts();

    const activeEmployees = employees.filter((emp) => emp.activo);
    const activeStores = stores.filter((store) => store.activa);
    const activeProducts = products.filter((prod) => prod.activo);

    const storesWithoutEmployee = activeStores.filter(
      (store) => !store.empleadoAsignado
    );
    const storesNeverVisited = activeStores.filter(
      (store) => !store.ultimaVisita
    );

    return {
      totalEmployees: activeEmployees.length,
      totalStores: activeStores.length,
      totalProducts: activeProducts.length,
      storesWithoutEmployee: storesWithoutEmployee.length,
      storesNeverVisited: storesNeverVisited.length,
    };
  }
}

// Instancia global
const adminDataManager = new AdminDataManager();

// Exportar para uso en otros archivos
if (typeof window !== "undefined") {
  window.adminDataManager = adminDataManager;
}
