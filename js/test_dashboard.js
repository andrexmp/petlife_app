// Script de prueba para el dashboard mejorado
// Este script genera datos de ejemplo para probar todas las funcionalidades

function generateTestDashboardData() {
    console.log('🚀 Generando datos de prueba para el dashboard...');
    
    // Generar pacientes de ejemplo si no existen
    const existingPatients = JSON.parse(localStorage.getItem('pacientes')) || [];
    if (existingPatients.length === 0) {
        const testPatients = [
            {
                id: 1,
                nombre: "Molly",
                especie: "Perro",
                raza: "Golden Retriever",
                edad: 3,
                peso: 25,
                propietario: "María González",
                telefono: "555-0101",
                email: "maria@email.com",
                foto: "../img/dog1.jpg",
                fechaRegistro: "2024-01-15"
            },
            {
                id: 2,
                nombre: "Luna",
                especie: "Gato",
                raza: "Siamés",
                edad: 2,
                peso: 4.5,
                propietario: "Carlos Ruiz",
                telefono: "555-0102",
                email: "carlos@email.com",
                foto: "../img/cat1.jpg",
                fechaRegistro: "2024-01-20"
            },
            {
                id: 3,
                nombre: "Buddy",
                especie: "Perro",
                raza: "Labrador",
                edad: 5,
                peso: 30,
                propietario: "Ana Martínez",
                telefono: "555-0103",
                email: "ana@email.com",
                foto: "../img/dog2.jpg",
                fechaRegistro: "2024-01-25"
            },
            {
                id: 4,
                nombre: "Simba",
                especie: "Gato",
                raza: "Persa",
                edad: 1,
                peso: 3.2,
                propietario: "Luis Pérez",
                telefono: "555-0104",
                email: "luis@email.com",
                foto: "../img/avatar.png",
                fechaRegistro: "2024-02-01"
            },
            {
                id: 5,
                nombre: "Rocky",
                especie: "Perro",
                raza: "Bulldog",
                edad: 4,
                peso: 22,
                propietario: "Patricia López",
                telefono: "555-0105",
                email: "patricia@email.com",
                foto: "../img/avatar.png",
                fechaRegistro: "2024-02-05"
            }
        ];
        
        localStorage.setItem('pacientes', JSON.stringify(testPatients));
        console.log('✅ Pacientes de prueba generados:', testPatients.length);
    }

    // Generar citas de ejemplo para los próximos días
    const today = new Date();
    const testAppointments = [
        {
            id: 1,
            patientName: "Molly",
            title: "Consulta general",
            date: formatDate(today),
            time: "09:00",
            duration: 30,
            notes: "Revisión rutinaria y vacunas",
            status: "confirmada"
        },
        {
            id: 2,
            patientName: "Luna",
            title: "Vacunación",
            date: formatDate(addDays(today, 1)),
            time: "14:30",
            duration: 45,
            notes: "Vacuna triple felina",
            status: "confirmada"
        },
        {
            id: 3,
            patientName: "Buddy",
            title: "Control post-operatorio",
            date: formatDate(addDays(today, 2)),
            time: "11:00",
            duration: 60,
            notes: "Revisión después de cirugía",
            status: "confirmada"
        },
        {
            id: 4,
            patientName: "Simba",
            title: "Consulta de emergencia",
            date: formatDate(addDays(today, 3)),
            time: "16:00",
            duration: 30,
            notes: "Problemas digestivos",
            status: "pendiente"
        },
        {
            id: 5,
            patientName: "Rocky",
            title: "Vacunación anual",
            date: formatDate(addDays(today, 5)),
            time: "10:30",
            duration: 45,
            notes: "Vacuna antirrábica y refuerzos",
            status: "confirmada"
        },
        {
            id: 6,
            patientName: "Molly",
            title: "Control de peso",
            date: formatDate(addDays(today, 7)),
            time: "15:00",
            duration: 30,
            notes: "Seguimiento de dieta",
            status: "confirmada"
        },
        // Agregar más citas para hoy para probar las estadísticas
        {
            id: 7,
            patientName: "Luna",
            title: "Revisión dental",
            date: formatDate(today),
            time: "10:30",
            duration: 45,
            notes: "Limpieza dental y revisión",
            status: "confirmada"
        },
        {
            id: 8,
            patientName: "Buddy",
            title: "Vacunación",
            date: formatDate(today),
            time: "16:00",
            duration: 30,
            notes: "Vacuna antirrábica",
            status: "confirmada"
        },
        {
            id: 9,
            patientName: "Simba",
            title: "Consulta general",
            date: formatDate(today),
            time: "17:30",
            duration: 30,
            notes: "Revisión rutinaria",
            status: "confirmada"
        },
        {
            id: 10,
            patientName: "Rocky",
            title: "Control de parásitos",
            date: formatDate(today),
            time: "18:00",
            duration: 30,
            notes: "Desparasitación",
            status: "confirmada"
        },
        {
            id: 11,
            patientName: "Molly",
            title: "Revisión de herida",
            date: formatDate(today),
            time: "19:00",
            duration: 30,
            notes: "Control de herida en pata",
            status: "confirmada"
        }
    ];

    localStorage.setItem('appointments', JSON.stringify(testAppointments));
    console.log('✅ Citas de prueba generadas:', testAppointments.length);

    // Mostrar resumen de datos generados
    console.log('📊 Resumen de datos generados:');
    console.log('- Pacientes:', JSON.parse(localStorage.getItem('pacientes')).length);
    console.log('- Citas:', JSON.parse(localStorage.getItem('appointments')).length);
    
    // Mostrar próximas citas
    const upcomingAppointments = testAppointments.filter(apt => {
        const aptDate = new Date(apt.date);
        const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
        return aptDate >= today && aptDate <= nextWeek;
    });
    
    console.log('- Próximas citas (7 días):', upcomingAppointments.length);
    upcomingAppointments.forEach(apt => {
        console.log(`  • ${apt.patientName} - ${apt.date} ${apt.time} - ${apt.title}`);
    });

    // Mostrar estadísticas
    const todayAppointments = testAppointments.filter(apt => apt.date === formatDate(today));
    console.log('- Citas de hoy:', todayAppointments.length);

    // Mostrar recordatorios que se generarán
    console.log('🔔 Recordatorios que aparecerán:');
    if (todayAppointments.length > 0) {
        console.log('  • Citas urgentes para hoy');
    }
    
    const tomorrowAppointments = testAppointments.filter(apt => apt.date === formatDate(addDays(today, 1)));
    if (tomorrowAppointments.length > 0) {
        console.log('  • Citas programadas para mañana');
    }

    console.log('🎉 ¡Datos de prueba generados exitosamente!');
    console.log('💡 Recarga la página del dashboard para ver los cambios.');
    console.log('🔍 Prueba la búsqueda global escribiendo "Molly" o "consulta"');
    console.log('🌙 Prueba el modo oscuro con el botón de la luna');
    console.log('⚡ Prueba los filtros rápidos para acceso directo');
}

