// components.js - Componentes reutilizables

// Header con navegación
function createHeader(title = 'Dashboard', showMenuBtn = true) {
    const user = getCurrentUser();
    if (!user) return '';
    
    return `
        <header class="bg-white shadow-sm sticky top-0 z-40">
            <div class="px-4 sm:px-6 lg:px-8">
                <div class="flex justify-between h-16">
                    <!-- Left side -->
                    <div class="flex items-center">
                        ${showMenuBtn ? `
                            <button 
                                id="menu-btn" 
                                onclick="toggleSidebar()" 
                                class="lg:hidden text-gray-500 hover:text-gray-700 focus:outline-none mr-4"
                            >
                                <i class="fas fa-bars text-xl"></i>
                            </button>
                        ` : ''}
                        <h1 class="text-xl sm:text-2xl font-bold text-gray-900">${title}</h1>
                    </div>

                    <!-- Right side -->
                    <div class="flex items-center space-x-4">
                        <!-- Notifications -->
                        <div class="relative">
                            <button 
                                onclick="toggleNotifications()" 
                                class="text-gray-500 hover:text-gray-700 focus:outline-none relative"
                            >
                                <i class="fas fa-bell text-xl"></i>
                                <span class="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white"></span>
                            </button>
                            <div id="notificationsDropdown" class="hidden absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg py-1 z-50">
                                <div class="px-4 py-2 border-b">
                                    <h3 class="text-sm font-semibold text-gray-900">Notificaciones</h3>
                                </div>
                                <div class="max-h-64 overflow-y-auto">
                                    <div class="px-4 py-3 hover:bg-gray-50 cursor-pointer">
                                        <p class="text-sm text-gray-800">Nueva orden recibida</p>
                                        <p class="text-xs text-gray-500 mt-1">Hace 5 minutos</p>
                                    </div>
                                    <div class="px-4 py-3 hover:bg-gray-50 cursor-pointer">
                                        <p class="text-sm text-gray-800">Producto bajo en stock</p>
                                        <p class="text-xs text-gray-500 mt-1">Hace 1 hora</p>
                                    </div>
                                </div>
                                <div class="px-4 py-2 border-t">
                                    <a href="#" class="text-sm text-gray-700 hover:text-gray-900">Ver todas</a>
                                </div>
                            </div>
                        </div>

                        <!-- User menu -->
                        <div class="relative">
                            <button 
                                onclick="toggleUserMenu()" 
                                class="flex items-center text-gray-500 hover:text-gray-700 focus:outline-none"
                            >
                                <div class="h-8 w-8 rounded-full bg-gray-700 flex items-center justify-center text-white font-semibold">
                                    ${user.nombre.charAt(0).toUpperCase()}
                                </div>
                                <i class="fas fa-chevron-down ml-2 text-sm"></i>
                            </button>
                            <div id="userDropdown" class="hidden absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg py-1 z-50">
                                <div class="px-4 py-3 border-b">
                                    <p id="userName" class="text-sm font-medium text-gray-900">${user.nombre}</p>
                                    <p id="userEmail" class="text-xs text-gray-500">${user.email}</p>
                                    <p class="text-xs text-gray-400 mt-1">
                                        <span id="userRole" class="badge badge-primary">${Format.capitalize(user.rol)}</span>
                                    </p>
                                </div>
                                <a href="#" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                    <i class="fas fa-user mr-2"></i> Mi Perfil
                                </a>
                                <a href="#" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                    <i class="fas fa-cog mr-2"></i> Configuración
                                </a>
                                <div class="border-t"></div>
                                <button onclick="logout()" class="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100">
                                    <i class="fas fa-sign-out-alt mr-2">Cerrar Sesión</i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    `;
}

