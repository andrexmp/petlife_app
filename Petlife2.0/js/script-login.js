document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        
        if(!email || !password) {
            alert('Por favor completa todos los campos');
            return;
        }
        
        // Obtener usuarios (con validación de formato)
        let registeredUsers = [];
        try {
            registeredUsers = JSON.parse(localStorage.getItem('registeredUsers')) || [];
        } catch (e) {
            console.error("Error al leer usuarios:", e);
            localStorage.removeItem('registeredUsers');
        }
        
        // Buscar usuario
        const user = registeredUsers.find(u => u.email === email && u.password === password);
        
        if(user) {
            localStorage.setItem('currentUser', JSON.stringify(user));
            window.location.href = 'perfil-tutor.html';
        } else {
            alert('Credenciales incorrectas');
        }
    });
    
    // Manejar login con Google
    googleBtn.addEventListener('click', function() {
        alert('Iniciando sesión con Google...');
        // Implementar OAuth con Google
    });
    
    // Manejar login con Apple
    appleBtn.addEventListener('click', function() {
        alert('Iniciando sesión con Apple...');
        // Implementar OAuth con Apple
    });
});