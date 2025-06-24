// Script de prueba para generar datos de ejemplo en PetLife 2.0
// Ejecutar en la consola del navegador para poblar datos de prueba

function generateTestData() {
    console.log('Generando datos de prueba para PetLife 2.0...');
    
    // Datos de ejemplo para mascotas
    const samplePets = [
        {
            id: "1",
            nombre: "Molly",
            tipo: "Perro",
            raza: "Labrador Retriever",
            edad: "5",
            genero: "Hembra",
            esterilizada: true,
            color: "Negro",
            colorDetails: "Con manchas blancas en el pecho",
            enfermedades: "Epilepsia controlada",
            alergias: "Alergia a ciertos tipos de comida",
            peso: "25.5",
            microchip: "123456789012345",
            foto: "img/pet-default.jpg",
            historial: []
        },
        {
            id: "2",
            nombre: "Rocky",
            tipo: "Perro",
            raza: "Pastor Alemán",
            edad: "3",
            genero: "Macho",
            esterilizada: false,
            color: "Negro",
            colorDetails: "Con marcas café",
            enfermedades: "Ninguna",
            alergias: "Sin alergias",
            peso: "32.0",
            microchip: "987654321098765",
            foto: "img/pet-default.jpg",
            historial: []
        },
        {
            id: "3",
            nombre: "Luna",
            tipo: "Gato",
            raza: "Siamés",
            edad: "2",
            genero: "Hembra",
            esterilizada: true,
            color: "Beige",
            colorDetails: "Puntos oscuros en cara, patas y cola",
            enfermedades: "Ninguna",
            alergias: "Sin alergias",
            peso: "4.2",
            microchip: "555666777888999",
            foto: "img/pet-default.jpg",
            historial: []
        },
        {
            id: "4",
            nombre: "Bella",
            tipo: "Perro",
            raza: "Golden Retriever",
            edad: "7",
            genero: "Hembra",
            esterilizada: true,
            color: "Beige",
            colorDetails: "Dorado claro",
            enfermedades: "Artritis leve",
            alergias: "Alergia a las pulgas",
            peso: "28.0",
            microchip: "111222333444555",
            foto: "img/pet-default.jpg",
            historial: []
        },
        {
            id: "5",
            nombre: "Max",
            tipo: "Gato",
            raza: "Mestizo",
            edad: "1",
            genero: "Macho",
            esterilizada: false,
            color: "Naranja",
            colorDetails: "Atigrado naranja",
            enfermedades: "Ninguna",
            alergias: "Sin alergias",
            peso: "3.8",
            microchip: "777888999000111",
            foto: "img/pet-default.jpg",
            historial: []
        }
    ];

    // Datos de ejemplo para citas
    const sampleAppointments = [
        {
            id: "1",
            mascota: "Molly",
            veterinario: "Dra. Adriana Contreras",
            fecha: "2024-12-20T10:00:00",
            tipo: "Vacunación",
            motivo: "Vacuna anual contra la rabia y triple felina",
            urgente: false,
            estado: "confirmada"
        },
        {
            id: "2",
            mascota: "Rocky",
            veterinario: "Dr. Andrés Martínez",
            fecha: "2024-12-21T15:30:00",
            tipo: "Control",
            motivo: "Control de rutina y desparasitación",
            urgente: false,
            estado: "pendiente"
        },
        {
            id: "3",
            mascota: "Luna",
            veterinario: "Dra. María González",
            fecha: "2024-12-22T09:00:00",
            tipo: "Consulta general",
            motivo: "Primera consulta para establecer historial médico",
            urgente: false,
            estado: "confirmada"
        },
        {
            id: "4",
            mascota: "Bella",
            veterinario: "Dr. Carlos Silva",
            fecha: "2024-12-19T14:00:00",
            tipo: "Control",
            motivo: "Control de artritis y ajuste de medicación",
            urgente: false,
            estado: "completada"
        },
        {
            id: "5",
            mascota: "Max",
            veterinario: "Dra. Patricia López",
            fecha: "2024-12-23T11:00:00",
            tipo: "Esterilización",
            motivo: "Procedimiento de esterilización",
            urgente: false,
            estado: "pendiente"
        }
    ];

    // Datos de ejemplo para notificaciones
    const sampleNotifications = [
        {
            id: 1,
            type: 'appointment',
            title: 'Cita confirmada',
            message: 'Tu cita con Molly para vacunación ha sido confirmada para mañana a las 10:00 AM.',
            timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
            read: false,
            urgent: false,
            data: {
                petName: 'Molly',
                vetName: 'Dra. Adriana Contreras',
                date: '2024-12-20',
                time: '10:00',
                type: 'Vacunación'
            }
        },
        {
            id: 2,
            type: 'reminder',
            title: 'Recordatorio de medicación',
            message: 'Es hora de darle la medicación a Rocky. No olvides su dosis de las 2:00 PM.',
            timestamp: new Date(Date.now() - 30 * 60 * 1000),
            read: false,
            urgent: true,
            data: {
                petName: 'Rocky',
                medication: 'Antibiótico',
                time: '14:00'
            }
        },
        {
            id: 3,
            type: 'alert',
            title: 'Mascota sin historial médico',
            message: 'Luna no tiene historial médico registrado. Te recomendamos agendar su primera consulta.',
            timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
            read: true,
            urgent: false,
            data: {
                petName: 'Luna'
            }
        },
        {
            id: 4,
            type: 'success',
            title: 'Cita completada',
            message: 'La consulta de Bella con el Dr. Martínez ha sido completada exitosamente.',
            timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
            read: true,
            urgent: false,
            data: {
                petName: 'Bella',
                vetName: 'Dr. Andrés Martínez',
                date: '2024-12-17'
            }
        },
        {
            id: 5,
            type: 'appointment',
            title: 'Cita próxima',
            message: 'Tienes una cita con Max mañana a las 3:00 PM. No olvides traer su historial médico.',
            timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
            read: false,
            urgent: false,
            data: {
                petName: 'Max',
                vetName: 'Dra. María González',
                date: '2024-12-20',
                time: '15:00',
                type: 'Control general'
            }
        }
    ];

    // Veterinarios favoritos de ejemplo
    const sampleFavoriteVets = [
        {
            id: 1,
            name: "Dra. Adriana Contreras",
            specialty: "Medicina General",
            rating: 4.9,
            photo: "img/vet1.jpg"
        },
        {
            id: 2,
            name: "Dr. Andrés Martínez",
            specialty: "Cirugía",
            rating: 4.8,
            photo: "img/vet2.jpg"
        }
    ];

    // Obtener usuario actual o crear uno de ejemplo
    let currentUser = JSON.parse(localStorage.getItem('currentUser'));
    
    if (!currentUser) {
        currentUser = {
            name: "Juan Pérez",
            email: "juan.perez@email.com",
            profilePic: "img/user-default.jpg",
            mascotas: samplePets,
            citas: sampleAppointments,
            notifications: sampleNotifications,
            favoriteVets: sampleFavoriteVets
        };
    } else {
        // Actualizar datos existentes
        currentUser.mascotas = samplePets;
        currentUser.citas = sampleAppointments;
        currentUser.notifications = sampleNotifications;
        currentUser.favoriteVets = sampleFavoriteVets;
    }

    // Guardar en localStorage
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    
    // Actualizar lista de usuarios registrados
    const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers')) || [];
    const userIndex = registeredUsers.findIndex(user => user.email === currentUser.email);
    
    if (userIndex !== -1) {
        registeredUsers[userIndex] = currentUser;
    } else {
        registeredUsers.push(currentUser);
    }
    
    localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers));

    console.log('✅ Datos de prueba generados exitosamente!');
    console.log('📊 Resumen de datos:');
    console.log(`   - ${samplePets.length} mascotas`);
    console.log(`   - ${sampleAppointments.length} citas`);
    console.log(`   - ${sampleNotifications.length} notificaciones`);
    console.log(`   - ${sampleFavoriteVets.length} veterinarios favoritos`);
    
    // Mostrar notificación de éxito
    if (typeof showNotification === 'function') {
        showNotification('Datos de prueba generados exitosamente!', 'success');
    } else {
        alert('Datos de prueba generados exitosamente!');
    }
}

