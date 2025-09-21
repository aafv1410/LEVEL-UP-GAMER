document.addEventListener('DOMContentLoaded', () => {

    // Constantes para los elementos de la página
    const cartSummaryList = document.getElementById('cart-summary-list');
    const totalAmountEl = document.getElementById('total-amount');

    // Botón de "Finalizar Compra"
    const finishPurchaseBtn = document.getElementById('finishPurchaseBtn');
    const shippingForm = document.getElementById('shippingForm');
    const paymentForm = document.getElementById('paymentForm');

    // Función para formatear el precio como moneda chilena
    function formatPrice(price) {
        return price.toLocaleString('es-CL', {
            currency: 'CLP'
        }).replace('CLP', '').trim();
    }

    // Cargar el carrito y el usuario desde el localStorage
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const loggedInUser = JSON.parse(localStorage.getItem('usuarioLogeado'));
    
    // Lógica para el costo de envío
    const shippingCost = 5000;

    // Función para renderizar el resumen del carrito en la página de pago
    function renderCartSummary() {
        cartSummaryList.innerHTML = '';
        let subtotal = 0;

        if (cart.length === 0) {
            cartSummaryList.innerHTML = `
                <li class="list-group-item d-flex justify-content-between align-items-center bg-secondary text-white">
                    El carrito está vacío.
                </li>
            `;
            totalAmountEl.textContent = `$${formatPrice(0)} CLP`;
            return;
        }

        // Renderizar cada producto del carrito
        cart.forEach(item => {
            const itemSubtotal = item.product.price * item.quantity;
            subtotal += itemSubtotal;

            const listItem = document.createElement('li');
            listItem.className = 'list-group-item d-flex justify-content-between align-items-center bg-secondary text-white';
            listItem.innerHTML = `
                <p class="mb-0 text-white">${item.product.name} x ${item.quantity}</p>
                <p class="mb-0 text-white">$${formatPrice(itemSubtotal)} CLP</p>
            `;
            cartSummaryList.appendChild(listItem);
        });

        // Agregar el subtotal
        const subtotalItem = document.createElement('li');
        subtotalItem.className = 'list-group-item d-flex justify-content-between align-items-center bg-secondary text-white';
        subtotalItem.innerHTML = `
            <p class="mb-0 text-white">Subtotal</p>
            <p class="mb-0 text-white">$${formatPrice(subtotal)} CLP</p>
        `;
        cartSummaryList.appendChild(subtotalItem);

        // Calcular el total inicial 
        let total = subtotal + shippingCost;
        
        // Aplicar el descuento por puntos si existe
        if (loggedInUser && loggedInUser.descuentoCanjeado) {
            const discountItem = document.createElement('li');
            discountItem.className = 'list-group-item d-flex justify-content-between align-items-center bg-secondary text-white';
            discountItem.innerHTML = `
                <p class="mb-0 text-warning">Descuento Canjeado</p>
                <p class="mb-0 text-warning">-$${formatPrice(loggedInUser.descuentoCanjeado)} CLP</p>
            `;
            cartSummaryList.appendChild(discountItem);
            total -= loggedInUser.descuentoCanjeado;
        }

        // Actualizar el total en la página
        totalAmountEl.textContent = `$${formatPrice(total)} CLP`;
    }

    // Lógica para enviar el formulario cuando se hace clic en el botón
    finishPurchaseBtn.addEventListener('click', (event) => {
        event.preventDefault();

        // Agrega la clase de validación de Bootstrap para mostrar los errores
        shippingForm.classList.add('was-validated');
        paymentForm.classList.add('was-validated');

        // Valida ambos formularios
        if (shippingForm.checkValidity() && paymentForm.checkValidity()) {
            alert('¡Compra finalizada con éxito!');

            // Eliminar el descuento canjeado del perfil del usuario
            if (loggedInUser && loggedInUser.descuentoCanjeado) {
                const todosLosUsuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
                const index = todosLosUsuarios.findIndex(user => user.correo === loggedInUser.correo);

                if (index !== -1) {
                    delete todosLosUsuarios[index].descuentoCanjeado;
                    localStorage.setItem('usuarios', JSON.stringify(todosLosUsuarios));
                    localStorage.setItem('usuarioLogeado', JSON.stringify(todosLosUsuarios[index]));
                }
            }
            
            // Limpiar el carrito y redirigir
            localStorage.removeItem('cart');
            window.location.href = 'index.html';
        }
    });

    renderCartSummary();
});

// Función de logout 
function logout() {
    localStorage.removeItem('usuarioLogeado');
    window.location.href = "index.html";
}