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
                showNotificationMessage('Por favor, ingresa un email válido', 'error');
                return;
            }
            
            // Validación básica de contraseña
            if (password.length < 6 && !(email === 'admin' && password === 'admin')) {
                showNotificationMessage('La contraseña debe tener al menos 6 caracteres', 'error');
                return;
            }
            
            // Intentar iniciar sesión
            if (iniciarSesion(email, password)) {
                if (window.showNotification) {
                    window.showNotification('¡Inicio de sesión exitoso!', 'success', 2000);
                }
                setTimeout(() => {
                    window.location.href = 'pages/dashboard.html';
                }, 2000);
            } else {
                showNotificationMessage('Credenciales inválidas', 'error');
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
                showNotificationMessage('El nombre debe tener al menos 3 caracteres', 'error');
                return;
            }
            
            if (!validateEmail(email)) {
                showNotificationMessage('Por favor, ingresa un email válido', 'error');
                return;
            }
            
            if (password.length < 6) {
                showNotificationMessage('La contraseña debe tener al menos 6 caracteres', 'error');
                return;
            }
            
            try {
                registrarUsuario(nombre, email, password);
                if (window.showNotification) {
                    window.showNotification('¡Usuario registrado exitosamente!', 'success', 3000);
                }
                setTimeout(() => {
                    window.location.href = 'login.html';
                }, 3000);
            } catch (error) {
                showNotificationMessage(error.message, 'error');
            }
        });
    }
    
    // Función para validar email con regex
    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email) || email === 'admin';
    }
    
    // Función para mostrar notificaciones (compatible con ambos sistemas)
    function showNotificationMessage(message, type) {
        if (window.showNotification) {
            window.showNotification(message, type, 4000);
        } else {
            // Fallback al sistema anterior
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
    }
});