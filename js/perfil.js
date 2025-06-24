document.addEventListener('DOMContentLoaded', () => {
    // Inputs del formulario
    const userNameInput = document.getElementById('userName');
    const emailInput = document.getElementById('email');
    const currentPasswordInput = document.getElementById('currentPassword');
    const newPasswordInput = document.getElementById('newPassword');
    const confirmPasswordInput = document.getElementById('confirmPassword');
    const phoneInput = document.getElementById('phone');
    const addressInput = document.getElementById('address');
    const specialtyInput = document.getElementById('specialty');
    const bioInput = document.getElementById('bio');
    const profilePic = document.getElementById('profilePic');
    const uploadPicInput = document.getElementById('uploadPic');
    const profileForm = document.getElementById('profileForm');

    // Cargar datos del usuario actual
    function loadProfileData() {
        const currentUser = JSON.parse(localStorage.getItem('petLifeUser'));
        if (currentUser) {
            userNameInput.value = currentUser.usuario || '';
            emailInput.value = currentUser.email || '';
            phoneInput.value = currentUser.phone || '';
            addressInput.value = currentUser.address || '';
            specialtyInput.value = currentUser.specialty || '';
            bioInput.value = currentUser.bio || '';
            if (currentUser.profilePic) {
                profilePic.src = currentUser.profilePic;
            }
        }
    }

    // Guardar cambios en el usuario actual y en el array de usuarios
    function saveProfileData(updatedUser) {
        // Actualizar usuario actual
        localStorage.setItem('petLifeUser', JSON.stringify(updatedUser));
        // Actualizar en el array de usuarios
        let usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
        const idx = usuarios.findIndex(u => u.usuario === updatedUser.usuario);
        if (idx !== -1) {
            usuarios[idx] = updatedUser;
            localStorage.setItem('usuarios', JSON.stringify(usuarios));
        }
    }

    // Validar email
    function isValidEmail(email) {
        return /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email);
    }

    // Previsualización de imagen
    uploadPicInput.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(ev) {
                profilePic.src = ev.target.result;
            };
            reader.readAsDataURL(file);
        }
    });

    profileForm.addEventListener('submit', function(event) {
        event.preventDefault();
        let currentUser = JSON.parse(localStorage.getItem('petLifeUser'));
        if (!currentUser) {
            showNotification('No hay usuario logueado.', 'error');
            return;
        }
        // Validaciones básicas
        if (!isValidEmail(emailInput.value)) {
            showNotification('Correo electrónico no válido.', 'error');
            return;
        }
        if (phoneInput.value && !/^\+?\d{7,15}$/.test(phoneInput.value.replace(/\s/g, ''))) {
            showNotification('Teléfono no válido.', 'error');
            return;
        }
        // Validar cambio de contraseña si se intenta
        if (currentPasswordInput.value || newPasswordInput.value || confirmPasswordInput.value) {
            if (currentUser.password !== currentPasswordInput.value) {
                showNotification('La contraseña actual es incorrecta.', 'error');
                return;
            }
            if (newPasswordInput.value !== confirmPasswordInput.value) {
                showNotification('La nueva contraseña y la confirmación no coinciden.', 'error');
                return;
            }
            if (newPasswordInput.value.length < 6) {
                showNotification('La nueva contraseña debe tener al menos 6 caracteres.', 'error');
                return;
            }
            currentUser.password = newPasswordInput.value;
        }
        // Actualizar datos
        currentUser.email = emailInput.value;
        currentUser.phone = phoneInput.value;
        currentUser.address = addressInput.value;
        currentUser.specialty = specialtyInput.value;
        currentUser.bio = bioInput.value;
        currentUser.profilePic = profilePic.src;
        saveProfileData(currentUser);
        showNotification('¡Perfil actualizado exitosamente!', 'success');
        // Limpiar campos de contraseña
        currentPasswordInput.value = '';
        newPasswordInput.value = '';
        confirmPasswordInput.value = '';
    });

    // Notificación amigable
    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        `;
        document.body.appendChild(notification);
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }

    loadProfileData();
});