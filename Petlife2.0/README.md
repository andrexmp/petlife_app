# PetLife 2.0 - Módulo Tutor

## 📋 Descripción

PetLife 2.0 es una aplicación veterinaria completa que incluye dos módulos principales:
- **Módulo Veterinario**: Para profesionales veterinarios
- **Módulo Tutor**: Para tutores de mascotas

Este repositorio contiene el **Módulo Tutor** que permite a los tutores gestionar sus mascotas, agendar citas, buscar veterinarios y recibir notificaciones.

## 🏗️ Estructura del Proyecto

```
PetLife/
├── index.html                 # Página principal (módulo veterinario)
├── login.html                 # Login veterinarios
├── css/                       # Estilos del módulo veterinario
├── js/                        # Scripts del módulo veterinario
├── pages/                     # Páginas del módulo veterinario
└── Petlife2.0/               # Módulo Tutor
    ├── index.html            # Página principal del módulo tutor
    ├── login.html            # Login tutores
    ├── registro-tutor.html   # Registro de tutores
    ├── inicio.html           # Dashboard principal
    ├── mis-mascotas.html     # Gestión de mascotas
    ├── veterinarios.html     # Búsqueda de veterinarios
    ├── agenda.html           # Calendario y citas
    ├── notificaciones.html   # Sistema de notificaciones
    ├── perfil-tutor.html     # Perfil del tutor
    ├── perfil-mascota.html   # Perfil de mascota
    ├── editar-mascota.html   # Editar mascota
    ├── editar-perfil.html    # Editar perfil
    ├── styles/               # Estilos CSS
    │   ├── main.css          # Estilos principales
    │   ├── dashboard.css     # Estilos del dashboard
    │   ├── navigation.css    # Estilos de navegación
    │   ├── veterinarios.css  # Estilos de veterinarios
    │   ├── agenda.css        # Estilos de agenda
    │   └── notificaciones.css # Estilos de notificaciones
    └── js/                   # Scripts JavaScript
        ├── script.js         # Script principal
        ├── navigation.js     # Sistema de navegación
        ├── dashboard.js      # Funcionalidad del dashboard
        ├── veterinarios.js   # Funcionalidad de veterinarios
        ├── notificaciones.js # Sistema de notificaciones
        └── test_data.js      # Datos de prueba
```

## 🧭 Sistema de Navegación

### Navegación entre Módulos

El sistema incluye una navegación fluida entre los dos módulos:

1. **Desde el Principal**: `index.html` → Botón "Soy Tutor" → `Petlife2.0/index.html`
2. **Desde el Módulo Tutor**: Botón "Cambiar a Veterinario" → `../login.html`
3. **Breadcrumbs**: Indicadores visuales de la ubicación actual

### Elementos de Navegación

- **Indicador de Módulo**: Badge que muestra "Módulo Tutor" en todas las páginas
- **Botón de Cambio**: Permite cambiar entre módulos veterinario y tutor
- **Breadcrumbs**: Navegación jerárquica (PetLife > Módulo Tutor > Página actual)
- **Navegación Inferior**: Menú de navegación rápida en dispositivos móviles

### Funciones de Navegación

```javascript
// Cambiar al módulo veterinario
switchToVetModule()

// Navegar a una página específica
navigateToPage('inicio.html')

// Obtener información del módulo actual
getCurrentModuleInfo()
```

## 🚀 Características del Módulo Tutor

### ✅ Funcionalidades Implementadas

1. **Dashboard Principal** (`inicio.html`)
   - Estadísticas rápidas (mascotas, citas, veterinarios)
   - Próximas citas
   - Acciones rápidas
   - Vista previa de mascotas

2. **Gestión de Mascotas** (`mis-mascotas.html`)
   - Lista de mascotas del tutor
   - Agregar nueva mascota
   - Ver perfil de mascota
   - Editar información

3. **Búsqueda de Veterinarios** (`veterinarios.html`)
   - Lista de veterinarios disponibles
   - Filtros por especialidad y ubicación
   - Vista de lista y cuadrícula
   - Sistema de favoritos
   - Modal de detalles

4. **Agenda y Citas** (`agenda.html`)
   - Calendario interactivo mensual
   - Agendamiento de citas
   - Filtros por fecha y mascota
   - Vista de citas del día
   - Estadísticas mensuales

5. **Sistema de Notificaciones** (`notificaciones.html`)
   - Lista de notificaciones
   - Filtros por tipo
   - Marcar como leído
   - Eliminar notificaciones
   - Contadores

6. **Perfil del Tutor** (`perfil-tutor.html`)
   - Información personal
   - Configuración de cuenta
   - Historial de actividades

### 🎨 Diseño y UX

