document.addEventListener('DOMContentLoaded', function() {
    // Verificar autenticación
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) {
        window.location.href = 'login.html';
        return;
    }

    // Inicializar página
    initializeNotificationsPage();
    setupEventListeners();
    loadNotifications();
});

let currentNotifications = [];
let currentFilter = 'all';

function initializeNotificationsPage() {
    // Generar notificaciones de ejemplo si no existen
    if (!currentUser.notifications || currentUser.notifications.length === 0) {
        generateSampleNotifications();
    }
}

function setupEventListeners() {
    // Filtros
    document.querySelectorAll('.filter-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            const filter = tab.dataset.filter;
            setActiveFilter(filter);
            filterNotifications(filter);
        });
    });

    // Acciones
    document.getElementById('markAllRead').addEventListener('click', markAllAsRead);
    document.getElementById('clearAll').addEventListener('click', clearAllNotifications);
}

function generateSampleNotifications() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const sampleNotifications = [
        {
            id: 1,
            type: 'appointment',
            title: 'Cita confirmada',
            message: 'Tu cita con Molly para vacunación ha sido confirmada para mañana a las 10:00 AM.',
            timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 horas atrás
            read: false,
            urgent: false,
            data: {
                petName: 'Molly',
                vetName: 'Dra. Adriana Contreras',
                date: '2024-12-20',
                time: '10:00',
                type: 'Vacunación'
            }
        },
        {
            id: 2,
            type: 'reminder',
            title: 'Recordatorio de medicación',
            message: 'Es hora de darle la medicación a Rocky. No olvides su dosis de las 2:00 PM.',
            timestamp: new Date(Date.now() - 30 * 60 * 1000), // 30 minutos atrás
            read: false,
            urgent: true,
            data: {
                petName: 'Rocky',
                medication: 'Antibiótico',
                time: '14:00'
            }
        },
        {
            id: 3,
            type: 'alert',
            title: 'Mascota sin historial médico',
            message: 'Luna no tiene historial médico registrado. Te recomendamos agendar su primera consulta.',
            timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 día atrás
            read: true,
            urgent: false,
            data: {
                petName: 'Luna'
            }
        },
        {
            id: 4,
            type: 'success',
            title: 'Cita completada',
            message: 'La consulta de Bella con el Dr. Martínez ha sido completada exitosamente.',
            timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 días atrás
            read: true,
            urgent: false,
            data: {
                petName: 'Bella',
                vetName: 'Dr. Andrés Martínez',
                date: '2024-12-17'
            }
        },
        {
            id: 5,
            type: 'appointment',
            title: 'Cita próxima',
            message: 'Tienes una cita con Max mañana a las 3:00 PM. No olvides traer su historial médico.',
            timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 horas atrás
            read: false,
            urgent: false,
            data: {
                petName: 'Max',
                vetName: 'Dra. María González',
                date: '2024-12-20',
                time: '15:00',
                type: 'Control general'
            }
        }
    ];

    currentUser.notifications = sampleNotifications;
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    updateRegisteredUsers(currentUser);
}

function loadNotifications() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    currentNotifications = currentUser.notifications || [];
    
    updateNotificationCounts();
    filterNotifications(currentFilter);
}

function updateNotificationCounts() {
    const counts = {
        all: currentNotifications.length,
        appointments: currentNotifications.filter(n => n.type === 'appointment').length,
        reminders: currentNotifications.filter(n => n.type === 'reminder').length,
        alerts: currentNotifications.filter(n => n.type === 'alert').length
    };

    document.getElementById('countAll').textContent = counts.all;
    document.getElementById('countAppointments').textContent = counts.appointments;
    document.getElementById('countReminders').textContent = counts.reminders;
    document.getElementById('countAlerts').textContent = counts.alerts;
}

