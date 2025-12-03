// utils.js - Funciones de utilidad comunes

// ========== Validaciones ==========
const Validators = {
    // Validar email
    email: (email) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(String(email).toLowerCase());
    },

    // Validar contraseña (mínimo 8 caracteres, 1 mayúscula, 1 minúscula, 1 número)
    password: (password) => {
        const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;
        return re.test(password);
    },

    // Validar teléfono (10 dígitos)
    phone: (phone) => {
        const re = /^\d{10}$/;
        return re.test(phone);
    },

    // Validar que no esté vacío
    required: (value) => {
        return value !== null && value !== undefined && value.toString().trim() !== '';
    },

    // Validar longitud mínima
    minLength: (value, min) => {
        return value && value.toString().length >= min;
    },

    // Validar longitud máxima
    maxLength: (value, max) => {
        return value && value.toString().length <= max;
    },

    // Validar número
    number: (value) => {
        return !isNaN(parseFloat(value)) && isFinite(value);
    },

    // Validar número positivo
    positiveNumber: (value) => {
        return Validators.number(value) && parseFloat(value) > 0;
    }
};

// ========== Formateo ==========
const Format = {
    // Formatear moneda
    currency: (amount) => {
        return new Intl.NumberFormat('es-MX', {
            style: 'currency',
            currency: 'MXN'
        }).format(amount);
    },

    // Formatear fecha
    date: (date, format = 'long') => {
        const options = {
            short: { year: 'numeric', month: '2-digit', day: '2-digit' },
            long: { year: 'numeric', month: 'long', day: 'numeric' },
            full: { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }
        };
        return new Intl.DateTimeFormat('es-MX', options[format]).format(new Date(date));
    },

    // Formatear fecha y hora
    datetime: (date) => {
        return new Intl.DateTimeFormat('es-MX', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        }).format(new Date(date));
    },

    // Capitalizar primera letra
    capitalize: (str) => {
        return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
    },

    // Formatear número de teléfono
    phone: (phone) => {
        const cleaned = ('' + phone).replace(/\D/g, '');
        const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
        if (match) {
            return '(' + match[1] + ') ' + match[2] + '-' + match[3];
        }
        return phone;
    },

    // Truncar texto
    truncate: (str, length = 50) => {
        return str.length > length ? str.substring(0, length) + '...' : str;
    }
};

// ========== LocalStorage ==========
const Storage = {
    // Guardar en localStorage
    set: (key, value) => {
        try {
            localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch (error) {
            console.error('Error al guardar en localStorage:', error);
            return false;
        }
    },

    // Obtener de localStorage
    get: (key) => {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : null;
        } catch (error) {
            console.error('Error al leer de localStorage:', error);
            return null;
        }
    },

    // Eliminar de localStorage
    remove: (key) => {
        try {
            localStorage.removeItem(key);
            return true;
        } catch (error) {
            console.error('Error al eliminar de localStorage:', error);
            return false;
        }
    },

    // Limpiar localStorage
    clear: () => {
        try {
            localStorage.clear();
            return true;
        } catch (error) {
            console.error('Error al limpiar localStorage:', error);
            return false;
        }
    }
};

// ========== Utilidades de Array ==========
const ArrayUtils = {
    // Filtrar y ordenar
    filterAndSort: (array, filterFn, sortKey, order = 'asc') => {
        const filtered = array.filter(filterFn);
        return filtered.sort((a, b) => {
            if (order === 'asc') {
                return a[sortKey] > b[sortKey] ? 1 : -1;
            }
            return a[sortKey] < b[sortKey] ? 1 : -1;
        });
    },

    // Agrupar por propiedad
    groupBy: (array, key) => {
        return array.reduce((result, item) => {
            const group = item[key];
            if (!result[group]) {
                result[group] = [];
            }
            result[group].push(item);
            return result;
        }, {});
    },

    // Obtener únicos
    unique: (array, key = null) => {
        if (key) {
            return [...new Map(array.map(item => [item[key], item])).values()];
        }
        return [...new Set(array)];
    },

    // Paginación
    paginate: (array, page = 1, pageSize = 10) => {
        const start = (page - 1) * pageSize;
        const end = start + pageSize;
        return {
            data: array.slice(start, end),
            currentPage: page,
            totalPages: Math.ceil(array.length / pageSize),
            totalItems: array.length
        };
    }
};

// ========== Utilidades de DOM ==========
const DOM = {
    // Crear elemento con atributos
    createElement: (tag, attributes = {}, children = []) => {
        const element = document.createElement(tag);
        Object.entries(attributes).forEach(([key, value]) => {
            if (key === 'className') {
                element.className = value;
            } else if (key === 'innerHTML') {
                element.innerHTML = value;
            } else {
                element.setAttribute(key, value);
            }
        });
        children.forEach(child => {
            if (typeof child === 'string') {
                element.appendChild(document.createTextNode(child));
            } else {
                element.appendChild(child);
            }
        });
        return element;
    },

    // Query selector con manejo de error
    $: (selector, parent = document) => {
        return parent.querySelector(selector);
    },

    // Query selector all
    $$: (selector, parent = document) => {
        return Array.from(parent.querySelectorAll(selector));
    },

    // Mostrar/ocultar elemento
    toggle: (element, show = null) => {
        if (show === null) {
            element.classList.toggle('hidden');
        } else {
            element.classList.toggle('hidden', !show);
        }
    }
};

// ========== Debounce y Throttle ==========
const Timing = {
    // Debounce
    debounce: (func, wait = 300) => {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    // Throttle
    throttle: (func, limit = 300) => {
        let inThrottle;
        return function executedFunction(...args) {
            if (!inThrottle) {
                func(...args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }
};

// ========== Generadores ==========
const Generators = {
    // Generar ID único
    uuid: () => {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            const r = Math.random() * 16 | 0;
            const v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    },

    // Generar ID numérico
    numericId: () => {
        return Date.now() + Math.floor(Math.random() * 1000);
    },

    // Generar color aleatorio
    randomColor: () => {
        return '#' + Math.floor(Math.random() * 16777215).toString(16);
    }
};

// ========== HTTP Helpers ==========
const HTTP = {
    // Simular llamada API con delay
    mockAPI: async (data, delay = 1000) => {
        return new Promise((resolve) => {
            setTimeout(() => resolve(data), delay);
        });
    },

    // Manejar errores HTTP
    handleError: (error) => {
        console.error('HTTP Error:', error);
        showNotification('Error en la operación', 'error');
    }
};

// ========== Exportar utilidades ==========
window.Validators = Validators;
window.Format = Format;
window.Storage = Storage;
window.ArrayUtils = ArrayUtils;
window.DOM = DOM;
window.Timing = Timing;
window.Generators = Generators;
window.HTTP = HTTP;
