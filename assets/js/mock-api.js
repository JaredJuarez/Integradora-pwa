// mock-api.js - Sistema de API simulada para facilitar migración a backend real

/**
 * Mock API Service
 * Simula respuestas de API para facilitar la futura integración con backend
 * Cuando el backend esté listo, solo se necesita cambiar las implementaciones
 * de los métodos para hacer fetch() real
 */

class MockAPIService {
  constructor() {
    this.baseDelay = 300; // Simular latencia de red (ms)
    this.initializeData();
  }

  // ============================================
  // SIMULACIÓN DE DELAY DE RED
  // ============================================

  async _simulateNetworkDelay(min = 200, max = 500) {
    const delay = Math.random() * (max - min) + min;
    await new Promise((resolve) => setTimeout(resolve, delay));
  }

  // ============================================
  // FORMATO DE RESPUESTAS (igual que backend real)
  // ============================================

  _successResponse(data, message = "Operación exitosa") {
    return {
      success: true,
      data: data,
      message: message,
      timestamp: new Date().toISOString(),
    };
  }

  _errorResponse(message, code = 400) {
    return {
      success: false,
      error: message,
      code: code,
      timestamp: new Date().toISOString(),
    };
  }

  // ============================================
  // INICIALIZACIÓN DE DATOS
  // ============================================

  initializeData() {
    // Solo inicializar si no existen datos
    if (!Storage.get("app_employees")) {
      Storage.set("app_employees", this._getDefaultEmployees());
    }
    if (!Storage.get("app_stores")) {
      Storage.set("app_stores", this._getDefaultStores());
    }
    if (!Storage.get("app_products")) {
      Storage.set("app_products", this._getDefaultProducts());
    }
    if (!Storage.get("app_users")) {
      Storage.set("app_users", this._getDefaultUsers());
    }
  }

  _getDefaultUsers() {
    return [
      {
        id: "ADMIN001",
        nombre: "Administrador Sistema",
        email: "admin@empresa.com",
        password: "Admin123",
        rol: "administrador",
        telefono: "7771234567",
        activo: true,
        fechaRegistro: "2025-01-01",
      },
      {
        id: "EMP001",
        nombre: "Carlos Mendoza",
        email: "carlos.mendoza@empresa.com",
        password: "Empleado123",
        rol: "empleado",
        telefono: "5551234567",
        activo: true,
        fechaRegistro: "2024-01-15",
      },
      {
        id: "EMP002",
        nombre: "María García",
        email: "maria.garcia@empresa.com",
        password: "Empleado123",
        rol: "empleado",
        telefono: "5552345678",
        activo: true,
        fechaRegistro: "2024-02-20",
      },
      {
        id: "EMP003",
        nombre: "Juan Pérez",
        email: "juan.perez@empresa.com",
        password: "Empleado123",
        rol: "empleado",
        telefono: "5553456789",
        activo: true,
        fechaRegistro: "2024-03-10",
      },
      {
        id: "EMP004",
        nombre: "Ana López",
        email: "ana.lopez@empresa.com",
        password: "Empleado123",
        rol: "empleado",
        telefono: "5554567890",
        activo: true,
        fechaRegistro: "2024-06-01",
      },
      {
        id: "EMP005",
        nombre: "Roberto Sánchez",
        email: "roberto.sanchez@empresa.com",
        password: "Empleado123",
        rol: "empleado",
        telefono: "5555678901",
        activo: false, // Usuario inactivo
        fechaRegistro: "2024-08-15",
      },
      {
        id: "EMP006",
        nombre: "Laura Martínez",
        email: "laura.martinez@empresa.com",
        password: "Empleado123",
        rol: "empleado",
        telefono: "5556789012",
        activo: true,
        fechaRegistro: "2024-09-20",
      },
    ];
  }

