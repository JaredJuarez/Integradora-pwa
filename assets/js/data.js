// data.js - Datos de demostración para la PWA

// Productos de demostración
const DEMO_PRODUCTS = [
  {
    id: 1,
    nombre: "Laptop Dell XPS 15",
    descripcion:
      "Laptop de alto rendimiento con procesador Intel Core i7, 16GB RAM, 512GB SSD",
    precio: 28999.99,
    stock: 15,
    categoria: "Electrónica",
    imagen: "https://via.placeholder.com/300x300?text=Laptop",
    activo: true,
    fechaCreacion: "2025-01-01",
  },
  {
    id: 2,
    nombre: "iPhone 15 Pro",
    descripcion: "Smartphone Apple con chip A17 Pro, cámara de 48MP, 256GB",
    precio: 32999.99,
    stock: 25,
    categoria: "Electrónica",
    imagen: "https://via.placeholder.com/300x300?text=iPhone",
    activo: true,
    fechaCreacion: "2025-01-02",
  },
  {
    id: 3,
    nombre: "Samsung Galaxy S24",
    descripcion: "Smartphone Android con Snapdragon 8 Gen 3, 12GB RAM, 256GB",
    precio: 24999.99,
    stock: 30,
    categoria: "Electrónica",
    imagen: "https://via.placeholder.com/300x300?text=Samsung",
    activo: true,
    fechaCreacion: "2025-01-03",
  },
  {
    id: 4,
    nombre: "iPad Air M2",
    descripcion: 'Tablet Apple con chip M2, pantalla 11", 128GB',
    precio: 18999.99,
    stock: 20,
    categoria: "Electrónica",
    imagen: "https://via.placeholder.com/300x300?text=iPad",
    activo: true,
    fechaCreacion: "2025-01-04",
  },
  {
    id: 5,
    nombre: "Sony WH-1000XM5",
    descripcion: "Audífonos inalámbricos con cancelación de ruido premium",
    precio: 7999.99,
    stock: 40,
    categoria: "Audio",
    imagen: "https://via.placeholder.com/300x300?text=Headphones",
    activo: true,
    fechaCreacion: "2025-01-05",
  },
  {
    id: 6,
    nombre: "Apple Watch Series 9",
    descripcion: "Smartwatch con GPS, monitor de salud, 45mm",
    precio: 12999.99,
    stock: 18,
    categoria: "Wearables",
    imagen: "https://via.placeholder.com/300x300?text=Apple+Watch",
    activo: true,
    fechaCreacion: "2025-01-06",
  },
  {
    id: 7,
    nombre: "Nintendo Switch OLED",
    descripcion: 'Consola de videojuegos híbrida con pantalla OLED de 7"',
    precio: 9999.99,
    stock: 12,
    categoria: "Gaming",
    imagen: "https://via.placeholder.com/300x300?text=Switch",
    activo: true,
    fechaCreacion: "2025-01-07",
  },
  {
    id: 8,
    nombre: "PlayStation 5",
    descripcion: "Consola de videojuegos de nueva generación, 1TB SSD",
    precio: 13999.99,
    stock: 8,
    categoria: "Gaming",
    imagen: "https://via.placeholder.com/300x300?text=PS5",
    activo: true,
    fechaCreacion: "2025-01-08",
  },
  {
    id: 9,
    nombre: "Canon EOS R6",
    descripcion: "Cámara mirrorless full-frame de 20MP con video 4K",
    precio: 45999.99,
    stock: 5,
    categoria: "Fotografía",
    imagen: "https://via.placeholder.com/300x300?text=Camera",
    activo: true,
    fechaCreacion: "2025-01-09",
  },
  {
    id: 10,
    nombre: "GoPro Hero 12",
    descripcion: "Cámara de acción 4K con estabilización HyperSmooth",
    precio: 11999.99,
    stock: 22,
    categoria: "Fotografía",
    imagen: "https://via.placeholder.com/300x300?text=GoPro",
    activo: true,
    fechaCreacion: "2025-01-10",
  },
];

