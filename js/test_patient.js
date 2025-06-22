// Script de prueba para verificar el funcionamiento del registro y visualización de pacientes
function testPatientRegistration() {
    console.log('🧪 Iniciando prueba de registro de paciente...');
    
    // Crear un paciente de prueba
    const testPatient = {
        id: Date.now(),
        nombre: "Luna",
        especie: "gato",
        genero: "hembra",
        fechaNacimiento: "2022-03-15",
        numeroChip: "CHIP123456",
        vacunas: ["triple", "rabia"],
        observaciones: "Gato doméstico, muy tranquilo",
        foto: "",
        creationDate: new Date().toISOString()
    };
    
    // Guardar en localStorage
    let pacientes = JSON.parse(localStorage.getItem('pacientes')) || [];
    pacientes.push(testPatient);
    localStorage.setItem('pacientes', JSON.stringify(pacientes));
    
    console.log('✅ Paciente de prueba creado:', testPatient);
    console.log('📋 Total de pacientes:', pacientes.length);
    
    // Verificar que se guardó correctamente
    const savedPatients = JSON.parse(localStorage.getItem('pacientes')) || [];
    const foundPatient = savedPatients.find(p => p.id === testPatient.id);
    
    if (foundPatient) {
        console.log('✅ Paciente guardado correctamente en localStorage');
        console.log('🔍 Datos del paciente:', foundPatient);
        
        // Simular navegación a la página de detalles
        const url = `ver_paciente.html?id=${testPatient.id}`;
        console.log('🔗 URL para ver detalles:', url);
        
        // Mostrar notificación de éxito
        if (window.showNotification) {
            window.showNotification('Paciente de prueba creado exitosamente', 'success', 3000);
        }
        
        return testPatient.id;
    } else {
        console.error('❌ Error: No se pudo guardar el paciente');
        return null;
    }
}

function testPatientDisplay(patientId) {
    console.log('🧪 Probando visualización del paciente...');
    
    const patients = JSON.parse(localStorage.getItem('pacientes')) || [];
    const patient = patients.find(p => p.id.toString() === patientId.toString());
    
    if (patient) {
        console.log('✅ Paciente encontrado:', patient);
        
        // Simular la función displayPatientDetails
        const patientDetails = `
            Nombre: ${patient.nombre}
            Especie: ${patient.especie}
            Género: ${patient.genero}
            Fecha de Nacimiento: ${patient.fechaNacimiento}
            Número de Chip: ${patient.numeroChip}
            Vacunas: ${patient.vacunas.join(', ')}
            Observaciones: ${patient.observaciones}
            Fecha de Registro: ${patient.creationDate}
        `;
        
        console.log('📋 Detalles del paciente:');
        console.log(patientDetails);
        
        return true;
    } else {
        console.error('❌ Error: No se encontró el paciente con ID:', patientId);
        return false;
    }
}

// Función para limpiar datos de prueba
function clearTestData() {
    console.log('🧹 Limpiando datos de prueba...');
    localStorage.removeItem('pacientes');
    localStorage.removeItem('appointments');
    console.log('✅ Datos de prueba eliminados');
}

// Función para ejecutar todas las pruebas
function runAllTests() {
    console.log('🚀 Iniciando todas las pruebas...');
    
    // Limpiar datos anteriores
    clearTestData();
    
    // Probar registro
    const patientId = testPatientRegistration();
    
    if (patientId) {
        // Probar visualización
        testPatientDisplay(patientId);
        
        console.log('🎉 Todas las pruebas completadas exitosamente!');
        
        // Mostrar instrucciones
        console.log('📝 Para ver el paciente en la interfaz:');
        console.log(`1. Ve a la página: pages/ver_paciente.html?id=${patientId}`);
        console.log('2. Verifica que se muestren todos los datos correctamente');
    } else {
        console.error('❌ Las pruebas fallaron');
    }
}

// Exportar funciones para uso en consola
window.testPatientRegistration = testPatientRegistration;
window.testPatientDisplay = testPatientDisplay;
window.clearTestData = clearTestData;
window.runAllTests = runAllTests;

console.log('🧪 Script de pruebas cargado. Usa runAllTests() para ejecutar todas las pruebas.'); 