  _getDefaultEmployees() {
    return [
      {
        id: "EMP001",
        nombre: "Carlos Mendoza",
        email: "carlos.mendoza@empresa.com",
        telefono: "5551234567",
        fechaContratacion: "2024-01-15",
        activo: true,
      },
      {
        id: "EMP002",
        nombre: "María García",
        email: "maria.garcia@empresa.com",
        telefono: "5552345678",
        fechaContratacion: "2024-02-20",
        activo: true,
      },
      {
        id: "EMP003",
        nombre: "Juan Pérez",
        email: "juan.perez@empresa.com",
        telefono: "5553456789",
        fechaContratacion: "2024-03-10",
        activo: true,
      },
      {
        id: "EMP004",
        nombre: "Ana López",
        email: "ana.lopez@empresa.com",
        telefono: "5554567890",
        fechaContratacion: "2024-06-01",
        activo: true,
      },
      {
        id: "EMP005",
        nombre: "Roberto Sánchez",
        email: "roberto.sanchez@empresa.com",
        telefono: "5555678901",
        fechaContratacion: "2024-08-15",
        activo: false, // Empleado inactivo
      },
      {
        id: "EMP006",
        nombre: "Laura Martínez",
        email: "laura.martinez@empresa.com",
        telefono: "5556789012",
        fechaContratacion: "2024-09-20",
        activo: true,
      },
    ];
  }

  _getDefaultStores() {
    const today = new Date();
    const fiveDaysAgo = new Date(today);
    fiveDaysAgo.setDate(today.getDate() - 5);
    const threeDaysAgo = new Date(today);
    threeDaysAgo.setDate(today.getDate() - 3);
    const twoDaysAgo = new Date(today);
    twoDaysAgo.setDate(today.getDate() - 2);
    const oneDayAgo = new Date(today);
    oneDayAgo.setDate(today.getDate() - 1);

    return [
      {
        id: "STORE001",
        nombre: "OXXO Centro",
        direccion: "Av. Principal #123, Col. Centro, CP 62000",
        frecuenciaVisita: 2, // Cada 2 días - REQUIERE VISITA HOY
        ultimaVisita: threeDaysAgo.toISOString().split("T")[0],
        empleadoAsignado: "EMP001",
        activa: true,
      },
      {
        id: "STORE002",
        nombre: "7-Eleven Norte",
        direccion: "Calle Juárez #456, Col. Norte, CP 62100",
        frecuenciaVisita: 3, // Cada 3 días
        ultimaVisita: oneDayAgo.toISOString().split("T")[0],
        empleadoAsignado: "EMP001",
        activa: true,
      },
      {
        id: "STORE003",
        nombre: "Extra Sur",
        direccion: "Blvd. Sur #789, Plaza Comercial, CP 62200",
        frecuenciaVisita: 7, // Cada semana
        ultimaVisita: fiveDaysAgo.toISOString().split("T")[0],
        empleadoAsignado: "EMP002",
        activa: true,
      },
      {
        id: "STORE004",
        nombre: "Circle K Poniente",
        direccion: "Av. Poniente #321, Col. Oeste, CP 62300",
        frecuenciaVisita: 1, // Cada día - REQUIERE VISITA HOY
        ultimaVisita: twoDaysAgo.toISOString().split("T")[0],
        empleadoAsignado: "EMP003",
        activa: true,
      },
      {
        id: "STORE005",
        nombre: "Tienda Oriente",
        direccion: "Calle Oriente #654, Col. Este, CP 62400",
        frecuenciaVisita: 4, // Cada 4 días - REQUIERE VISITA HOY
        ultimaVisita: fiveDaysAgo.toISOString().split("T")[0],
        empleadoAsignado: "EMP002",
        activa: true,
      },
      {
        id: "STORE006",
        nombre: "SuperCompras Plaza",
        direccion: "Centro Comercial Plaza #100, CP 62500",
        frecuenciaVisita: 3,
        ultimaVisita: null, // Sin visitas aún - REQUIERE VISITA
        empleadoAsignado: "EMP004",
        activa: true,
      },
      {
        id: "STORE007",
        nombre: "MiniSuper San Miguel",
        direccion: "Av. San Miguel #888, Barrio Antiguo, CP 62600",
        frecuenciaVisita: 5,
        ultimaVisita: null, // Sin visitas - nueva tienda
        empleadoAsignado: null, // SIN ASIGNAR
        activa: true,
      },
      {
        id: "STORE008",
        nombre: "Abarrotes Don Pepe",
        direccion: "Callejón del Comercio #25, Centro, CP 62050",
        frecuenciaVisita: 2,
        ultimaVisita: oneDayAgo.toISOString().split("T")[0],
        empleadoAsignado: null, // SIN ASIGNAR
        activa: true,
      },
      {
        id: "STORE009",
        nombre: "Tienda La Esperanza",
        direccion: "Colonia Esperanza #456, CP 62700",
        frecuenciaVisita: 7,
        ultimaVisita: twoDaysAgo.toISOString().split("T")[0],
        empleadoAsignado: "EMP006",
        activa: true,
      },
      {
        id: "STORE010",
        nombre: "Express Market (Inactiva)",
        direccion: "Av. Cerrada #999, CP 62800",
        frecuenciaVisita: 3,
        ultimaVisita: fiveDaysAgo.toISOString().split("T")[0],
        empleadoAsignado: "EMP005", // Asignada a empleado inactivo
        activa: false, // TIENDA INACTIVA
      },
    ];
  }

