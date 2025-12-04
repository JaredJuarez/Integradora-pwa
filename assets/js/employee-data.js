// employee-data.js - Datos y funcionalidad para empleados con integración al sistema de admin

// ============================================
// OBTENER TIENDAS ASIGNADAS QUE SE DEBEN VISITAR HOY
// ============================================

/**
 * Obtiene las tiendas que el empleado actual debe visitar HOY
 * basado en la lógica de frecuencia de visitas del adminDataManager
 */
function getTiendasAsignadasEmpleado() {
  const user = getCurrentUser();
  if (!user || user.rol !== "empleado") {
    return [];
  }

  // Usar el adminDataManager para obtener las tiendas que se deben visitar HOY
  const storesToVisitToday = adminDataManager.getStoresToVisitToday(user.id);

  // Obtener estado de visitas del storage
  const storage = new Storage();
  const visitStatus = storage.getItem(`visit_status_${user.id}`) || {};

  // Mapear tiendas con estado de completado del día actual
  const today = new Date().toISOString().split("T")[0];

  return storesToVisitToday.map((store) => ({
    ...store,
    qrCode: `QR_${store.id}`, // Generar código QR basado en ID
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
}

// ============================================
// PRODUCTOS DISPONIBLES PARA SURTIR
// ============================================

function getProductosSurtir() {
  // Los productos ahora vienen del adminDataManager
  return adminDataManager.getAllProducts();
}

// ============================================
// VALIDACIÓN DE QR
// ============================================

function validarQRTienda(qrCode, tiendaId) {
  const expectedQR = `QR_${tiendaId}`;
  return qrCode === expectedQR;
}

// ============================================
// GESTIÓN DE VISITAS
// ============================================

function iniciarVisitaTienda(tiendaId, coordenadas) {
  const user = getCurrentUser();
  if (!user || user.rol !== "empleado") {
    return null;
  }

  const timestamp = new Date().toISOString();
  const storage = new Storage();

  // Crear registro de visita temporal
  const visitaActual = {
    empleadoId: user.id,
    tiendaId: tiendaId,
    fechaInicio: timestamp,
    coordenadasInicio: coordenadas,
    estado: "en_curso",
  };

  storage.setItem("visitaActual", visitaActual);
  return visitaActual;
}

function completarVisitaTienda(datosVisita) {
  const storage = new Storage();
  const visitaActual = storage.getItem("visitaActual");

  if (!visitaActual) return null;

  const timestamp = new Date().toISOString();
  const today = timestamp.split("T")[0];
  const horaInicio = new Date(visitaActual.fechaInicio);
  const horaFin = new Date(timestamp);
  const duracionMinutos = Math.round((horaFin - horaInicio) / 1000 / 60);

  // Crear pedido completado
  const pedidoCompleto = {
    id: "ped_emp_" + Date.now(),
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

  // Guardar en historial
  let historialPedidos = storage.getItem("pedidosEmpleado") || [];
  historialPedidos.push(pedidoCompleto);
  storage.setItem("pedidosEmpleado", historialPedidos);

  // Actualizar estado de visita para este empleado y tienda
  let visitStatus =
    storage.getItem(`visit_status_${visitaActual.empleadoId}`) || {};
  visitStatus[visitaActual.tiendaId] = {
    fecha: today,
    completada: true,
    productos: datosVisita.productos || [],
    fotoEstante: datosVisita.fotoEstante,
  };
  storage.setItem(`visit_status_${visitaActual.empleadoId}`, visitStatus);

  // Marcar visita en el adminDataManager
  adminDataManager.completeVisit(visitaActual.tiendaId);

  // Limpiar visita actual
  storage.removeItem("visitaActual");

  return pedidoCompleto;
}

// ============================================
// HISTORIAL Y ESTADÍSTICAS
// ============================================

function getHistorialPedidosEmpleado(empleadoId, filtros = {}) {
  const storage = new Storage();
  let pedidos = storage.getItem("pedidosEmpleado") || [];

  // Filtrar por empleado
  pedidos = pedidos.filter((p) => p.empleadoId === empleadoId);

  // Filtrar por fecha si se especifica
  if (filtros.fecha) {
    pedidos = pedidos.filter((p) => p.fecha === filtros.fecha);
  }

  // Ordenar por fecha más reciente
  return pedidos.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
}

function getEstadisticasEmpleado(empleadoId) {
  const storage = new Storage();
  const historial = getHistorialPedidosEmpleado(empleadoId);
  const hoy = new Date().toISOString().split("T")[0];
  const pedidosHoy = historial.filter((p) => p.fecha === hoy);

  // Obtener tiendas asignadas hoy
  const tiendasHoy = getTiendasAsignadasEmpleado();
  const tiendasCompletadas = tiendasHoy.filter((t) => t.completada).length;
  const tiendasPendientes = tiendasHoy.length - tiendasCompletadas;

  const totalProductosHoy = pedidosHoy.reduce(
    (sum, p) =>
      sum + p.productos.reduce((pSum, prod) => pSum + prod.cantidad, 0),
    0
  );

  return {
    tiendasAsignadas: tiendasHoy.length,
    tiendasCompletadas: tiendasCompletadas,
    tiendasPendientes: tiendasPendientes,
    productosEntregadosHoy: totalProductosHoy,
    visitasHoy: pedidosHoy.length,
    promedioTiempoPorVisita:
      pedidosHoy.length > 0
        ? Math.round(
            pedidosHoy.reduce((sum, p) => sum + p.duracionVisita, 0) /
              pedidosHoy.length
          )
        : 0,
    rutaCompletada: tiendasPendientes === 0 && tiendasHoy.length > 0,
  };
}

// ============================================
// UTILIDADES
// ============================================

function simularEscaneoQR(tiendaId) {
  return `QR_${tiendaId}`;
}

function getVisitaActual() {
  const storage = new Storage();
  return storage.getItem("visitaActual");
}

function cancelarVisitaActual() {
  const storage = new Storage();
  storage.removeItem("visitaActual");
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
