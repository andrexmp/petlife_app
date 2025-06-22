// Dashboard mejorado para PetLife
class Dashboard {
    constructor() {
        this.init();
    }

    init() {
        this.loadUpcomingAppointments();
        this.updateStats();
        this.loadReminders();
        this.setupAutoRefresh();
        this.setupFilters();
        this.setupThemeToggle();
        this.loadTheme();
        this.setupUserMenu();
        this.loadUserData();
    }

    // Cargar próximas citas
    loadUpcomingAppointments() {
        const appointments = JSON.parse(localStorage.getItem('appointments')) || [];
        const container = document.getElementById('upcomingAppointmentsList');
        
        if (!container) return;

        // Filtrar citas de los próximos 7 días
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Resetear a inicio del día
        const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
        
        const upcomingAppointments = appointments.filter(apt => {
            const aptDate = new Date(apt.date);
            aptDate.setHours(0, 0, 0, 0);
            return aptDate >= today && aptDate <= nextWeek;
        });

        // Ordenar por fecha y hora
        upcomingAppointments.sort((a, b) => {
            const dateA = new Date(`${a.date}T${a.time || '00:00'}`);
            const dateB = new Date(`${b.date}T${b.time || '00:00'}`);
            return dateA - dateB;
        });

        // Mostrar solo las próximas 3 citas
        const displayAppointments = upcomingAppointments.slice(0, 3);

        if (displayAppointments.length === 0) {
            container.innerHTML = `
                <div class="no-appointments">
                    <i class="fas fa-calendar-times"></i>
                    <h4>No hay citas próximas</h4>
                    <p>No tienes citas programadas para los próximos 7 días.</p>
                    <a href="citas.html" class="btn btn-primary">Agendar Cita</a>
                </div>
            `;
            return;
        }

        const appointmentsHTML = displayAppointments.map(apt => {
            const appointmentDate = new Date(apt.date);
            const isToday = this.isToday(appointmentDate);
            const timeUntil = this.getTimeUntil(appointmentDate);
            
            return `
                <div class="appointment-card ${isToday ? 'urgent' : ''}">
                    <div class="pet-avatar">
                        <img src="${this.getPatientPhoto(apt.patientName)}" alt="${apt.patientName}">
                    </div>
                    <div class="appointment-details">
                        <h4>${apt.patientName}</h4>
                        <p class="appointment-date">${this.formatDateForDisplay(appointmentDate)}</p>
                        <p class="appointment-time">${apt.time || 'Sin hora'}</p>
                        <p class="appointment-type">${apt.title}</p>
                        ${isToday ? '<span class="today-badge">Hoy</span>' : ''}
                    </div>
                    <div class="appointment-actions">
                        <button class="btn-small" onclick="window.location.href='citas.html'">
                            <i class="fas fa-eye"></i>
                        </button>
                    </div>
                </div>
            `;
        }).join('');

        container.innerHTML = appointmentsHTML;
    }

    // Actualizar estadísticas
    updateStats() {
        const patients = JSON.parse(localStorage.getItem('pacientes')) || [];
        const appointments = JSON.parse(localStorage.getItem('appointments')) || [];
        
        // Total de pacientes
        document.getElementById('totalPatients').textContent = patients.length;
        
        // Citas de hoy
        const today = this.formatDate(new Date());
        const todayAppointments = appointments.filter(apt => apt.date === today);
        document.getElementById('todayAppointments').textContent = todayAppointments.length;
        
        // Citas de esta semana
        const weekStart = this.getWeekStart();
        const weekEnd = this.getWeekEnd();
        const weekAppointments = appointments.filter(apt => {
            const aptDate = new Date(apt.date);
            aptDate.setHours(0, 0, 0, 0);
            return aptDate >= weekStart && aptDate <= weekEnd;
        });
        document.getElementById('weekAppointments').textContent = weekAppointments.length;
    }

