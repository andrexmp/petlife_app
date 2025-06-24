document.addEventListener('DOMContentLoaded', function() {
    // Cargar usuario actual
    const petLifeUser = JSON.parse(localStorage.getItem('petLifeUser'));
    
    if (!petLifeUser || localStorage.getItem('petLifeModule') !== 'tutor') {
        window.location.href = 'login-tutor.html';
        return;
    }

    // Inicializar elementos del DOM
    const petModal = document.getElementById('petModal');
    const addPetBtn = document.getElementById('addPet');
    const closeModal = document.querySelector('.close-modal');
    const petForm = document.getElementById('petForm');
    const photoPreview = document.getElementById('photoPreview');
    const petPhotoInput = document.getElementById('petPhoto');

    // Menú de usuario
    const userMenuBtn = document.querySelector('.user-menu-btn');
    const userMenuDropdown = document.querySelector('.user-menu-dropdown');

    if (userMenuBtn && userMenuDropdown) {
        userMenuBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            userMenuDropdown.classList.toggle('show');
        });

        document.addEventListener('click', () => {
            userMenuDropdown.classList.remove('show');
        });

        document.getElementById('editProfileBtn')?.addEventListener('click', () => {
            window.location.href = 'editar-perfil.html';
        });

        document.getElementById('logoutBtn')?.addEventListener('click', () => {
            if (confirm('¿Estás seguro que deseas cerrar sesión?')) {
                cerrarSesion();
            }
        });
    }

    // Mostrar datos del usuario
    document.getElementById('welcomeMessage').textContent = `Hola, ${petLifeUser.name.split(' ')[0]}`;
    document.getElementById('profilePicture').src = petLifeUser.profilePic || 'img/user-default.jpg';

    // Cargar datos
    loadPets(petLifeUser.mascotas || []);
    loadFavoriteVets(petLifeUser.favoriteVets || getDefaultVets());

    // Configurar modal de mascotas
    if (addPetBtn && petModal) {
        addPetBtn.addEventListener('click', () => {
            petModal.style.display = 'block';
        });
    }

    if (closeModal) {
        closeModal.addEventListener('click', () => {
            petModal.style.display = 'none';
        });
    }

    // Abrir modal si hay hash #add-pet
    if (window.location.hash === '#add-pet') {
        const petModal = document.getElementById('petModal');
        if (petModal) petModal.style.display = 'block';
    }

    // Cerrar modal al hacer clic fuera
    window.addEventListener('click', (e) => {
        if (e.target === petModal) {
            petModal.style.display = 'none';
        }
    });

    // Subida de foto
    if (petPhotoInput && photoPreview) {
        petPhotoInput.addEventListener('change', handlePhotoUpload);
    }

    // Formulario de mascota
    if (petForm) {
        petForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handlePetSubmit(petLifeUser);
        });
    }

    // Botones de navegación
    document.getElementById('view-all-pets')?.addEventListener('click', () => {
        window.location.href = 'mis-mascotas.html';
    });

    document.getElementById('view-all-vets')?.addEventListener('click', () => {
        window.location.href = 'veterinarios-favoritos.html';
    });
});

// Funciones auxiliares
function getDefaultVets() {
    return [
        {
            name: "Dra. Adriana Contreras",
            rating: "5.0",
            reviews: "120 Reseñas",
            photo: "img/vet1.jpg"
        },
        {
            name: "Dr. Andres Martínez",
            rating: "4.9",
            reviews: "150 Reseñas",
            photo: "img/vet2.jpg"
        }
    ];
}

function handlePhotoUpload(e) {
    const file = e.target.files[0];
    const photoPreview = document.getElementById('photoPreview');
    
    if (file && photoPreview) {
        const reader = new FileReader();
        reader.onload = function(event) {
            photoPreview.innerHTML = `<img src="${event.target.result}" alt="Preview">`;
        };
        reader.readAsDataURL(file);
    }
}

