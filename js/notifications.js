// Sistema de notificaciones para PetLife
class NotificationSystem {
    constructor() {
        this.createNotificationContainer();
    }

    // Crear el contenedor de notificaciones si no existe
    createNotificationContainer() {
        let container = document.getElementById('notificationContainer');
        if (!container) {
            container = document.createElement('div');
            container.id = 'notificationContainer';
            container.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 10000;
                max-width: 350px;
            `;
            document.body.appendChild(container);
        }
    }

    // Mostrar notificación
    show(message, type = 'success', duration = 4000) {
        const notification = this.createNotificationElement(message, type);
        const container = document.getElementById('notificationContainer');
        
        container.appendChild(notification);

        // Animar entrada
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);

        // Auto-remover después del tiempo especificado
        setTimeout(() => {
            this.hide(notification);
        }, duration);

        // Permitir cerrar manualmente
        notification.addEventListener('click', () => {
            this.hide(notification);
        });

        return notification;
    }

    // Crear elemento de notificación
    createNotificationElement(message, type) {
        const notification = document.createElement('div');
        notification.className = `notification-toast ${type}`;
        
        const icon = this.getIconForType(type);
        
        notification.innerHTML = `
            <div class="notification-content">
                <div class="notification-icon">${icon}</div>
                <div class="notification-message">${message}</div>
                <button class="notification-close">&times;</button>
            </div>
        `;

        // Agregar estilos inline para asegurar que funcionen
        notification.style.cssText = `
            background: ${this.getBackgroundForType(type)};
            color: white;
            padding: 16px 20px;
            border-radius: 12px;
            margin-bottom: 10px;
            box-shadow: 0 8px 25px rgba(0,0,0,0.15);
            transform: translateX(400px);
            transition: transform 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
            cursor: pointer;
            border: 1px solid rgba(255,255,255,0.2);
            backdrop-filter: blur(10px);
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            font-size: 14px;
            font-weight: 500;
            max-width: 100%;
            word-wrap: break-word;
        `;

        // Estilos para el contenido interno
        const content = notification.querySelector('.notification-content');
        content.style.cssText = `
            display: flex;
            align-items: center;
            gap: 12px;
        `;

        // Estilos para el icono
        const iconElement = notification.querySelector('.notification-icon');
        iconElement.style.cssText = `
            font-size: 18px;
            font-weight: bold;
            flex-shrink: 0;
        `;

        // Estilos para el mensaje
        const messageElement = notification.querySelector('.notification-message');
        messageElement.style.cssText = `
            flex: 1;
            line-height: 1.4;
        `;

        // Estilos para el botón de cerrar
        const closeButton = notification.querySelector('.notification-close');
        closeButton.style.cssText = `
            background: none;
            border: none;
            color: white;
            font-size: 20px;
            cursor: pointer;
            padding: 0;
            width: 20px;
            height: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            opacity: 0.7;
            transition: opacity 0.2s;
            flex-shrink: 0;
        `;

        closeButton.addEventListener('mouseenter', () => {
            closeButton.style.opacity = '1';
        });

        closeButton.addEventListener('mouseleave', () => {
            closeButton.style.opacity = '0.7';
        });

        closeButton.addEventListener('click', (e) => {
            e.stopPropagation();
            this.hide(notification);
        });

        return notification;
    }

    // Obtener icono según el tipo
    getIconForType(type) {
        const icons = {
            success: '✓',
            error: '✕',
            warning: '⚠',
            info: 'ℹ'
        };
        return icons[type] || icons.info;
    }

    // Obtener color de fondo según el tipo
    getBackgroundForType(type) {
        const backgrounds = {
            success: 'linear-gradient(135deg, #4CAF50, #45a049)',
            error: 'linear-gradient(135deg, #f44336, #d32f2f)',
            warning: 'linear-gradient(135deg, #ff9800, #f57c00)',
            info: 'linear-gradient(135deg, #2196F3, #1976D2)'
        };
        return backgrounds[type] || backgrounds.info;
    }

    // Ocultar notificación
    hide(notification) {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }

    // Métodos de conveniencia
    success(message, duration) {
        return this.show(message, 'success', duration);
    }

    error(message, duration) {
        return this.show(message, 'error', duration);
    }

    warning(message, duration) {
        return this.show(message, 'warning', duration);
    }

    info(message, duration) {
        return this.show(message, 'info', duration);
    }
}

// Crear instancia global
window.notifications = new NotificationSystem();

// Función de conveniencia para usar en otros archivos
window.showNotification = (message, type = 'success', duration = 4000) => {
    return window.notifications.show(message, type, duration);
};

// Agregar estilos CSS dinámicamente
const notificationStyles = `
    .notification-toast.show {
        transform: translateX(0) !important;
    }
    
    .notification-toast:hover {
        transform: translateX(-5px) !important;
    }
    
    @media (max-width: 480px) {
        #notificationContainer {
            top: 10px !important;
            right: 10px !important;
            left: 10px !important;
            max-width: none !important;
        }
        
        .notification-toast {
            transform: translateY(-100px) !important;
        }
        
        .notification-toast.show {
            transform: translateY(0) !important;
        }
    }
`;

// Insertar estilos en el head
const styleSheet = document.createElement('style');
styleSheet.textContent = notificationStyles;
document.head.appendChild(styleSheet); 