    // Cargar recordatorios
    loadReminders() {
        const reminders = this.generateReminders();
        const container = document.getElementById('remindersList');
        const section = document.getElementById('remindersSection');
        
        if (!container || !section) return;

        if (reminders.length === 0) {
            section.style.display = 'none';
            return;
        }

        const remindersHTML = reminders.map(reminder => `
            <div class="reminder-item ${reminder.type}">
                <div class="reminder-icon">
                    <i class="${reminder.icon}"></i>
                </div>
                <div class="reminder-content">
                    <h4>${reminder.title}</h4>
                    <p>${reminder.message}</p>
                </div>
                <div class="reminder-action">
                    <button class="btn-small" onclick="${reminder.action}">
                        ${reminder.actionText}
                    </button>
                </div>
            </div>
        `).join('');

        container.innerHTML = remindersHTML;
        section.style.display = 'block';
    }

    // Generar recordatorios inteligentes
    generateReminders() {
        const reminders = [];
        const appointments = JSON.parse(localStorage.getItem('appointments')) || [];
        const patients = JSON.parse(localStorage.getItem('pacientes')) || [];

        // Recordatorio de citas de mañana
        const today = new Date();
        const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000);
        const tomorrowFormatted = this.formatDate(tomorrow);
        const tomorrowAppointments = appointments.filter(apt => apt.date === tomorrowFormatted);

        if (tomorrowAppointments.length > 0) {
            reminders.push({
                type: 'info',
                icon: 'fas fa-calendar-day',
                title: 'Citas Mañana',
                message: `Tienes ${tomorrowAppointments.length} cita(s) programada(s) para mañana.`,
                action: 'window.location.href=`citas.html?filter=tomorrow`',
                actionText: 'Ver Agenda'
            });
        }

        // Recordatorio de citas urgentes (hoy)
        const todayFormatted = this.formatDate(today);
        const todayAppointments = appointments.filter(apt => apt.date === todayFormatted);
        if (todayAppointments.length > 0) {
            reminders.push({
                type: 'urgent',
                icon: 'fas fa-exclamation-triangle',
                title: 'Citas Hoy',
                message: `Tienes ${todayAppointments.length} cita(s) programada(s) para hoy.`,
                action: 'window.location.href=`citas.html?filter=today`',
                actionText: 'Ver Agenda'
            });
        }

        // Recordatorio de pacientes sin citas recientes
        const patientsWithoutRecentAppointments = patients.filter(patient => {
            const patientAppointments = appointments.filter(apt => apt.patientName === patient.nombre);
            if (patientAppointments.length === 0) return true;
            
            const lastAppointment = new Date(Math.max(...patientAppointments.map(apt => new Date(apt.date))));
            const daysSinceLastAppointment = (today - lastAppointment) / (1000 * 60 * 60 * 24);
            return daysSinceLastAppointment > 30; // Más de 30 días
        });

        if (patientsWithoutRecentAppointments.length > 0) {
            reminders.push({
                type: 'warning',
                icon: 'fas fa-user-clock',
                title: 'Pacientes Inactivos',
                message: `${patientsWithoutRecentAppointments.length} paciente(s) sin citas recientes.`,
                action: 'window.location.href="pacientes.html"',
                actionText: 'Ver Pacientes'
            });
        }

