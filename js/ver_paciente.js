document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const patientId = urlParams.get('id');
    let currentPatient = null;

    // Function to display patient details
    function displayPatientDetails(patient) {
        const patientDetailsContainer = document.getElementById('patientDetailsContainer');
        const patientPhotoContainer = document.getElementById('patientPhotoContainer');
        const patientDetailsContent = document.getElementById('patientDetailsContent');

        // Clear previous content
        patientPhotoContainer.innerHTML = '';
        patientDetailsContent.innerHTML = '';

        // Add patient photo
        const photo = document.createElement('img');
        photo.src = patient.foto || '../img/avatar.png'; // Use default avatar if no photo
        photo.alt = `Foto de ${patient.nombre}`;
        patientPhotoContainer.appendChild(photo);

        // Formatear la fecha de nacimiento
        const fechaNacimiento = patient.fechaNacimiento ? new Date(patient.fechaNacimiento).toLocaleDateString('es-ES') : 'No especificada';
        
        // Formatear la fecha de registro
        const fechaRegistro = patient.creationDate ? new Date(patient.creationDate).toLocaleDateString('es-ES') : 'No especificada';
        
        // Formatear las vacunas
        const vacunasTexto = patient.vacunas && patient.vacunas.length > 0 ? patient.vacunas.join(', ') : 'No especificadas';

        // Add patient details
        patientDetailsContent.innerHTML = `
            <h3>${patient.nombre}</h3>
            <p><strong>Especie:</strong> ${patient.especie}</p>
            <p><strong>Género:</strong> ${patient.genero}</p>
            <p><strong>Fecha de Nacimiento:</strong> ${fechaNacimiento}</p>
            <p><strong>Número de Chip:</strong> ${patient.numeroChip || 'No especificado'}</p>
            <p><strong>Vacunas:</strong> ${vacunasTexto}</p>
            <p><strong>Observaciones:</strong> ${patient.observaciones || 'Sin observaciones'}</p>
            <p><strong>Fecha de Registro:</strong> ${fechaRegistro}</p>
        `;
    }

    // Function to display appointments
    function displayAppointments(patientId) {
        const appointmentsContainer = document.createElement('div');
        appointmentsContainer.classList.add('appointments-container');
        appointmentsContainer.innerHTML = '<h4>Citas Registradas</h4>';

        const appointments = JSON.parse(localStorage.getItem('appointments')) || [];
        const patientAppointments = appointments.filter(appointment => appointment.patientId === patientId);

        if (patientAppointments.length > 0) {
            const appointmentsList = document.createElement('ul');
            patientAppointments.forEach(appointment => {
                const listItem = document.createElement('li');
                listItem.textContent = `Fecha: ${appointment.date}, Tipo: ${appointment.type}`;
                appointmentsList.appendChild(listItem);
            });
            appointmentsContainer.appendChild(appointmentsList);
        } else {
            const noAppointments = document.createElement('p');
            noAppointments.textContent = 'No hay citas registradas para este paciente.';
            appointmentsContainer.appendChild(noAppointments);
        }

        document.getElementById('patientDetailsContainer').appendChild(appointmentsContainer);
    }

    if (patientId) {
        const patients = JSON.parse(localStorage.getItem('pacientes')) || [];
        currentPatient = patients.find(p => p.id.toString() === patientId);

        if (currentPatient) {
            displayPatientDetails(currentPatient);
            // We will call displayAppointments later or it can be part of another view

            const agendarCitaBtn = document.getElementById('agendarCitaBtn');
            const modal = document.getElementById('appointmentModal');
            const closeButton = document.querySelector('.modal .close-button');
            const appointmentForm = document.getElementById('appointmentForm');
            const patientNameInput = document.getElementById('appointmentPatientName');

            if (agendarCitaBtn) {
                agendarCitaBtn.addEventListener('click', () => {
                    patientNameInput.value = currentPatient.nombre;
                    modal.style.display = 'block';
                });
            }

            if (closeButton) {
                closeButton.addEventListener('click', () => {
                    modal.style.display = 'none';
                });
            }

            window.addEventListener('click', (event) => {
                if (event.target == modal) {
                    modal.style.display = 'none';
                }
            });

            if (appointmentForm) {
                appointmentForm.addEventListener('submit', (event) => {
                    event.preventDefault();
                    
                    // Validar que todos los campos requeridos estén completos
                    const title = document.getElementById('appointmentTitle').value;
                    const date = document.getElementById('appointmentDate').value;
                    const time = document.getElementById('appointmentTime').value;
                    const notes = document.getElementById('appointmentNotes').value;

                    if (!title || !date || !time) {
                        window.showNotification('Por favor, completa todos los campos requeridos', 'error', 4000);
                        return;
                    }

                    // Validar que la fecha no sea anterior a hoy
                    const selectedDate = new Date(date);
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);
                    
                    if (selectedDate < today) {
                        window.showNotification('La fecha de la cita no puede ser anterior a hoy', 'warning', 4000);
                        return;
                    }

                    try {
                        if (window.addAppointment) {
                            window.addAppointment(title, currentPatient.nombre, date, time, notes);
                        }

                        modal.style.display = 'none';
                        appointmentForm.reset();

                        // Mostrar notificación de éxito
                        window.showNotification(`¡Cita agendada exitosamente para ${currentPatient.nombre}!`, 'success', 3000);

                        // Redirigir después de mostrar la notificación
                        setTimeout(() => {
                            window.location.href = 'citas.html';
                        }, 3500);

                    } catch (error) {
                        window.showNotification('Error al agendar la cita. Inténtalo de nuevo.', 'error', 4000);
                        console.error('Error al agendar cita:', error);
                    }
                });
            }
        } else {
            document.getElementById('patientDetailsContainer').innerHTML = '<p>Paciente no encontrado.</p>';
            window.showNotification('Paciente no encontrado', 'error', 3000);
        }
    } else {
        document.getElementById('patientDetailsContainer').innerHTML = '<p>ID de paciente no proporcionado.</p>';
        window.showNotification('ID de paciente no proporcionado', 'error', 3000);
    }
});