// Pedidos de demostración (solo para admin)
const DEMO_ORDERS = [
  {
    id: 1001,
    empleadoId: 3,
    empleado: "Carlos Mendoza",
    tienda: "SuperMercado Centro",
    productos: [
      {
        productoId: "prod_001",
        nombre: "Coca Cola 600ml",
        cantidad: 24,
        precio: 15.0,
      },
    ],
    total: 360.0,
    estado: "completado",
    fecha: "2025-12-02",
    direccion: "Av. Plan de Ayala #123, Centro, Cuernavaca, Morelos",
  },
  {
    id: 1002,
    empleadoId: 3,
    empleado: "Carlos Mendoza",
    tienda: "Tienda Norte Plaza",
    productos: [
      {
        productoId: "prod_002",
        nombre: "Sabritas Original 45g",
        cantidad: 12,
        precio: 18.0,
      },
      {
        productoId: "prod_004",
        nombre: "Lala Leche Entera 1L",
        cantidad: 6,
        precio: 28.5,
      },
    ],
    total: 387.0,
    estado: "en proceso",
    fecha: "2025-12-03",
    direccion: "Blvd. Cuauhnáhuac #456, Col. Cantarranas, Cuernavaca, Morelos",
  },
];

// Categorías
const CATEGORIES = [
  "Electrónica",
  "Audio",
  "Wearables",
  "Gaming",
  "Fotografía",
  "Accesorios",
  "Computadoras",
  "Smartphones",
];

// Estados de pedidos
const ORDER_STATUSES = [
  { value: "pendiente", label: "Pendiente", color: "yellow" },
  { value: "en proceso", label: "En Proceso", color: "blue" },
  { value: "enviado", label: "Enviado", color: "indigo" },
  { value: "entregado", label: "Entregado", color: "green" },
  { value: "cancelado", label: "Cancelado", color: "red" },
];

// Roles de usuario
const USER_ROLES = [
  { value: "administrador", label: "Administrador" },
  { value: "empleado", label: "Empleado" },
];

// Inicializar datos de demostración
function initDemoData() {
  // Inicializar productos si no existen
  if (!Storage.get("products")) {
    Storage.set("products", DEMO_PRODUCTS);
  }

  // Inicializar pedidos si no existen
  if (!Storage.get("orders")) {
    Storage.set("orders", DEMO_ORDERS);
  }

  // Inicializar carrito vacío si no existe
  if (!Storage.get("cart")) {
    Storage.set("cart", []);
  }

  // Inicializar favoritos vacíos si no existen
  if (!Storage.get("favorites")) {
    Storage.set("favorites", []);
  }
}

// Obtener productos
function getProducts(filters = {}) {
  let products = Storage.get("products") || [];

  // Filtrar por categoría
  if (filters.categoria) {
    products = products.filter((p) => p.categoria === filters.categoria);
  }

  // Filtrar por búsqueda
  if (filters.search) {
    const search = filters.search.toLowerCase();
    products = products.filter(
      (p) =>
        p.nombre.toLowerCase().includes(search) ||
        p.descripcion.toLowerCase().includes(search)
    );
  }

  // Filtrar por precio
  if (filters.minPrice) {
    products = products.filter((p) => p.precio >= parseFloat(filters.minPrice));
  }
  if (filters.maxPrice) {
    products = products.filter((p) => p.precio <= parseFloat(filters.maxPrice));
  }

  // Filtrar solo activos
  if (filters.activeOnly) {
    products = products.filter((p) => p.activo);
  }

  // Ordenar
  if (filters.sortBy) {
    products.sort((a, b) => {
      switch (filters.sortBy) {
        case "precio-asc":
          return a.precio - b.precio;
        case "precio-desc":
          return b.precio - a.precio;
        case "nombre-asc":
          return a.nombre.localeCompare(b.nombre);
        case "nombre-desc":
          return b.nombre.localeCompare(a.nombre);
        default:
          return 0;
      }
    });
  }

  return products;
}

// Obtener producto por ID
function getProductById(id) {
  const products = Storage.get("products") || [];
  return products.find((p) => p.id === parseInt(id));
}

