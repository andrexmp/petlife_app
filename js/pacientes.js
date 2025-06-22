document.addEventListener('DOMContentLoaded', () => {
    const registroPacienteForm = document.getElementById('registroPacienteForm');

    if (registroPacienteForm) {
        registroPacienteForm.addEventListener('submit', async (event) => {
            event.preventDefault();

            const nombre = document.getElementById('nombre').value;
            const especie = document.getElementById('especie').value;
            const genero = document.getElementById('genero').value;
            const fechaNacimiento = document.getElementById('fechaNacimiento').value;
            const numeroChip = document.getElementById('numeroChip').value;
            const observaciones = document.getElementById('observaciones').value;
            const fotoPacienteInput = document.getElementById('fotoPaciente');
            
            const vacunas = Array.from(document.querySelectorAll('input[name="vacunas"]:checked'))
                               .map(checkbox => checkbox.value);

            let fotoBase64 = '';
            if (fotoPacienteInput.files.length > 0) {
                fotoBase64 = await readFileAsBase64(fotoPacienteInput.files[0]);
            }

            const nuevoPaciente = {
                id: Date.now(), // Generar un ID único
                nombre,
                especie,
                genero,
                fechaNacimiento,
                numeroChip,
                vacunas,
                observaciones,
                foto: fotoBase64,
                creationDate: new Date().toISOString() // Añadir la fecha de creación
            };

            let pacientes = JSON.parse(localStorage.getItem('pacientes')) || [];
            pacientes.push(nuevoPaciente);
            localStorage.setItem('pacientes', JSON.stringify(pacientes));

            // Mostrar notificación de éxito
            if (window.showNotification) {
                window.showNotification(`¡Paciente ${nombre} registrado exitosamente!`, 'success', 3000);
            }

            // Redirigir al dashboard con un mensaje de éxito
            window.location.href = `dashboard.html?registered=true`; // Simplificado para solo indicar registro exitoso
        });
    }

    function readFileAsBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => {
                resolve(reader.result);
            };
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    }

    // Función para cargar y mostrar pacientes en el dashboard
    function loadPatients() {
        const patientListContainer = document.getElementById('patientList');
        if (!patientListContainer) return; // Salir si no estamos en el dashboard

        let pacientes = JSON.parse(localStorage.getItem('pacientes')) || [];
        
        // Ordenar pacientes por fecha de creación (los más recientes primero)
        pacientes.sort((a, b) => new Date(b.creationDate) - new Date(a.creationDate));

        patientListContainer.innerHTML = ''; // Limpiar lista actual

        if (pacientes.length === 0) {
            patientListContainer.innerHTML = '<p>No hay pacientes registrados aún.</p>';
            return;
        }

        // Mostrar solo los 3 pacientes más recientes
        const latestPatients = pacientes.slice(0, 3);

        latestPatients.forEach(paciente => {
            const patientCard = document.createElement('div');
            patientCard.classList.add('appointment-card'); // Usar la misma clase que las citas

            const petAvatar = document.createElement('div');
            petAvatar.classList.add('pet-avatar');
            const img = document.createElement('img');
            img.src = paciente.foto || '../img/avatar.png'; // Usar foto guardada o avatar por defecto
            img.alt = paciente.nombre;
            petAvatar.appendChild(img);

            const patientDetails = document.createElement('div');
            patientDetails.classList.add('appointment-details'); // Usar la misma clase que las citas
            const nameElement = document.createElement('h4');
            nameElement.textContent = paciente.nombre;
            const speciesElement = document.createElement('p');
            speciesElement.textContent = `Especie: ${paciente.especie}`;
            
            // Botón "Ver ficha"
            const viewDetailsButton = document.createElement('button');
            viewDetailsButton.textContent = 'Ver ficha';
            viewDetailsButton.classList.add('btn-small'); // Usar la misma clase que las citas
            viewDetailsButton.onclick = () => {
                window.location.href = `ver_paciente.html?id=${paciente.id}`;
            };

            patientDetails.appendChild(nameElement);
            patientDetails.appendChild(speciesElement);

            const patientActions = document.createElement('div');
            patientActions.classList.add('appointment-actions');
            patientActions.appendChild(viewDetailsButton);

            patientCard.appendChild(petAvatar);
            patientCard.appendChild(patientDetails);
            patientCard.appendChild(patientActions);

            patientListContainer.appendChild(patientCard);
        });
    }

    // Asegurarse de que loadPatients se llama solo en el dashboard
    if (document.getElementById('patientList')) {
        loadPatients();
    }
});