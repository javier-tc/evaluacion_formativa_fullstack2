//sistema de roles y permisos
const ROLES = {
    ADMINISTRADOR: 'Administrador',
    VENDEDOR: 'Vendedor',
    CLIENTE: 'Cliente'
};

const PERMISOS = {
    //permisos de administrador
    ADMINISTRADOR: [
        'ver_productos',
        'crear_productos',
        'editar_productos',
        'eliminar_productos',
        'ver_inventario',
        'ver_usuarios',
        'crear_usuarios',
        'editar_usuarios',
        'eliminar_usuarios',
        'ver_ordenes',
        'gestionar_ordenes',
        'ver_reportes',
        'configurar_sistema'
    ],
    
    //permisos de vendedor
    VENDEDOR: [
        'ver_productos',
        'ver_inventario',
        'ver_ordenes',
        'gestionar_ordenes'
    ],
    
    //permisos de cliente
    CLIENTE: [
        'ver_productos',
        'ver_blogs',
        'usar_carrito',
        'realizar_compras'
    ]
};

//función para verificar si un usuario tiene un permiso específico
function tienePermiso(rol, permiso) {
    if (!PERMISOS[rol]) {
        return false;
    }
    return PERMISOS[rol].includes(permiso);
}

//función para obtener el rol del usuario actual
function obtenerRolUsuario() {
    //simular obtención del rol desde localStorage o sesión
    const usuarioActual = localStorage.getItem('usuario_actual');
    if (usuarioActual) {
        const usuario = JSON.parse(usuarioActual);
        return usuario.rol || ROLES.CLIENTE;
    }
    return ROLES.CLIENTE;
}

//función para verificar acceso a una página
function verificarAccesoPagina(pagina, rolUsuario) {
    //páginas públicas que todos pueden acceder
    const paginasPublicas = [
        'index.html',
        'productos.html', 
        'blogs.html',
        'contacto.html',
        'detalle-producto.html',
        'detalle-blog.html',
        'login.html',
        'registro.html',
        'nosotros.html'
    ];
    
    //si es una página pública, permitir acceso
    if (paginasPublicas.includes(pagina)) {
        return true;
    }
    
    //páginas de administración que requieren login de admin
    const paginasAdmin = [
        'admin.html',
        'admin-inventory.html',
        'admin-new-product.html',
        'admin-edit-product.html',
        'admin-users.html',
        'admin-new-user.html',
        'admin-edit-user.html'
    ];
    
    //si es una página de admin, verificar que sea administrador
    if (paginasAdmin.includes(pagina)) {
        const usuarioActual = localStorage.getItem('usuario_actual');
        if (!usuarioActual) {
            alert('Debes iniciar sesión como administrador para acceder a esta página');
            const rutaBase = obtenerRutaBase();
            window.location.href = `${rutaBase}pages/login.html`;
            return false;
        }
        
        const usuario = JSON.parse(usuarioActual);
        if (usuario.rol !== ROLES.ADMINISTRADOR) {
            alert('Solo los administradores pueden acceder a esta página');
            const rutaBase = obtenerRutaBase();
            window.location.href = `${rutaBase}index.html`;
            return false;
        }
        
        return true;
    }
    
    //por defecto, permitir acceso
    return true;
}

//función para mostrar/ocultar elementos según rol
function aplicarPermisosUI(rolUsuario) {
    //ocultar elementos de administrador si no es administrador
    if (rolUsuario !== ROLES.ADMINISTRADOR) {
        const elementosAdmin = document.querySelectorAll('.admin-only');
        elementosAdmin.forEach(elemento => {
            elemento.style.display = 'none';
        });
    }
    
    //ocultar elementos de vendedor si no es vendedor o administrador
    if (rolUsuario !== ROLES.VENDEDOR && rolUsuario !== ROLES.ADMINISTRADOR) {
        const elementosVendedor = document.querySelectorAll('.vendedor-only');
        elementosVendedor.forEach(elemento => {
            elemento.style.display = 'none';
        });
    }
    
    //ocultar elementos de cliente si no es cliente
    if (rolUsuario !== ROLES.CLIENTE) {
        const elementosCliente = document.querySelectorAll('.cliente-only');
        elementosCliente.forEach(elemento => {
            elemento.style.display = 'none';
        });
    }
}

//función para obtener la ruta base según la ubicación actual
function obtenerRutaBase() {
    const pathname = window.location.pathname;
    //si estamos en la carpeta pages/, necesitamos subir un nivel
    if (pathname.includes('/pages/') || pathname.includes('\\pages\\')) {
        return '../';
    }
    //si estamos en la carpeta admin/, necesitamos subir un nivel
    if (pathname.includes('/admin/') || pathname.includes('\\admin\\')) {
        return '../';
    }
    //si estamos en la raíz, no necesitamos prefijo
    return '';
}