// Sidebar para administrador
function createAdminSidebar() {
    const currentPath = window.location.pathname;
    const isActive = (path) => currentPath.includes(path) ? 'bg-gray-700' : '';
    
    return `
        <aside id="sidebar" class="sidebar bg-gray-800 text-white w-64 min-h-screen flex flex-col">
            <div class="p-6">
                <div class="flex items-center space-x-3">
                    <i class="fas fa-store text-3xl"></i>
                    <span class="text-xl font-bold">PWA Admin</span>
                </div>
            </div>
            
            <nav class="flex-1 px-4 space-y-2">
                <a href="dashboard.html" class="flex items-center px-4 py-3 rounded-lg hover:bg-gray-700 transition ${isActive('dashboard')}">
                    <i class="fas fa-home w-6"></i>
                    <span class="ml-3">Dashboard</span>
                </a>
                
                <a href="usuarios-management.html" class="flex items-center px-4 py-3 rounded-lg hover:bg-gray-700 transition ${isActive('usuarios')}">
                    <i class="fas fa-users w-6"></i>
                    <span class="ml-3">Usuarios</span>
                </a>
                
                <a href="productos-management.html" class="flex items-center px-4 py-3 rounded-lg hover:bg-gray-700 transition ${isActive('productos')}">
                    <i class="fas fa-box w-6"></i>
                    <span class="ml-3">Productos</span>
                </a>
                
                <a href="empleados-management.html" class="flex items-center px-4 py-3 rounded-lg hover:bg-gray-700 transition ${isActive('empleados')}">
                    <i class="fas fa-briefcase w-6"></i>
                    <span class="ml-3">Empleados</span>
                </a>
                
                <a href="reportes.html" class="flex items-center px-4 py-3 rounded-lg hover:bg-gray-700 transition ${isActive('reportes')}">
                    <i class="fas fa-chart-bar w-6"></i>
                    <span class="ml-3">Reportes</span>
                </a>
                
                <a href="configuracion.html" class="flex items-center px-4 py-3 rounded-lg hover:bg-gray-700 transition ${isActive('configuracion')}">
                    <i class="fas fa-cog w-6"></i>
                    <span class="ml-3">Configuración</span>
                </a>
            </nav>
            
            <div class="p-4 border-t border-gray-700">
                <button onclick="logout()" class="w-full flex items-center px-4 py-3 rounded-lg hover:bg-gray-700 transition text-red-300">
                    <i class="fas fa-sign-out-alt w-6"></i>
                    <span class="ml-3">Cerrar Sesión</span>
                </button>
            </div>
        </aside>
    `;
}

// Sidebar para cliente
function createClienteSidebar() {
    const currentPath = window.location.pathname;
    const isActive = (path) => currentPath.includes(path) ? 'bg-blue-700' : '';
    
    return `
        <aside id="sidebar" class="sidebar bg-blue-800 text-white w-64 min-h-screen flex flex-col">
            <div class="p-6">
                <div class="flex items-center space-x-3">
                    <i class="fas fa-store text-3xl"></i>
                    <span class="text-xl font-bold">PWA Shop</span>
                </div>
            </div>
            
            <nav class="flex-1 px-4 space-y-2">
                <a href="dashboard.html" class="flex items-center px-4 py-3 rounded-lg hover:bg-blue-700 transition ${isActive('dashboard')}">
                    <i class="fas fa-home w-6"></i>
                    <span class="ml-3">Inicio</span>
                </a>
                
                <a href="productos.html" class="flex items-center px-4 py-3 rounded-lg hover:bg-blue-700 transition ${isActive('productos')}">
                    <i class="fas fa-shopping-bag w-6"></i>
                    <span class="ml-3">Productos</span>
                </a>
                
                <a href="carrito.html" class="flex items-center px-4 py-3 rounded-lg hover:bg-blue-700 transition ${isActive('carrito')}">
                    <i class="fas fa-shopping-cart w-6"></i>
                    <span class="ml-3">Carrito</span>
                    <span id="cartBadge" class="ml-auto bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">0</span>
                </a>
                
                <a href="historial-pedidos.html" class="flex items-center px-4 py-3 rounded-lg hover:bg-blue-700 transition ${isActive('historial')}">
                    <i class="fas fa-history w-6"></i>
                    <span class="ml-3">Mis Pedidos</span>
                </a>
                
                <a href="favoritos.html" class="flex items-center px-4 py-3 rounded-lg hover:bg-blue-700 transition ${isActive('favoritos')}">
                    <i class="fas fa-heart w-6"></i>
                    <span class="ml-3">Favoritos</span>
                </a>
                
                <a href="perfil.html" class="flex items-center px-4 py-3 rounded-lg hover:bg-blue-700 transition ${isActive('perfil')}">
                    <i class="fas fa-user w-6"></i>
                    <span class="ml-3">Mi Perfil</span>
                </a>
            </nav>
            
            <div class="p-4 border-t border-blue-700">
                <button onclick="logout()" class="w-full flex items-center px-4 py-3 rounded-lg hover:bg-blue-700 transition text-red-300">
                    <i class="fas fa-sign-out-alt w-6"></i>
                    <span class="ml-3">Cerrar Sesión</span>
                </button>
            </div>
        </aside>
    `;
}

