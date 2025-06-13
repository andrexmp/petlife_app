document.addEventListener('DOMContentLoaded', () => {
    const patientDetailsContainer = document.getElementById('patientDetailsContainer');

    const urlParams = new URLSearchParams(window.location.search);
    const patientId = urlParams.get('id');

    if (patientId) {
        const pacientes = JSON.parse(localStorage.getItem('pacientes')) || [];
        const paciente = pacientes.find(p => p.id == patientId);

         if (paciente) {
            const patientPhotoContainer = document.getElementById('patientPhotoContainer');
            const patientDetailsContent = document.getElementById('patientDetailsContent');

            if (paciente.foto) {
                patientPhotoContainer.innerHTML = `<img src="${paciente.foto}" alt="Foto del paciente">`;
            } else {
                patientPhotoContainer.innerHTML = `<img src="../img/avatar.png" alt="Foto por defecto">`; // Default image
            }

            patientDetailsContent.innerHTML = `
                <div class="detail-item">
                    <label>Nombre:</label>
                    <span>${paciente.nombre}</span>
                </div>
                <div class="detail-item">
                    <label>Especie:</label>
                    <span>${paciente.especie}</span>
                </div>
                <div class="detail-item">
                    <label>Género:</label>
                    <span>${paciente.genero}</span>
                </div>
                <div class="detail-item">
                    <label>Fecha de Nacimiento:</label>
                    <span>${paciente.fechaNacimiento}</span>
                </div>
                <div class="detail-item">
                    <label>Número de Chip:</label>
                    <span>${paciente.numeroChip || 'N/A'}</span>
                </div>
                <div class="detail-item">
                    <label>Vacunas:</label>
                    <span>${paciente.vacunas && paciente.vacunas.length > 0 ? paciente.vacunas.join(', ') : 'Ninguna'}</span>
                </div>
                <div class="detail-item">
                    <label>Observaciones:</label>
                    <span>${paciente.observaciones || 'Ninguna'}</span>
                </div>
                <div class="detail-item">
                    <label>Fecha de Creación:</label>
                    <span>${new Date(paciente.creationDate).toLocaleString()}</span>
                </div>
            `;
        } else {
            patientDetailsContainer.innerHTML = '<p>Paciente no encontrado.</p>';
        }
    } else {
        patientDetailsContainer.innerHTML = '<p>ID de paciente no proporcionado.</p>';
    }
});