document.addEventListener('DOMContentLoaded', () => {
    // --- LÓGICA COMPARTIDA PARA GESTIÓN DE SESIÓN Y VISTA DEL NAVBAR ---
    const navMiCuenta = document.getElementById('nav-mi-cuenta');
    const navIniciarSesion = document.getElementById('nav-iniciar-sesion');
    const navRegistrarse = document.getElementById('nav-registrarse');
    const navPuntosContainer = document.getElementById('nav-puntos-container');

    const usuarioLogeado = JSON.parse(localStorage.getItem('usuarioLogeado'));

    function actualizarNavbar() {
        if (usuarioLogeado) {
            if (navMiCuenta) navMiCuenta.style.display = 'block';
            if (navIniciarSesion) navIniciarSesion.style.display = 'none';
            if (navRegistrarse) navRegistrarse.style.display = 'none';
            if (navPuntosContainer) navPuntosContainer.style.display = 'block';

            const navUserPointsEl = document.getElementById('nav-user-points');
            if (navUserPointsEl && usuarioLogeado.puntos !== undefined) {
                navUserPointsEl.textContent = usuarioLogeado.puntos;
            }
        } else {
            if (navMiCuenta) navMiCuenta.style.display = 'none';
            if (navIniciarSesion) navIniciarSesion.style.display = 'block';
            if (navRegistrarse) navRegistrarse.style.display = 'block';
            if (navPuntosContainer) navPuntosContainer.style.display = 'none';
        }
    }
    actualizarNavbar();

    // --- DATOS DE PRODUCTOS ---
    const productos = [
        {
            id: 1,
            nombre: 'Control Xbox Series X',
            precio: 55990,
            categoria: 'Accesorios',
            imagen: 'img/control.png',
            descripcion: 'El mando inalámbrico de Xbox de color Carbón cuenta con superficies esculpidas y una geometría refinada para una mayor comodidad mientras juegas.'
        },
        {
            id: 2,
            nombre: 'Consola Xbox Series X',
            precio: 499990,
            categoria: 'Consolas',
            imagen: 'img/xbox.png',
            descripcion: 'La Xbox más rápida y potente. La Xbox Series X te permite disfrutar de miles de títulos de cuatro generaciones de consolas.'
        },
        {
            id: 3,
            nombre: 'Consola PlayStation 5',
            precio: 629990,
            categoria: 'Consolas',
            imagen: 'img/ps5.png',
            descripcion: 'La consola PS5 abre un mundo de nuevas posibilidades de juego que jamás habías imaginado. Disfruta de una velocidad de carga ultrarrápida.'
        },
        {
            id: 4,
            nombre: 'Silla Gamer',
            precio: 149990,
            categoria: 'Sillas Gamers',
            imagen: 'img/silla_gamer.png',
            descripcion: 'Esta silla es la más vendida de su clase. Cuenta con un diseño ergonómico, reclinable, y un cojín lumbar y reposacabezas ajustable.'
        },
        {
            id: 5,
            nombre: 'Mouse Logitech G PRO X',
            precio: 99990,
            categoria: 'Mouse',
            imagen: 'img/mouse.png',
            descripcion: 'Logitech G PRO X SUPERLIGHT es el mouse inalámbrico PRO más ligero de la historia, diseñado en colaboración con los mejores profesionales de los esports.'
        },
        {
            id: 6,
            nombre: 'Teclado HyperX Alloy Origins Core',
            precio: 89990,
            categoria: 'Accesorios',
            imagen: 'img/teclado.png',
            descripcion: 'El teclado mecánico HyperX Alloy Origins Core es un teclado ultracompacto y robusto, con interruptores mecánicos diseñados para brindar a los jugadores la mejor combinación de estilo, rendimiento y confiabilidad.'
        },
        {
            id: 7,
            nombre: 'Juego de Mesa Catan',
            precio: 29990,
            categoria: 'Juegos de Mesa',
            imagen: 'img/catan.png',
            descripcion: 'En CATÁN, los jugadores intentan ser la fuerza dominante en la isla de Catán construyendo asentamientos, ciudades y carreteras.'
        },
        {
            id: 8,
            nombre: 'Polera Personalizada',
            precio: 15000,
            categoria: 'Poleras Personalizadas',
            imagen: 'img/polera.png',
            descripcion: 'Polera personalizada de tu videojuego, película o serie favorita. ¡Muestra al mundo tu pasión!'
        }
    ];

    // --- LÓGICA DEL CATÁLOGO ---
    const productListEl = document.getElementById('product-list');
    const searchBar = document.getElementById('searchBar');
    const cartCountEl = document.getElementById('cart-count');
    const cartItemsEl = document.getElementById('cart-items');
    const cartTotalEl = document.getElementById('cart-total');
    const clearCartBtn = document.getElementById('clear-cart');

    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    let loggedInUser = JSON.parse(localStorage.getItem('usuarioLogeado'));
    const descuento = loggedInUser ? loggedInUser.descuento : 0;

    function formatPrice(price) {
        return `$${price.toLocaleString('es-CL', { style: 'currency', currency: 'CLP' }).replace('CLP', '').trim()}`;
    }

    function renderProducts(productsToRender) {
        productListEl.innerHTML = '';
        productsToRender.forEach(product => {
            const productCard = document.createElement('div');
            productCard.className = 'col-sm-6 col-md-4 col-lg-3';
            productCard.dataset.productId = product.id;

            let precioOriginal = product.precio;
            let precioFinal = precioOriginal;
            let precioHTML = `<p class="fw-bold text-success">${formatPrice(precioFinal)} CLP</p>`;

            if (descuento > 0) {
                precioFinal = precioOriginal - (precioOriginal * (descuento / 100));
                precioHTML = `
                    <p class="fw-bold text-success m-0">
                        <del class="text-secondary fw-normal me-2">${formatPrice(precioOriginal)} CLP</del> 
                        ${formatPrice(precioFinal)} CLP
                    </p>
                    <span class="badge bg-warning text-dark">- ${descuento}%</span>
                `;
            }

            productCard.innerHTML = `
                <div class="card h-100 bg-dark text-white shadow-sm product-card">
                    <img src="${product.imagen}" class="card-img-top p-3" alt="${product.nombre}">
                    <div class="card-body d-flex flex-column">
                        <h5 class="card-title">${product.nombre}</h5>
                        <p class="card-text">${product.descripcion.substring(0, 50)}...</p>
                        ${precioHTML}
                        <button class="btn btn-levelup mt-auto" data-bs-toggle="modal" data-bs-target="#productModal" data-product-id="${product.id}">Ver Detalle</button>
                    </div>
                </div>
            `;
            productListEl.appendChild(productCard);
        });
    }

    function updateCartCount() {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCountEl.textContent = totalItems;
        localStorage.setItem('cart', JSON.stringify(cart));
    }

    function renderCart() {
        cartItemsEl.innerHTML = '';
        let total = 0;

        cart.forEach(item => {
            const itemPrice = item.product.precio;
            const subtotal = itemPrice * item.quantity;
            total += subtotal;

            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${item.product.nombre}</td>
                <td>${item.quantity}</td>
                <td>${formatPrice(itemPrice)} CLP</td>
                <td>${formatPrice(subtotal)} CLP</td>
            `;
            cartItemsEl.appendChild(row);
        });

        cartTotalEl.textContent = formatPrice(total) + " CLP";
    }

    function addToCart(productId) {
        const product = productos.find(p => p.id === productId);
        if (product) {
            const existingItem = cart.find(item => item.product.id === productId);
            if (existingItem) {
                existingItem.quantity++;
            } else {
                cart.push({ product, quantity: 1 });
            }
            updateCartCount();
            renderCart();
        }
    }

    // Abrir modal de producto
    document.addEventListener('click', (event) => {
        if (event.target.matches('[data-bs-toggle="modal"][data-product-id]')) {
            const productId = parseInt(event.target.dataset.productId);
            const product = productos.find(p => p.id === productId);
            if (product) {
                const modalTitle = document.getElementById('productModalLabel');
                const modalImage = document.getElementById('modal-product-image');
                const modalDescription = document.getElementById('modal-product-description');
                const modalPrice = document.getElementById('modal-product-price');
                const modalAddToCartBtn = document.getElementById('modal-add-to-cart');

                modalTitle.textContent = product.nombre;
                modalImage.src = product.imagen;
                modalDescription.textContent = product.descripcion;
                modalAddToCartBtn.dataset.productId = product.id;

                let precioOriginal = product.precio;
                let precioFinal = precioOriginal;
                let precioHTML = `${formatPrice(precioFinal)} CLP`;

                if (descuento > 0) {
                    precioFinal = precioOriginal - (precioOriginal * (descuento / 100));
                    precioHTML = `<del class="text-secondary me-2">${formatPrice(precioOriginal)} CLP</del> ${formatPrice(precioFinal)} CLP`;
                }

                modalPrice.innerHTML = precioHTML;
                modalAddToCartBtn.onclick = () => addToCart(product.id);
            }
        }
    });

    // Filtro de búsqueda
    searchBar.addEventListener('keyup', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        const filteredProducts = productos.filter(product => {
            return product.nombre.toLowerCase().includes(searchTerm) ||
                product.categoria.toLowerCase().includes(searchTerm);
        });
        renderProducts(filteredProducts);
    });

    // Vaciar carrito
    clearCartBtn.addEventListener('click', () => {
        cart = [];
        updateCartCount();
        renderCart();
    });

    // Renderizado inicial
    renderProducts(productos);
    updateCartCount();
    renderCart();
});

// Función de logout
function logout() {
    localStorage.removeItem('usuarioLogeado');
    window.location.href = "index.html";
}