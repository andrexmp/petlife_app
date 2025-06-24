document.addEventListener('DOMContentLoaded', function() {
    const registroForm = document.getElementById('registroForm');
    
    registroForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Validar contraseñas
        const password = document.getElementById('password').value;
        const confirmar = document.getElementById('confirmar').value;
        
        if(password !== confirmar) {
            alert('Las contraseñas no coinciden');
            return;
        }
        
        // Crear objeto usuario (formato correcto)
        const newUser = {
            name: document.getElementById('nombre').value,
            email: document.getElementById('email').value,
            password: password,
            profilePic: 'img/user-default.jpg',
            mascotas: []
        };
        
        // Obtener usuarios existentes
        let registeredUsers = JSON.parse(localStorage.getItem('registeredUsers')) || [];
        
        // Verificar si el usuario ya existe
        if(registeredUsers.some(u => u.email === newUser.email)) {
            alert('Este correo ya está registrado');
            return;
        }
        
        // Agregar nuevo usuario
        registeredUsers.push(newUser);
        
        // Guardar en localStorage (con formato válido)
        localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers));
        localStorage.setItem('currentUser', JSON.stringify(newUser));
        
        // Redirigir al perfil
        window.location.href = 'login.html';
    });
});