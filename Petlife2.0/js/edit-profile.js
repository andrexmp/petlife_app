document.addEventListener('DOMContentLoaded', () => {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const form = document.getElementById('editProfileForm');

    if (!currentUser) {
        window.location.href = 'login.html';
        return;
    }

    // Cargar datos actuales
    document.getElementById('editName').value = currentUser.name || '';
    document.getElementById('editEmail').value = currentUser.email || '';
    document.getElementById('editPhone').value = currentUser.phone || '';
    

    // Manejar envío
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Actualizar datos
        currentUser.name = document.getElementById('editName').value;
        currentUser.email = document.getElementById('editEmail').value;
        currentUser.phone = document.getElementById('editPhone').value;

        // Guardar cambios
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        
        // Actualizar en lista de usuarios
        const allUsers = JSON.parse(localStorage.getItem('registeredUsers')) || [];
        const updatedUsers = allUsers.map(user => 
            user.email === currentUser.email ? currentUser : user
        );
        localStorage.setItem('registeredUsers', JSON.stringify(updatedUsers));
        
        alert('Perfil actualizado correctamente');
        window.location.href = 'perfil-tutor.html';
    });
});