  _getDefaultProducts() {
    return [
      {
        id: "PROD001",
        nombre: "Coca-Cola 600ml",
        categoria: "Bebidas",
        precioSugerido: 15.5,
        unidad: "pieza",
        codigoBarras: "7501055336471",
        activo: true,
      },
      {
        id: "PROD002",
        nombre: "Agua Ciel 1L",
        categoria: "Bebidas",
        precioSugerido: 12.0,
        unidad: "pieza",
        codigoBarras: "7501055362554",
        activo: true,
      },
      {
        id: "PROD003",
        nombre: "Pepsi 600ml",
        categoria: "Bebidas",
        precioSugerido: 14.5,
        unidad: "pieza",
        codigoBarras: "7501055315584",
        activo: true,
      },
      {
        id: "PROD004",
        nombre: "Sabritas Original 45g",
        categoria: "Botanas",
        precioSugerido: 18.0,
        unidad: "bolsa",
        codigoBarras: "7501011111111",
        activo: true,
      },
      {
        id: "PROD005",
        nombre: "Doritos Nacho 60g",
        categoria: "Botanas",
        precioSugerido: 20.0,
        unidad: "bolsa",
        codigoBarras: "7501011122222",
        activo: true,
      },
      {
        id: "PROD006",
        nombre: "Ruffles Queso 50g",
        categoria: "Botanas",
        precioSugerido: 19.0,
        unidad: "bolsa",
        codigoBarras: "7501011133333",
        activo: false, // Producto descontinuado
      },
      {
        id: "PROD007",
        nombre: "Galletas Oreo",
        categoria: "Galletas",
        precioSugerido: 22.0,
        unidad: "paquete",
        codigoBarras: "7622210601155",
        activo: true,
      },
      {
        id: "PROD008",
        nombre: "Chips Ahoy",
        categoria: "Galletas",
        precioSugerido: 24.0,
        unidad: "paquete",
        codigoBarras: "7622210602155",
        activo: true,
      },
      {
        id: "PROD009",
        nombre: "Emperador Chocolate",
        categoria: "Galletas",
        precioSugerido: 18.0,
        unidad: "paquete",
        codigoBarras: "7501000100033",
        activo: true,
      },
      {
        id: "PROD010",
        nombre: "Jugo Del Valle Naranja 1L",
        categoria: "Bebidas",
        precioSugerido: 25.0,
        unidad: "litro",
        codigoBarras: "7501055308064",
        activo: true,
      },
      {
        id: "PROD011",
        nombre: "Jugo Del Valle Manzana 1L",
        categoria: "Bebidas",
        precioSugerido: 25.0,
        unidad: "litro",
        codigoBarras: "7501055308071",
        activo: true,
      },
      {
        id: "PROD012",
        nombre: "Chocolate Snickers",
        categoria: "Dulces",
        precioSugerido: 15.0,
        unidad: "pieza",
        codigoBarras: "7501000100019",
        activo: true,
      },
      {
        id: "PROD013",
        nombre: "M&M's Chocolate",
        categoria: "Dulces",
        precioSugerido: 18.0,
        unidad: "bolsa",
        codigoBarras: "7501000100040",
        activo: true,
      },
      {
        id: "PROD014",
        nombre: "Skittles Original",
        categoria: "Dulces",
        precioSugerido: 14.0,
        unidad: "bolsa",
        codigoBarras: "7501000100057",
        activo: true,
      },
      {
        id: "PROD015",
        nombre: "Chicles Trident",
        categoria: "Dulces",
        precioSugerido: 8.5,
        unidad: "paquete",
        codigoBarras: "7501000100026",
        activo: true,
      },
      {
        id: "PROD016",
        nombre: "Pan Bimbo Blanco Grande",
        categoria: "Panadería",
        precioSugerido: 42.0,
        unidad: "paquete",
        codigoBarras: "7501030470014",
        activo: true,
      },
      {
        id: "PROD017",
        nombre: "Pan Integral Bimbo",
        categoria: "Panadería",
        precioSugerido: 45.0,
        unidad: "paquete",
        codigoBarras: "7501030470021",
        activo: true,
      },
      {
        id: "PROD018",
        nombre: "Leche Lala Entera 1L",
        categoria: "Lácteos",
        precioSugerido: 23.5,
        unidad: "litro",
        codigoBarras: "7501020555014",
        activo: true,
      },
      {
        id: "PROD019",
        nombre: "Leche Lala Deslactosada 1L",
        categoria: "Lácteos",
        precioSugerido: 28.0,
        unidad: "litro",
        codigoBarras: "7501020555021",
        activo: true,
      },
      {
        id: "PROD020",
        nombre: "Yogurt Danone Natural",
        categoria: "Lácteos",
        precioSugerido: 32.0,
        unidad: "paquete",
        codigoBarras: "7501000100088",
        activo: true,
      },
      {
        id: "PROD021",
        nombre: "Huevos San Juan 12pz",
        categoria: "Frescos",
        precioSugerido: 45.0,
        unidad: "cartón",
        codigoBarras: "7501000000014",
        activo: true,
      },
      {
        id: "PROD022",
        nombre: "Huevos Orgánicos 12pz",
        categoria: "Frescos",
        precioSugerido: 65.0,
        unidad: "cartón",
        codigoBarras: "7501000000021",
        activo: true,
      },
      {
        id: "PROD023",
        nombre: "Café Nescafé Clásico 200g",
        categoria: "Despensa",
        precioSugerido: 85.0,
        unidad: "frasco",
        codigoBarras: "7501000100095",
        activo: true,
      },
      {
        id: "PROD024",
        nombre: "Azúcar Estándar 1kg",
        categoria: "Despensa",
        precioSugerido: 28.0,
        unidad: "bolsa",
        codigoBarras: "7501000100101",
        activo: true,
      },
      {
        id: "PROD025",
        nombre: "Aceite 123 900ml",
        categoria: "Despensa",
        precioSugerido: 38.0,
        unidad: "botella",
        codigoBarras: "7501000100118",
        activo: true,
      },
    ];
  }

