// employee-data.js - Capa de datos para empleados (usa Mock API)

/**
 * Employee Data Service
 * Capa de abstracción que usa el Mock API Service
 * En producción, se reemplazarían las llamadas a mockAPI por fetch() reales
 */

// ============================================
// OBTENER TIENDAS ASIGNADAS QUE SE DEBEN VISITAR HOY
// ============================================

/**
 * Obtiene las tiendas que el empleado actual debe visitar HOY
 * Producción: GET /api/stores/employee/:id/today
 */
async function getTiendasAsignadasEmpleado() {
  const user = getCurrentUser();
  if (!user || user.rol !== "empleado") {
    return [];
  }

  try {
    // Llamar al API mock (en producción sería un fetch real)
    const response = await mockAPI.getStoresToVisitToday(user.id);

    if (!response.success) {
      console.error("Error al obtener tiendas:", response.error);
      return [];
    }

    // Obtener estado de visitas del storage local
    const visitStatus = Storage.get(`visit_status_${user.id}`) || {};
    const today = new Date().toISOString().split("T")[0];

    // Agregar información de estado local a las tiendas
    return response.data.map((store) => ({
      ...store,
      qrCode: `QR_${store.id}`,
      completada:
        (visitStatus[store.id]?.fecha === today &&
          visitStatus[store.id]?.completada) ||
        false,
      productos: visitStatus[store.id]?.productos || [],
      fotoEstante: visitStatus[store.id]?.fotoEstante || null,
      estado:
        visitStatus[store.id]?.fecha === today &&
        visitStatus[store.id]?.completada
          ? "completada"
          : "pendiente",
    }));
  } catch (error) {
    console.error("Error en getTiendasAsignadasEmpleado:", error);
    return [];
  }
}

// ============================================
// PRODUCTOS DISPONIBLES PARA SURTIR
// ============================================

/**
 * Obtiene todos los productos disponibles
 * Producción: GET /api/products?activo=true
 */
async function getProductosSurtir() {
  try {
    const response = await mockAPI.getProducts({ activo: true });
    return response.success ? response.data : [];
  } catch (error) {
    console.error("Error al obtener productos:", error);
    return [];
  }
}

// ============================================
// VALIDACIÓN DE QR
// ============================================

/**
 * Valida el código QR de una tienda
 */
function validarQRTienda(qrCode, tiendaId) {
  const expectedQR = `QR_${tiendaId}`;
  return qrCode === expectedQR;
}

// ============================================
// GESTIÓN DE VISITAS
// ============================================

/**
 * Inicia una visita a una tienda
 * Guarda el estado localmente
 */
function iniciarVisitaTienda(tiendaId, coordenadas) {
  const user = getCurrentUser();
  if (!user || user.rol !== "empleado") {
    return null;
  }

  const timestamp = new Date().toISOString();

  const visitaActual = {
    empleadoId: user.id,
    tiendaId: tiendaId,
    fechaInicio: timestamp,
    coordenadasInicio: coordenadas,
    estado: "en_curso",
  };

  Storage.set("visitaActual", visitaActual);
  return visitaActual;
}

/**
 * Completa una visita a una tienda
 * Producción: POST /api/visits
 */
