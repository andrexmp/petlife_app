document.addEventListener('DOMContentLoaded', function() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const petsList = document.getElementById('pets-list');
    const addPetBtn = document.getElementById('addPet');
    
    let razasData = {};

    // Cargar datos de razas y mascotas
    fetch('/data/razas.json')
        .then(response => response.json())
        .then(data => {
            razasData = data;
            renderPets(currentUser?.mascotas || []);
        })
        .catch(error => {
            console.error('Error cargando razas:', error);
            razasData = {
                perros: ["Labrador", "Pastor Alemán", "Chihuahua", "Mestizo"],
                gatos: ["Siamés", "Persa", "Mestizo"]
            };
            renderPets(currentUser?.mascotas || []);
        });

    // Función única para renderizar mascotas
    function renderPets(pets) {
        petsList.innerHTML = '';
        
        if (!pets || pets.length === 0) {
            petsList.innerHTML = '<p class="no-pets">No tienes mascotas registradas</p>';
            return;
        }

        pets.forEach(pet => {
            const petCard = document.createElement('div');
            petCard.className = 'pet-card';
            petCard.innerHTML = `
                <div class="pet-info">
                    <div class="pet-type">${pet.tipo || 'PERRO'}</div>
                    <h3>${pet.nombre}</h3>
                    <p>${pet.raza || 'Mestiza'}, ${pet.edad || '0'} años</p>
                </div>
                <img src="${pet.foto || 'img/pet-default.jpg'}" alt="${pet.nombre}">
            `;
            
            petCard.addEventListener('click', () => {
                window.location.href = `perfil-mascota.html?id=${pet.id}`;
            });
            
            petsList.appendChild(petCard);
        });
    }


    // Configurar el selector de razas
    document.getElementById('petType')?.addEventListener('change', function() {
        const type = this.value;
        const breedInput = document.getElementById('petBreed');
        const datalist = document.getElementById('breedsList');
        
        datalist.innerHTML = '';
        
        if (type === 'Perro' && razasData.perros) {
            razasData.perros.forEach(breed => {
                const option = document.createElement('option');
                option.value = breed;
                datalist.appendChild(option);
            });
            breedInput.placeholder = 'Seleccione o escriba';
        }
        else if (type === 'Gato' && razasData.gatos) {
            razasData.gatos.forEach(breed => {
                const option = document.createElement('option');
                option.value = breed;
                datalist.appendChild(option);
            });
            breedInput.placeholder = 'Seleccione o escriba';
        }
        else {
            breedInput.placeholder = 'Escriba la raza';
        }
    });

    // Botón "Añadir Mascota" (redirige al perfil del tutor con hash)
    addPetBtn.addEventListener('click', () => {
        window.location.href = 'perfil-tutor.html#add-pet';
    });

});
