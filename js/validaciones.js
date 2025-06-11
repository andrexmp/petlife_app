// Validación de formulario de login
document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    
    if (loginForm) {
        loginForm.addEventListener('submit', function(event) {
            event.preventDefault();
            
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            
            // Validación básica de email
            if (!validateEmail(email)) {
                showError('Por favor, ingresa un email válido');
                return;
            }
            
            // Validación básica de contraseña
            if (password.length < 6 && !(email === 'admin' && password === 'admin')) {
                showError('La contraseña debe tener al menos 6 caracteres');
                return;
            }
            
            // Intentar iniciar sesión
            if (iniciarSesion(email, password)) {
                window.location.href = 'pages/dashboard.html';
            } else {
                showError('Credenciales inválidas');
            }
        });
    }
    
    if (registerForm) {
        registerForm.addEventListener('submit', function(event) {
            event.preventDefault();
            
            const nombre = document.getElementById('nombre').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            
            // Validaciones
            if (!nombre || nombre.length < 3) {
                showError('El nombre debe tener al menos 3 caracteres');
                return;
            }
            
            if (!validateEmail(email)) {
                showError('Por favor, ingresa un email válido');
                return;
            }
            
            if (password.length < 6) {
                showError('La contraseña debe tener al menos 6 caracteres');
                return;
            }
            
            try {
                registrarUsuario(nombre, email, password);
                window.location.href = 'login.html';
            } catch (error) {
                showError(error.message);
            }
        });
    }
    
    // Función para validar email con regex
    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email) || email === 'admin';
    }
    
    // Función para mostrar errores
    function showError(message) {
        let errorDiv = document.querySelector('.error-message');
        
        if (!errorDiv) {
            errorDiv = document.createElement('div');
            errorDiv.className = 'error-message';
            const form = document.querySelector('form');
            form.insertBefore(errorDiv, form.firstChild);
        }
        
        errorDiv.textContent = message;
        errorDiv.style.display = 'block';
        
        setTimeout(() => {
            errorDiv.style.display = 'none';
        }, 3000);
    }
});