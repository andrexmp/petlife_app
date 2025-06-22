// Sistema de citas mejorado para PetLife
// Este archivo ahora es compatible con el calendario interactivo

document.addEventListener('DOMContentLoaded', () => {
    // Solo inicializar si no hay calendario (página simple)
    if (!document.getElementById('calendarDays')) {
        initializeSimpleAppointments();
    }
});

function initializeSimpleAppointments() {
    const appointmentList = document.getElementById('appointmentList');

    // Function to load appointments from localStorage
    function loadAppointments() {
        const appointments = JSON.parse(localStorage.getItem('appointments')) || [];
        appointmentList.innerHTML = ''; // Clear existing list
        if (appointments.length === 0) {
            appointmentList.innerHTML = '<li class="no-appointments">No hay citas agendadas.</li>';
            return;
        }
        appointments.forEach(appointment => {
            const listItem = document.createElement('li');
            listItem.classList.add('appointment-item');
            listItem.innerHTML = `
                <div class="appointment-details">
                    <h4>${appointment.title}</h4>
                    <p><strong>Paciente:</strong> ${appointment.patientName}</p>
                    <p><strong>Fecha:</strong> ${appointment.date}</p>
                    <p><strong>Hora:</strong> ${appointment.time}</p>
                    <p><strong>Notas:</strong> ${appointment.notes || 'N/A'}</p>
                </div>
            `;
            appointmentList.appendChild(listItem);
        });
    }

    // Load appointments when the page loads
    if (appointmentList) {
        loadAppointments();
    }
}

// Función global para agregar citas (usada desde otras páginas)
window.addAppointment = (title, patientName, date, time, notes) => {
    const newAppointment = {
        id: Date.now(), // Simple unique ID
        title,
        patientName,
        date,
        time,
        notes
    };
    const appointments = JSON.parse(localStorage.getItem('appointments')) || [];
    appointments.push(newAppointment);
    localStorage.setItem('appointments', JSON.stringify(appointments));
    
    // Solo recargar la lista si estamos en la página de citas simple
    const appointmentList = document.getElementById('appointmentList');
    if (appointmentList && !document.getElementById('calendarDays')) {
        loadAppointments(); // Reload list to show new appointment
    }
    
    // No mostrar notificación aquí, se maneja desde donde se llama la función
    return newAppointment;
};