document.addEventListener('DOMContentLoaded', function() {
    // Obtener ID de la mascota de la URL
    const urlParams = new URLSearchParams(window.location.search);
    const petId = urlParams.get('id');
    
    // Cargar datos del usuario
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) {
        alert('Usuario no encontrado. Por favor inicie sesión.');
        window.location.href = 'login.html';
        return;
    }

    // Buscar mascota
    const pet = currentUser.mascotas?.find(p => p.id === petId);
    if (!pet) {
        alert('Mascota no encontrada');
        window.location.href = 'mis-mascotas.html';
        return;
    }

    // Mostrar datos en la página
    displayPetData(pet);

    // Configurar menú desplegable y eventos
    setupPetMenu(currentUser, petId);
    
    // Configurar modal de edición
    setupEditModal(currentUser, petId);
});

// Función para mostrar los datos de la mascota
function displayPetData(pet) {
    const petPhoto = document.querySelector('.pet-photo');
    petPhoto.src = pet.foto || 'img/pet-default.jpg';
    petPhoto.alt = pet.nombre || 'Foto de mascota';
    petPhoto.onerror = function() {
        this.src = 'img/pet-default.jpg';
    };

    document.querySelector('.pet-name').textContent = pet.nombre || 'Sin nombre';
    document.querySelector('.pet-type').textContent = pet.tipo || '';
    document.querySelector('.pet-breed').textContent = pet.raza || 'Mestiza';
    document.querySelector('.pet-details').textContent = 
        `${pet.genero || 'Hembra'}, ${pet.edad || '0'} años`;
    
    // Mostrar detalles completos
    document.getElementById('petBreed').textContent = pet.raza || 'Mestiza';
    document.getElementById('petGender').textContent = pet.genero || 'Hembra';
    document.getElementById('petSterilized').textContent = pet.esterilizada ? 'Sí' : 'No';
    document.getElementById('petColor').textContent = pet.color || 'No especificado';
    document.getElementById('petColorDetails').textContent = pet.colorDetails || 'No especificado';
    document.getElementById('petDiseases').textContent = pet.enfermedades || 'Ninguna';
    document.getElementById('petAllergies').textContent = pet.alergias ? pet.alergias : 'No';
    document.getElementById('petWeight').textContent = pet.peso ? `${pet.peso} kg` : 'No registrado';
    document.getElementById('petMicrochip').textContent = pet.microchip || 'No registrado';
}

// Configurar el menú desplegable
function setupPetMenu(currentUser, petId) {
    const petMenuBtn = document.querySelector('.pet-menu-btn');
    const petMenuDropdown = document.querySelector('.pet-menu-dropdown');

    if (petMenuBtn && petMenuDropdown) {
        petMenuBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            petMenuDropdown.classList.toggle('show');
        });

        document.addEventListener('click', () => {
            petMenuDropdown.classList.remove('show');
        });
    }

    // Configurar acciones del menú
    document.getElementById('editPetBtn')?.addEventListener('click', () => {
        const pet = currentUser.mascotas.find(p => p.id === petId);
        if (pet) openEditModal(pet);
    });

    document.getElementById('viewDocumentsBtn')?.addEventListener('click', () => {
        if (confirm('¿Ver comprobantes médicos?')) {
            window.location.href = `comprobantes-mascota.html?id=${petId}`;
        }
    });

    document.getElementById('viewMedicalHistoryBtn')?.addEventListener('click', () => {
        window.location.href = `historial-medico.html?id=${petId}`;
    });

    document.getElementById('deletePetBtn')?.addEventListener('click', function() {
        if (confirm('¿Estás seguro de eliminar esta mascota? ¡Esta acción no se puede deshacer!')) {
            deletePet(currentUser, petId);
        }
    });

    document.querySelector('.view-all-btn')?.addEventListener('click', () => {
        window.location.href = `historial-medico.html?id=${petId}`;
    });
}

// Función para eliminar mascota
function deletePet(currentUser, petId) {
    currentUser.mascotas = currentUser.mascotas.filter(p => p.id !== petId);
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    updateRegisteredUsers(currentUser);
    alert('Mascota eliminada');
    window.location.href = 'mis-mascotas.html';
}

// Función para actualizar usuarios registrados
function updateRegisteredUsers(updatedUser) {
    const allUsers = JSON.parse(localStorage.getItem('registeredUsers')) || [];
    const updatedUsers = allUsers.map(user => 
        user.email === updatedUser.email ? updatedUser : user
    );
    localStorage.setItem('registeredUsers', JSON.stringify(updatedUsers));
}