function setActiveFilter(filter) {
    currentFilter = filter;
    
    // Actualizar UI
    document.querySelectorAll('.filter-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    document.querySelector(`[data-filter="${filter}"]`).classList.add('active');
}

function filterNotifications(filter) {
    let filteredNotifications = currentNotifications;
    
    if (filter !== 'all') {
        filteredNotifications = currentNotifications.filter(n => n.type === filter);
    }
    
    // Ordenar por fecha (más recientes primero)
    filteredNotifications.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    
    renderNotifications(filteredNotifications);
}

function renderNotifications(notifications) {
    const notificationsList = document.getElementById('notificationsList');
    const emptyState = document.getElementById('emptyState');
    
    if (notifications.length === 0) {
        notificationsList.style.display = 'none';
        emptyState.style.display = 'block';
        return;
    }
    
    notificationsList.style.display = 'block';
    emptyState.style.display = 'none';
    
    notificationsList.innerHTML = notifications.map(notification => 
        createNotificationItem(notification)
    ).join('');
    
    // Configurar eventos de las notificaciones
    setupNotificationEvents();
}

function createNotificationItem(notification) {
    const timeAgo = getTimeAgo(notification.timestamp);
    const iconClass = getNotificationIcon(notification.type);
    const urgentClass = notification.urgent ? 'urgent' : '';
    const unreadClass = !notification.read ? 'unread' : '';
    
    let actionsHTML = '';
    if (notification.type === 'appointment') {
        actionsHTML = `
            <div class="notification-actions">
                <button class="notification-action primary" onclick="viewAppointmentDetails(${notification.id})">
                    Ver detalles
                </button>
                <button class="notification-action" onclick="markAsRead(${notification.id})">
                    Marcar como leído
                </button>
            </div>
        `;
    } else {
        actionsHTML = `
            <div class="notification-actions">
                <button class="notification-action" onclick="markAsRead(${notification.id})">
                    Marcar como leído
                </button>
                <button class="notification-action danger" onclick="deleteNotification(${notification.id})">
                    Eliminar
                </button>
            </div>
        `;
    }
    
    let detailsHTML = '';
    if (notification.type === 'appointment' && notification.data) {
        detailsHTML = `
            <div class="appointment-details">
                <div class="appointment-detail">
                    <span class="appointment-detail-label">Mascota</span>
                    <span class="appointment-detail-value">${notification.data.petName}</span>
                </div>
                <div class="appointment-detail">
                    <span class="appointment-detail-label">Veterinario</span>
                    <span class="appointment-detail-value">${notification.data.vetName}</span>
                </div>
                <div class="appointment-detail">
                    <span class="appointment-detail-label">Fecha</span>
                    <span class="appointment-detail-value">${formatDate(notification.data.date)}</span>
                </div>
                <div class="appointment-detail">
                    <span class="appointment-detail-label">Hora</span>
                    <span class="appointment-detail-value">${notification.data.time}</span>
                </div>
            </div>
        `;
    }
    
    return `
        <div class="notification-item ${notification.type} ${urgentClass} ${unreadClass}" data-id="${notification.id}">
            <div class="notification-header">
                <div class="notification-icon ${notification.type}">
                    <i class="${iconClass}"></i>
                </div>
                <div class="notification-content">
                    <h4 class="notification-title">${notification.title}</h4>
                    <p class="notification-message">${notification.message}</p>
                    ${detailsHTML}
                    <div class="notification-meta">
                        <span class="notification-time">
                            <i class="fas fa-clock"></i>
                            ${timeAgo}
                        </span>
                        ${notification.urgent ? '<span class="urgent-badge">Urgente</span>' : ''}
                    </div>
                    ${actionsHTML}
                </div>
            </div>
        </div>
    `;
}

function getNotificationIcon(type) {
    const icons = {
        appointment: 'fas fa-calendar-check',
        reminder: 'fas fa-clock',
        alert: 'fas fa-exclamation-triangle',
        success: 'fas fa-check-circle',
        info: 'fas fa-info-circle'
    };
    return icons[type] || 'fas fa-bell';
}

function getTimeAgo(timestamp) {
    const now = new Date();
    const diff = now - new Date(timestamp);
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (minutes < 1) return 'Ahora mismo';
    if (minutes < 60) return `Hace ${minutes} minuto${minutes > 1 ? 's' : ''}`;
    if (hours < 24) return `Hace ${hours} hora${hours > 1 ? 's' : ''}`;
    if (days < 7) return `Hace ${days} día${days > 1 ? 's' : ''}`;
    return new Date(timestamp).toLocaleDateString('es-ES');
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });
}

