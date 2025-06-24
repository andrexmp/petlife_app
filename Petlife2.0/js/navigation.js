// Sistema de Navegación para PetLife 2.0
// Gestiona la navegación entre módulos y mejora la experiencia del usuario

class PetLifeNavigation {
    constructor() {
        this.currentModule = 'tutor';
        this.vetModulePath = '../';
        this.tutorModulePath = './';
        this.init();
    }

    init() {
        this.setupNavigationLinks();
        this.addModuleIndicator();
        this.setupBreadcrumbs();
    }

    setupNavigationLinks() {
        // Actualizar enlaces de navegación en todas las páginas
        const navLinks = document.querySelectorAll('a[href*="login.html"], a[href*="dashboard.html"]');
        
        navLinks.forEach(link => {
            if (link.href.includes('login.html')) {
                // Detectar el módulo
                if (window.location.pathname.includes('Petlife2.0')) {
                    link.href = '../login-veterinario.html';
                } else {
                    link.href = 'Petlife2.0/login-tutor.html';
                }
                link.setAttribute('data-module', 'login');
            }
        });

        // Agregar botón de cambio de módulo en el header
        this.addModuleToggle();
    }

    addModuleIndicator() {
        // Agregar indicador visual del módulo actual
        const header = document.querySelector('.dashboard-header, .vets-header, .notifications-header, .agenda-header');
        
        if (header) {
            const moduleIndicator = document.createElement('div');
            moduleIndicator.className = 'module-indicator';
            moduleIndicator.innerHTML = `
                <span class="module-badge">
                    <i class="fas fa-user"></i>
                    Módulo Tutor
                </span>
            `;
            
            // Insertar al inicio del header
            header.insertBefore(moduleIndicator, header.firstChild);
        }
    }

    addModuleToggle() {
        // Agregar botón para cambiar entre módulos
        const headerActions = document.querySelector('.header-actions, .header-content');
        
        if (headerActions) {
            const moduleToggle = document.createElement('button');
            moduleToggle.className = 'module-toggle-btn';
            moduleToggle.innerHTML = `
                <i class="fas fa-exchange-alt"></i>
                Cambiar a Veterinario
            `;
            moduleToggle.onclick = () => this.switchToVetModule();
            
            headerActions.appendChild(moduleToggle);
        }
    }

    switchToVetModule() {
        if (confirm('¿Deseas cambiar al módulo de Veterinarios?')) {
            window.location.href = this.vetModulePath + 'login.html';
        }
    }

    setupBreadcrumbs() {
        // Agregar breadcrumbs para mejor navegación
        const container = document.querySelector('.dashboard-container, .vets-container, .notifications-container, .agenda-container');
        
        if (container) {
            const breadcrumbs = document.createElement('div');
            breadcrumbs.className = 'breadcrumbs';
            breadcrumbs.innerHTML = `
                <a href="${this.vetModulePath}index.html" class="breadcrumb-item">
                    <i class="fas fa-home"></i>
                    PetLife
                </a>
                <span class="breadcrumb-separator">/</span>
                <span class="breadcrumb-item active">
                    <i class="fas fa-user"></i>
                    Módulo Tutor
                </span>
            `;
            
            container.insertBefore(breadcrumbs, container.firstChild);
        }
    }

    // Método para navegar al módulo veterinario
    navigateToVetModule(page = 'login.html') {
        window.location.href = this.vetModulePath + page;
    }

    // Método para navegar dentro del módulo tutor
    navigateToTutorModule(page) {
        window.location.href = this.tutorModulePath + page;
    }

    // Método para obtener la ruta correcta según el módulo
    getModulePath(module = 'tutor') {
        return module === 'veterinario' ? this.vetModulePath : this.tutorModulePath;
    }
}

// Función para inicializar la navegación
function initializeNavigation() {
    window.petLifeNav = new PetLifeNavigation();
}

// Función para cambiar de módulo
function switchModule(targetModule) {
    if (targetModule === 'veterinario') {
        window.petLifeNav.navigateToVetModule();
    } else {
        window.petLifeNav.navigateToTutorModule('inicio.html');
    }
}

// Función para obtener información del módulo actual
function getCurrentModuleInfo() {
    return {
        name: 'Tutor',
        path: './',
        icon: 'fas fa-user',
        color: '#667eea'
    };
}

// Exportar funciones para uso global
window.initializeNavigation = initializeNavigation;
window.switchModule = switchModule;
window.getCurrentModuleInfo = getCurrentModuleInfo;

// Inicializar automáticamente cuando se carga el DOM
document.addEventListener('DOMContentLoaded', function() {
    initializeNavigation();
});

console.log('🧭 Sistema de navegación PetLife 2.0 cargado');
console.log('📱 Módulo actual: Tutor');
console.log('🔗 Funciones disponibles:');
console.log('  - switchModule("veterinario") - Cambiar al módulo veterinario');
console.log('  - getCurrentModuleInfo() - Obtener información del módulo actual'); 