// Configurar modal de edición
function setupEditModal(currentUser, petId) {
    const modal = document.getElementById('editPetModal');
    if (!modal) return;

    const closeBtn = document.querySelector('.close-edit-modal');
    const form = document.getElementById('editPetForm');
    
    // Cerrar modal
    closeBtn?.addEventListener('click', () => {
        modal.style.display = 'none';
    });
    
    // Cerrar al hacer clic fuera
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });
    
    // Manejar envío del formulario
    form?.addEventListener('submit', function(e) {
        e.preventDefault();
        savePetChanges(currentUser, petId);
    });
}

// Abrir modal de edición
function openEditModal(pet) {
    const modal = document.getElementById('editPetModal');
    const form = document.getElementById('editPetForm');
    
    if (!modal || !form) return;
    
    // Llenar el formulario con los datos actuales
    document.getElementById('editPetId').value = pet.id;
    document.getElementById('editPetName').value = pet.nombre;
    document.getElementById('editPetType').value = pet.tipo;
    document.getElementById('editPetBreed').value = pet.raza;
    document.getElementById('editPetAge').value = pet.edad;
    document.getElementById('editPetGender').value = pet.genero;
    document.getElementById('editPetSterilized').value = pet.esterilizada ? 'true' : 'false';
    document.getElementById('editPetColor').value = pet.color || '';
    document.getElementById('editPetColorDetails').value = pet.colorDetails || '';
    document.getElementById('editPetDiseases').value = pet.enfermedades || '';
    
    // Manejar alergias
    const hasAllergies = typeof pet.alergias === 'string' && pet.alergias !== 'No';
    document.getElementById('editPetAllergies').value = hasAllergies ? 'true' : 'false';
    const allergyContainer = document.getElementById('editAllergyDetailsContainer');
    if (hasAllergies && allergyContainer) {
        document.getElementById('editAllergyDetails').value = pet.alergias;
        allergyContainer.style.display = 'block';
    }
    
    document.getElementById('editPetWeight').value = pet.peso || '';
    document.getElementById('editPetMicrochip').value = pet.microchip || '';
    
    // Mostrar foto actual si existe
    const photoPreview = document.getElementById('editPhotoPreview');
    if (pet.foto && pet.foto !== 'img/pet-default.jpg' && photoPreview) {
        photoPreview.innerHTML = `<img src="${pet.foto}" alt="Foto actual">`;
    }
    
    // Mostrar modal
    modal.style.display = 'block';
    
    // Configurar evento para alergias
    const allergiesSelect = document.getElementById('editPetAllergies');
    if (allergiesSelect && allergyContainer) {
        allergiesSelect.addEventListener('change', function() {
            allergyContainer.style.display = this.value === 'true' ? 'block' : 'none';
        });
    }
    
    // Configurar subida de foto
    const photoInput = document.getElementById('editPetPhoto');
    if (photoInput && photoPreview) {
        photoInput.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(event) {
                    photoPreview.innerHTML = `<img src="${event.target.result}" alt="Nueva foto">`;
                };
                reader.readAsDataURL(file);
            }
        });
    }
}

// Guardar cambios de la mascota
function savePetChanges(currentUser, petId) {
    const petIndex = currentUser.mascotas.findIndex(p => p.id === petId);
    if (petIndex === -1) return;
    
    // Obtener valores del formulario
    const updatedPet = {
        id: petId,
        nombre: document.getElementById('editPetName').value,
        tipo: document.getElementById('editPetType').value,
        raza: document.getElementById('editPetBreed').value,
        edad: document.getElementById('editPetAge').value,
        genero: document.getElementById('editPetGender').value,
        esterilizada: document.getElementById('editPetSterilized').value === 'true',
        color: document.getElementById('editPetColor').value,
        colorDetails: document.getElementById('editPetColorDetails').value,
        enfermedades: document.getElementById('editPetDiseases').value,
        alergias: document.getElementById('editPetAllergies').value === 'true' 
            ? document.getElementById('editAllergyDetails')?.value || 'Sí' 
            : 'No',
        peso: document.getElementById('editPetWeight').value,
        microchip: document.getElementById('editPetMicrochip').value,
        foto: document.getElementById('editPhotoPreview')?.querySelector('img')?.src || currentUser.mascotas[petIndex].foto,
        historial: currentUser.mascotas[petIndex].historial || []
    };
    
    // Validaciones básicas
    if (!updatedPet.nombre || !updatedPet.tipo || !updatedPet.raza || !updatedPet.edad || !updatedPet.genero) {
        alert('Por favor complete los campos obligatorios');
        return;
    }
    
    // Actualizar mascota
    currentUser.mascotas[petIndex] = updatedPet;
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    updateRegisteredUsers(currentUser);
    
    // Cerrar modal y recargar datos
    document.getElementById('editPetModal').style.display = 'none';
    window.location.reload();
}