function clearTestData() {
    if (confirm('¿Estás seguro de que quieres eliminar todos los datos de prueba?')) {
        localStorage.removeItem('currentUser');
        localStorage.removeItem('registeredUsers');
        console.log('🗑️ Datos de prueba eliminados');
        
        if (typeof showNotification === 'function') {
            showNotification('Datos de prueba eliminados', 'info');
        } else {
            alert('Datos de prueba eliminados');
        }
    }
}

function showTestData() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (currentUser) {
        console.log('📋 Datos actuales:');
        console.log('Usuario:', currentUser.name);
        console.log('Mascotas:', currentUser.mascotas?.length || 0);
        console.log('Citas:', currentUser.citas?.length || 0);
        console.log('Notificaciones:', currentUser.notifications?.length || 0);
        console.log('Veterinarios favoritos:', currentUser.favoriteVets?.length || 0);
    } else {
        console.log('❌ No hay datos de usuario');
    }
}

// Función para generar datos de prueba específicos
function generateSpecificTestData(type) {
    switch(type) {
        case 'pets':
            generateTestData();
            console.log('🐾 Solo datos de mascotas generados');
            break;
        case 'appointments':
            generateTestData();
            console.log('📅 Solo datos de citas generados');
            break;
        case 'notifications':
            generateTestData();
            console.log('🔔 Solo datos de notificaciones generados');
            break;
        default:
            generateTestData();
    }
}

// Exportar funciones para uso global
window.generateTestData = generateTestData;
window.clearTestData = clearTestData;
window.showTestData = showTestData;
window.generateSpecificTestData = generateSpecificTestData;

console.log('🚀 Script de prueba cargado!');
console.log('Comandos disponibles:');
console.log('  - generateTestData() - Generar todos los datos de prueba');
console.log('  - clearTestData() - Eliminar todos los datos de prueba');
console.log('  - showTestData() - Mostrar datos actuales');
console.log('  - generateSpecificTestData("pets") - Generar solo mascotas');
console.log('  - generateSpecificTestData("appointments") - Generar solo citas');
console.log('  - generateSpecificTestData("notifications") - Generar solo notificaciones'); 