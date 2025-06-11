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
    const usuarioActual = localStorage.getItem('usuarioActual');
    if (!usuarioActual) {
        window.location.href = '/login.html';
    }
}

// Función para cerrar sesión
function cerrarSesion() {
    localStorage.removeItem('usuarioActual');
    window.location.href = '/login.html';
}