  // ============================================
  // API: AUTENTICACIÓN
  // ============================================

  /**
   * POST /api/auth/login
   * Simula el login de usuario
   */
  async login(email, password) {
    await this._simulateNetworkDelay();

    const users = Storage.get("app_users") || [];
    const user = users.find(
      (u) => u.email === email && u.password === password
    );

    if (!user) {
      return this._errorResponse("Credenciales incorrectas", 401);
    }

    if (!user.activo) {
      return this._errorResponse("Usuario inactivo", 403);
    }

    // Generar token simulado
    const token = `mock_token_${Date.now()}_${Math.random()
      .toString(36)
      .substr(2, 9)}`;

    return this._successResponse(
      {
        user: {
          id: user.id,
          nombre: user.nombre,
          email: user.email,
          rol: user.rol,
          telefono: user.telefono,
        },
        token: token,
      },
      "Login exitoso"
    );
  }

  /**
   * POST /api/auth/logout
   * Simula el cierre de sesión
   */
  async logout() {
    await this._simulateNetworkDelay(100, 200);
    return this._successResponse(null, "Sesión cerrada");
  }

  // ============================================
  // API: EMPLEADOS
  // ============================================

  /**
   * GET /api/employees
   * Obtiene todos los empleados
   */
  async getEmployees() {
    await this._simulateNetworkDelay();
    const employees = Storage.get("app_employees") || [];
    return this._successResponse(employees, "Empleados obtenidos");
  }