async function completarVisitaTienda(datosVisita) {
  const visitaActual = Storage.get("visitaActual");

  if (!visitaActual) return null;

  const timestamp = new Date().toISOString();
  const today = timestamp.split("T")[0];
  const horaInicio = new Date(visitaActual.fechaInicio);
  const horaFin = new Date(timestamp);
  const duracionMinutos = Math.round((horaFin - horaInicio) / 1000 / 60);

  // Crear registro de visita completada
  const pedidoCompleto = {
    id: "visit_" + Date.now(),
    empleadoId: visitaActual.empleadoId,
    tiendaId: visitaActual.tiendaId,
    fecha: today,
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

  // Guardar en historial local
  let historialPedidos = Storage.get("pedidosEmpleado") || [];
  historialPedidos.push(pedidoCompleto);
  Storage.set("pedidosEmpleado", historialPedidos);

  // Actualizar estado de visita local
  let visitStatus =
    Storage.get(`visit_status_${visitaActual.empleadoId}`) || {};
  visitStatus[visitaActual.tiendaId] = {
    fecha: today,
    completada: true,
    productos: datosVisita.productos || [],
    fotoEstante: datosVisita.fotoEstante,
  };
  Storage.set(`visit_status_${visitaActual.empleadoId}`, visitStatus);

  // Actualizar en el API mock (en producción: POST /api/stores/:id/visit)
  try {
    await mockAPI.completeVisit(visitaActual.tiendaId);
  } catch (error) {
    console.error("Error al registrar visita en API:", error);
  }

  // Limpiar visita actual
  Storage.remove("visitaActual");

  return pedidoCompleto;
}

// ============================================
// HISTORIAL Y ESTADÍSTICAS
// ============================================

/**
 * Obtiene el historial de pedidos/visitas del empleado
 * Producción: GET /api/visits?employeeId=:id
 */
function getHistorialPedidosEmpleado(empleadoId, filtros = {}) {
  let pedidos = Storage.get("pedidosEmpleado") || [];

  // Filtrar por empleado
  pedidos = pedidos.filter((p) => p.empleadoId === empleadoId);

  // Filtrar por fecha si se especifica
  if (filtros.fecha) {
    pedidos = pedidos.filter((p) => p.fecha === filtros.fecha);
  }

  // Ordenar por fecha más reciente
  return pedidos.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
}

/**
 * Obtiene estadísticas del empleado
 * Producción: GET /api/stats/employee/:id
 */
async function getEstadisticasEmpleado(empleadoId) {
  try {
    // Obtener estadísticas del API
    const response = await mockAPI.getEmployeeStats(empleadoId);
    const apiStats = response.success ? response.data : {};

    // Complementar con estadísticas locales
    const historial = getHistorialPedidosEmpleado(empleadoId);
    const hoy = new Date().toISOString().split("T")[0];
    const pedidosHoy = historial.filter((p) => p.fecha === hoy);

    const totalProductosHoy = pedidosHoy.reduce(
      (sum, p) =>
        sum + p.productos.reduce((pSum, prod) => pSum + prod.cantidad, 0),
      0
    );

    const promedioTiempo =
      pedidosHoy.length > 0
        ? Math.round(
            pedidosHoy.reduce((sum, p) => sum + p.duracionVisita, 0) /
              pedidosHoy.length
          )
        : 0;

    return {
      ...apiStats,
      productosEntregadosHoy: totalProductosHoy,
      visitasHoy: pedidosHoy.length,
      promedioTiempoPorVisita: promedioTiempo,
      tiendasPendientes: apiStats.tiendasAsignadas - pedidosHoy.length,
      tiendasCompletadas: pedidosHoy.length,
      rutaCompletada:
        apiStats.tiendasAsignadas > 0 &&
        pedidosHoy.length >= apiStats.tiendasVisitarHoy,
    };
  } catch (error) {
    console.error("Error al obtener estadísticas:", error);
    return {
      tiendasAsignadas: 0,
      tiendasVisitarHoy: 0,
      tiendasCompletadas: 0,
      tiendasPendientes: 0,
      productosEntregadosHoy: 0,
      visitasHoy: 0,
      promedioTiempoPorVisita: 0,
      rutaCompletada: false,
    };
  }
}

// ============================================
// UTILIDADES
// ============================================

function simularEscaneoQR(tiendaId) {
  return `QR_${tiendaId}`;
}

function getVisitaActual() {
  return Storage.get("visitaActual");
}

function cancelarVisitaActual() {
  Storage.remove("visitaActual");
}

// ============================================
// EXPORTAR FUNCIONES
// ============================================

window.getTiendasAsignadasEmpleado = getTiendasAsignadasEmpleado;
window.getProductosSurtir = getProductosSurtir;
window.validarQRTienda = validarQRTienda;
window.iniciarVisitaTienda = iniciarVisitaTienda;
window.completarVisitaTienda = completarVisitaTienda;
window.getHistorialPedidosEmpleado = getHistorialPedidosEmpleado;
window.getEstadisticasEmpleado = getEstadisticasEmpleado;
window.simularEscaneoQR = simularEscaneoQR;
window.getVisitaActual = getVisitaActual;
window.cancelarVisitaActual = cancelarVisitaActual;
