document.addEventListener('DOMContentLoaded', () => {
    const userNameInput = document.getElementById('userName');
    const currentPasswordInput = document.getElementById('currentPassword');
    const newPasswordInput = document.getElementById('newPassword');
    const confirmPasswordInput = document.getElementById('confirmPassword');
    const phoneInput = document.getElementById('phone');
    const addressInput = document.getElementById('address');
    const countrySelect = document.getElementById('country');
    const regionSelect = document.getElementById('region');
    const citySelect = document.getElementById('city');
    const additionalInfoTextarea = document.getElementById('additionalInfo');
    const profilePic = document.getElementById('profilePic');
    const uploadPicInput = document.getElementById('uploadPic');
    const profileForm = document.getElementById('profileForm');

    // Datos de ejemplo para regiones y ciudades de Chile
    const chileData = {
        "Tarapacá": ["Iquique", "Alto Hospicio"],
        "Antofagasta": ["Antofagasta", "Calama"],
        "Atacama": ["Copiapó", "Vallenar"],
        "Coquimbo": ["La Serena", "Coquimbo"],
        "Valparaíso": ["Valparaíso", "Viña del Mar"],
        "Metropolitana de Santiago": ["Santiago", "Puente Alto", "Maipú"],
        "O'Higgins": ["Rancagua", "San Fernando"],
        "Maule": ["Talca", "Curicó"],
        "Biobío": ["Concepción", "Talcahuano"],
        "La Araucanía": ["Temuco", "Padre Las Casas"],
        "Los Ríos": ["Valdivia", "La Unión"],
        "Los Lagos": ["Puerto Montt", "Osorno"],
        "Aysén": ["Coyhaique", "Puerto Aysén"],
        "Magallanes": ["Punta Arenas", "Puerto Natales"],
        "Ñuble": ["Chillán", "San Carlos"],
        "Arica y Parinacota": ["Arica", "Putre"]
    };

    function loadProfileData() {
        const currentUser = JSON.parse(localStorage.getItem('usuarioActual'));
        if (currentUser) {
            userNameInput.value = currentUser.nombre || '';
            phoneInput.value = currentUser.telefono || '';
            addressInput.value = currentUser.direccion || '';
            countrySelect.value = currentUser.pais || 'Chile';
            additionalInfoTextarea.value = currentUser.infoAdicional || '';
            if (currentUser.profilePic) {
                profilePic.src = currentUser.profilePic;
            }

            // Cargar regiones y ciudades
            loadRegions(currentUser.region);
            if (currentUser.region) {
                loadCities(currentUser.region, currentUser.ciudad);
            }
        }
    }

    function loadRegions(selectedRegion = '') {
        regionSelect.innerHTML = '<option value="">Seleccione una Región</option>';
        for (const region in chileData) {
            const option = document.createElement('option');
            option.value = region;
            option.textContent = region;
            if (region === selectedRegion) {
                option.selected = true;
            }
            regionSelect.appendChild(option);
        }
    }

    function loadCities(region, selectedCity = '') {
        citySelect.innerHTML = '<option value="">Seleccione una Ciudad</option>';
        if (region && chileData[region]) {
            chileData[region].forEach(city => {
                const option = document.createElement('option');
                option.value = city;
                option.textContent = city;
                if (city === selectedCity) {
                    option.selected = true;
                }
                citySelect.appendChild(option);
            });
        }
    }

    regionSelect.addEventListener('change', (event) => {
        loadCities(event.target.value);
    });

    uploadPicInput.addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                profilePic.src = e.target.result;
            };
            reader.readAsDataURL(file);
        }
    });

    profileForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const currentUser = JSON.parse(localStorage.getItem('usuarioActual'));
        if (!currentUser) {
            if (window.showNotification) {
                window.showNotification('No hay usuario logueado.', 'error', 4000);
            } else {
                alert('No hay usuario logueado.');
            }
            return;
        }

        // Validar cambio de contraseña
        if (currentPasswordInput.value || newPasswordInput.value || confirmPasswordInput.value) {
            if (currentPasswordInput.value !== currentUser.password) {
                if (window.showNotification) {
                    window.showNotification('La contraseña actual es incorrecta.', 'error', 4000);
                } else {
                    alert('La contraseña actual es incorrecta.');
                }
                return;
            }
            if (newPasswordInput.value !== confirmPasswordInput.value) {
                if (window.showNotification) {
                    window.showNotification('La nueva contraseña y la confirmación no coinciden.', 'error', 4000);
                } else {
                    alert('La nueva contraseña y la confirmación no coinciden.');
                }
                return;
            }
            if (newPasswordInput.value.length < 6) {
                if (window.showNotification) {
                    window.showNotification('La nueva contraseña debe tener al menos 6 caracteres.', 'error', 4000);
                } else {
                    alert('La nueva contraseña debe tener al menos 6 caracteres.');
                }
                return;
            }
            currentUser.password = newPasswordInput.value;
        }

        currentUser.telefono = phoneInput.value;
        currentUser.direccion = addressInput.value;
        currentUser.pais = countrySelect.value;
        currentUser.region = regionSelect.value;
        currentUser.ciudad = citySelect.value;
        currentUser.infoAdicional = additionalInfoTextarea.value;
        currentUser.profilePic = profilePic.src;

        localStorage.setItem('usuarioActual', JSON.stringify(currentUser));

        // Actualizar la lista de usuarios registrados (si aplica)
        let users = JSON.parse(localStorage.getItem('users')) || [];
        const userIndex = users.findIndex(user => user.email === currentUser.email);
        if (userIndex !== -1) {
            users[userIndex] = currentUser;
            localStorage.setItem('users', JSON.stringify(users));
        }

        // Mostrar notificación de éxito
        if (window.showNotification) {
            window.showNotification('Perfil actualizado exitosamente!', 'success', 3000);
        } else {
            alert('Perfil actualizado exitosamente!');
        }
        
        // Limpiar campos de contraseña después de guardar
        currentPasswordInput.value = '';
        newPasswordInput.value = '';
        confirmPasswordInput.value = '';
    });

    loadProfileData();
});