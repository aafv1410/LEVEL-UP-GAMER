document.getElementById('contact-form').addEventListener('submit', function(event) {
    event.preventDefault();

    const emailInput = document.getElementById('contact-email');
    const emailError = document.getElementById('email-error');
    const nameInput = document.getElementById('contact-name');

    // Dominios permitidos
    const allowedDomains = ['@duoc.cl', '@profesor.duoc.cl', '@gmail.com'];
    const emailValue = emailInput.value;

    const isValidDomain = allowedDomains.some(domain => emailValue.endsWith(domain));

    if (!isValidDomain) {
        emailError.textContent = 'El correo debe ser @duoc.cl, @profesor.duoc.cl o @gmail.com.';
        return;
    }

    // Si todo es válido
    emailError.textContent = '';
    alert(`Gracias por tu mensaje, ${nameInput.value}. Te responderemos pronto.`);
    
    // Limpiar formulario
    document.getElementById('contact-form').reset();
});