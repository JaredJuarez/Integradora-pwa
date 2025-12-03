// employee-data.js - Datos mockeados específicos para el flujo del empleado

// Tiendas asignadas a empleados (rutas)
const DEMO_TIENDAS = [
  {
    id: "store_001",
    nombre: "SuperMercado Centro",
    direccion: "Av. Plan de Ayala #123, Centro, Cuernavaca, Morelos",
    qrCode: "QR_STORE_001", // Código QR único de la tienda
    coordenadas: { lat: 18.9186, lng: -99.2342 },
    activa: true,
    horario: "08:00 - 20:00",
  },
  {
    id: "store_002",
    nombre: "Tienda Norte Plaza",
    direccion: "Blvd. Cuauhnáhuac #456, Col. Cantarranas, Cuernavaca, Morelos",
    qrCode: "QR_STORE_002",
    coordenadas: { lat: 18.9351, lng: -99.2401 },
    activa: true,
    horario: "07:00 - 21:00",
  },
  {
    id: "store_003",
    nombre: "Express Sur",
    direccion:
      "Av. Emiliano Zapata #789, Col. Vista Hermosa, Cuernavaca, Morelos",
    qrCode: "QR_STORE_003",
    coordenadas: { lat: 18.8956, lng: -99.2156 },
    activa: true,
    horario: "06:00 - 22:00",
  },
  {
    id: "store_004",
    nombre: "Mini Market Palmira",
    direccion: "Carr. Federal #321, Palmira, Cuernavaca, Morelos",
    qrCode: "QR_STORE_004",
    coordenadas: { lat: 18.9012, lng: -99.2289 },
    activa: true,
    horario: "24 horas",
  },
  {
    id: "store_005",
    nombre: "Abarrotes La Selva",
    direccion: "Av. Universidad #654, Col. La Selva, Cuernavaca, Morelos",
    qrCode: "QR_STORE_005",
    coordenadas: { lat: 18.9145, lng: -99.2412 },
    activa: false, // Completada
    horario: "09:00 - 19:00",
  },
];

// Rutas asignadas por empleado
const EMPLEADO_RUTAS = {
  3: {
    // ID del empleado demo
    tiendas: ["store_001", "store_002", "store_003", "store_004", "store_005"],
    fecha: "2025-12-03",
    estado: "activa", // activa, completada, pausada
  },
};

// Productos disponibles para surtir en tiendas
const PRODUCTOS_SURTIR = [
  {
    id: "prod_001",
    nombre: "Coca Cola 600ml",
    categoria: "Bebidas",
    precioSugerido: 15.0,
    unidad: "pieza",
    codigoBarras: "7501055300014",
  },
  {
    id: "prod_002",
    nombre: "Sabritas Original 45g",
    categoria: "Botanas",
    precioSugerido: 18.0,
    unidad: "bolsa",
    codigoBarras: "7501011111111",
  },
  {
    id: "prod_003",
    nombre: "Bimbo Pan Blanco",
    categoria: "Panadería",
    precioSugerido: 32.0,
    unidad: "paquete",
    codigoBarras: "7501030470014",
  },
  {
    id: "prod_004",
    nombre: "Lala Leche Entera 1L",
    categoria: "Lácteos",
    precioSugerido: 28.5,
    unidad: "litro",
    codigoBarras: "7501020555014",
  },
  {
    id: "prod_005",
    nombre: "Gamesa Chokis",
    categoria: "Galletas",
    precioSugerido: 22.0,
    unidad: "paquete",
    codigoBarras: "7501055530014",
  },
  {
    id: "prod_006",
    nombre: "Huevos San Juan 12 piezas",
    categoria: "Frescos",
    precioSugerido: 45.0,
    unidad: "cartón",
    codigoBarras: "7501000000014",
  },
  {
    id: "prod_007",
    nombre: "Aceite Capullo 1L",
    categoria: "Aceites",
    precioSugerido: 65.0,
    unidad: "botella",
    codigoBarras: "7501031111014",
  },
  {
    id: "prod_008",
    nombre: "Arroz Verde Valle 1kg",
    categoria: "Granos",
    precioSugerido: 38.0,
    unidad: "bolsa",
    codigoBarras: "7501040000014",
  },
  {
    id: "prod_009",
    nombre: "Jabón Roma Neutro",
    categoria: "Limpieza",
    precioSugerido: 12.5,
    unidad: "barra",
    codigoBarras: "7501050000014",
  },
  {
    id: "prod_010",
    nombre: "Papel Higiénico Suavel 4 rollos",
    categoria: "Higiene",
    precioSugerido: 55.0,
    unidad: "paquete",
    codigoBarras: "7501060000014",
  },
];