        return reminders;
    }

    // Configurar filtros rápidos
    setupFilters() {
        const filterButtons = document.querySelectorAll('.quick-filter');
        filterButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const filterType = e.target.dataset.filter;
                this.applyQuickFilter(filterType);
            });
        });
    }

    // Aplicar filtro rápido
    applyQuickFilter(filterType) {
        // Por ahora redirigimos a la página de citas con filtros
        // En el futuro se puede implementar filtrado en el dashboard
        window.location.href = `citas.html?filter=${filterType}`;
    }

    // Configurar auto-refresh
    setupAutoRefresh() {
        // Actualizar cada 5 minutos
        setInterval(() => {
            this.loadUpcomingAppointments();
            this.updateStats();
            this.loadReminders();
        }, 5 * 60 * 1000);
    }

    // Utilidades
    isToday(date) {
        const today = new Date();
        return this.formatDate(date) === this.formatDate(today);
    }

    formatDate(date, includeDay = false) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        
        if (includeDay) {
            const dayNames = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
            const dayName = dayNames[date.getDay()];
            return `${dayName}, ${day}/${month}/${year}`;
        }
        
        return `${year}-${month}-${day}`;
    }

    formatDateForDisplay(date) {
        const dayNames = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
        const dayName = dayNames[date.getDay()];
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        
        return `${dayName}, ${day}/${month}/${year}`;
    }

    getTimeUntil(date) {
        const now = new Date();
        const diff = date - now;
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        
        if (days > 0) return `En ${days} día(s)`;
        if (hours > 0) return `En ${hours} hora(s)`;
        return 'Pronto';
    }

    getPatientPhoto(patientName) {
        const patients = JSON.parse(localStorage.getItem('pacientes')) || [];
        const patient = patients.find(p => p.nombre === patientName);
        return patient && patient.foto ? patient.foto : '../img/avatar.png';
    }

    getWeekStart() {
        const today = new Date();
        const dayOfWeek = today.getDay();
        const diff = today.getDate() - dayOfWeek;
        const weekStart = new Date(today);
        weekStart.setDate(diff);
        weekStart.setHours(0, 0, 0, 0);
        return weekStart;
    }

    getWeekEnd() {
        const weekStart = this.getWeekStart();
        const weekEnd = new Date(weekStart.getTime() + 6 * 24 * 60 * 60 * 1000);
        weekEnd.setHours(23, 59, 59, 999);
        return weekEnd;
    }

    // Configurar toggle del tema
    setupThemeToggle() {
        const themeToggle = document.getElementById('themeToggle');
        if (!themeToggle) return;

        themeToggle.addEventListener('click', () => {
            this.toggleTheme();
        });
    }

    // Cargar tema guardado
    loadTheme() {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'dark') {
            this.applyDarkTheme();
        }
    }

    // Cambiar tema
    toggleTheme() {
        const body = document.body;
        const themeToggle = document.getElementById('themeToggle');
        const icon = themeToggle.querySelector('i');

        if (body.classList.contains('dark-theme')) {
            body.classList.remove('dark-theme');
            icon.className = 'fas fa-moon';
            localStorage.setItem('theme', 'light');
        } else {
            body.classList.add('dark-theme');
            icon.className = 'fas fa-sun';
            localStorage.setItem('theme', 'dark');
        }
    }

    // Aplicar tema oscuro
    applyDarkTheme() {
        const body = document.body;
        const themeToggle = document.getElementById('themeToggle');
        if (!themeToggle) return;
        const icon = themeToggle.querySelector('i');

        body.classList.add('dark-theme');
        icon.className = 'fas fa-sun';
    }

    // Cargar datos del usuario en el header y menú
    loadUserData() {
        const usuario = JSON.parse(localStorage.getItem('usuarioActual'));
        if (!usuario) return;

        document.getElementById('userName').textContent = usuario.nombre.split(' ')[0]; // Mostrar solo el primer nombre
        document.getElementById('userNameDropdown').textContent = usuario.nombre;
        document.getElementById('userEmailDropdown').textContent = usuario.email;

        // Si el usuario tiene una foto de perfil, la cargamos
        const userAvatar = document.getElementById('userAvatar');
        if (usuario.foto) {
            userAvatar.src = usuario.foto;
        }
    }

    // Configurar menú de usuario
    setupUserMenu() {
        const userMenuBtn = document.getElementById('userMenuBtn');
        const userDropdown = document.getElementById('userDropdown');

        if (!userMenuBtn || !userDropdown) return;

        userMenuBtn.addEventListener('click', (event) => {
            event.stopPropagation();
            userDropdown.classList.toggle('show');
            userMenuBtn.classList.toggle('active');
        });

        // Cierra el menú si se hace clic fuera de él
        window.addEventListener('click', () => {
            if (userDropdown.classList.contains('show')) {
                userDropdown.classList.remove('show');
                userMenuBtn.classList.remove('active');
            }
        });
    }
}

// Inicializar dashboard
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => new Dashboard());
} else {
    new Dashboard();
} 