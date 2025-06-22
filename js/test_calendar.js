// Script de prueba para el calendario de citas
function createSampleAppointments() {
    console.log('📅 Creando citas de ejemplo para probar el calendario...');
    
    const sampleAppointments = [
        {
            id: Date.now() + 1,
            title: "Consulta General",
            patientName: "Luna",
            date: new Date().toISOString().split('T')[0], // Hoy
            time: "10:00",
            notes: "Chequeo anual de rutina"
        },
        {
            id: Date.now() + 2,
            title: "Vacunación",
            patientName: "Molly",
            date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // En 2 días
            time: "14:30",
            notes: "Vacuna antirrábica"
        },
        {
            id: Date.now() + 3,
            title: "Cirugía",
            patientName: "Buddy",
            date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // En 1 semana
            time: "09:00",
            notes: "Esterilización"
        },
        {
            id: Date.now() + 4,
            title: "Control Postoperatorio",
            patientName: "Luna",
            date: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // En 10 días
            time: "16:00",
            notes: "Revisión de heridas"
        },
        {
            id: Date.now() + 5,
            title: "Exámenes de Laboratorio",
            patientName: "Molly",
            date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // En 2 semanas
            time: "11:30",
            notes: "Análisis de sangre completo"
        }
    ];
    
    // Guardar en localStorage
    localStorage.setItem('appointments', JSON.stringify(sampleAppointments));
    
    console.log('✅ Citas de ejemplo creadas:', sampleAppointments.length);
    console.log('📋 Citas creadas:');
    sampleAppointments.forEach((apt, index) => {
        console.log(`${index + 1}. ${apt.title} - ${apt.patientName} - ${apt.date} ${apt.time}`);
    });
    
    // Mostrar notificación
    if (window.showNotification) {
        window.showNotification('Citas de ejemplo creadas exitosamente', 'success', 3000);
    }
    
    // Recargar la página si estamos en la página de citas
    if (window.location.pathname.includes('citas.html')) {
        setTimeout(() => {
            window.location.reload();
        }, 2000);
    }
}

function clearSampleAppointments() {
    console.log('🗑️ Eliminando citas de ejemplo...');
    localStorage.removeItem('appointments');
    console.log('✅ Citas eliminadas');
    
    if (window.showNotification) {
        window.showNotification('Citas eliminadas', 'info', 2000);
    }
    
    // Recargar la página si estamos en la página de citas
    if (window.location.pathname.includes('citas.html')) {
        setTimeout(() => {
            window.location.reload();
        }, 2000);
    }
}

function showCalendarFeatures() {
    console.log('🎯 Funcionalidades del Calendario:');
    console.log('📅 Calendario interactivo con navegación mensual');
    console.log('🎨 Días con citas destacados en verde');
    console.log('📱 Filtros: Todas, Hoy, Esta Semana');
    console.log('👁️ Vista de lista y tarjetas');
    console.log('📊 Estadísticas en tiempo real');
    console.log('➕ Botón para agregar citas rápidamente');
    console.log('🎯 Clic en días para filtrar por fecha específica');
    console.log('📱 Diseño completamente responsive');
}

// Exportar funciones para uso en consola
window.createSampleAppointments = createSampleAppointments;
window.clearSampleAppointments = clearSampleAppointments;
window.showCalendarFeatures = showCalendarFeatures;

console.log('📅 Script de prueba del calendario cargado.');
console.log('💡 Usa createSampleAppointments() para crear citas de ejemplo');
console.log('💡 Usa showCalendarFeatures() para ver las funcionalidades'); 