function handlePetSubmit(petLifeUser) {
    const petId = document.getElementById('petId').value;
    const petName = document.getElementById('petName').value;
    const petType = document.getElementById('petType').value;
    const petBreed = document.getElementById('petBreed').value;
    const petAge = document.getElementById('petAge').value;
    const petGender = document.getElementById('petGender').value;
    const petSterilized = document.getElementById('petSterilized').value === 'true';
    const petColor = document.getElementById('petColor').value;
    const petColorDetails = document.getElementById('petColorDetails').value;
    const petDiseases = document.getElementById('petDiseases').value;
    const petAllergies = document.getElementById('petAllergies').value === 'true' 
        ? document.getElementById('allergyDetails').value || 'Sí' 
        : 'No';
    const petWeight = document.getElementById('petWeight').value;
    const petMicrochip = document.getElementById('petMicrochip').value;
    const photoPreview = document.getElementById('photoPreview');

    // Validaciones
    if (!petName || !petType || !petBreed || !petAge || !petGender) {
        alert('Por favor, complete todos los campos obligatorios');
        return;
    }

    if (petWeight && isNaN(petWeight)) {
        alert('El peso debe ser un número válido');
        return;
    }

    const newPet = {
        id: petId || Date.now().toString(),
        nombre: petName,
        tipo: petType,
        raza: petBreed,
        edad: petAge,
        genero: petGender,
        esterilizada: petSterilized,
        color: petColor,
        colorDetails: petColorDetails,
        enfermedades: petDiseases,
        alergias: petAllergies,
        peso: petWeight,
        microchip: petMicrochip,
        foto: photoPreview?.querySelector('img')?.src || 'img/pet-default.jpg',
        historial: []
    };

    // Actualizar usuario
    if (petId) {
        // Edición
        const index = petLifeUser.mascotas.findIndex(p => p.id === petId);
        petLifeUser.mascotas[index] = newPet;
    } else {
        // Nuevo
        petLifeUser.mascotas = [...(petLifeUser.mascotas || []), newPet];
    }
    
    localStorage.setItem('petLifeUser', JSON.stringify(petLifeUser));

    // Reset y cerrar modal
    document.getElementById('petForm').reset();
    if (photoPreview) photoPreview.innerHTML = '';
    document.getElementById('petModal').style.display = 'none';
    loadPets(petLifeUser.mascotas);
}

function loadPets(pets) {
    const petsPreview = document.getElementById('petsPreview');
    if (!petsPreview) return;

    if (!pets || pets.length === 0) {
        petsPreview.innerHTML = '<p class="no-items">No tienes mascotas registradas</p>';
        return;
    }

    petsPreview.innerHTML = pets.slice(0, 3).map(pet => `
        <div class="pet-card">
            <img src="${pet.foto || 'img/pet-default.jpg'}" alt="${pet.nombre}">
            <div class="pet-info">
                <h4>${pet.nombre}</h4>
                <p>${pet.tipo} • ${pet.edad} años</p>
            </div>
        </div>
    `).join('');
}

function loadFavoriteVets(vets) {
    const vetsPreview = document.getElementById('vetsPreview');
    if (!vetsPreview) return;

    if (!vets || vets.length === 0) {
        vetsPreview.innerHTML = '<p class="no-items">No tienes veterinarios favoritos</p>';
        return;
    }

    vetsPreview.innerHTML = vets.slice(0, 3).map(vet => `
        <div class="vet-card">
            <img src="${vet.photo}" alt="${vet.name}">
            <div class="vet-info">
                <h4>${vet.name}</h4>
                <p>${vet.rating} ⭐ • ${vet.reviews}</p>
            </div>
        </div>
    `).join('');
}

function cerrarSesion() {
    localStorage.removeItem('petLifeUser');
    localStorage.removeItem('petLifeModule');
    window.location.href = 'login-tutor.html';
}