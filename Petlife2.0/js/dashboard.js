document.addEventListener('DOMContentLoaded', function() {
    // Verificar autenticación
    const petLifeUser = JSON.parse(localStorage.getItem('petLifeUser'));
    if (!petLifeUser || localStorage.getItem('petLifeModule') !== 'tutor') {
        window.location.href = 'login-tutor.html';
        return;
    }

    // Inicializar dashboard
    initializeDashboard(petLifeUser);
    setupEventListeners();
    loadDashboardData(petLifeUser);
});

function initializeDashboard(petLifeUser) {
    // Configurar saludo personalizado
    const welcomeMessage = document.getElementById('welcomeMessage');
    const welcomeSubtitle = document.getElementById('welcomeSubtitle');
    const userAvatar = document.getElementById('userAvatar');
    
    const firstName = petLifeUser.name.split(' ')[0];
    const hour = new Date().getHours();
    let greeting = '';
    
    if (hour < 12) greeting = '¡Buenos días';
    else if (hour < 18) greeting = '¡Buenas tardes';
    else greeting = '¡Buenas noches';
    
    welcomeMessage.textContent = `${greeting}, ${firstName}!`;
    welcomeSubtitle.textContent = '¿Cómo están tus mascotas hoy?';
    userAvatar.src = petLifeUser.profilePic || 'img/user-default.jpg';
}

function setupEventListeners() {
    // Botones de acciones rápidas
    document.getElementById('addPetBtn').addEventListener('click', () => {
        window.location.href = 'perfil-tutor.html#add-pet';
    });
    
    document.getElementById('bookAppointmentBtn').addEventListener('click', () => {
        window.location.href = 'agenda.html';
    });
    
    document.getElementById('findVetBtn').addEventListener('click', () => {
        window.location.href = 'veterinarios.html';
    });
    
    document.getElementById('viewPetsBtn').addEventListener('click', () => {
        window.location.href = 'mis-mascotas.html';
    });
    
    // Botones de ver todas
    document.getElementById('viewAllAppointments').addEventListener('click', () => {
        window.location.href = 'agenda.html';
    });
    
    document.getElementById('viewAllPets').addEventListener('click', () => {
        window.location.href = 'mis-mascotas.html';
    });
    
    // Botón de notificaciones
    document.getElementById('notificationBtn').addEventListener('click', () => {
        window.location.href = 'notificaciones.html';
    });
}

function loadDashboardData(petLifeUser) {
    // Cargar estadísticas
    loadStatistics(petLifeUser);
    
    // Cargar próximas citas
    loadUpcomingAppointments(petLifeUser);
    
    // Cargar recordatorios
    loadReminders(petLifeUser);
    
    // Cargar mascotas
    loadPetsPreview(petLifeUser);
    
    // Actualizar badge de notificaciones
    updateNotificationBadge(petLifeUser);
}

function loadStatistics(petLifeUser) {
    const pets = petLifeUser.mascotas || [];
    const appointments = petLifeUser.citas || [];
    const favoriteVets = petLifeUser.favoriteVets || [];
    
    // Contar citas de hoy
    const today = new Date().toDateString();
    const todayAppointments = appointments.filter(app => 
        new Date(app.fecha).toDateString() === today
    );
    
    // Contar alertas pendientes
    const alerts = generateAlerts(petLifeUser);
    
    // Actualizar estadísticas
    document.getElementById('totalPets').textContent = pets.length;
    document.getElementById('todayAppointments').textContent = todayAppointments.length;
    document.getElementById('favoriteVets').textContent = favoriteVets.length;
    document.getElementById('pendingAlerts').textContent = alerts.length;
}

function loadUpcomingAppointments(petLifeUser) {
    const appointmentsList = document.getElementById('appointmentsList');
    const appointments = petLifeUser.citas || [];
    
    // Filtrar citas futuras y ordenar por fecha
    const upcomingAppointments = appointments
        .filter(app => new Date(app.fecha) > new Date())
        .sort((a, b) => new Date(a.fecha) - new Date(b.fecha))
        .slice(0, 3); // Solo mostrar las próximas 3
    
    if (upcomingAppointments.length === 0) {
        appointmentsList.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-calendar-times"></i>
                <h3>No tienes citas programadas</h3>
                <p>Agenda una cita para tus mascotas</p>
            </div>
        `;
        return;
    }
    
    appointmentsList.innerHTML = upcomingAppointments.map(app => {
        const date = new Date(app.fecha);
        const time = date.toLocaleTimeString('es-ES', { 
            hour: '2-digit', 
            minute: '2-digit' 
        });
        const dateStr = date.toLocaleDateString('es-ES', { 
            day: 'numeric', 
            month: 'short' 
        });
        
        return `
            <div class="appointment-item">
                <div class="appointment-time">
                    ${time}
                </div>
                <div class="appointment-info">
                    <h4>${app.mascota}</h4>
                    <p>${app.veterinario} • ${dateStr}</p>
                </div>
            </div>
        `;
    }).join('');
}

function loadReminders(petLifeUser) {
    const remindersList = document.getElementById('remindersList');
    const reminders = generateReminders(petLifeUser);
    
    if (reminders.length === 0) {
        remindersList.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-check-circle"></i>
                <h3>Todo al día</h3>
                <p>No tienes recordatorios pendientes</p>
            </div>
        `;
        return;
    }
    
    remindersList.innerHTML = reminders.map(reminder => {
        const iconClass = reminder.urgent ? 'fas fa-exclamation-triangle' : 'fas fa-bell';
        const urgentClass = reminder.urgent ? 'urgent' : '';
        
        return `
            <div class="reminder-item ${urgentClass}">
                <i class="${iconClass}"></i>
                <div class="reminder-text">${reminder.text}</div>
            </div>
        `;
    }).join('');
}

