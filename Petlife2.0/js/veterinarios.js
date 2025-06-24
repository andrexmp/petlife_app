document.addEventListener('DOMContentLoaded', function() {
    // Verificar autenticación
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) {
        window.location.href = 'login.html';
        return;
    }

    // Inicializar página
    initializeVetsPage();
    setupEventListeners();
    loadVeterinarians();
});

// Datos de ejemplo de veterinarios
const veterinariansData = [
    {
        id: 1,
        name: "Dra. Adriana Contreras",
        specialty: "Medicina General",
        rating: 4.9,
        reviews: 127,
        location: "Santiago Centro",
        distance: 2.3,
        photo: "img/vet1.jpg",
        description: "Médico veterinario con más de 10 años de experiencia en medicina general y atención de emergencias.",
        experience: "10+ años",
        education: "Universidad de Chile",
        schedule: {
            "Lunes": "09:00 - 18:00",
            "Martes": "09:00 - 18:00",
            "Miércoles": "09:00 - 18:00",
            "Jueves": "09:00 - 18:00",
            "Viernes": "09:00 - 18:00",
            "Sábado": "09:00 - 14:00",
            "Domingo": "Cerrado"
        },
        services: ["Consulta general", "Vacunación", "Desparasitación", "Emergencias"],
        languages: ["Español", "Inglés"]
    },
    {
        id: 2,
        name: "Dr. Andrés Martínez",
        specialty: "Cirugía",
        rating: 4.8,
        reviews: 89,
        location: "Providencia",
        distance: 4.1,
        photo: "img/vet2.jpg",
        description: "Cirujano veterinario especializado en cirugías complejas y traumatología.",
        experience: "15+ años",
        education: "Universidad Católica",
        schedule: {
            "Lunes": "08:00 - 17:00",
            "Martes": "08:00 - 17:00",
            "Miércoles": "08:00 - 17:00",
            "Jueves": "08:00 - 17:00",
            "Viernes": "08:00 - 17:00",
            "Sábado": "08:00 - 12:00",
            "Domingo": "Emergencias"
        },
        services: ["Cirugía general", "Traumatología", "Ortopedia", "Emergencias"],
        languages: ["Español"]
    },
    {
        id: 3,
        name: "Dra. María González",
        specialty: "Dermatología",
        rating: 4.7,
        reviews: 156,
        location: "Las Condes",
        distance: 6.8,
        photo: "img/vet3.jpg",
        description: "Dermatóloga veterinaria especializada en enfermedades de la piel y alergias.",
        experience: "8+ años",
        education: "Universidad de Concepción",
        schedule: {
            "Lunes": "10:00 - 19:00",
            "Martes": "10:00 - 19:00",
            "Miércoles": "10:00 - 19:00",
            "Jueves": "10:00 - 19:00",
            "Viernes": "10:00 - 19:00",
            "Sábado": "10:00 - 15:00",
            "Domingo": "Cerrado"
        },
        services: ["Dermatología", "Alergias", "Tratamientos de piel", "Biopsias"],
        languages: ["Español", "Inglés", "Francés"]
    },
    {
        id: 4,
        name: "Dr. Carlos Silva",
        specialty: "Cardiología",
        rating: 4.9,
        reviews: 203,
        location: "Ñuñoa",
        distance: 3.2,
        photo: "img/vet4.jpg",
        description: "Cardiólogo veterinario con especialización en enfermedades cardíacas y ecocardiografía.",
        experience: "12+ años",
        education: "Universidad Austral",
        schedule: {
            "Lunes": "08:30 - 17:30",
            "Martes": "08:30 - 17:30",
            "Miércoles": "08:30 - 17:30",
            "Jueves": "08:30 - 17:30",
            "Viernes": "08:30 - 17:30",
            "Sábado": "08:30 - 13:30",
            "Domingo": "Cerrado"
        },
        services: ["Cardiología", "Ecocardiografía", "Electrocardiograma", "Monitoreo cardíaco"],
        languages: ["Español", "Inglés"]
    },
    {
        id: 5,
        name: "Dra. Patricia López",
        specialty: "Oftalmología",
        rating: 4.6,
        reviews: 78,
        location: "Vitacura",
        distance: 8.5,
        photo: "img/vet5.jpg",
        description: "Oftalmóloga veterinaria especializada en cirugías oculares y tratamientos de retina.",
        experience: "9+ años",
        education: "Universidad de Valparaíso",
        schedule: {
            "Lunes": "09:00 - 18:00",
            "Martes": "09:00 - 18:00",
            "Miércoles": "09:00 - 18:00",
            "Jueves": "09:00 - 18:00",
            "Viernes": "09:00 - 18:00",
            "Sábado": "09:00 - 14:00",
            "Domingo": "Cerrado"
        },
        services: ["Oftalmología", "Cirugía ocular", "Tratamientos de retina", "Emergencias oculares"],
        languages: ["Español", "Inglés"]
    }
];