// Guardar producto (crear o actualizar)
function saveProduct(product) {
  let products = Storage.get("products") || [];

  if (product.id) {
    // Actualizar
    const index = products.findIndex((p) => p.id === product.id);
    if (index !== -1) {
      products[index] = { ...products[index], ...product };
    }
  } else {
    // Crear
    product.id = Generators.numericId();
    product.fechaCreacion = new Date().toISOString();
    products.push(product);
  }

  Storage.set("products", products);
  return product;
}

// Eliminar producto
function deleteProduct(id) {
  let products = Storage.get("products") || [];
  products = products.filter((p) => p.id !== parseInt(id));
  Storage.set("products", products);
}

// Obtener pedidos
function getOrders(filters = {}) {
  let orders = Storage.get("orders") || [];

  // Filtrar por empleado
  if (filters.empleadoId) {
    orders = orders.filter(
      (o) => o.empleadoId === parseInt(filters.empleadoId)
    );
  }

  // Filtrar por estado
  if (filters.estado) {
    orders = orders.filter((o) => o.estado === filters.estado);
  }

  // Ordenar por fecha más reciente
  orders.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));

  return orders;
}

// Obtener pedido por ID
function getOrderById(id) {
  const orders = Storage.get("orders") || [];
  return orders.find((o) => o.id === parseInt(id));
}

// Crear pedido
function createOrder(orderData) {
  let orders = Storage.get("orders") || [];

  const newOrder = {
    id: Generators.numericId(),
    ...orderData,
    fecha: new Date().toISOString(),
    estado: "pendiente",
  };

  orders.push(newOrder);
  Storage.set("orders", orders);

  return newOrder;
}

// Actualizar estado de pedido
function updateOrderStatus(orderId, newStatus) {
  let orders = Storage.get("orders") || [];
  const index = orders.findIndex((o) => o.id === parseInt(orderId));

  if (index !== -1) {
    orders[index].estado = newStatus;
    Storage.set("orders", orders);
    return orders[index];
  }

  return null;
}

// Obtener estadísticas para dashboard
function getDashboardStats() {
  const products = Storage.get("products") || [];
  const orders = Storage.get("orders") || [];
  const users = Storage.get("users") || [];
  const pedidosEmpleado = Storage.get("pedidosEmpleado") || [];

  const totalVentas = pedidosEmpleado.reduce(
    (sum, pedido) =>
      sum +
      pedido.productos.reduce((pSum, prod) => pSum + prod.cantidad * 15, 0),
    0
  ); // precio promedio
  const ventasHoy = pedidosEmpleado
    .filter((p) => p.fecha === new Date().toISOString().split("T")[0])
    .reduce(
      (sum, pedido) =>
        sum +
        pedido.productos.reduce((pSum, prod) => pSum + prod.cantidad * 15, 0),
      0
    );

  return {
    totalProductos: products.length,
    productosActivos: products.filter((p) => p.activo).length,
    productosBajoStock: products.filter((p) => p.stock < 10).length,
    totalVentas: totalVentas,
    ventasHoy: ventasHoy,
    totalPedidos: pedidosEmpleado.length,
    pedidosPendientes: orders.filter((o) => o.estado === "pendiente").length,
    totalUsuarios: users.length,
    empleadosActivos: users.filter((u) => u.rol === "empleado" && u.activo)
      .length,
    visitasCompletadas: pedidosEmpleado.filter((p) => p.estado === "completado")
      .length,
  };
}

// Inicializar datos al cargar
initDemoData();

// Exportar funciones y constantes
window.DEMO_PRODUCTS = DEMO_PRODUCTS;
window.DEMO_ORDERS = DEMO_ORDERS;
window.CATEGORIES = CATEGORIES;
window.ORDER_STATUSES = ORDER_STATUSES;
window.USER_ROLES = USER_ROLES;
window.initDemoData = initDemoData;
window.getProducts = getProducts;
window.getProductById = getProductById;
window.saveProduct = saveProduct;
window.deleteProduct = deleteProduct;
window.getOrders = getOrders;
window.getOrderById = getOrderById;
window.createOrder = createOrder;
window.updateOrderStatus = updateOrderStatus;
window.getDashboardStats = getDashboardStats;
