// order-api.js - API para gestión de órdenes

/**
 * OrderAPI
 * Maneja todas las operaciones de órdenes con la API real
 */
class OrderAPI {
  /**
   * Obtiene todas las órdenes
   * GET /api/orders
   */
  async getAllOrders() {
    try {
      const response = await apiFetch(API_CONFIG.ENDPOINTS.ORDERS, {
        method: "GET",
      });

      const result = await response.json();

      if (result.error || !response.ok) {
        throw new Error(result.message || "Error al obtener órdenes");
      }

      // Mapear los datos de la API al formato esperado
      return result.data.map((order) => ({
        id: order.id,
        fechaVisita: order.visitDate,
        fotoUrl: order.photoUrl,
        items: order.items.map((item) => ({
          id: item.id,
          producto: {
            id: item.product.id,
            nombre: item.product.name,
            descripcion: item.product.description,
            activo: item.product.active,
          },
          cantidad: item.quantity,
        })),
      }));
    } catch (error) {
      console.error("Error al obtener órdenes:", error);
      throw error;
    }
  }

  /**
   * Obtiene una orden por ID
   * GET /api/orders/{id}
   */
  async getOrderById(id) {
    try {
      const response = await apiFetch(API_CONFIG.ENDPOINTS.ORDER_BY_ID(id), {
        method: "GET",
      });

      const result = await response.json();

      if (result.error || !response.ok) {
        throw new Error(result.message || "Error al obtener orden");
      }

      // Mapear los datos de la API al formato esperado
      const order = result.data;
      return {
        id: order.id,
        fechaVisita: order.visitDate,
        fotoUrl: order.photoUrl,
        items: order.items.map((item) => ({
          id: item.id,
          producto: {
            id: item.product.id,
            nombre: item.product.name,
            descripcion: item.product.description,
            activo: item.product.active,
          },
          cantidad: item.quantity,
        })),
      };
    } catch (error) {
      console.error("Error al obtener orden:", error);
      throw error;
    }
  }

  /**
   * Elimina una orden
   * DELETE /api/orders/{id}
   */
  async deleteOrder(id) {
    try {
      const response = await apiFetch(API_CONFIG.ENDPOINTS.ORDER_BY_ID(id), {
        method: "DELETE",
      });

      const result = await response.json();

      if (result.error || !response.ok) {
        throw new Error(result.message || "Error al eliminar orden");
      }

      return result;
    } catch (error) {
      console.error("Error al eliminar orden:", error);
      throw error;
    }
  }
}

// Exportar la clase
window.OrderAPI = OrderAPI;
