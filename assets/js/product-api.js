// product-api.js - API para gestión de productos

/**
 * ProductAPI
 * Maneja todas las operaciones CRUD de productos con la API real
 */
class ProductAPI {
  /**
   * Obtiene todos los productos
   * GET /api/products
   */
  async getAllProducts() {
    try {
      const response = await apiFetch(API_CONFIG.ENDPOINTS.PRODUCTS, {
        method: "GET",
      });

      const result = await response.json();

      if (result.error || !response.ok) {
        throw new Error(result.message || "Error al obtener productos");
      }

      // Mapear los datos de la API al formato esperado
      return result.data.map((product) => ({
        id: product.id,
        nombre: product.name,
        descripcion: product.description,
        activo: product.active,
      }));
    } catch (error) {
      console.error("Error al obtener productos:", error);
      throw error;
    }
  }

  /**
   * Obtiene un producto por ID
   * GET /api/products/{id}
   */
  async getProductById(id) {
    try {
      const response = await apiFetch(API_CONFIG.ENDPOINTS.PRODUCT_BY_ID(id), {
        method: "GET",
      });

      const result = await response.json();

      if (result.error || !response.ok) {
        throw new Error(result.message || "Error al obtener producto");
      }

      // Mapear los datos de la API al formato esperado
      const product = result.data;
      return {
        id: product.id,
        nombre: product.name,
        descripcion: product.description,
        activo: product.active,
      };
    } catch (error) {
      console.error("Error al obtener producto:", error);
      throw error;
    }
  }

  /**
   * Crea un nuevo producto
   * POST /api/products
   */
  async createProduct(productData) {
    try {
      const response = await apiFetch(API_CONFIG.ENDPOINTS.PRODUCTS, {
        method: "POST",
        body: JSON.stringify({
          name: productData.nombre,
          description: productData.descripcion,
          active: productData.activo !== false, // Por defecto true
        }),
      });

      const result = await response.json();

      if (result.error || !response.ok) {
        throw new Error(result.message || "Error al crear producto");
      }

      return result.data;
    } catch (error) {
      console.error("Error al crear producto:", error);
      throw error;
    }
  }

  /**
   * Actualiza un producto existente
   * PUT /api/products/{id}
   */
  async updateProduct(id, productData) {
    try {
      const response = await apiFetch(API_CONFIG.ENDPOINTS.PRODUCT_BY_ID(id), {
        method: "PUT",
        body: JSON.stringify({
          name: productData.nombre,
          description: productData.descripcion,
          active: productData.activo !== false,
        }),
      });

      const result = await response.json();

      if (result.error || !response.ok) {
        throw new Error(result.message || "Error al actualizar producto");
      }

      return result.data;
    } catch (error) {
      console.error("Error al actualizar producto:", error);
      throw error;
    }
  }

  /**
   * Elimina un producto
   * DELETE /api/products/{id}
   */
  async deleteProduct(id) {
    try {
      const response = await apiFetch(API_CONFIG.ENDPOINTS.PRODUCT_BY_ID(id), {
        method: "DELETE",
      });

      const result = await response.json();

      if (result.error || !response.ok) {
        throw new Error(result.message || "Error al eliminar producto");
      }

      return true;
    } catch (error) {
      console.error("Error al eliminar producto:", error);
      throw error;
    }
  }
}

// Crear instancia global
const productAPI = new ProductAPI();

// Exportar
window.ProductAPI = ProductAPI;
window.productAPI = productAPI;