function setupNotificationEvents() {
    // Eventos de clic en notificaciones
    document.querySelectorAll('.notification-item').forEach(item => {
        item.addEventListener('click', (e) => {
            if (!e.target.closest('.notification-action')) {
                const notificationId = parseInt(item.dataset.id);
                markAsRead(notificationId);
            }
        });
    });
}

function markAsRead(notificationId) {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const notification = currentUser.notifications.find(n => n.id === notificationId);
    
    if (notification) {
        notification.read = true;
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        updateRegisteredUsers(currentUser);
        
        // Actualizar UI
        const notificationElement = document.querySelector(`[data-id="${notificationId}"]`);
        if (notificationElement) {
            notificationElement.classList.remove('unread');
        }
        
        showNotification('Notificación marcada como leída', 'success');
        loadNotifications(); // Recargar para actualizar contadores
    }
}

function markAllAsRead() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    
    currentUser.notifications.forEach(notification => {
        notification.read = true;
    });
    
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    updateRegisteredUsers(currentUser);
    
    showNotification('Todas las notificaciones marcadas como leídas', 'success');
    loadNotifications();
}

function deleteNotification(notificationId) {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    
    currentUser.notifications = currentUser.notifications.filter(n => n.id !== notificationId);
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    updateRegisteredUsers(currentUser);
    
    // Animación de eliminación
    const notificationElement = document.querySelector(`[data-id="${notificationId}"]`);
    if (notificationElement) {
        notificationElement.classList.add('removing');
        setTimeout(() => {
            loadNotifications();
        }, 300);
    }
    
    showNotification('Notificación eliminada', 'info');
}

function clearAllNotifications() {
    if (confirm('¿Estás seguro de que quieres eliminar todas las notificaciones?')) {
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        currentUser.notifications = [];
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        updateRegisteredUsers(currentUser);
        
        showNotification('Todas las notificaciones han sido eliminadas', 'info');
        loadNotifications();
    }
}

function viewAppointmentDetails(notificationId) {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const notification = currentUser.notifications.find(n => n.id === notificationId);
    
    if (notification && notification.data) {
        // Redirigir a la página de agenda con los detalles
        window.location.href = `agenda.html?appointment=${notificationId}`;
    }
}

function updateRegisteredUsers(updatedUser) {
    const allUsers = JSON.parse(localStorage.getItem('registeredUsers')) || [];
    const userIndex = allUsers.findIndex(user => user.email === updatedUser.email);
    
    if (userIndex !== -1) {
        allUsers[userIndex] = updatedUser;
    } else {
        allUsers.push(updatedUser);
    }
    
    localStorage.setItem('registeredUsers', JSON.stringify(allUsers));
}

// Sistema de notificaciones
function showNotification(message, type = 'info') {
    const notificationSystem = document.getElementById('notificationSystem');
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    
    const icon = type === 'success' ? 'fas fa-check-circle' :
                 type === 'error' ? 'fas fa-exclamation-circle' :
                 type === 'warning' ? 'fas fa-exclamation-triangle' :
                 'fas fa-info-circle';
    
    notification.innerHTML = `
        <i class="${icon}"></i>
        <span>${message}</span>
        <button onclick="this.parentElement.remove()" style="margin-left: auto; background: none; border: none; color: inherit; cursor: pointer;">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    notificationSystem.appendChild(notification);
    
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 5000);
}

// Exportar funciones para uso global
window.markAsRead = markAsRead;
window.deleteNotification = deleteNotification;
window.viewAppointmentDetails = viewAppointmentDetails;
window.showNotification = showNotification;

function cerrarSesion() {
    localStorage.removeItem('petLifeUser');
    localStorage.removeItem('petLifeModule');
    const modulo = window.currentModule || localStorage.getItem('petLifeModule');
    if (modulo === 'tutor') {
        window.location.href = '../Petlife2.0/login-tutor.html';
    } else {
        window.location.href = '../login-veterinario.html';
    }
} 