//función para configurar navegación según rol
function configurarNavegacion(rolUsuario) {
    const navMenu = document.querySelector('.nav-menu');
    if (!navMenu) return;
    
    const rutaBase = obtenerRutaBase();
    
    //si no hay usuario logueado, mostrar navegación básica
    if (!localStorage.getItem('usuario_actual')) {
        const elementosBasicos = [
            { texto: 'Inicio', href: `${rutaBase}index.html` },
            { texto: 'Productos', href: `${rutaBase}pages/productos.html` },
            { texto: 'Blogs', href: `${rutaBase}pages/blogs.html` },
            { texto: 'Contacto', href: `${rutaBase}pages/contacto.html` },
            { texto: 'Ingresar', href: `${rutaBase}pages/login.html` },
            { texto: 'Registrarse', href: `${rutaBase}pages/registro.html`, clase: 'nav-btn' }
        ];
        
        navMenu.innerHTML = '';
        elementosBasicos.forEach(elemento => {
            const li = document.createElement('li');
            const a = document.createElement('a');
            a.href = elemento.href;
            a.textContent = elemento.texto;
            a.className = 'nav-link';
            
            if (elemento.clase) {
                a.classList.add(elemento.clase);
            }
            
            li.appendChild(a);
            navMenu.appendChild(li);
        });
        
        //agregar carrito si no es página de admin
        if (!window.location.pathname.includes('admin')) {
            const liCarrito = document.createElement('li');
            liCarrito.innerHTML = `
                <div class="cart-icon" onclick="cart.toggleCart()">
                    🛒
                    <span class="cart-count" id="cart-count"></span>
                </div>
            `;
            navMenu.appendChild(liCarrito);
        }
        return;
    }
    
    //crear elementos de navegación según rol
    const elementosNav = {
        [ROLES.ADMINISTRADOR]: [
            { texto: 'Inicio', href: `${rutaBase}index.html` },
            { texto: 'Productos', href: `${rutaBase}pages/productos.html` },
            { texto: 'Blogs', href: `${rutaBase}pages/blogs.html` },
            { texto: 'Admin', href: `${rutaBase}pages/admin.html`, clase: 'admin-only' },
            { texto: 'Cerrar Sesión', href: '#', clase: 'logout-btn' }
        ],
        [ROLES.VENDEDOR]: [
            { texto: 'Inicio', href: `${rutaBase}index.html` },
            { texto: 'Productos', href: `${rutaBase}pages/productos.html` },
            { texto: 'Blogs', href: `${rutaBase}pages/blogs.html` },
            { texto: 'Inventario', href: `${rutaBase}admin/admin-inventory.html`, clase: 'vendedor-only' },
            { texto: 'Cerrar Sesión', href: '#', clase: 'logout-btn' }
        ],
        [ROLES.CLIENTE]: [
            { texto: 'Inicio', href: `${rutaBase}index.html` },
            { texto: 'Productos', href: `${rutaBase}pages/productos.html` },
            { texto: 'Blogs', href: `${rutaBase}pages/blogs.html` },
            { texto: 'Contacto', href: `${rutaBase}pages/contacto.html` },
            { texto: 'Cerrar Sesión', href: '#', clase: 'logout-btn' }
        ]
    };
    
    const elementos = elementosNav[rolUsuario] || elementosNav[ROLES.CLIENTE];
    
    //limpiar navegación existente
    navMenu.innerHTML = '';
    
    //agregar elementos de navegación
    elementos.forEach(elemento => {
        const li = document.createElement('li');
        const a = document.createElement('a');
        a.href = elemento.href;
        a.textContent = elemento.texto;
        a.className = 'nav-link';
        
        if (elemento.clase) {
            a.classList.add(elemento.clase);
        }
        
        //manejar logout
        if (elemento.clase === 'logout-btn') {
            a.addEventListener('click', function(e) {
                e.preventDefault();
                cerrarSesion();
            });
        }
        
        li.appendChild(a);
        navMenu.appendChild(li);
    });
    
    //agregar carrito si no es página de admin
    if (!window.location.pathname.includes('admin')) {
        const liCarrito = document.createElement('li');
        liCarrito.innerHTML = `
            <div class="cart-icon" onclick="cart.toggleCart()">
                🛒
                <span class="cart-count" id="cart-count"></span>
            </div>
        `;
        navMenu.appendChild(liCarrito);
    }
}

//función para cerrar sesión
function cerrarSesion() {
    localStorage.removeItem('usuario_actual');
    alert('Sesión cerrada exitosamente');
    const rutaBase = obtenerRutaBase();
    window.location.href = `${rutaBase}index.html`;
}

