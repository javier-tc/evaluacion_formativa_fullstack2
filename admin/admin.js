//funcionalidad principal del panel de administrador
document.addEventListener('DOMContentLoaded', function() {
    //inicializar funcionalidades del dashboard
    initializeDashboard();
    
    //manejar notificaciones
    setupNotifications();
    
    //manejar navegación responsive
    setupResponsiveNavigation();
});

function initializeDashboard() {
    //actualizar estadísticas en tiempo real (simulado)
    updateStats();
    
    //configurar actualizaciones automáticas
    setInterval(updateStats, 30000); //actualizar cada 30 segundos
}

function updateStats() {
    //simular actualización de estadísticas
    const statNumbers = document.querySelectorAll('.stat-number');
    
    statNumbers.forEach(stat => {
        const currentValue = parseInt(stat.textContent.replace(/[^\d]/g, ''));
        const newValue = currentValue + Math.floor(Math.random() * 10);
        
        //animación de contador
        // animateCounter(stat, currentValue, newValue);
    });
}

// function animateCounter(element, start, end) {
//     const duration = 1000;
//     const startTime = performance.now();
    
//     function updateCounter(currentTime) {
//         const elapsed = currentTime - startTime;
//         const progress = Math.min(elapsed / duration, 1);
        
//         const current = Math.floor(start + (end - start) * progress);
//         element.textContent = formatNumber(current);
        
//         if (progress < 1) {
//             requestAnimationFrame(updateCounter);
//         }
//     }
    
//     requestAnimationFrame(updateCounter);
// }

function formatNumber(num) {
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
        return num.toLocaleString();
    }
    return num.toString();
}

function setupNotifications() {
    const notificationBtn = document.querySelector('.notification-btn');
    
    if (notificationBtn) {
        notificationBtn.addEventListener('click', function() {
            showNotificationPanel();
        });
    }
}

function showNotificationPanel() {
    //crear panel de notificaciones
    const notificationPanel = document.createElement('div');
    notificationPanel.className = 'notification-panel';
    notificationPanel.innerHTML = `
        <div class="notification-header">
            <h3>Notificaciones</h3>
            <button class="close-notifications">&times;</button>
        </div>
        <div class="notification-list">
            <div class="notification-item">
                <i class="fas fa-user-plus"></i>
                <div class="notification-content">
                    <p>Nuevo usuario registrado: Juan Pérez</p>
                    <span>Hace 5 minutos</span>
                </div>
            </div>
            <div class="notification-item">
                <i class="fas fa-shopping-cart"></i>
                <div class="notification-content">
                    <p>Nuevo pedido recibido: #ORD-2024-001</p>
                    <span>Hace 15 minutos</span>
                </div>
            </div>
            <div class="notification-item">
                <i class="fas fa-exclamation-triangle"></i>
                <div class="notification-content">
                    <p>Stock bajo: Led Zeppelin IV (5 unidades)</p>
                    <span>Hace 1 hora</span>
                </div>
            </div>
        </div>
    `;
    
    //agregar estilos
    notificationPanel.style.cssText = `
        position: absolute;
        top: 100%;
        right: 0;
        width: 350px;
        background: white;
        border: 1px solid #ddd;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 1000;
        max-height: 400px;
        overflow-y: auto;
    `;
    
    //insertar en el DOM
    const headerActions = document.querySelector('.header-actions');
    headerActions.style.position = 'relative';
    headerActions.appendChild(notificationPanel);
    
    //manejar cierre
    const closeBtn = notificationPanel.querySelector('.close-notifications');
    closeBtn.addEventListener('click', function() {
        notificationPanel.remove();
    });
    
    //cerrar al hacer clic fuera
    document.addEventListener('click', function(e) {
        if (!notificationPanel.contains(e.target) && !notificationBtn.contains(e.target)) {
            notificationPanel.remove();
        }
    });
}

function setupResponsiveNavigation() {
    //agregar botón de menú para móviles
    const header = document.querySelector('.admin-header');
    const menuBtn = document.createElement('button');
    menuBtn.className = 'mobile-menu-btn';
    menuBtn.innerHTML = '<i class="fas fa-bars"></i>';
    menuBtn.style.cssText = `
        display: none;
        background: none;
        border: none;
        font-size: 1.5rem;
        color: #2c3e50;
        cursor: pointer;
        padding: 0.5rem;
    `;
    
    header.querySelector('.header-content').prepend(menuBtn);
    
    //manejar toggle del menú
    menuBtn.addEventListener('click', function() {
        const sidebar = document.querySelector('.admin-sidebar');
        sidebar.classList.toggle('open');
    });
    
    //mostrar botón en móviles
    function checkMobile() {
        if (window.innerWidth <= 768) {
            menuBtn.style.display = 'block';
        } else {
            menuBtn.style.display = 'none';
            document.querySelector('.admin-sidebar').classList.remove('open');
        }
    }
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
}

//funciones de utilidad
// function showMessage(message, type = 'info') {
//     const messageDiv = document.createElement('div');
//     messageDiv.className = `admin-message ${type}`;
//     messageDiv.textContent = message;
    
//     messageDiv.style.cssText = `
//         position: fixed;
//         top: 20px;
//         right: 20px;
//         padding: 1rem 1.5rem;
//         border-radius: 5px;
//         color: white;
//         font-weight: 600;
//         z-index: 10000;
//         animation: slideIn 0.3s ease;
//     `;
    
//     //estilos según tipo
//     if (type === 'success') {
//         messageDiv.style.backgroundColor = '#2ecc71';
//     } else if (type === 'error') {
//         messageDiv.style.backgroundColor = '#e74c3c';
//     } else {
//         messageDiv.style.backgroundColor = '#3498db';
//     }
    
//     document.body.appendChild(messageDiv);
    
//     //remover después de 3 segundos
//     setTimeout(() => {
//         messageDiv.style.animation = 'slideOut 0.3s ease';
//         setTimeout(() => messageDiv.remove(), 300);
//     }, 3000);
// }

//agregar estilos de animación
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
    
    .notification-header {
        padding: 1rem;
        border-bottom: 1px solid #eee;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    
    .notification-header h3 {
        margin: 0;
        font-size: 1rem;
    }
    
    .close-notifications {
        background: none;
        border: none;
        font-size: 1.5rem;
        cursor: pointer;
        color: #666;
    }
    
    .notification-list {
        padding: 0;
    }
    
    .notification-item {
        display: flex;
        align-items: center;
        gap: 1rem;
        padding: 1rem;
        border-bottom: 1px solid #eee;
    }
    
    .notification-item:last-child {
        border-bottom: none;
    }
    
    .notification-item i {
        color: #3498db;
        width: 20px;
    }
    
    .notification-content p {
        margin: 0 0 0.25rem 0;
        font-size: 0.9rem;
    }
    
    .notification-content span {
        font-size: 0.8rem;
        color: #666;
    }
`;
document.head.appendChild(style);
