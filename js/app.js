document.addEventListener('DOMContentLoaded', () => {
    const settingsBtn = document.getElementById('settingsBtn');
    const settingsDropdown = document.getElementById('settingsDropdown');

    if (settingsBtn && settingsDropdown) {
        settingsBtn.addEventListener('click', (event) => {
            event.stopPropagation(); // Evita que el clic se propague y cierre el menú inmediatamente
            settingsDropdown.classList.toggle('show');
        });

        // Cierra el menú si se hace clic fuera de él
        window.addEventListener('click', (event) => {
            if (!event.target.matches('#settingsBtn') && !event.target.matches('.settings-btn i')) {
                if (settingsDropdown.classList.contains('show')) {
                    settingsDropdown.classList.remove('show');
                }
            }
        });
    }
});