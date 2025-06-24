// Script principal para PetLife 2.0 - Módulo Tutor
// Gestiona la funcionalidad general y la navegación

class PetLifeApp {
    constructor() {
        this.currentUser = null;
        this.isLoggedIn = false;
        this.currentModule = 'tutor';
        this.init();
    }

    init() {
        this.loadUserData();
        this.setupEventListeners();
        this.initializeNavigation();
        this.showWelcomeMessage();
    }

    loadUserData() {
        // Cargar datos del usuario desde localStorage
        const userData = localStorage.getItem('petLifeUser');
        if (userData) {
            this.currentUser = JSON.parse(userData);
            this.isLoggedIn = true;
        }
    }

    setupEventListeners() {
        // Configurar eventos de navegación
        document.addEventListener('DOMContentLoaded', () => {
            this.setupNavigationEvents();
            this.setupModuleToggle();
            this.setupQuickAccess();
        });

        // Eventos para botones de acceso
        const loginBtn = document.querySelector('a[href="login.html"]');
        const registerBtn = document.querySelector('a[href="registro-tutor.html"]');
        
        if (loginBtn) {
            loginBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.navigateToLogin();
            });
        }

        if (registerBtn) {
            registerBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.navigateToRegister();
            });
        }
    }

    setupNavigationEvents() {
        // Configurar eventos de navegación rápida
        const quickLinks = document.querySelectorAll('.quick-link');
        quickLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const href = link.getAttribute('href');
                this.navigateToPage(href);
            });
        });

        // Configurar eventos de breadcrumbs
        const breadcrumbLinks = document.querySelectorAll('.breadcrumb-item');
        breadcrumbLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const href = link.getAttribute('href');
                if (href) {
                    this.navigateToPage(href);
                }
            });
        });
    }

    setupModuleToggle() {
        // Configurar botón de cambio de módulo
        const moduleToggle = document.querySelector('.module-toggle-btn');
        if (moduleToggle) {
            moduleToggle.addEventListener('click', () => {
                this.switchToVetModule();
            });
        }
    }

    setupQuickAccess() {
        // Configurar acceso directo a páginas
        const accessLinks = document.querySelectorAll('a[href*=".html"]');
        accessLinks.forEach(link => {
            if (!link.classList.contains('quick-link') && !link.classList.contains('breadcrumb-item')) {
                link.addEventListener('click', (e) => {
                    const href = link.getAttribute('href');
                    if (href && !href.startsWith('#')) {
                        // Permitir navegación normal para enlaces externos
                        if (href.startsWith('http') || href.startsWith('../')) {
                            return;
                        }
                        
                        e.preventDefault();
                        this.navigateToPage(href);
                    }
                });
            }
        });
    }

    navigateToPage(page) {
        // Navegar a una página específica
        console.log(`🧭 Navegando a: ${page}`);
        
        // Agregar efecto de transición
        document.body.style.opacity = '0.7';
        
        setTimeout(() => {
            window.location.href = page;
        }, 200);
    }

    navigateToLogin() {
        // Navegar a la página de login
        this.navigateToPage('login.html');
    }

    navigateToRegister() {
        // Navegar a la página de registro
        this.navigateToPage('registro-tutor.html');
    }

    switchToVetModule() {
        // Cambiar al módulo veterinario
        if (confirm('¿Deseas cambiar al módulo de Veterinarios?')) {
            console.log('🔄 Cambiando al módulo veterinario');
            window.location.href = '../login.html';
        }
    }

    initializeNavigation() {
        // Inicializar sistema de navegación
        if (window.petLifeNav) {
            console.log('🧭 Sistema de navegación ya inicializado');
            return;
        }

        // Crear instancia de navegación
        window.petLifeNav = new PetLifeNavigation();
        
        // Agregar indicadores visuales
        this.addModuleIndicators();
        this.addNavigationHelpers();
    }

    addModuleIndicators() {
        // Agregar indicadores visuales del módulo actual
        const body = document.body;
        body.setAttribute('data-module', this.currentModule);
        
        // Agregar clase CSS para estilos específicos del módulo
        body.classList.add(`module-${this.currentModule}`);
    }

    addNavigationHelpers() {
        // Agregar helpers de navegación
        const navHelpers = document.createElement('div');
        navHelpers.className = 'nav-helpers';
        navHelpers.innerHTML = `
            <div class="nav-helper" id="backToMain">
                <i class="fas fa-home"></i>
                <span>Principal</span>
            </div>
            <div class="nav-helper" id="switchModule">
                <i class="fas fa-exchange-alt"></i>
                <span>Cambiar Módulo</span>
            </div>
        `;
        
        document.body.appendChild(navHelpers);
        
        // Configurar eventos de helpers
        document.getElementById('backToMain').addEventListener('click', () => {
            window.location.href = '../index.html';
        });
        
        document.getElementById('switchModule').addEventListener('click', () => {
            this.switchToVetModule();
        });
    }

    showWelcomeMessage() {
        // Mostrar mensaje de bienvenida
        if (this.isLoggedIn && this.currentUser) {
            console.log(`👋 Bienvenido de vuelta, ${this.currentUser.name}!`);
            this.showNotification(`¡Hola ${this.currentUser.name}! Bienvenido al módulo tutor.`, 'success');
        } else {
            console.log('👋 Bienvenido al módulo tutor de PetLife');
        }
    }

    showNotification(message, type = 'info') {
        // Mostrar notificación
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'info-circle'}"></i>
            <span>${message}</span>
            <button class="notification-close">
                <i class="fas fa-times"></i>
            </button>
        `;
        
        document.body.appendChild(notification);
        
        // Auto-remover después de 5 segundos
        setTimeout(() => {
            notification.remove();
        }, 5000);
        
        // Configurar botón de cerrar
        notification.querySelector('.notification-close').addEventListener('click', () => {
            notification.remove();
        });
    }

    // Métodos de utilidad
    getCurrentModule() {
        return this.currentModule;
    }

    isUserLoggedIn() {
        return this.isLoggedIn;
    }

    getCurrentUser() {
        return this.currentUser;
    }

    logout() {
        // Cerrar sesión
        localStorage.removeItem('petLifeUser');
        this.currentUser = null;
        this.isLoggedIn = false;
        
        this.showNotification('Sesión cerrada correctamente', 'info');
        
        // Redirigir al login
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 1000);
    }
}

// Funciones globales para uso en otras páginas
window.PetLifeApp = PetLifeApp;

// Función para cambiar de módulo
window.switchToVetModule = function() {
    if (window.petLifeApp) {
        window.petLifeApp.switchToVetModule();
    }
};

// Función para navegar a una página
window.navigateToPage = function(page) {
    if (window.petLifeApp) {
        window.petLifeApp.navigateToPage(page);
    }
};

// Función para mostrar notificaciones
window.showNotification = function(message, type) {
    if (window.petLifeApp) {
        window.petLifeApp.showNotification(message, type);
    }
};

// Función para cerrar sesión
window.logout = function() {
    if (window.petLifeApp) {
        window.petLifeApp.logout();
    }
};

// Inicializar la aplicación cuando se carga el DOM
document.addEventListener('DOMContentLoaded', function() {
    window.petLifeApp = new PetLifeApp();
    
    console.log('🚀 PetLife 2.0 - Módulo Tutor inicializado');
    console.log('📱 Módulo actual:', window.petLifeApp.getCurrentModule());
    console.log('👤 Usuario logueado:', window.petLifeApp.isUserLoggedIn());
});

// Manejar errores de navegación
window.addEventListener('error', function(e) {
    console.error('❌ Error en PetLife 2.0:', e.error);
    if (window.petLifeApp) {
        window.petLifeApp.showNotification('Ha ocurrido un error. Por favor, recarga la página.', 'error');
    }
});

// Manejar eventos de navegación
window.addEventListener('beforeunload', function() {
    console.log('👋 Cerrando PetLife 2.0 - Módulo Tutor');
});

console.log('📦 PetLife 2.0 - Script principal cargado');
console.log('🔧 Funciones disponibles:');
console.log('  - switchToVetModule() - Cambiar al módulo veterinario');
console.log('  - navigateToPage(page) - Navegar a una página específica');
console.log('  - showNotification(message, type) - Mostrar notificación');
console.log('  - logout() - Cerrar sesión');