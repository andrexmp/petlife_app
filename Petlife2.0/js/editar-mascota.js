document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const petId = urlParams.get('id');
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const pet = currentUser.mascotas.find(p => p.id === petId);

    if (!pet) {
        alert('Mascota no encontrada');
        window.location.href = 'mis-mascotas.html';
        return;
    }

    // Cargar datos en el formulario
    document.getElementById('editPetName').value = pet.nombre;
    document.getElementById('editPetType').value = pet.tipo;
    document.getElementById('editPetBreed').value = pet.raza || '';
    document.getElementById('editPetAge').value = pet.edad || '';
    document.getElementById('editPetGender').value = pet.genero || 'Hembra';
    document.getElementById('editPetSterilized').value = pet.esterilizada ? 'true' : 'false';
    document.getElementById('editPetColor').value = pet.color || '';
    document.getElementById('editPetColorDetails').value = pet.colorDetails || '';
    document.getElementById('editPetDiseases').value = pet.enfermedades || '';
    document.getElementById('editPetAllergies').value = pet.alergias ? 'true' : 'false';
    document.getElementById('editAllergyDetails').value = pet.alergiasDetalle || '';
    document.getElementById('editPetWeight').value = pet.peso || '';
    document.getElementById('editPetMicrochip').value = pet.microchip || '';

    // Mostrar/ocultar detalles de alergias según selección
    document.getElementById('editPetAllergies').addEventListener('change', function() {
        document.getElementById('allergyDetailsContainer').style.display = 
            this.value === 'true' ? 'block' : 'none';
    });

    // Inicializar visibilidad de alergias
    document.getElementById('allergyDetailsContainer').style.display = 
        pet.alergias ? 'block' : 'none';

    // Guardar cambios
    document.getElementById('editPetForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        // ------ VALIDACIONES ------
        // 1. Nombre obligatorio
        const nombre = document.getElementById('editPetName').value.trim();
        if (!nombre) {
            alert('El nombre de la mascota es obligatorio');
            return;
        }

        // 2. Tipo válido
        const tipo = document.getElementById('editPetType').value;
        if (tipo !== 'Perro' && tipo !== 'Gato') {
            alert('Seleccione un tipo válido (Perro o Gato)');
            return;
        }

        // 3. Raza obligatoria
        const raza = document.getElementById('editPetBreed').value.trim();
        if (!raza) {
            alert('La raza es obligatoria');
            return;
        }

        // 4. Edad válida (0-30 años)
        const edad = parseInt(document.getElementById('editPetAge').value);
        if (isNaN(edad) || edad < 0 || edad > 30) {
            alert('La edad debe ser entre 0 y 30 años');
            return;
        }

        // 5. Peso válido (>0 kg)
        const peso = parseFloat(document.getElementById('editPetWeight').value);
        if (peso && (isNaN(peso) || peso <= 0)) {
            alert('El peso debe ser un número mayor a 0 (ej: 5.2)');
            return;
        }

        // 6. Validar alergias (si está marcado "Sí", debe tener detalles)
        const tieneAlergias = document.getElementById('editPetAllergies').value === 'true';
        const detalleAlergias = document.getElementById('editAllergyDetails').value.trim();
        if (tieneAlergias && !detalleAlergias) {
            alert('Si la mascota tiene alergias, debe especificar a qué');
            return;
        }

        // ------ SI PASÓ LAS VALIDACIONES, ACTUALIZAR DATOS ------
        pet.nombre = nombre;
        pet.tipo = tipo;
        pet.raza = raza;
        pet.edad = edad;
        pet.genero = document.getElementById('editPetGender').value;
        pet.esterilizada = document.getElementById('editPetSterilized').value === 'true';
        pet.color = document.getElementById('editPetColor').value;
        pet.colorDetails = document.getElementById('editPetColorDetails').value;
        pet.enfermedades = document.getElementById('editPetDiseases').value;
        pet.alergias = tieneAlergias;
        pet.alergiasDetalle = tieneAlergias ? detalleAlergias : '';
        pet.peso = peso || null;
        pet.microchip = document.getElementById('editPetMicrochip').value.trim();

        // Guardar en localStorage
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        updateRegisteredUsers(currentUser);
        alert('Cambios guardados correctamente');
        window.location.href = `perfil-mascota.html?id=${petId}`;
    });

    // Eliminar mascota
    document.getElementById('deletePetBtn').addEventListener('click', function() {
        if (confirm('¿Estás seguro de eliminar esta mascota? Esta acción no se puede deshacer.')) {
            currentUser.mascotas = currentUser.mascotas.filter(p => p.id !== petId);
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
            updateRegisteredUsers(currentUser);
            alert('Mascota eliminada');
            window.location.href = 'mis-mascotas.html';
        }
    });

    // Actualizar todos los usuarios (para persistencia)
    function updateRegisteredUsers(updatedUser) {
        const allUsers = JSON.parse(localStorage.getItem('registeredUsers')) || [];
        const updatedUsers = allUsers.map(user => 
            user.email === updatedUser.email ? updatedUser : user
        );
        localStorage.setItem('registeredUsers', JSON.stringify(updatedUsers));
    }
});