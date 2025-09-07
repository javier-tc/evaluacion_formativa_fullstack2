//funcionalidad para la gestión de usuarios
document.addEventListener('DOMContentLoaded', function() {
    //inicializar funcionalidades de usuarios
    initializeUsersPage();
    
    //configurar búsqueda y filtros
    setupSearchAndFilters();
    
    //configurar paginación
    setupPagination();
});

function initializeUsersPage() {
    //cargar datos de usuarios (simulado)
    loadUsersData();
    
    //configurar eventos de la tabla
    setupTableEvents();
}

function loadUsersData() {
    //simular carga de datos desde API
    const users = [
        {
            id: 1,
            name: 'María González',
            username: 'mariagonzalez',
            email: 'maria.gonzalez@email.com',
            role: 'user',
            status: 'active',
            registrationDate: '15/01/2024'
        },
        {
            id: 2,
            name: 'Carlos Ruiz',
            username: 'carlosruiz',
            email: 'carlos.ruiz@email.com',
            role: 'admin',
            status: 'active',
            registrationDate: '10/01/2024'
        },
        {
            id: 3,
            name: 'Ana Silva',
            username: 'anasilva',
            email: 'ana.silva@email.com',
            role: 'moderator',
            status: 'inactive',
            registrationDate: '05/01/2024'
        },
        {
            id: 4,
            name: 'Luis Mendoza',
            username: 'luismendoza',
            email: 'luis.mendoza@email.com',
            role: 'user',
            status: 'active',
            registrationDate: '20/01/2024'
        },
        {
            id: 5,
            name: 'Patricia López',
            username: 'patricialopez',
            email: 'patricia.lopez@email.com',
            role: 'user',
            status: 'active',
            registrationDate: '18/01/2024'
        }
    ];
    
    //almacenar datos globalmente
    window.usersData = users;
}

function setupTableEvents() {
    //configurar eventos de los botones de acción
    const tableBody = document.getElementById('usersTableBody');
    
    if (tableBody) {
        tableBody.addEventListener('click', function(e) {
            const target = e.target;
            
            //manejar clic en botón editar
            if (target.closest('.btn-edit')) {
                const userId = target.closest('tr').querySelector('td:first-child').textContent;
                editUser(parseInt(userId));
            }
            
            //manejar clic en botón eliminar
            if (target.closest('.btn-delete')) {
                const userId = target.closest('tr').querySelector('td:first-child').textContent;
                deleteUser(parseInt(userId));
            }
        });
    }
}

function setupSearchAndFilters() {
    const searchInput = document.getElementById('searchUsers');
    const roleFilter = document.getElementById('filterRole');
    
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            filterUsers();
        });
    }
    
    if (roleFilter) {
        roleFilter.addEventListener('change', function() {
            filterUsers();
        });
    }
}

function filterUsers() {
    const searchTerm = document.getElementById('searchUsers').value.toLowerCase();
    const roleFilter = document.getElementById('filterRole').value;
    const tableBody = document.getElementById('usersTableBody');
    
    if (!tableBody || !window.usersData) return;
    
    const filteredUsers = window.usersData.filter(user => {
        const matchesSearch = user.name.toLowerCase().includes(searchTerm) ||
                             user.email.toLowerCase().includes(searchTerm) ||
                             user.username.toLowerCase().includes(searchTerm);
        
        const matchesRole = !roleFilter || user.role === roleFilter;
        
        return matchesSearch && matchesRole;
    });
    
    //actualizar tabla
    updateUsersTable(filteredUsers);
}

function updateUsersTable(users) {
    const tableBody = document.getElementById('usersTableBody');
    
    if (!tableBody) return;
    
    tableBody.innerHTML = '';
    
    users.forEach(user => {
        const row = createUserRow(user);
        tableBody.appendChild(row);
    });
    
    //actualizar contador
    updateUserCount(users.length);
}

function createUserRow(user) {
    const row = document.createElement('tr');
    
    const roleClass = user.role === 'admin' ? 'admin' : 
                     user.role === 'moderator' ? 'moderator' : 'user';
    
    const statusClass = user.status === 'active' ? 'active' : 'inactive';
    
    row.innerHTML = `
        <td>${user.id}</td>
        <td>
            <div class="user-info">
                <div class="user-avatar">
                    <i class="fas fa-user"></i>
                </div>
                <div>
                    <p class="user-name">${user.name}</p>
                    <p class="user-username">@${user.username}</p>
                </div>
            </div>
        </td>
        <td>${user.email}</td>
        <td><span class="role-badge ${roleClass}">${getRoleDisplayName(user.role)}</span></td>
        <td><span class="status-badge ${statusClass}">${getStatusDisplayName(user.status)}</span></td>
        <td>${user.registrationDate}</td>
        <td>
            <div class="action-buttons">
                <button class="btn-edit" title="Editar Usuario">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn-delete" title="Eliminar Usuario">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </td>
    `;
    
    return row;
}

function getRoleDisplayName(role) {
    const roleNames = {
        'admin': 'Administrador',
        'moderator': 'Moderador',
        'user': 'Usuario'
    };
    return roleNames[role] || role;
}

function getStatusDisplayName(status) {
    const statusNames = {
        'active': 'Activo',
        'inactive': 'Inactivo'
    };
    return statusNames[status] || status;
}

function updateUserCount(count) {
    const sectionHeader = document.querySelector('.section-header h2');
    if (sectionHeader) {
        sectionHeader.textContent = `Listado de Usuarios (${count})`;
    }
}

function setupPagination() {
    //configurar paginación (simulada)
    const paginationBtns = document.querySelectorAll('.pagination-btn');
    
    paginationBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            if (!btn.disabled) {
                //simular cambio de página
                showMessage('Funcionalidad de paginación en desarrollo', 'info');
            }
        });
    });
}

//funciones de acción
function editUser(userId) {
    //redirigir a la página de edición con el ID del usuario
    window.location.href = `admin-edit-user.html?id=${userId}`;
}

function deleteUser(userId) {
    //mostrar confirmación antes de eliminar
    if (confirm('¿Estás seguro de que deseas eliminar este usuario? Esta acción no se puede deshacer.')) {
        //simular eliminación
        const userIndex = window.usersData.findIndex(user => user.id === userId);
        
        if (userIndex !== -1) {
            window.usersData.splice(userIndex, 1);
            
            //actualizar tabla
            filterUsers();
            
            showMessage('Usuario eliminado correctamente', 'success');
        } else {
            showMessage('Error al eliminar el usuario', 'error');
        }
    }
}

//función global para mostrar mensajes
function showMessage(message, type = 'info') {
    const messageDiv = document.createElement('div');
    messageDiv.className = `admin-message ${type}`;
    messageDiv.textContent = message;
    
    messageDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 1.5rem;
        border-radius: 5px;
        color: white;
        font-weight: 600;
        z-index: 10000;
        animation: slideIn 0.3s ease;
    `;
    
    //estilos según tipo
    if (type === 'success') {
        messageDiv.style.backgroundColor = '#2ecc71';
    } else if (type === 'error') {
        messageDiv.style.backgroundColor = '#e74c3c';
    } else {
        messageDiv.style.backgroundColor = '#3498db';
    }
    
    document.body.appendChild(messageDiv);
    
    //remover después de 3 segundos
    setTimeout(() => {
        messageDiv.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => messageDiv.remove(), 300);
    }, 3000);
}

//agregar estilos de animación si no existen
if (!document.querySelector('#admin-users-styles')) {
    const style = document.createElement('style');
    style.id = 'admin-users-styles';
    style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        
        @keyframes slideOut {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }
    `;
    document.head.appendChild(style);
}