- **Diseño Responsive**: Adaptado para móviles, tablets y desktop
- **Interfaz Moderna**: Gradientes, sombras y efectos visuales
- **Navegación Intuitiva**: Menús claros y accesibles
- **Feedback Visual**: Notificaciones y estados de carga
- **Accesibilidad**: Contraste adecuado y navegación por teclado

## 🛠️ Tecnologías Utilizadas

- **HTML5**: Estructura semántica
- **CSS3**: Estilos modernos con Flexbox y Grid
- **JavaScript ES6+**: Funcionalidad interactiva
- **Font Awesome**: Iconografía
- **LocalStorage**: Persistencia de datos local
- **Responsive Design**: Adaptación a diferentes dispositivos

## 📱 Funcionalidades por Página

### Dashboard (`inicio.html`)
- Estadísticas en tiempo real
- Acceso rápido a funciones principales
- Vista previa de mascotas y citas
- Notificaciones emergentes

### Veterinarios (`veterinarios.html`)
- Búsqueda y filtrado avanzado
- Vista de lista y cuadrícula
- Sistema de favoritos
- Información detallada de veterinarios
- Paginación

### Agenda (`agenda.html`)
- Calendario interactivo
- Agendamiento de citas
- Filtros por fecha y mascota
- Vista de citas del día
- Estadísticas mensuales

### Notificaciones (`notificaciones.html`)
- Lista de notificaciones
- Filtros por tipo y estado
- Acciones masivas
- Contadores en tiempo real

## 🔧 Configuración y Uso

### Instalación

1. Clona o descarga el proyecto
2. Abre `index.html` en tu navegador
3. Haz clic en "Soy Tutor" para acceder al módulo tutor

### Datos de Prueba

El sistema incluye datos de prueba que se cargan automáticamente:
- 3 mascotas de ejemplo
- 5 veterinarios disponibles
- 8 citas programadas
- 12 notificaciones

### Navegación

1. **Acceso Principal**: `index.html` → "Soy Tutor"
2. **Dashboard**: `Petlife2.0/inicio.html`
3. **Mascotas**: `Petlife2.0/mis-mascotas.html`
4. **Veterinarios**: `Petlife2.0/veterinarios.html`
5. **Agenda**: `Petlife2.0/agenda.html`
6. **Notificaciones**: `Petlife2.0/notificaciones.html`

## 🎯 Funciones Principales

### Gestión de Mascotas
- Agregar nueva mascota
- Editar información existente
- Ver historial médico
- Subir fotos

### Búsqueda de Veterinarios
- Filtrar por especialidad
- Buscar por ubicación
- Ver calificaciones
- Agregar a favoritos

### Agendamiento de Citas
- Seleccionar veterinario
- Elegir fecha y hora
- Especificar motivo
- Recibir confirmación

### Sistema de Notificaciones
- Recordatorios de citas
- Actualizaciones de mascotas
- Mensajes de veterinarios
- Alertas importantes

## 🔄 Flujo de Navegación

```
Principal (index.html)
    ↓
Módulo Tutor (Petlife2.0/index.html)
    ↓
Login/Registro
    ↓
Dashboard (inicio.html)
    ↓
┌─────────────────┬─────────────────┬─────────────────┐
│   Mascotas      │  Veterinarios   │     Agenda      │
│ (mis-mascotas)  │ (veterinarios)  │   (agenda)      │
└─────────────────┴─────────────────┴─────────────────┘
    ↓
Notificaciones (notificaciones.html)
    ↓
Perfil (perfil-tutor.html)
```

## 🎨 Personalización

### Colores del Tema
- **Primario**: #667eea (Azul)
- **Secundario**: #764ba2 (Púrpura)
- **Éxito**: #27ae60 (Verde)
- **Advertencia**: #f39c12 (Naranja)
- **Error**: #e74c3c (Rojo)

### Modificar Estilos
Los estilos se pueden personalizar editando los archivos CSS en la carpeta `styles/`:
- `main.css`: Estilos generales
- `dashboard.css`: Estilos del dashboard
- `navigation.css`: Estilos de navegación

## 📞 Soporte

Para soporte técnico o preguntas sobre el módulo tutor:
- Revisa la documentación en este README
- Consulta los comentarios en el código
- Verifica la consola del navegador para errores

## 🔮 Próximas Mejoras

- [ ] Integración con backend
- [ ] Chat en tiempo real
- [ ] Notificaciones push
- [ ] Modo offline
- [ ] PWA (Progressive Web App)
- [ ] Integración con APIs de veterinarios
- [ ] Sistema de pagos
- [ ] Historial médico completo

---

**PetLife 2.0 - Módulo Tutor** | Desarrollado con ❤️ para el cuidado de mascotas 