function loadPetsPreview(petLifeUser) {
    const petsGrid = document.getElementById('petsGrid');
    const pets = petLifeUser.mascotas || [];
    
    if (pets.length === 0) {
        petsGrid.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-paw"></i>
                <h3>No tienes mascotas registradas</h3>
                <p>Añade tu primera mascota</p>
            </div>
        `;
        return;
    }
    
    // Mostrar solo las primeras 4 mascotas
    const previewPets = pets.slice(0, 4);
    
    petsGrid.innerHTML = previewPets.map(pet => `
        <a href="perfil-mascota.html?id=${pet.id}" class="pet-card">
            <img src="${pet.foto || 'img/pet-default.jpg'}" alt="${pet.nombre}">
            <h4>${pet.nombre}</h4>
            <p>${pet.tipo} • ${pet.edad} años</p>
        </a>
    `).join('');
}

function generateReminders(petLifeUser) {
    const reminders = [];
    const pets = petLifeUser.mascotas || [];
    const appointments = petLifeUser.citas || [];
    
    // Verificar citas mañana
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowAppointments = appointments.filter(app => 
        new Date(app.fecha).toDateString() === tomorrow.toDateString()
    );
    
    if (tomorrowAppointments.length > 0) {
        reminders.push({
            text: `Tienes ${tomorrowAppointments.length} cita${tomorrowAppointments.length > 1 ? 's' : ''} mañana`,
            urgent: false
        });
    }
    
    // Verificar mascotas sin citas recientes
    pets.forEach(pet => {
        const lastAppointment = appointments
            .filter(app => app.mascota === pet.nombre)
            .sort((a, b) => new Date(b.fecha) - new Date(a.fecha))[0];
        
        if (lastAppointment) {
            const daysSinceLastAppointment = Math.floor(
                (new Date() - new Date(lastAppointment.fecha)) / (1000 * 60 * 60 * 24)
            );
            
            if (daysSinceLastAppointment > 180) { // 6 meses
                reminders.push({
                    text: `${pet.nombre} necesita revisión médica`,
                    urgent: true
                });
            }
        } else {
            reminders.push({
                text: `${pet.nombre} no tiene historial médico`,
                urgent: true
            });
        }
    });
    
    // Verificar citas urgentes hoy
    const today = new Date().toDateString();
    const urgentToday = appointments.filter(app => 
        new Date(app.fecha).toDateString() === today && app.urgente
    );
    
    if (urgentToday.length > 0) {
        reminders.push({
            text: `Tienes ${urgentToday.length} cita${urgentToday.length > 1 ? 's' : ''} urgente${urgentToday.length > 1 ? 's' : ''} hoy`,
            urgent: true
        });
    }
    
    return reminders.slice(0, 5); // Máximo 5 recordatorios
}

function generateAlerts(petLifeUser) {
    const alerts = [];
    const pets = petLifeUser.mascotas || [];
    const appointments = petLifeUser.citas || [];
    
    // Mascotas sin historial médico
    pets.forEach(pet => {
        const hasAppointments = appointments.some(app => app.mascota === pet.nombre);
        if (!hasAppointments) {
            alerts.push(`Nueva mascota: ${pet.nombre} necesita primera consulta`);
        }
    });
    
    // Citas urgentes
    const urgentAppointments = appointments.filter(app => app.urgente);
    if (urgentAppointments.length > 0) {
        alerts.push(`${urgentAppointments.length} cita${urgentAppointments.length > 1 ? 's' : ''} urgente${urgentAppointments.length > 1 ? 's' : ''}`);
    }
    
    return alerts;
}

function updateNotificationBadge(petLifeUser) {
    const badge = document.getElementById('notificationBadge');
    const alerts = generateAlerts(petLifeUser);
    const reminders = generateReminders(petLifeUser);
    
    const totalNotifications = alerts.length + reminders.length;
    badge.textContent = totalNotifications;
    
    if (totalNotifications === 0) {
        badge.style.display = 'none';
    } else {
        badge.style.display = 'flex';
    }
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
    
    // Auto-remover después de 5 segundos
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 5000);
}

// Exportar para uso global
window.showNotification = showNotification;

function cerrarSesion() {
    localStorage.removeItem('petLifeUser');
    localStorage.removeItem('petLifeModule');
    window.location.href = 'login-tutor.html';
} 