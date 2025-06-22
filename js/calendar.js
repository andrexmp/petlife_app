// Sistema de calendario interactivo para PetLife
class Calendar {
    constructor() {
        this.currentDate = new Date();
        this.selectedDate = new Date();
        this.currentFilter = 'all';
        this.currentView = 'list';
        
        this.init();
    }

    init() {
        this.renderCalendar();
        this.bindEvents();
        this.loadAppointments();
        this.updateStats();
    }

    // Renderizar el calendario
    renderCalendar() {
        const year = this.currentDate.getFullYear();
        const month = this.currentDate.getMonth();
        
        // Actualizar el título del mes
        const monthNames = [
            'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
            'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
        ];
        
        document.getElementById('currentMonth').textContent = 
            `${monthNames[month]} ${year}`;

        // Obtener el primer día del mes y el número de días
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startingDay = firstDay.getDay();

        // Obtener el último día del mes anterior
        const prevMonthLastDay = new Date(year, month, 0);
        const prevMonthDays = prevMonthLastDay.getDate();

        let calendarHTML = '';

        // Días del mes anterior
        for (let i = startingDay - 1; i >= 0; i--) {
            const day = prevMonthDays - i;
            calendarHTML += `<div class="calendar-day other-month">${day}</div>`;
        }

        // Días del mes actual
        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(year, month, day);
            const isToday = this.isToday(date);
            const isSelected = this.isSelected(date);
            const hasAppointments = this.hasAppointmentsOnDate(date);
            
            let classes = 'calendar-day';
            if (isToday) classes += ' today';
            if (isSelected) classes += ' selected';
            if (hasAppointments) classes += ' has-appointments';
            
            calendarHTML += `<div class="${classes}" data-date="${date.toISOString().split('T')[0]}">${day}</div>`;
        }

        // Días del mes siguiente
        const remainingDays = 42 - (startingDay + daysInMonth); // 6 semanas * 7 días
        for (let day = 1; day <= remainingDays; day++) {
            calendarHTML += `<div class="calendar-day other-month">${day}</div>`;
        }

