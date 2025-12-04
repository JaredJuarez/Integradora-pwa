// admin-data.js - Capa de datos para administrador (usa Mock API)

/**
 * AdminDataManager
 * Capa de abstracción que usa el Mock API Service
 * En producción, se reemplazarían las llamadas a mockAPI por fetch() reales
 */

class AdminDataManager {
  constructor() {
    this.api = mockAPI; // En producción: this.api = realAPIService
  }

  // ============================================
  // EMPLEADOS
  // ============================================

  /**
   * Obtiene todos los empleados
   * Producción: GET /api/employees
   */
  async getAllEmployees() {
    const response = await this.api.getEmployees();
    return response.success ? response.data : [];
  }

  /**
   * Obtiene un empleado por ID
   * Producción: GET /api/employees/:id
   */
  async getEmployeeById(id) {
    const response = await this.api.getEmployee(id);
    return response.success ? response.data : null;
  }

  /**
   * Crea un nuevo empleado
   * Producción: POST /api/employees
   */
  async addEmployee(employeeData) {
    const response = await this.api.createEmployee(employeeData);
    if (!response.success) {
      throw new Error(response.error);
    }
    return response.data;
  }

  /**
   * Actualiza un empleado existente
   * Producción: PUT /api/employees/:id
   */
  async updateEmployee(id, employeeData) {
    const response = await this.api.updateEmployee(id, employeeData);
    if (!response.success) {
      throw new Error(response.error);
    }
    return response.data;
  }

  /**
   * Elimina un empleado
   * Producción: DELETE /api/employees/:id
   */
  async deleteEmployee(id) {
    const response = await this.api.deleteEmployee(id);
    if (!response.success) {
      throw new Error(response.error);
    }
    return true;
  }

  // ============================================
  // TIENDAS
  // ============================================

  /**
   * Obtiene todas las tiendas
   * Producción: GET /api/stores
   */
  async getAllStores(filters = {}) {
    const response = await this.api.getStores(filters);
    return response.success ? response.data : [];
  }

  /**
   * Obtiene una tienda por ID
   * Producción: GET /api/stores/:id
   */
  async getStoreById(id) {
    const response = await this.api.getStore(id);
    return response.success ? response.data : null;
  }

  /**
   * Obtiene tiendas asignadas a un empleado
   * Producción: GET /api/stores?employeeId=:id
   */
  async getStoresByEmployee(employeeId) {
    const response = await this.api.getStores({ employeeId, activa: true });
    return response.success ? response.data : [];
  }

  /**
   * Obtiene tiendas que debe visitar un empleado HOY
   * Producción: GET /api/stores/employee/:employeeId/today
   */
  async getStoresToVisitToday(employeeId) {
    const response = await this.api.getStoresToVisitToday(employeeId);
    return response.success ? response.data : [];
  }

  /**
   * Crea una nueva tienda
   * Producción: POST /api/stores
   */
  async addStore(storeData) {
    const response = await this.api.createStore(storeData);
    if (!response.success) {
      throw new Error(response.error);
    }
    return response.data;
  }

  /**
   * Actualiza una tienda existente
   * Producción: PUT /api/stores/:id
   */
  async updateStore(id, storeData) {
    const response = await this.api.updateStore(id, storeData);
    if (!response.success) {
      throw new Error(response.error);
    }
    return response.data;
  }

  /**
   * Elimina una tienda
   * Producción: DELETE /api/stores/:id
   */
  async deleteStore(id) {
    const response = await this.api.deleteStore(id);
    if (!response.success) {
      throw new Error(response.error);
    }
    return true;
  }

  /**
   * Registra una visita completada
   * Producción: POST /api/stores/:id/visit
   */
  async completeVisit(storeId) {
    const response = await this.api.completeVisit(storeId);
    if (!response.success) {
      throw new Error(response.error);
    }
    return response.data;
  }

  // ============================================
  // PRODUCTOS
  // ============================================

  /**
   * Obtiene todos los productos
   * Producción: GET /api/products
   */
  async getAllProducts(filters = {}) {
    const response = await this.api.getProducts(filters);
    return response.success ? response.data : [];
  }

  /**
   * Obtiene un producto por ID
   * Producción: GET /api/products/:id
   */
  async getProductById(id) {
    const response = await this.api.getProduct(id);
    return response.success ? response.data : null;
  }

  /**
   * Obtiene solo productos activos
   * Producción: GET /api/products?activo=true
   */
  async getActiveProducts() {
    const response = await this.api.getProducts({ activo: true });
    return response.success ? response.data : [];
  }

  /**
   * Crea un nuevo producto
   * Producción: POST /api/products
   */
  async addProduct(productData) {
    const response = await this.api.createProduct(productData);
    if (!response.success) {
      throw new Error(response.error);
    }
    return response.data;
  }

  /**
   * Actualiza un producto existente
   * Producción: PUT /api/products/:id
   */
  async updateProduct(id, productData) {
    const response = await this.api.updateProduct(id, productData);
    if (!response.success) {
      throw new Error(response.error);
    }
    return response.data;
  }

  /**
   * Elimina un producto
   * Producción: DELETE /api/products/:id
   */
  async deleteProduct(id) {
    const response = await this.api.deleteProduct(id);
    if (!response.success) {
      throw new Error(response.error);
    }
    return true;
  }

  // ============================================
  // ESTADÍSTICAS
  // ============================================

  /**
   * Obtiene estadísticas del dashboard admin
   * Producción: GET /api/stats/admin
   */
  async getAdminStats() {
    const response = await this.api.getAdminStats();
    return response.success ? response.data : {};
  }

  /**
   * Obtiene estadísticas de un empleado
   * Producción: GET /api/stats/employee/:id
   */
  async getEmployeeStats(employeeId) {
    const response = await this.api.getEmployeeStats(employeeId);
    return response.success ? response.data : {};
  }

  // ============================================
  // UTILIDADES SÍNCRONAS (sin API)
  // ============================================

  /**
   * Calcula si una tienda debe visitarse hoy (lógica cliente)
   */
  shouldVisitToday(store) {
    if (!store.ultimaVisita) return true;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const lastVisit = new Date(store.ultimaVisita);
    lastVisit.setHours(0, 0, 0, 0);

    const diffDays = Math.floor((today - lastVisit) / (1000 * 60 * 60 * 24));
    return diffDays >= store.frecuenciaVisita;
  }

  /**
   * Calcula la próxima fecha de visita (lógica cliente)
   */
  getNextVisitDate(store) {
    if (!store.ultimaVisita) return null;

    const lastVisit = new Date(store.ultimaVisita);
    const nextVisit = new Date(lastVisit);
    nextVisit.setDate(lastVisit.getDate() + store.frecuenciaVisita);

    return nextVisit;
  }
}

// Instancia global
const adminDataManager = new AdminDataManager();

// Exportar para uso en otros archivos
if (typeof window !== "undefined") {
  window.adminDataManager = adminDataManager;
}
