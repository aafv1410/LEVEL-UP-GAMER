document.addEventListener('DOMContentLoaded', () => {

    // Constantes para los elementos de la página
    const cartSummaryList = document.getElementById('cart-summary-list');
    const totalAmountEl = document.getElementById('total-amount');

    // Botón de "Finalizar Compra"
    const finishPurchaseBtn = document.querySelector('.btn-levelup.btn-lg');
    const form = document.querySelector('form');
    const inputs = form.querySelectorAll('input[required]');

    // Función para formatear el precio como moneda chilena
    function formatPrice(price) {
        return price.toLocaleString('es-CL', {
            currency: 'CLP'
        }).replace('CLP', '').trim();
    }

    // Cargar el carrito desde el localStorage
    const cart = JSON.parse(localStorage.getItem('cart')) || [];

    // Lógica para obtener el descuento del usuario si está logueado
    const loggedInUser = JSON.parse(localStorage.getItem('usuarioLogeado'));
    const descuento = loggedInUser ? loggedInUser.descuento : 0;

    // Lógica para el costo de envío (ejemplo)
    const shippingCost = 5000;

    // Función para renderizar el resumen del carrito en la página de pago
    function renderCartSummary() {
        cartSummaryList.innerHTML = '';
        let subtotal = 0;

        // Renderizar cada producto del carrito
        cart.forEach(item => {
            const precioConDescuento = item.product.price - (item.product.price * (descuento / 100));
            const itemSubtotal = precioConDescuento * item.quantity;
            subtotal += itemSubtotal;

            const listItem = document.createElement('li');
            listItem.className = 'list-group-item d-flex justify-content-between align-items-center bg-secondary';
            listItem.innerHTML = `
                <p class="mb-0 text-white">${item.product.name} x ${item.quantity}</p>
                <p class="mb-0 text-white">$${formatPrice(itemSubtotal)} CLP</p>
            `;
            cartSummaryList.appendChild(listItem);
        });

        // Calcular el total final (subtotal + envío)
        const total = subtotal + shippingCost;

        // Actualizar el total en la página
        totalAmountEl.textContent = `$${formatPrice(total)} CLP`;
    }

    // --- Lógica de Validación de Formulario Mejorada ---

    // Función para mostrar un mensaje de error
    function showError(input, message) {
        // En lugar de usar un span oculto, usamos las clases de Bootstrap
        input.classList.add('is-invalid');
        input.nextElementSibling.textContent = message;
    }

    // Función para ocultar un mensaje de error
    function hideError(input) {
        input.classList.remove('is-invalid');
        input.nextElementSibling.textContent = '';
    }

    // Valida un campo individual con reglas específicas
    function validateField(input) {
        const id = input.id;
        const value = input.value.trim();

        if (value === '') {
            showError(input, 'Este campo es obligatorio.');
            return false;
        }

        switch (id) {
            case 'email':
                // Validación simple de email
                if (!/^\S+@\S+\.\S+$/.test(value)) {
                    showError(input, 'Por favor, ingresa un correo electrónico válido.');
                    return false;
                }
                break;
            case 'cardNumber':
                // Validación de número de tarjeta (solo números, 16 dígitos)
                if (!/^\d{16}$/.test(value.replace(/\s/g, ''))) {
                    showError(input, 'El número de tarjeta debe tener 16 dígitos.');
                    return false;
                }
                break;
            case 'expiryDate':
                // Validación de fecha de expiración (MM/AA)
                if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(value)) {
                    showError(input, 'Formato incorrecto. Usa MM/AA.');
                    return false;
                }
                break;
            case 'cvv':
                // Validación de CVV (3 o 4 dígitos)
                if (!/^\d{3,4}$/.test(value)) {
                    showError(input, 'El CVV debe tener 3 o 4 dígitos.');
                    return false;
                }
                break;
        }

        hideError(input);
        return true;
    }

    // Función para verificar la validez de todo el formulario y habilitar/deshabilitar el botón
    function checkFormValidity() {
        let isFormValid = true;
        inputs.forEach(input => {
            if (!validateField(input)) {
                isFormValid = false;
            }
        });

        finishPurchaseBtn.disabled = !isFormValid;
    }

    // Agrega listeners para validar en tiempo real y verificar la validez del formulario
    inputs.forEach(input => {
        input.addEventListener('input', checkFormValidity);
        input.addEventListener('blur', () => validateField(input));
    });

    // Lógica para enviar el formulario cuando todos los campos son válidos
    form.addEventListener('submit', (event) => {
        event.preventDefault(); // Detiene el envío por defecto
        
        // Se valida una última vez para asegurar
        checkFormValidity();

        if (!finishPurchaseBtn.disabled) {
            // Si el botón no está deshabilitado, la compra es válida.
            alert('¡Compra finalizada con éxito! ✅');

            // Aquí puedes agregar la lógica para limpiar el carrito y redirigir
            localStorage.removeItem('cart');
            window.location.href = 'index.html';
        }
    });

    // Deshabilita el botón al inicio
    finishPurchaseBtn.disabled = true;

    // Llamar a la función para renderizar el resumen del carrito al cargar la página
    renderCartSummary();
});

// Función de logout
function logout() {
    localStorage.removeItem('usuarioLogeado');
    window.location.href = "index.html";
}