  /**
   * GET /api/employees/:id
   * Obtiene un empleado por ID
   */
  async getEmployee(id) {
    await this._simulateNetworkDelay();
    const employees = Storage.get("app_employees") || [];
    const employee = employees.find((e) => e.id === id);

    if (!employee) {
      return this._errorResponse("Empleado no encontrado", 404);
    }

    return this._successResponse(employee, "Empleado obtenido");
  }

  /**
   * POST /api/employees
   * Crea un nuevo empleado
   */
  async createEmployee(employeeData) {
    await this._simulateNetworkDelay();

    const employees = Storage.get("app_employees") || [];
    const newId = this._generateId("EMP", employees);

    const newEmployee = {
      id: newId,
      ...employeeData,
      fechaContratacion: new Date().toISOString().split("T")[0],
      activo: true,
    };

    employees.push(newEmployee);
    Storage.set("app_employees", employees);

    // Sincronizar con usuarios
    await this._syncEmployeeToUser(newEmployee);

    return this._successResponse(newEmployee, "Empleado creado exitosamente");
  }

  /**
   * PUT /api/employees/:id
   * Actualiza un empleado existente
   */
  async updateEmployee(id, employeeData) {
    await this._simulateNetworkDelay();

    const employees = Storage.get("app_employees") || [];
    const index = employees.findIndex((e) => e.id === id);

    if (index === -1) {
      return this._errorResponse("Empleado no encontrado", 404);
    }

    employees[index] = { ...employees[index], ...employeeData };
    Storage.set("app_employees", employees);

    // Sincronizar con usuarios
    await this._syncEmployeeToUser(employees[index]);

    return this._successResponse(
      employees[index],
      "Empleado actualizado exitosamente"
    );
  }

  /**
   * DELETE /api/employees/:id
   * Elimina un empleado
   */
  async deleteEmployee(id) {
    await this._simulateNetworkDelay();

    // Verificar si tiene tiendas asignadas
    const stores = Storage.get("app_stores") || [];
    const hasStores = stores.some((s) => s.empleadoAsignado === id);

    if (hasStores) {
      return this._errorResponse(
        "No se puede eliminar. El empleado tiene tiendas asignadas",
        400
      );
    }

    const employees = Storage.get("app_employees") || [];
    const filtered = employees.filter((e) => e.id !== id);

    if (filtered.length === employees.length) {
      return this._errorResponse("Empleado no encontrado", 404);
    }

    Storage.set("app_employees", filtered);

    // Eliminar usuario asociado
    const users = Storage.get("app_users") || [];
    const filteredUsers = users.filter((u) => u.id !== id);
    Storage.set("app_users", filteredUsers);

    return this._successResponse(null, "Empleado eliminado exitosamente");
  }

  // ============================================
  // API: TIENDAS
  // ============================================

  /**
   * GET /api/stores
   * Obtiene todas las tiendas
   */
  async getStores(filters = {}) {
    await this._simulateNetworkDelay();
    let stores = Storage.get("app_stores") || [];

    // Aplicar filtros si existen
    if (filters.employeeId) {
      stores = stores.filter((s) => s.empleadoAsignado === filters.employeeId);
    }
    if (filters.activa !== undefined) {
      stores = stores.filter((s) => s.activa === filters.activa);
    }

    return this._successResponse(stores, "Tiendas obtenidas");
  }

  /**
   * GET /api/stores/:id
   * Obtiene una tienda por ID
   */
  async getStore(id) {
    await this._simulateNetworkDelay();
    const stores = Storage.get("app_stores") || [];
    const store = stores.find((s) => s.id === id);

    if (!store) {
      return this._errorResponse("Tienda no encontrada", 404);
    }

    return this._successResponse(store, "Tienda obtenida");
  }

  /**
   * GET /api/stores/employee/:employeeId/today
   * Obtiene las tiendas que debe visitar un empleado HOY
   */
  async getStoresToVisitToday(employeeId) {
    await this._simulateNetworkDelay();

    const stores = Storage.get("app_stores") || [];
    const employeeStores = stores.filter(
      (s) => s.empleadoAsignado === employeeId && s.activa
    );

    const storesToVisit = employeeStores.filter((store) =>
      this._shouldVisitToday(store)
    );

    return this._successResponse(
      storesToVisit,
      "Tiendas a visitar hoy obtenidas"
    );
  }