// Pedidos/visitas completadas (historial)
const DEMO_PEDIDOS_EMPLEADO = [
  {
    id: "ped_emp_001",
    empleadoId: 3,
    tiendaId: "store_005",
    fecha: "2025-12-02",
    horaInicioVisita: "09:15:00",
    horaFinVisita: "09:45:00",
    productos: [
      {
        productoId: "prod_001",
        cantidad: 24,
        observaciones: "Producto en buen estado",
      },
      {
        productoId: "prod_002",
        cantidad: 12,
        observaciones: "Fecha próxima a vencer",
      },
      {
        productoId: "prod_004",
        cantidad: 6,
        observaciones: "Refrigeración OK",
      },
    ],
    fotoEstante: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABg...", // Base64 de imagen
    observacionesGenerales: "Tienda en excelentes condiciones, personal amable",
    estado: "completado",
    coordenadasVisita: { lat: 18.9145, lng: -99.2412 },
    qrEscaneado: "QR_STORE_005",
    duracionVisita: 30, // minutos
  },
];

// Estado actual de la ruta del empleado
const ESTADO_RUTA_ACTUAL = {
  empleadoId: 3,
  fecha: "2025-12-03",
  tiendaActual: null, // null = no ha iniciado ninguna visita
  horaInicioRuta: null,
  tiendasPendientes: ["store_001", "store_002", "store_003", "store_004"],
  tiendasCompletadas: ["store_005"],
  estadoGeneral: "en_progreso", // pendiente, en_progreso, completada
};

// Funciones para manejar datos del empleado

// Obtener tiendas asignadas al empleado para el día actual
function getTiendasAsignadasEmpleado(empleadoId) {
  const rutaEmpleado = EMPLEADO_RUTAS[empleadoId];
  if (!rutaEmpleado) return [];

  const tiendas = rutaEmpleado.tiendas.map((tiendaId) => {
    const tienda = DEMO_TIENDAS.find((t) => t.id === tiendaId);
    const estadoActual = ESTADO_RUTA_ACTUAL;

    // Determinar estado de la tienda
    let estado = "pendiente";
    if (estadoActual.tiendasCompletadas.includes(tiendaId)) {
      estado = "completada";
    } else if (estadoActual.tiendaActual === tiendaId) {
      estado = "en_visita";
    }

    return {
      ...tienda,
      estado: estado,
      completada: estadoActual.tiendasCompletadas.includes(tiendaId),
    };
  });

  return tiendas;
}

// Obtener productos disponibles para surtir
function getProductosSurtir() {
  return PRODUCTOS_SURTIR;
}

// Validar código QR de tienda
function validarQRTienda(qrCode, tiendaId) {
  const tienda = DEMO_TIENDAS.find((t) => t.id === tiendaId);
  return tienda && tienda.qrCode === qrCode;
}

// Iniciar visita a tienda
function iniciarVisitaTienda(empleadoId, tiendaId, coordenadas) {
  const timestamp = new Date().toISOString();

  // Actualizar estado global
  ESTADO_RUTA_ACTUAL.tiendaActual = tiendaId;
  if (!ESTADO_RUTA_ACTUAL.horaInicioRuta) {
    ESTADO_RUTA_ACTUAL.horaInicioRuta = timestamp;
  }

  // Crear registro de visita temporal
  const visitaActual = {
    empleadoId: empleadoId,
    tiendaId: tiendaId,
    fechaInicio: timestamp,
    coordenadasInicio: coordenadas,
    estado: "en_curso",
  };

  Storage.set("visitaActual", visitaActual);
  Storage.set("estadoRutaActual", ESTADO_RUTA_ACTUAL);

  return visitaActual;
}

// Completar visita a tienda
function completarVisitaTienda(datosVisita) {
  const visitaActual = Storage.get("visitaActual");
  if (!visitaActual) return null;

  const timestamp = new Date().toISOString();
  const horaInicio = new Date(visitaActual.fechaInicio);
  const horaFin = new Date(timestamp);
  const duracionMinutos = Math.round((horaFin - horaInicio) / 1000 / 60);

  // Crear pedido completado
  const pedidoCompleto = {
    id: "ped_emp_" + Date.now(),
    empleadoId: visitaActual.empleadoId,
    tiendaId: visitaActual.tiendaId,
    fecha: timestamp.split("T")[0],
    horaInicioVisita: horaInicio.toTimeString().split(" ")[0],
    horaFinVisita: horaFin.toTimeString().split(" ")[0],
    productos: datosVisita.productos || [],
    fotoEstante: datosVisita.fotoEstante,
    observacionesGenerales: datosVisita.observaciones || "",
    estado: "completado",
    coordenadasVisita: visitaActual.coordenadasInicio,
    qrEscaneado: datosVisita.qrCode,
    duracionVisita: duracionMinutos,
  };

  // Actualizar estado de ruta
  ESTADO_RUTA_ACTUAL.tiendaActual = null;
  ESTADO_RUTA_ACTUAL.tiendasPendientes =
    ESTADO_RUTA_ACTUAL.tiendasPendientes.filter(
      (t) => t !== visitaActual.tiendaId
    );
  ESTADO_RUTA_ACTUAL.tiendasCompletadas.push(visitaActual.tiendaId);

  if (ESTADO_RUTA_ACTUAL.tiendasPendientes.length === 0) {
    ESTADO_RUTA_ACTUAL.estadoGeneral = "completada";
  }

  // Guardar en historial
  let historialPedidos = Storage.get("pedidosEmpleado") || [];
  historialPedidos.push(pedidoCompleto);
  Storage.set("pedidosEmpleado", historialPedidos);

  // Limpiar visita actual
  Storage.remove("visitaActual");
  Storage.set("estadoRutaActual", ESTADO_RUTA_ACTUAL);

  return pedidoCompleto;
}

