// employee-api.js - API para gestión de empleados

/**
 * EmployeeAPI
 * Maneja todas las operaciones CRUD de empleados con la API real
 */
class EmployeeAPI {
  /**
   * Obtiene todos los empleados
   * GET /api/user/employees
   */
  async getAllEmployees() {
    try {
      const response = await apiFetch(API_CONFIG.ENDPOINTS.EMPLOYEES, {
        method: "GET",
      });

      const result = await response.json();

      if (result.error || !response.ok) {
        throw new Error(result.message || "Error al obtener empleados");
      }

      // Mapear los datos de la API al formato esperado por la UI
      return result.data.map((emp) => ({
        id: emp.id,
        nombre: emp.name,
        email: emp.email,
        telefono: emp.phone,
        activo: emp.status,
        rol: emp.rol.name,
        fechaContratacion: new Date().toISOString(), // La API no devuelve esta fecha, usar fecha actual
      }));
    } catch (error) {
      console.error("Error al obtener empleados:", error);
      throw error;
    }
  }

  /**
   * Obtiene un empleado por ID
   * GET /api/user/{id}
   */
  async getEmployeeById(id) {
    try {
      const response = await apiFetch(API_CONFIG.ENDPOINTS.USER_BY_ID(id), {
        method: "GET",
      });

      const result = await response.json();

      if (result.error || !response.ok) {
        throw new Error(result.message || "Error al obtener empleado");
      }

      // Mapear los datos de la API al formato esperado
      const emp = result.data;
      return {
        id: emp.id,
        nombre: emp.name,
        email: emp.email,
        telefono: emp.phone,
        activo: emp.status,
        rol: emp.rol.name,
        fechaContratacion: new Date().toISOString(),
      };
    } catch (error) {
      console.error("Error al obtener empleado:", error);
      throw error;
    }
  }

  /**
   * Crea un nuevo empleado
   * POST /api/user/
   */
  async createEmployee(employeeData) {
    try {
      const response = await apiFetch(API_CONFIG.ENDPOINTS.USERS, {
        method: "POST",
        body: JSON.stringify({
          name: employeeData.nombre,
          phone: employeeData.telefono,
          email: employeeData.email,
          password: employeeData.password,
          roleId: 1, // Por defecto empleado (EMPLOYEE)
        }),
      });

      const result = await response.json();

      if (result.error || !response.ok) {
        throw new Error(result.message || "Error al crear empleado");
      }

      return result.data;
    } catch (error) {
      console.error("Error al crear empleado:", error);
      throw error;
    }
  }

  /**
   * Actualiza un empleado existente
   * PUT /api/user/
   */
  async updateEmployee(id, employeeData) {
    try {
      // Preparar datos para la API
      const updateData = {
        id: parseInt(id), // Convertir ID a número entero
        name: employeeData.nombre,
        phone: employeeData.telefono,
        email: employeeData.email,
        status: employeeData.activo,
        roleId: 1, // Mantener como empleado
      };

      // Solo agregar password si se proporcionó
      if (employeeData.password) {
        updateData.password = employeeData.password;
      }

      const response = await apiFetch(API_CONFIG.ENDPOINTS.USERS, {
        method: "PUT",
        body: JSON.stringify(updateData),
      });

      const result = await response.json();

      if (result.error || !response.ok) {
        throw new Error(result.message || "Error al actualizar empleado");
      }

      return result.data;
    } catch (error) {
      console.error("Error al actualizar empleado:", error);
      throw error;
    }
  }

  /**
   * Elimina un empleado
   * DELETE /api/user/{id}
   */
  async deleteEmployee(id) {
    try {
      const response = await apiFetch(API_CONFIG.ENDPOINTS.USER_BY_ID(id), {
        method: "DELETE",
      });

      const result = await response.json();

      if (result.error || !response.ok) {
        throw new Error(result.message || "Error al eliminar empleado");
      }

      return true;
    } catch (error) {
      console.error("Error al eliminar empleado:", error);
      throw error;
    }
  }
}

// Crear instancia global
const employeeAPI = new EmployeeAPI();

// Exportar
window.EmployeeAPI = EmployeeAPI;
window.employeeAPI = employeeAPI;
