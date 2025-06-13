document.addEventListener('DOMContentLoaded', () => {
    const allPatientListContainer = document.getElementById('allPatientList');
    const patientSearchInput = document.getElementById('patientSearch');

    function loadAllPatients() {
        let pacientes = JSON.parse(localStorage.getItem('pacientes')) || [];

        // Ordenar pacientes alfabéticamente por nombre
        pacientes.sort((a, b) => a.nombre.localeCompare(b.nombre));

        allPatientListContainer.innerHTML = ''; // Limpiar lista actual

        if (pacientes.length === 0) {
            allPatientListContainer.innerHTML = '<p>No hay pacientes registrados aún.</p>';
            return;
        }

        const searchTerm = patientSearchInput.value.toLowerCase();
        const filteredPacientes = pacientes.filter(paciente => 
            paciente.nombre.toLowerCase().includes(searchTerm)
        );

        if (filteredPacientes.length === 0) {
            allPatientListContainer.innerHTML = '<p>No se encontraron pacientes con ese nombre.</p>';
            return;
        }

        filteredPacientes.forEach(paciente => {
            const patientCard = document.createElement('div');
            patientCard.classList.add('appointment-card'); // Reutilizar la clase de tarjeta de cita

            const petAvatar = document.createElement('div');
            petAvatar.classList.add('pet-avatar');
            const img = document.createElement('img');
            img.src = paciente.foto || '../img/avatar.png';
            img.alt = paciente.nombre;
            petAvatar.appendChild(img);

            const patientDetails = document.createElement('div');
            patientDetails.classList.add('appointment-details');
            const nameElement = document.createElement('h4');
            nameElement.textContent = paciente.nombre;
            const speciesElement = document.createElement('p');
            speciesElement.textContent = `Especie: ${paciente.especie}`;

            const viewDetailsButton = document.createElement('button');
            viewDetailsButton.textContent = 'Ver ficha';
            viewDetailsButton.classList.add('btn-small');
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

            allPatientListContainer.appendChild(patientCard);
        });
    }

    // Cargar pacientes inicialmente
    loadAllPatients();

    // Añadir evento de escucha para el campo de búsqueda
    if (patientSearchInput) {
        patientSearchInput.addEventListener('input', loadAllPatients);
    }
});