//función para simular login con roles
function simularLogin(email, password) {
    //simular usuarios con diferentes roles
    const usuarios = {
        'admin@admin.cl': { rol: ROLES.ADMINISTRADOR, nombre: 'Administrador' },
        'vendedor@vendedor.cl': { rol: ROLES.VENDEDOR, nombre: 'Vendedor' },
        'cliente@gmail.com': { rol: ROLES.CLIENTE, nombre: 'Cliente' }
    };
    
    const usuario = usuarios[email];
    if (usuario && password === '123456') {
        localStorage.setItem('usuario_actual', JSON.stringify({
            email: email,
            rol: usuario.rol,
            nombre: usuario.nombre
        }));
        return true;
    }
    return false;
}

//función para corregir enlaces automáticamente según la ubicación actual
function corregirEnlaces() {
    const rutaBase = obtenerRutaBase();
    const enlaces = document.querySelectorAll('a[href]');
    
    enlaces.forEach(enlace => {
        const href = enlace.getAttribute('href');
        
        //si el enlace es relativo y no es un enlace externo
        if (href && !href.startsWith('http') && !href.startsWith('#') && !href.startsWith('mailto:') && !href.startsWith('tel:')) {
            //si el enlace no tiene ruta base y no es un enlace a la misma página
            if (!href.startsWith('../') && !href.startsWith('./') && href !== 'index.html') {
                //corregir enlaces comunes
                if (href === 'productos.html') {
                    enlace.href = `${rutaBase}pages/productos.html`;
                } else if (href === 'blogs.html') {
                    enlace.href = `${rutaBase}pages/blogs.html`;
                } else if (href === 'contacto.html') {
                    enlace.href = `${rutaBase}pages/contacto.html`;
                } else if (href === 'login.html') {
                    enlace.href = `${rutaBase}pages/login.html`;
                } else if (href === 'registro.html') {
                    enlace.href = `${rutaBase}pages/registro.html`;
                } else if (href === 'nosotros.html') {
                    enlace.href = `${rutaBase}pages/nosotros.html`;
                } else if (href === 'admin.html') {
                    enlace.href = `${rutaBase}pages/admin.html`;
                } else if (href === 'admin-inventory.html') {
                    enlace.href = `${rutaBase}admin/admin-inventory.html`;
                } else if (href === 'admin-users.html') {
                    enlace.href = `${rutaBase}admin/admin-users.html`;
                } else if (href === 'detalle-producto.html') {
                    enlace.href = `${rutaBase}pages/detalle-producto.html`;
                } else if (href === 'detalle-blog.html') {
                    enlace.href = `${rutaBase}pages/detalle-blog.html`;
                }
            }
        }
    });
}

//función para inicializar sistema de roles
function inicializarSistemaRoles() {
    const rolUsuario = obtenerRolUsuario();
    
    //corregir enlaces automáticamente
    corregirEnlaces();
    
    //aplicar permisos de UI
    aplicarPermisosUI(rolUsuario);
    
    //configurar navegación
    configurarNavegacion(rolUsuario);
    
    //verificar acceso a página actual
    const paginaActual = window.location.pathname.split('/').pop();
    if (!verificarAccesoPagina(paginaActual, rolUsuario)) {
        alert('No tienes permisos para acceder a esta página');
        const rutaBase = obtenerRutaBase();
        window.location.href = `${rutaBase}index.html`;
        return;
    }
    
    //mostrar información del usuario
    mostrarInfoUsuario(rolUsuario);
    
    //agregar modal del carrito si no es página de admin
    if (!window.location.pathname.includes('admin')) {
        agregarModalCarrito();
    }
}

//función para mostrar información del usuario
function mostrarInfoUsuario(rolUsuario) {
    const usuarioActual = localStorage.getItem('usuario_actual');
    if (usuarioActual) {
        const usuario = JSON.parse(usuarioActual);
        const infoUsuario = document.createElement('div');
        infoUsuario.className = 'user-info';
        infoUsuario.innerHTML = `
            <span>Bienvenido, ${usuario.nombre}</span>
            <span class="user-role">(${rolUsuario})</span>
        `;
        
        const nav = document.querySelector('.nav');
        if (nav) {
            nav.appendChild(infoUsuario);
        }
    }
}

//función para agregar modal del carrito
function agregarModalCarrito() {
    //verificar si ya existe el modal
    if (document.getElementById('cart-modal')) {
        return;
    }
    
    const modalHTML = `
        <div id="cart-modal" class="cart-modal">
            <div class="cart-content">
                <div class="cart-header">
                    <h2>Mi Carrito</h2>
                    <button class="close-cart" onclick="cart.closeCart()">&times;</button>
                </div>
                <div class="cart-body">
                    <div id="cart-empty" class="cart-empty">
                        <p>Tu carrito está vacío</p>
                        <p>¡Agrega algunos vinilos!</p>
                    </div>
                    <div id="cart-items"></div>
                </div>
                <div class="cart-footer">
                    <div class="cart-total">
                        Total: <span id="cart-total">$0</span>
                    </div>
                    <button class="checkout-btn" onclick="alert('¡Gracias por tu compra!')" disabled>
                        Proceder al Pago
                    </button>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
}

//inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    inicializarSistemaRoles();
});