        document.getElementById('calendarDays').innerHTML = calendarHTML;
    }

    // Vincular eventos
    bindEvents() {
        // Navegación del calendario
        document.getElementById('prevMonth').addEventListener('click', () => {
            this.currentDate.setMonth(this.currentDate.getMonth() - 1);
            this.renderCalendar();
            this.loadAppointments();
        });

        document.getElementById('nextMonth').addEventListener('click', () => {
            this.currentDate.setMonth(this.currentDate.getMonth() + 1);
            this.renderCalendar();
            this.loadAppointments();
        });

        // Clic en días del calendario
        document.getElementById('calendarDays').addEventListener('click', (e) => {
            if (e.target.classList.contains('calendar-day') && !e.target.classList.contains('other-month')) {
                const dateStr = e.target.dataset.date;
                if (dateStr) {
                    this.selectedDate = new Date(dateStr);
                    this.currentFilter = 'day';
                    this.updateFilterTabs();
                    this.loadAppointments();
                    this.renderCalendar(); // Para actualizar la selección visual
                }
            }
        });

        // Filtros
        document.querySelectorAll('.filter-tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                this.currentFilter = e.target.closest('.filter-tab').dataset.filter;
                this.updateFilterTabs();
                this.loadAppointments();
            });
        });

        // Cambio de vista
        document.querySelectorAll('.view-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.currentView = e.target.closest('.view-btn').dataset.view;
                this.updateViewButtons();
                this.loadAppointments();
            });
        });

        // Botón de agregar cita
        document.getElementById('addAppointmentBtn').addEventListener('click', () => {
            this.showAddAppointmentModal();
        });

        // Modal de agregar cita
        const modal = document.getElementById('addAppointmentModal');
        const closeBtn = modal.querySelector('.close-button');
        const form = document.getElementById('addAppointmentForm');

        closeBtn.addEventListener('click', () => {
            modal.style.display = 'none';
        });

        window.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        });

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.addNewAppointment();
        });
    }

    // Cargar citas
    loadAppointments() {
        const appointments = JSON.parse(localStorage.getItem('appointments')) || [];
        let filteredAppointments = [];

        // Filtrar citas según el filtro actual
        switch (this.currentFilter) {
            case 'today':
                filteredAppointments = appointments.filter(apt => 
                    apt.date === this.formatDate(new Date())
                );
                document.getElementById('appointmentsTitle').textContent = 'Citas de Hoy';
                break;
            case 'week':
                const weekStart = this.getWeekStart();
                const weekEnd = this.getWeekEnd();
                filteredAppointments = appointments.filter(apt => {
                    const aptDate = new Date(apt.date);
                    return aptDate >= weekStart && aptDate <= weekEnd;
                });
                document.getElementById('appointmentsTitle').textContent = 'Citas de Esta Semana';
                break;
            case 'day':
                filteredAppointments = appointments.filter(apt => 
                    apt.date === this.formatDate(this.selectedDate)
                );
                document.getElementById('appointmentsTitle').textContent = 
                    `Citas del ${this.formatDate(this.selectedDate, true)}`;
                break;
            default:
                filteredAppointments = appointments;
                document.getElementById('appointmentsTitle').textContent = 'Todas las Citas';
        }

        this.renderAppointments(filteredAppointments);
        this.updateStats();
    }

    // Renderizar citas
    renderAppointments(appointments) {
        const container = document.getElementById('appointmentList');
        
        if (appointments.length === 0) {
            container.innerHTML = `
                <div class="no-appointments">
                    <i class="fas fa-calendar-times"></i>
                    <h4>No hay citas programadas</h4>
                    <p>${this.getEmptyMessage()}</p>
                </div>
            `;
            return;
        }

        // Ordenar por fecha y hora
        appointments.sort((a, b) => {
            const dateA = new Date(`${a.date}T${a.time}`);
            const dateB = new Date(`${b.date}T${b.time}`);
            return dateA - dateB;
        });

        const appointmentsHTML = appointments.map(apt => {
            const appointmentDate = new Date(apt.date);
            const isToday = this.isToday(appointmentDate);
            const isPast = appointmentDate < new Date();
            
            let statusClass = '';
            if (isPast) statusClass = 'completed';
            else if (isToday) statusClass = 'urgent';

            return `
                <div class="appointment-item ${statusClass}">
                    <h4>${apt.title}</h4>
                    <p><strong>Paciente:</strong> ${apt.patientName}</p>
                    <p><strong>Fecha:</strong> ${this.formatDate(appointmentDate, true)}</p>
                    <p><strong>Hora:</strong> ${apt.time}</p>
                    ${apt.notes ? `<p><strong>Notas:</strong> ${apt.notes}</p>` : ''}
                </div>
            `;
        }).join('');

        container.innerHTML = appointmentsHTML;

        // Aplicar vista actual
        if (this.currentView === 'cards') {
            container.classList.add('cards-view');
        } else {
            container.classList.remove('cards-view');
        }
    }

    // Actualizar estadísticas
    updateStats() {
        const appointments = JSON.parse(localStorage.getItem('appointments')) || [];
        const today = this.formatDate(new Date());
        const weekStart = this.getWeekStart();
        const weekEnd = this.getWeekEnd();

        const todayCount = appointments.filter(apt => apt.date === today).length;
        const weekCount = appointments.filter(apt => {
            const aptDate = new Date(apt.date);
            return aptDate >= weekStart && aptDate <= weekEnd;
        }).length;

        document.getElementById('totalAppointments').textContent = appointments.length;
        document.getElementById('todayAppointments').textContent = todayCount;
        document.getElementById('weekAppointments').textContent = weekCount;
    }

    // Actualizar pestañas de filtro
    updateFilterTabs() {
        document.querySelectorAll('.filter-tab').forEach(tab => {
            tab.classList.remove('active');
        });
        document.querySelector(`[data-filter="${this.currentFilter}"]`).classList.add('active');
    }

    // Actualizar botones de vista
    updateViewButtons() {
        document.querySelectorAll('.view-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-view="${this.currentView}"]`).classList.add('active');
    }

    // Mostrar modal de agregar cita
    showAddAppointmentModal() {
        const modal = document.getElementById('addAppointmentModal');
        const patientSelect = document.getElementById('appointmentPatientName');
        
        // Cargar pacientes en el select
        const patients = JSON.parse(localStorage.getItem('pacientes')) || [];
        patientSelect.innerHTML = '<option value="" disabled selected>Seleccione un paciente</option>';
        patients.forEach(patient => {
            const option = document.createElement('option');
            option.value = patient.nombre;
            option.textContent = patient.nombre;
            patientSelect.appendChild(option);
        });

        // Establecer fecha actual
        document.getElementById('appointmentDate').value = this.formatDate(new Date());
        
        modal.style.display = 'block';
    }

    // Agregar nueva cita
    addNewAppointment() {
        const title = document.getElementById('appointmentTitle').value;
        const patientName = document.getElementById('appointmentPatientName').value;
        const date = document.getElementById('appointmentDate').value;
        const time = document.getElementById('appointmentTime').value;
        const notes = document.getElementById('appointmentNotes').value;

        if (!title || !patientName || !date || !time) {
            window.showNotification('Por favor, completa todos los campos requeridos', 'error', 4000);
            return;
        }

        const newAppointment = {
            id: Date.now(),
            title,
            patientName,
            date,
            time,
            notes
        };

        const appointments = JSON.parse(localStorage.getItem('appointments')) || [];
        appointments.push(newAppointment);
        localStorage.setItem('appointments', JSON.stringify(appointments));

        // Cerrar modal y limpiar formulario
        document.getElementById('addAppointmentModal').style.display = 'none';
        document.getElementById('addAppointmentForm').reset();

        // Actualizar vista
        this.renderCalendar();
        this.loadAppointments();
        this.updateStats();

        // Mostrar notificación
        window.showNotification('Cita agendada exitosamente', 'success', 3000);
    }

    // Utilidades
    isToday(date) {
        return this.formatDate(date) === this.formatDate(new Date());
    }

    isSelected(date) {
        return this.formatDate(date) === this.formatDate(this.selectedDate);
    }

    hasAppointmentsOnDate(date) {
        const appointments = JSON.parse(localStorage.getItem('appointments')) || [];
        const dateStr = this.formatDate(date);
        return appointments.some(apt => apt.date === dateStr);
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

    getWeekStart() {
        const today = new Date();
        const dayOfWeek = today.getDay();
        const diff = today.getDate() - dayOfWeek;
        return new Date(today.setDate(diff));
    }

    getWeekEnd() {
        const weekStart = this.getWeekStart();
        return new Date(weekStart.getTime() + 6 * 24 * 60 * 60 * 1000);
    }

    getEmptyMessage() {
        switch (this.currentFilter) {
            case 'today':
                return 'No tienes citas programadas para hoy. ¡Disfruta tu día!';
            case 'week':
                return 'No hay citas programadas esta semana.';
            case 'day':
                return `No hay citas programadas para el ${this.formatDate(this.selectedDate, true)}.`;
            default:
                return 'No hay citas programadas. ¡Agrega tu primera cita!';
        }
    }
}

// Inicializar calendario cuando se cargue la página
document.addEventListener('DOMContentLoaded', () => {
    new Calendar();
}); 