  /**
   * POST /api/stores
   * Crea una nueva tienda
   */
  async createStore(storeData) {
    await this._simulateNetworkDelay();

    const stores = Storage.get("app_stores") || [];
    const newId = this._generateId("STORE", stores);

    const newStore = {
      id: newId,
      ...storeData,
      ultimaVisita: null,
      activa: true,
    };

    stores.push(newStore);
    Storage.set("app_stores", stores);

    return this._successResponse(newStore, "Tienda creada exitosamente");
  }

  /**
   * PUT /api/stores/:id
   * Actualiza una tienda existente
   */
  async updateStore(id, storeData) {
    await this._simulateNetworkDelay();

    const stores = Storage.get("app_stores") || [];
    const index = stores.findIndex((s) => s.id === id);

    if (index === -1) {
      return this._errorResponse("Tienda no encontrada", 404);
    }

    stores[index] = { ...stores[index], ...storeData };
    Storage.set("app_stores", stores);

    return this._successResponse(
      stores[index],
      "Tienda actualizada exitosamente"
    );
  }

  /**
   * DELETE /api/stores/:id
   * Elimina una tienda
   */
  async deleteStore(id) {
    await this._simulateNetworkDelay();

    const stores = Storage.get("app_stores") || [];
    const filtered = stores.filter((s) => s.id !== id);

    if (filtered.length === stores.length) {
      return this._errorResponse("Tienda no encontrada", 404);
    }

    Storage.set("app_stores", filtered);
    return this._successResponse(null, "Tienda eliminada exitosamente");
  }

  /**
   * POST /api/stores/:id/visit
   * Registra una visita completada
   */
  async completeVisit(storeId) {
    await this._simulateNetworkDelay();

    const today = new Date().toISOString().split("T")[0];
    const result = await this.updateStore(storeId, { ultimaVisita: today });

    if (result.success) {
      return this._successResponse(
        result.data,
        "Visita registrada exitosamente"
      );
    }

    return result;
  }

  // ============================================
  // API: PRODUCTOS
  // ============================================

  /**
   * GET /api/products
   * Obtiene todos los productos
   */
  async getProducts(filters = {}) {
    await this._simulateNetworkDelay();
    let products = Storage.get("app_products") || [];

    if (filters.activo !== undefined) {
      products = products.filter((p) => p.activo === filters.activo);
    }
    if (filters.categoria) {
      products = products.filter((p) => p.categoria === filters.categoria);
    }

    return this._successResponse(products, "Productos obtenidos");
  }

  /**
   * GET /api/products/:id
   * Obtiene un producto por ID
   */
  async getProduct(id) {
    await this._simulateNetworkDelay();
    const products = Storage.get("app_products") || [];
    const product = products.find((p) => p.id === id);

    if (!product) {
      return this._errorResponse("Producto no encontrado", 404);
    }

    return this._successResponse(product, "Producto obtenido");
  }

  /**
   * POST /api/products
   * Crea un nuevo producto
   */
  async createProduct(productData) {
    await this._simulateNetworkDelay();

    const products = Storage.get("app_products") || [];
    const newId = this._generateId("PROD", products);

    const newProduct = {
      id: newId,
      ...productData,
      activo: true,
    };

    products.push(newProduct);
    Storage.set("app_products", products);

    return this._successResponse(newProduct, "Producto creado exitosamente");
  }

  /**
   * PUT /api/products/:id
   * Actualiza un producto existente
   */
  async updateProduct(id, productData) {
    await this._simulateNetworkDelay();

    const products = Storage.get("app_products") || [];
    const index = products.findIndex((p) => p.id === id);

    if (index === -1) {
      return this._errorResponse("Producto no encontrado", 404);
    }

    products[index] = { ...products[index], ...productData };
    Storage.set("app_products", products);

    return this._successResponse(
      products[index],
      "Producto actualizado exitosamente"
    );
  }

