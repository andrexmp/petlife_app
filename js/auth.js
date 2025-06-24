// Función para registrar usuario
function registrarUsuario(nombre, email, password) {
    const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
    
    // Verificar si el usuario ya existe
    if (usuarios.find(u => u.email === email)) {
        throw new Error('El usuario ya existe');
    }
    
    // Agregar nuevo usuario
    usuarios.push({
        nombre,
        email,
        password // En una aplicación real, la contraseña debe estar hasheada
    });
    
    localStorage.setItem('usuarios', JSON.stringify(usuarios));
}

// Función para iniciar sesión
function iniciarSesion(email, password) {
    const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
    
    // Verificar credenciales de admin
    if (email === 'admin' && password === 'admin') {
        const adminUser = {
            nombre: 'Administrador',
            email: 'admin',
            isAdmin: true
        };
        localStorage.setItem('usuarioActual', JSON.stringify(adminUser));
        return true;
    }
    
    // Buscar usuario registrado
    const usuario = usuarios.find(u => u.email === email && u.password === password);
    if (usuario) {
        localStorage.setItem('usuarioActual', JSON.stringify(usuario));
        return true;
    }
    
    return false;
}

// Función para verificar si hay sesión activa
function verificarSesion() {
    const petLifeUser = localStorage.getItem('petLifeUser');
    const petLifeModule = localStorage.getItem('petLifeModule');
    
    if (!petLifeUser) {
        // Detectar el módulo actual basado en la URL
        const currentPath = window.location.pathname;
        if (currentPath.includes('Petlife2.0') || currentPath.includes('pages')) {
            // Si estamos en el módulo veterinario, redirigir al login veterinario
            window.location.href = '../login-veterinario.html';
        } else {
            // Si estamos en el módulo tutor, redirigir al login tutor
            window.location.href = 'Petlife2.0/login-tutor.html';
        }
        return;
    }
    
    // Si hay sesión, verificar que el módulo coincida
    const userData = JSON.parse(petLifeUser);
    if (userData.role === 'veterinario' && petLifeModule !== 'veterinario') {
        localStorage.removeItem('petLifeUser');
        localStorage.removeItem('petLifeModule');
        window.location.href = '../login-veterinario.html';
    } else if (userData.role === 'tutor' && petLifeModule !== 'tutor') {
        localStorage.removeItem('petLifeUser');
        localStorage.removeItem('petLifeModule');
        window.location.href = 'Petlife2.0/login-tutor.html';
    }
}

// Función para cerrar sesión
function cerrarSesion() {
    localStorage.removeItem('petLifeUser');
    localStorage.removeItem('petLifeModule');
    
    // Detectar el módulo actual basado en la URL
    const currentPath = window.location.pathname;
    if (currentPath.includes('Petlife2.0')) {
        // Si estamos en el módulo tutor, redirigir al login tutor
        window.location.href = 'Petlife2.0/login-tutor.html';
    } else {
        // Si estamos en el módulo veterinario, redirigir al login veterinario
        // Usar ruta relativa desde cualquier página del módulo veterinario
        if (currentPath.includes('pages/')) {
            window.location.href = '../login-veterinario.html';
        } else {
            window.location.href = 'login-veterinario.html';
        }
    }
}