// store-api.js - API para gestión de tiendas

/**
 * StoreAPI
 * Maneja todas las operaciones CRUD de tiendas con la API real
 */
class StoreAPI {
  /**
   * Obtiene todas las tiendas
   * GET /api/stores
   */
  async getAllStores() {
    try {
      const response = await apiFetch(API_CONFIG.ENDPOINTS.STORES, {
        method: "GET",
      });

      const result = await response.json();

      if (result.error || !response.ok) {
        throw new Error(result.message || "Error al obtener tiendas");
      }

      // Mapear los datos de la API al formato esperado
      return result.data.map((store) => ({
        id: store.id,
        nombre: store.name,
        direccion: store.address,
        frecuenciaVisita: store.visitFrequency,
        empleadoAsignado: store.assignedCourier
          ? store.assignedCourier.id
          : null,
        empleadoNombre: store.assignedCourier
          ? store.assignedCourier.name
          : null,
        activa: store.active,
        lastVisitDate: store.lastVisitDate,
      }));
    } catch (error) {
      console.error("Error al obtener tiendas:", error);
      throw error;
    }
  }

  /**
   * Obtiene una tienda por ID
   * GET /api/stores/{id}
   */
  async getStoreById(id) {
    try {
      const response = await apiFetch(API_CONFIG.ENDPOINTS.STORE_BY_ID(id), {
        method: "GET",
      });

      const result = await response.json();

      if (result.error || !response.ok) {
        throw new Error(result.message || "Error al obtener tienda");
      }

      // Mapear los datos de la API al formato esperado
      const store = result.data;
      return {
        id: store.id,
        nombre: store.name,
        direccion: store.address,
        frecuenciaVisita: store.visitFrequency,
        lastVisitDate: store.lastVisitDate,
        empleadoAsignado: store.assignedCourier
          ? store.assignedCourier.id
          : null,
        empleadoNombre: store.assignedCourier
          ? store.assignedCourier.name
          : null,
        activa: store.active,
      };
    } catch (error) {
      console.error("Error al obtener tienda:", error);
      throw error;
    }
  }

  /**
   * Crea una nueva tienda
   * POST /api/stores
   */
  async createStore(storeData) {
    try {
      const response = await apiFetch(API_CONFIG.ENDPOINTS.STORES, {
        method: "POST",
        body: JSON.stringify({
          name: storeData.nombre,
          address: storeData.direccion,
          visitFrequency: parseInt(storeData.frecuenciaVisita),
          assignedCourierId: storeData.empleadoAsignado
            ? parseInt(storeData.empleadoAsignado)
            : null,
          active: storeData.activa !== false,
        }),
      });

      const result = await response.json();

      if (result.error || !response.ok) {
        throw new Error(result.message || "Error al crear tienda");
      }

      return result.data;
    } catch (error) {
      console.error("Error al crear tienda:", error);
      throw error;
    }
  }

  /**
   * Actualiza una tienda existente
   * PUT /api/stores/{id}
   */
  async updateStore(id, storeData) {
    try {
      const response = await apiFetch(API_CONFIG.ENDPOINTS.STORE_BY_ID(id), {
        method: "PUT",
        body: JSON.stringify({
          id: parseInt(id),
          name: storeData.nombre,
          address: storeData.direccion,
          visitFrequency: parseInt(storeData.frecuenciaVisita),
          assignedCourierId: storeData.empleadoAsignado
            ? parseInt(storeData.empleadoAsignado)
            : null,
          active: storeData.activa !== false,
        }),
      });

      const result = await response.json();

      if (result.error || !response.ok) {
        throw new Error(result.message || "Error al actualizar tienda");
      }

      return result.data;
    } catch (error) {
      console.error("Error al actualizar tienda:", error);
      throw error;
    }
  }

  /**
   * Elimina una tienda
   * DELETE /api/stores/{id}
   */
  async deleteStore(id) {
    try {
      const response = await apiFetch(API_CONFIG.ENDPOINTS.STORE_BY_ID(id), {
        method: "DELETE",
      });

      const result = await response.json();

      if (result.error || !response.ok) {
        throw new Error(result.message || "Error al eliminar tienda");
      }

      return true;
    } catch (error) {
      console.error("Error al eliminar tienda:", error);
      throw error;
    }
  }
}

// Crear instancia global
const storeAPI = new StoreAPI();

// Exportar
window.StoreAPI = StoreAPI;
window.storeAPI = storeAPI;