// Sidebar para empleado
function createEmpleadoSidebar() {
    const currentPath = window.location.pathname;
    const isActive = (path) => currentPath.includes(path) ? 'bg-green-700' : '';
    
    return `
        <aside id="sidebar" class="sidebar bg-green-800 text-white w-64 min-h-screen flex flex-col">
            <div class="p-6">
                <div class="flex items-center space-x-3">
                    <i class="fas fa-store text-3xl"></i>
                    <span class="text-xl font-bold">PWA Staff</span>
                </div>
            </div>
            
            <nav class="flex-1 px-4 space-y-2">
                <a href="dashboard.html" class="flex items-center px-4 py-3 rounded-lg hover:bg-green-700 transition ${isActive('dashboard')}">
                    <i class="fas fa-home w-6"></i>
                    <span class="ml-3">Dashboard</span>
                </a>
                
                <a href="inventario.html" class="flex items-center px-4 py-3 rounded-lg hover:bg-green-700 transition ${isActive('inventario')}">
                    <i class="fas fa-boxes w-6"></i>
                    <span class="ml-3">Inventario</span>
                </a>
                
                <a href="ventas.html" class="flex items-center px-4 py-3 rounded-lg hover:bg-green-700 transition ${isActive('ventas')}">
                    <i class="fas fa-cash-register w-6"></i>
                    <span class="ml-3">Ventas</span>
                </a>
                
                <a href="atencion-cliente.html" class="flex items-center px-4 py-3 rounded-lg hover:bg-green-700 transition ${isActive('atencion')}">
                    <i class="fas fa-headset w-6"></i>
                    <span class="ml-3">Atención Cliente</span>
                </a>
                
                <a href="reportes-ventas.html" class="flex items-center px-4 py-3 rounded-lg hover:bg-green-700 transition ${isActive('reportes')}">
                    <i class="fas fa-chart-line w-6"></i>
                    <span class="ml-3">Reportes</span>
                </a>
            </nav>
            
            <div class="p-4 border-t border-green-700">
                <button onclick="logout()" class="w-full flex items-center px-4 py-3 rounded-lg hover:bg-green-700 transition text-red-300">
                    <i class="fas fa-sign-out-alt w-6"></i>
                    <span class="ml-3">Cerrar Sesión</span>
                </button>
            </div>
        </aside>
    `;
}

// Toggle notifications dropdown
function toggleNotifications() {
    const dropdown = document.getElementById('notificationsDropdown');
    const userDropdown = document.getElementById('userDropdown');
    
    if (dropdown) {
        dropdown.classList.toggle('hidden');
        if (userDropdown) userDropdown.classList.add('hidden');
    }
}

// Toggle user menu dropdown
function toggleUserMenu() {
    const dropdown = document.getElementById('userDropdown');
    const notificationsDropdown = document.getElementById('notificationsDropdown');
    
    if (dropdown) {
        dropdown.classList.toggle('hidden');
        if (notificationsDropdown) notificationsDropdown.classList.add('hidden');
    }
}

// Cerrar dropdowns al hacer clic fuera
document.addEventListener('click', (e) => {
    const userDropdown = document.getElementById('userDropdown');
    const notificationsDropdown = document.getElementById('notificationsDropdown');
    
    if (userDropdown && !e.target.closest('[onclick="toggleUserMenu()"]') && !userDropdown.contains(e.target)) {
        userDropdown.classList.add('hidden');
    }
    
    if (notificationsDropdown && !e.target.closest('[onclick="toggleNotifications()"]') && !notificationsDropdown.contains(e.target)) {
        notificationsDropdown.classList.add('hidden');
    }
});

// Actualizar contador del carrito
function updateCartBadge() {
    const cartBadge = document.getElementById('cartBadge');
    if (cartBadge) {
        const cart = Storage.get('cart') || [];
        const totalItems = cart.reduce((sum, item) => sum + item.cantidad, 0);
        cartBadge.textContent = totalItems;
    }
}

// Exportar componentes
window.createHeader = createHeader;
window.createAdminSidebar = createAdminSidebar;
window.createClienteSidebar = createClienteSidebar;
window.createEmpleadoSidebar = createEmpleadoSidebar;
window.toggleNotifications = toggleNotifications;
window.toggleUserMenu = toggleUserMenu;
window.updateCartBadge = updateCartBadge;