let currentVets = [...veterinariansData];
let currentPage = 1;
const vetsPerPage = 6;

function initializeVetsPage() {
    // Configurar vista inicial
    document.querySelector('.view-btn[data-view="list"]').classList.add('active');
}

function setupEventListeners() {
    // Búsqueda
    const searchInput = document.getElementById('searchInput');
    const clearSearch = document.getElementById('clearSearch');
    
    searchInput.addEventListener('input', debounce(handleSearch, 300));
    clearSearch.addEventListener('click', clearSearchInput);
    
    // Filtros
    document.getElementById('specialtyFilter').addEventListener('change', handleFilters);
    document.getElementById('ratingFilter').addEventListener('change', handleFilters);
    document.getElementById('distanceFilter').addEventListener('change', handleFilters);
    
    // Toggle de vista
    document.querySelectorAll('.view-btn').forEach(btn => {
        btn.addEventListener('click', () => toggleView(btn.dataset.view));
    });
    
    // Modal
    const modal = document.getElementById('vetModal');
    const closeModal = document.querySelector('.close-modal');
    
    closeModal.addEventListener('click', () => {
        modal.style.display = 'none';
    });
    
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });
}

function loadVeterinarians() {
    const vetsList = document.getElementById('vetsList');
    const startIndex = (currentPage - 1) * vetsPerPage;
    const endIndex = startIndex + vetsPerPage;
    const paginatedVets = currentVets.slice(startIndex, endIndex);
    
    if (paginatedVets.length === 0) {
        vetsList.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-search"></i>
                <h3>No se encontraron veterinarios</h3>
                <p>Intenta ajustar los filtros de búsqueda</p>
            </div>
        `;
        return;
    }
    
    vetsList.innerHTML = paginatedVets.map(vet => createVetCard(vet)).join('');
    
    // Configurar eventos de las tarjetas
    setupVetCardEvents();
    
    // Actualizar paginación
    updatePagination();
}

function createVetCard(vet) {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const isFavorite = currentUser.favoriteVets?.some(fav => fav.id === vet.id);
    
    const stars = generateStars(vet.rating);
    
    return `
        <div class="vet-card" data-vet-id="${vet.id}">
            <div class="vet-card-header">
                <img src="${vet.photo}" alt="${vet.name}" class="vet-photo">
                <div class="vet-info">
                    <h3>${vet.name}</h3>
                    <p class="vet-specialty">${vet.specialty}</p>
                    <div class="vet-rating">
                        <span class="stars">${stars}</span>
                        <span class="rating-text">${vet.rating} (${vet.reviews} reseñas)</span>
                    </div>
                </div>
            </div>
            
            <div class="vet-details-info">
                <div class="vet-location">
                    <i class="fas fa-map-marker-alt"></i>
                    <span>${vet.location} • ${vet.distance} km</span>
                </div>
                
                <div class="vet-actions">
                    <button class="favorite-btn ${isFavorite ? 'active' : ''}" data-vet-id="${vet.id}">
                        <i class="fas fa-heart"></i>
                    </button>
                    <button class="action-btn btn-secondary" onclick="viewVetDetails(${vet.id})">
                        Ver detalles
                    </button>
                    <button class="action-btn btn-primary" onclick="bookAppointment(${vet.id})">
                        Agendar
                    </button>
                </div>
            </div>
        </div>
    `;
}

function generateStars(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    
    let stars = '';
    
    for (let i = 0; i < fullStars; i++) {
        stars += '<i class="fas fa-star"></i>';
    }
    
    if (hasHalfStar) {
        stars += '<i class="fas fa-star-half-alt"></i>';
    }
    
    for (let i = 0; i < emptyStars; i++) {
        stars += '<i class="far fa-star"></i>';
    }
    
    return stars;
}

function setupVetCardEvents() {
    // Eventos de favoritos
    document.querySelectorAll('.favorite-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleFavorite(btn.dataset.vetId);
        });
    });
}

function toggleFavorite(vetId) {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const vet = veterinariansData.find(v => v.id === parseInt(vetId));
    
    if (!currentUser.favoriteVets) {
        currentUser.favoriteVets = [];
    }
    
    const isFavorite = currentUser.favoriteVets.some(fav => fav.id === parseInt(vetId));
    
    if (isFavorite) {
        currentUser.favoriteVets = currentUser.favoriteVets.filter(fav => fav.id !== parseInt(vetId));
        showNotification('Veterinario removido de favoritos', 'info');
    } else {
        currentUser.favoriteVets.push({
            id: vet.id,
            name: vet.name,
            specialty: vet.specialty,
            rating: vet.rating,
            photo: vet.photo
        });
        showNotification('Veterinario añadido a favoritos', 'success');
    }
    
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    updateRegisteredUsers(currentUser);
    
    // Actualizar UI
    const btn = document.querySelector(`.favorite-btn[data-vet-id="${vetId}"]`);
    btn.classList.toggle('active');
}

function viewVetDetails(vetId) {
    const vet = veterinariansData.find(v => v.id === vetId);
    const modal = document.getElementById('vetModal');
    const vetDetails = document.getElementById('vetDetails');
    
    const scheduleHTML = Object.entries(vet.schedule).map(([day, time]) => `
        <div class="schedule-item">
            <span class="schedule-day">${day}</span>
            <span class="schedule-time">${time}</span>
        </div>
    `).join('');
    
    const servicesHTML = vet.services.map(service => `<li>${service}</li>`).join('');
    const languagesHTML = vet.languages.join(', ');
    
    vetDetails.innerHTML = `
        <div class="vet-details-header">
            <img src="${vet.photo}" alt="${vet.name}" class="vet-details-photo">
            <div class="vet-details-info">
                <h2>${vet.name}</h2>
                <p class="vet-details-specialty">${vet.specialty}</p>
                <div class="vet-details-rating">
                    <span class="stars">${generateStars(vet.rating)}</span>
                    <span>${vet.rating} (${vet.reviews} reseñas)</span>
                </div>
            </div>
        </div>
        
        <div class="vet-details-section">
            <h3>Descripción</h3>
            <p>${vet.description}</p>
        </div>
        
        <div class="vet-details-section">
            <h3>Información</h3>
            <p><strong>Experiencia:</strong> ${vet.experience}</p>
            <p><strong>Educación:</strong> ${vet.education}</p>
            <p><strong>Idiomas:</strong> ${languagesHTML}</p>
        </div>
        
        <div class="vet-details-section">
            <h3>Servicios</h3>
            <ul>${servicesHTML}</ul>
        </div>
        
        <div class="vet-details-section">
            <h3>Horarios</h3>
            <div class="vet-schedule">
                ${scheduleHTML}
            </div>
        </div>
        
        <div class="vet-details-section">
            <button class="action-btn btn-primary" onclick="bookAppointment(${vet.id})">
                Agendar Cita
            </button>
        </div>
    `;
    
    modal.style.display = 'block';
}

function bookAppointment(vetId) {
    // Redirigir a la página de agenda con el veterinario seleccionado
    window.location.href = `agenda.html?vet=${vetId}`;
}

function handleSearch() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    
    currentVets = veterinariansData.filter(vet => 
        vet.name.toLowerCase().includes(searchTerm) ||
        vet.specialty.toLowerCase().includes(searchTerm) ||
        vet.location.toLowerCase().includes(searchTerm)
    );
    
    currentPage = 1;
    loadVeterinarians();
}

function clearSearchInput() {
    document.getElementById('searchInput').value = '';
    currentVets = [...veterinariansData];
    currentPage = 1;
    loadVeterinarians();
}

function handleFilters() {
    const specialty = document.getElementById('specialtyFilter').value;
    const rating = parseFloat(document.getElementById('ratingFilter').value);
    const distance = parseFloat(document.getElementById('distanceFilter').value);
    
    currentVets = veterinariansData.filter(vet => {
        const matchesSpecialty = !specialty || vet.specialty === specialty;
        const matchesRating = !rating || vet.rating >= rating;
        const matchesDistance = !distance || vet.distance <= distance;
        
        return matchesSpecialty && matchesRating && matchesDistance;
    });
    
    currentPage = 1;
    loadVeterinarians();
}

function toggleView(viewType) {
    const vetsList = document.getElementById('vetsList');
    const viewBtns = document.querySelectorAll('.view-btn');
    
    viewBtns.forEach(btn => btn.classList.remove('active'));
    document.querySelector(`[data-view="${viewType}"]`).classList.add('active');
    
    if (viewType === 'grid') {
        vetsList.classList.add('grid-view');
    } else {
        vetsList.classList.remove('grid-view');
    }
}

function updatePagination() {
    const totalPages = Math.ceil(currentVets.length / vetsPerPage);
    const pagination = document.getElementById('pagination');
    
    if (totalPages <= 1) {
        pagination.innerHTML = '';
        return;
    }
    
    let paginationHTML = '';
    
    // Botón anterior
    paginationHTML += `
        <button class="pagination-btn" ${currentPage === 1 ? 'disabled' : ''} onclick="changePage(${currentPage - 1})">
            <i class="fas fa-chevron-left"></i>
        </button>
    `;
    
    // Números de página
    for (let i = 1; i <= totalPages; i++) {
        if (i === 1 || i === totalPages || (i >= currentPage - 1 && i <= currentPage + 1)) {
            paginationHTML += `
                <button class="pagination-btn ${i === currentPage ? 'active' : ''}" onclick="changePage(${i})">
                    ${i}
                </button>
            `;
        } else if (i === currentPage - 2 || i === currentPage + 2) {
            paginationHTML += '<span>...</span>';
        }
    }
    
    // Botón siguiente
    paginationHTML += `
        <button class="pagination-btn" ${currentPage === totalPages ? 'disabled' : ''} onclick="changePage(${currentPage + 1})">
            <i class="fas fa-chevron-right"></i>
        </button>
    `;
    
    pagination.innerHTML = paginationHTML;
}

function changePage(page) {
    const totalPages = Math.ceil(currentVets.length / vetsPerPage);
    if (page >= 1 && page <= totalPages) {
        currentPage = page;
        loadVeterinarians();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

function updateRegisteredUsers(updatedUser) {
    const allUsers = JSON.parse(localStorage.getItem('registeredUsers')) || [];
    const userIndex = allUsers.findIndex(user => user.email === updatedUser.email);
    
    if (userIndex !== -1) {
        allUsers[userIndex] = updatedUser;
    } else {
        allUsers.push(updatedUser);
    }
    
    localStorage.setItem('registeredUsers', JSON.stringify(allUsers));
}

// Función de debounce para la búsqueda
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Sistema de notificaciones
function showNotification(message, type = 'info') {
    const notificationSystem = document.getElementById('notificationSystem');
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    
    const icon = type === 'success' ? 'fas fa-check-circle' :
                 type === 'error' ? 'fas fa-exclamation-circle' :
                 type === 'warning' ? 'fas fa-exclamation-triangle' :
                 'fas fa-info-circle';
    
    notification.innerHTML = `
        <i class="${icon}"></i>
        <span>${message}</span>
        <button onclick="this.parentElement.remove()" style="margin-left: auto; background: none; border: none; color: inherit; cursor: pointer;">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    notificationSystem.appendChild(notification);
    
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 5000);
}

// Exportar funciones para uso global
window.viewVetDetails = viewVetDetails;
window.bookAppointment = bookAppointment;
window.changePage = changePage;
window.showNotification = showNotification; 