// Funciones auxiliares
function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

function addDays(date, days) {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
}

// Función para limpiar datos de prueba
function clearTestData() {
    console.log('🧹 Limpiando datos de prueba...');
    localStorage.removeItem('pacientes');
    localStorage.removeItem('appointments');
    console.log('✅ Datos de prueba eliminados');
    console.log('💡 Recarga la página para ver el estado vacío.');
}

// Función para mostrar estado actual
function showCurrentState() {
    console.log('📋 Estado actual del dashboard:');
    
    const patients = JSON.parse(localStorage.getItem('pacientes')) || [];
    const appointments = JSON.parse(localStorage.getItem('appointments')) || [];
    
    console.log('- Pacientes registrados:', patients.length);
    console.log('- Citas programadas:', appointments.length);
    
    if (patients.length > 0) {
        console.log('📝 Pacientes:');
        patients.forEach(patient => {
            console.log(`  • ${patient.nombre} (${patient.especie}) - ${patient.propietario}`);
        });
    }
    
    if (appointments.length > 0) {
        console.log('📅 Citas:');
        appointments.forEach(apt => {
            console.log(`  • ${apt.patientName} - ${apt.date} ${apt.time} - ${apt.title}`);
        });
    }
}

// Función para probar búsqueda global
function testSearch(query) {
    console.log(`🔍 Probando búsqueda: "${query}"`);
    const searchInput = document.getElementById('globalSearch');
    if (searchInput) {
        searchInput.value = query;
        searchInput.dispatchEvent(new Event('input'));
        console.log('✅ Búsqueda ejecutada');
    } else {
        console.log('❌ Campo de búsqueda no encontrado');
    }
}

// Función para probar modo oscuro
function testDarkMode() {
    console.log('🌙 Probando modo oscuro...');
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        themeToggle.click();
        console.log('✅ Modo oscuro activado/desactivado');
    } else {
        console.log('❌ Botón de tema no encontrado');
    }
}

// Función para probar filtros rápidos
function testQuickFilter(filterType) {
    console.log(`⚡ Probando filtro: ${filterType}`);
    const filterButton = document.querySelector(`[data-filter="${filterType}"]`);
    if (filterButton) {
        filterButton.click();
        console.log('✅ Filtro ejecutado');
    } else {
        console.log('❌ Filtro no encontrado');
    }
}

// Exportar funciones para uso en consola
window.generateTestDashboardData = generateTestDashboardData;
window.clearTestData = clearTestData;
window.showCurrentState = showCurrentState;
window.testSearch = testSearch;
window.testDarkMode = testDarkMode;
window.testQuickFilter = testQuickFilter;

// Auto-ejecutar si se incluye en la página
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        console.log('🎯 Script de prueba del dashboard cargado');
        console.log('💡 Comandos disponibles:');
        console.log('  - generateTestDashboardData() - Generar datos de prueba');
        console.log('  - testSearch("Molly") - Probar búsqueda');
        console.log('  - testDarkMode() - Probar modo oscuro');
        console.log('  - testQuickFilter("today") - Probar filtros');
        console.log('  - showCurrentState() - Ver estado actual');
        console.log('  - clearTestData() - Limpiar datos');
    });
} else {
    console.log('🎯 Script de prueba del dashboard cargado');
    console.log('💡 Usa generateTestDashboardData() para generar datos de ejemplo');
} 