  /**
   * DELETE /api/products/:id
   * Elimina un producto
   */
  async deleteProduct(id) {
    await this._simulateNetworkDelay();

    const products = Storage.get("app_products") || [];
    const filtered = products.filter((p) => p.id !== id);

    if (filtered.length === products.length) {
      return this._errorResponse("Producto no encontrado", 404);
    }

    Storage.set("app_products", filtered);
    return this._successResponse(null, "Producto eliminado exitosamente");
  }

  // ============================================
  // API: ESTADÍSTICAS
  // ============================================

  /**
   * GET /api/stats/admin
   * Obtiene estadísticas para el dashboard admin
   */
  async getAdminStats() {
    await this._simulateNetworkDelay();

    const employees = Storage.get("app_employees") || [];
    const stores = Storage.get("app_stores") || [];
    const products = Storage.get("app_products") || [];

    const activeEmployees = employees.filter((e) => e.activo);
    const activeStores = stores.filter((s) => s.activa);
    const assignedStores = activeStores.filter((s) => s.empleadoAsignado);

    // Calcular tiendas que necesitan visita hoy
    const storesTodayCount = activeStores.filter((s) =>
      this._shouldVisitToday(s)
    ).length;

    // Categorías únicas de productos
    const categories = [...new Set(products.map((p) => p.categoria))];

    const stats = {
      totalEmpleados: employees.length,
      empleadosActivos: activeEmployees.length,
      totalTiendas: stores.length,
      tiendasActivas: activeStores.length,
      tiendasAsignadas: assignedStores.length,
      tiendasVisitarHoy: storesTodayCount,
      totalProductos: products.length,
      categorias: categories.length,
    };

    return this._successResponse(stats, "Estadísticas obtenidas");
  }

  /**
   * GET /api/stats/employee/:id
   * Obtiene estadísticas para un empleado específico
   */
  async getEmployeeStats(employeeId) {
    await this._simulateNetworkDelay();

    const stores = Storage.get("app_stores") || [];
    const employeeStores = stores.filter(
      (s) => s.empleadoAsignado === employeeId && s.activa
    );

    const storesToVisit = employeeStores.filter((s) =>
      this._shouldVisitToday(s)
    );
    const visitedStores = employeeStores.filter((s) => s.ultimaVisita !== null);

    const stats = {
      tiendasAsignadas: employeeStores.length,
      tiendasVisitarHoy: storesToVisit.length,
      tiendasVisitadas: visitedStores.length,
      tiendasPendientes: employeeStores.length - visitedStores.length,
    };

    return this._successResponse(stats, "Estadísticas del empleado obtenidas");
  }

  // ============================================
  // UTILIDADES PRIVADAS
  // ============================================

  _generateId(prefix, array) {
    if (array.length === 0) return `${prefix}001`;

    const lastId = array[array.length - 1].id;
    const num = parseInt(lastId.replace(prefix, "")) + 1;
    return `${prefix}${String(num).padStart(3, "0")}`;
  }

  _shouldVisitToday(store) {
    if (!store.ultimaVisita) return true;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const lastVisit = new Date(store.ultimaVisita);
    lastVisit.setHours(0, 0, 0, 0);

    const diffDays = Math.floor((today - lastVisit) / (1000 * 60 * 60 * 24));
    return diffDays >= store.frecuenciaVisita;
  }

  async _syncEmployeeToUser(employee) {
    const users = Storage.get("app_users") || [];
    const existingUserIndex = users.findIndex((u) => u.id === employee.id);

    const userData = {
      id: employee.id,
      nombre: employee.nombre,
      email: employee.email,
      password:
        existingUserIndex >= 0
          ? users[existingUserIndex].password
          : "Empleado123",
      rol: "empleado",
      telefono: employee.telefono,
      activo: employee.activo,
      fechaRegistro: employee.fechaContratacion,
    };

    if (existingUserIndex >= 0) {
      users[existingUserIndex] = userData;
    } else {
      users.push(userData);
    }

    Storage.set("app_users", users);
  }
}

// Instancia global del servicio
const mockAPI = new MockAPIService();

// Exportar para uso en otros archivos
if (typeof window !== "undefined") {
  window.mockAPI = mockAPI;
}
