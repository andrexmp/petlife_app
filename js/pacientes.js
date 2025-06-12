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
                foto: fotoBase64
            };

            let pacientes = JSON.parse(localStorage.getItem('pacientes')) || [];
            pacientes.push(nuevoPaciente);
            localStorage.setItem('pacientes', JSON.stringify(pacientes));

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

        const pacientes = JSON.parse(localStorage.getItem('pacientes')) || [];
        patientListContainer.innerHTML = ''; // Limpiar lista actual

        if (pacientes.length === 0) {
            patientListContainer.innerHTML = '<p>No hay pacientes registrados aún.</p>';
            return;
        }

        pacientes.forEach(paciente => {
            const patientCard = document.createElement('div');
            patientCard.classList.add('patient-card');

            const petAvatar = document.createElement('div');
            petAvatar.classList.add('pet-avatar');
            const img = document.createElement('img');
            img.src = paciente.foto || '../img/avatar.png'; // Usar foto guardada o avatar por defecto
            img.alt = paciente.nombre;
            petAvatar.appendChild(img);

            const patientDetails = document.createElement('div');
            patientDetails.classList.add('patient-details');
            const nameElement = document.createElement('h4');
            nameElement.textContent = paciente.nombre;
            const speciesElement = document.createElement('p');
            speciesElement.textContent = `Especie: ${paciente.especie}`;
            // Puedes añadir más detalles aquí si lo deseas

            patientDetails.appendChild(nameElement);
            patientDetails.appendChild(speciesElement);

            patientCard.appendChild(petAvatar);
            patientCard.appendChild(patientDetails);

            patientListContainer.appendChild(patientCard);
        });
    }

    // Asegurarse de que loadPatients se llama solo en el dashboard
    if (document.getElementById('patientList')) {
        loadPatients();
    }
});