// Obtener historial de pedidos del empleado
function getHistorialPedidosEmpleado(empleadoId, filtros = {}) {
  let pedidos = Storage.get("pedidosEmpleado") || DEMO_PEDIDOS_EMPLEADO;

  // Filtrar por empleado
  pedidos = pedidos.filter((p) => p.empleadoId === empleadoId);

  // Filtrar por fecha si se especifica
  if (filtros.fecha) {
    pedidos = pedidos.filter((p) => p.fecha === filtros.fecha);
  }

  // Ordenar por fecha más reciente
  return pedidos.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
}

// Obtener estadísticas del empleado
function getEstadisticasEmpleado(empleadoId) {
  const historial = getHistorialPedidosEmpleado(empleadoId);
  const hoy = new Date().toISOString().split("T")[0];
  const estadoRuta = Storage.get("estadoRutaActual") || ESTADO_RUTA_ACTUAL;

  const pedidosHoy = historial.filter((p) => p.fecha === hoy);
  const totalProductosHoy = pedidosHoy.reduce(
    (sum, p) =>
      sum + p.productos.reduce((pSum, prod) => pSum + prod.cantidad, 0),
    0
  );

  return {
    tiendasAsignadas:
      estadoRuta.tiendasPendientes.length +
      estadoRuta.tiendasCompletadas.length,
    tiendasCompletadas: estadoRuta.tiendasCompletadas.length,
    tiendasPendientes: estadoRuta.tiendasPendientes.length,
    productosEntregadosHoy: totalProductosHoy,
    visitasHoy: pedidosHoy.length,
    promedioTiempoPorVisita:
      pedidosHoy.length > 0
        ? Math.round(
            pedidosHoy.reduce((sum, p) => sum + p.duracionVisita, 0) /
              pedidosHoy.length
          )
        : 0,
    rutaCompletada: estadoRuta.estadoGeneral === "completada",
  };
}

// Inicializar datos del empleado
function initEmpleadoData() {
  // Inicializar estado de ruta si no existe
  if (!Storage.get("estadoRutaActual")) {
    Storage.set("estadoRutaActual", ESTADO_RUTA_ACTUAL);
  }

  // Inicializar historial de pedidos si no existe
  if (!Storage.get("pedidosEmpleado")) {
    Storage.set("pedidosEmpleado", DEMO_PEDIDOS_EMPLEADO);
  }
}

// Simular escaneo de QR (para desarrollo)
function simularEscaneoQR(tiendaId) {
  const tienda = DEMO_TIENDAS.find((t) => t.id === tiendaId);
  return tienda ? tienda.qrCode : null;
}

// Exportar funciones y datos
window.DEMO_TIENDAS = DEMO_TIENDAS;
window.EMPLEADO_RUTAS = EMPLEADO_RUTAS;
window.PRODUCTOS_SURTIR = PRODUCTOS_SURTIR;
window.DEMO_PEDIDOS_EMPLEADO = DEMO_PEDIDOS_EMPLEADO;
window.ESTADO_RUTA_ACTUAL = ESTADO_RUTA_ACTUAL;

window.getTiendasAsignadasEmpleado = getTiendasAsignadasEmpleado;
window.getProductosSurtir = getProductosSurtir;
window.validarQRTienda = validarQRTienda;
window.iniciarVisitaTienda = iniciarVisitaTienda;
window.completarVisitaTienda = completarVisitaTienda;
window.getHistorialPedidosEmpleado = getHistorialPedidosEmpleado;
window.getEstadisticasEmpleado = getEstadisticasEmpleado;
window.initEmpleadoData = initEmpleadoData;
window.simularEscaneoQR = simularEscaneoQR;
