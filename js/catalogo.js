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
    const initialProducts = [{
            id: "CAT01",
            name: "Catan",
            category: "Juegos de Mesa",
            price: 29990,
            description: "Un clásico juego de estrategia donde los jugadores compiten por colonizar y expandirse en la isla de Catan. Ideal para 3-4 jugadores y perfecto para noches de juego en familia o con amigos",
            image: "img/catan.png",
            stock: 15,
            stockCritico: 5,
            rating: 4.5,
            comments: []
        },
        {
            id: "CAR01",
            name: "Carcassonne",
            category: "Juegos de Mesa",
            price: 24990,
            description: "Un juego de colocación de fichas donde los jugadores construyen el paisaje alrededor de la fortaleza medieval de Carcassonne. Ideal para 2-5 jugadores y fácil de aprender",
            image: "img/carcasonne.png",
            stock: 20,
            stockCritico: 5,
            rating: 4.8,
            comments: []
        },
        {
            id: "XBX01",
            name: "Controlador Xbox Series X",
            category: "Accesorios",
            price: 59990,
            description: "Ofrece una experiencia de juego cómoda con botones mapeables y una respuesta táctil mejorada. Compatible con consolas Xbox y PC.",
            image: "img/control.png",
            stock: 10,
            stockCritico: 3,
            rating: 4.2,
            comments: []
        },
        {
            id: "HYP01",
            name: "Auriculares Gamer HyperX Cloud II",
            category: "Accesorios",
            price: 79990,
            description: "Proporcionan un sonido envolvente de calidad con un micrófono desmontable y almohadillas de espuma viscoelástica para mayor comodidad durante largas sesiones de juego",
            image: "img/audifonos.png",
            stock: 8,
            stockCritico: 2,
            rating: 4.7,
            comments: []
        },
        {
            id: "PS501",
            name: "PlayStation 5",
            category: "Consolas",
            price: 549990,
            description: "La consola de última generación de Sony, que ofrece gráficos impresionantes y tiempos de carga ultrarrápidos para una experiencia de juego inmersiva",
            image: "img/ps55.png",
            stock: 5,
            stockCritico: 2,
            rating: 5.0,
            comments: []
        },
        {
            id: "PCG01",
            name: "PC Gamer ASUS ROG Strix",
            category: "Computadores Gamers",
            price: 1299990,
            description: "Un potente equipo diseñado para los gamers más exigentes, equipado con los últimos componentes para ofrecer un rendimiento excepcional en cualquier juego",
            image: "img/gabinete.png",
            stock: 3,
            stockCritico: 1,
            rating: 4.9,
            comments: []
        },
        {
            id: "SGS01",
            name: "Silla Gamer Secretlab Titan",
            category: "Sillas Gamers",
            price: 349990,
            description: "Diseñada para el máximo confort, esta silla ofrece un soporte ergonómico y personalización ajustable para sesiones de juego prolongadas.",
            image: "img/silla.png",
            stock: 12,
            stockCritico: 3,
            rating: 4.6,
            comments: []
        },
        {
            id: "LOG01",
            name: "Mouse Gamer Logitech G502 HERO",
            category: "Mouse",
            price: 49990,
            description: "Con sensor de alta precisión y botones personalizables, este mouse es ideal para gamers que buscan un control preciso y personalización.",
            image: "img/mouse.png",
            stock: 25,
            stockCritico: 10,
            rating: 4.5,
            comments: []
        },
        {
            id: "RAZ01",
            name: "Mousepad Razer Goliathus Extended Chroma",
            category: "Mousepad",
            price: 29990,
            description: "Ofrece un área de juego amplia con iluminación RGB personalizable, asegurando una superficie suave y uniforme para el movimiento del mouse.",
            image: "img/mousepad.jpg",
            stock: 30,
            stockCritico: 10,
            rating: 4.3,
            comments: []
        },
        {
            id: "POL01",
            name: "Polera Gamer Personalizada 'Level-Up'",
            category: "Poleras Personalizadas",
            price: 14990,
            description: "Una camiseta cómoda y estilizada, con la posibilidad de personalizarla con tu gamer tag o diseño favorito.",
            image: "img/polera.png",
            stock: 50,
            stockCritico: 15,
            rating: 4.0,
            comments: []
        },
    ];

    let productos = JSON.parse(localStorage.getItem('productos'));
    if (!productos) {
        productos = initialProducts;
        localStorage.setItem('productos', JSON.stringify(productos));
    }


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
        return price.toLocaleString('es-CL', {
            currency: 'CLP'
        }).replace('CLP', '').trim();
    }

    // Función para renderizar estrellas estáticas en las tarjetas de productos
    function renderStars(rating) {
        let starsHtml = '';
        const roundedRating = Math.round(rating);
        
        for (let i = 1; i <= 5; i++) {
            if (i <= roundedRating) {
                starsHtml += '<i class="fas fa-star text-warning"></i>'; // Estrella llena
            } else {
                starsHtml += '<i class="far fa-star text-warning"></i>'; // Estrella vacía
            }
        }
        return starsHtml;
    }

    function renderProducts(productsToRender) {
        productListEl.innerHTML = '';
        productsToRender.forEach(product => {
            const productCard = document.createElement('div');
            productCard.className = 'col-sm-6 col-md-4 col-lg-3';
            productCard.dataset.productId = product.id;

            let precioOriginal = product.price;
            let precioFinal = precioOriginal;
            let precioHTML = `<p class="fw-bold text-success">$${formatPrice(precioFinal)} CLP</p>`;

            if (descuento > 0) {
                precioFinal = precioOriginal - (precioOriginal * (descuento / 100));
                precioHTML = `
                    <p class="fw-bold text-success m-0">
                        <del class="text-secondary fw-normal me-2">$${formatPrice(precioOriginal)} CLP</del> 
                        $${formatPrice(precioFinal)} CLP
                    </p>
                    <span class="badge bg-warning text-dark">- ${descuento}%</span>
                `;
            }

            let stockBadge = '';
            if (product.stock <= product.stockCritico) {
                stockBadge = `<span class="badge bg-danger position-absolute top-0 start-0 m-2">Poco stock</span>`;
            }

            productCard.innerHTML = `
                <div class="card h-100 bg-dark text-white shadow-sm product-card">
                    ${stockBadge}
                    <img src="${product.image}" class="card-img-top p-3" alt="${product.name}">
                    <div class="card-body d-flex flex-column">
                        <h5 class="card-title">${product.name}</h5>
                        <div class="text-center mb-2">${renderStars(product.rating)}</div>
                        <p class="card-text">${product.description.substring(0, 50)}...</p>
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

    function removeFromCart(productId) {
        const item = cart.find(item => item.product.id === productId);
        if (item) {
            if (item.quantity > 1) {
                item.quantity--;
            } else {
                cart = cart.filter(item => item.product.id !== productId);
            }
        }
        updateCartCount();
        renderCart();
    }

    function renderCart() {
        cartItemsEl.innerHTML = '';
        let total = 0;

        cart.forEach(item => {
            // Se calcula el precio unitario con el descuento
            const precioConDescuento = item.product.price - (item.product.price * (descuento / 100));
            const subtotal = precioConDescuento * item.quantity;
            total += subtotal;

            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${item.product.name}</td>
                <td>${item.quantity}</td>
                <td>$${formatPrice(precioConDescuento)} CLP</td>
                <td>$${formatPrice(subtotal)} CLP</td>
                <td>
                    <button class="btn btn-sm btn-danger remove-item" data-product-id="${item.product.id}">
                        <i class="fas fa-minus-circle"></i> Eliminar uno
                    </button>
                </td>
            `;
            cartItemsEl.appendChild(row);
        });

        cartTotalEl.textContent = `$${formatPrice(total)} CLP`;
    }

    function addToCart(productId) {
        const product = productos.find(p => p.id === productId);
        if (product) {
            const existingItem = cart.find(item => item.product.id === productId);
            if (existingItem) {
                existingItem.quantity++;
            } else {
                cart.push({
                    product,
                    quantity: 1
                });
            }
            updateCartCount();
            renderCart();
        }
    }

    // LÓGICA DE VALORACIONES INTERACTIVAS Y COMENTARIOS
    let currentProductId = null;
    let selectedRating = 0;

    document.getElementById('productModal').addEventListener('show.bs.modal', (event) => {
        const button = event.relatedTarget;
        const productId = button.dataset.productId;
        currentProductId = productId;
        const product = productos.find(p => p.id === productId);
        const modalAddToCartBtn = document.getElementById('modal-add-to-cart');

        if (product) {
            const modalTitle = document.getElementById('productModalLabel');
            const modalImage = document.getElementById('modal-product-image');
            const modalDescription = document.getElementById('modal-product-description');
            const modalPrice = document.getElementById('modal-product-price');
            const modalStarsContainer = document.getElementById('rating-stars');
            const commentsSection = document.getElementById('comments-section');

            modalTitle.textContent = product.name;
            modalImage.src = product.image;
            modalDescription.textContent = product.description;
            modalAddToCartBtn.dataset.productId = product.id;

            let precioOriginal = product.price;
            let precioFinal = precioOriginal;
            let precioHTML = `$${formatPrice(precioFinal)} CLP`;

            if (descuento > 0) {
                precioFinal = precioOriginal - (precioOriginal * (descuento / 100));
                precioHTML = `<del class="text-secondary me-2">$${formatPrice(precioOriginal)} CLP</del> $${formatPrice(precioFinal)} CLP`;
            }

            modalPrice.innerHTML = precioHTML;
            modalAddToCartBtn.onclick = () => addToCart(product.id);

            // Cargar y mostrar estrellas interactivas en el modal
            modalStarsContainer.innerHTML = '';
            for (let i = 1; i <= 5; i++) {
                const star = document.createElement('span');
                star.className = `star`;
                star.dataset.value = i;
                star.innerHTML = '★';
                modalStarsContainer.appendChild(star);
            }
            const stars = modalStarsContainer.querySelectorAll('.star');

            // Marcar las estrellas según el rating del producto (en el modal)
            const productRating = product.rating || 0;
            stars.forEach(star => {
                if (parseInt(star.dataset.value) <= Math.round(productRating)) {
                    star.classList.add('selected');
                } else {
                    star.classList.remove('selected');
                }
            });

            // Lógica para manejar el hover y el click de las estrellas
            stars.forEach(star => {
                star.addEventListener('mouseover', () => {
                    const ratingValue = parseInt(star.dataset.value);
                    stars.forEach(s => {
                        if (parseInt(s.dataset.value) <= ratingValue) {
                            s.classList.add('hover');
                        } else {
                            s.classList.remove('hover');
                        }
                    });
                });

                star.addEventListener('mouseout', () => {
                    stars.forEach(s => s.classList.remove('hover'));
                });

                // Al hacer clic, solo se guarda el valor seleccionado
                star.addEventListener('click', () => {
                    selectedRating = parseInt(star.dataset.value);
                    stars.forEach(s => {
                        if (parseInt(s.dataset.value) <= selectedRating) {
                            s.classList.add('selected');
                        } else {
                            s.classList.remove('selected');
                        }
                    });
                });
            });

            // Lógica para comentarios
            renderComments(product.comments, commentsSection);

            document.getElementById('comment-form').onsubmit = (e) => {
                e.preventDefault();
                const author = document.getElementById('comment-author').value;
                const text = document.getElementById('comment-text').value;

                if (author && text && selectedRating > 0) {
                    const newComment = {
                        author,
                        text,
                        date: new Date().toLocaleDateString(),
                        rating: selectedRating // Se guarda la calificación junto al comentario
                    };

                    const productIndex = productos.findIndex(p => p.id === currentProductId);
                    if (productIndex > -1) {
                        const productToUpdate = productos[productIndex];
                        productToUpdate.comments.push(newComment);

                        // Recalcular la calificación del producto como el promedio de todas las calificaciones
                        const totalRatings = productToUpdate.comments.reduce((sum, comment) => sum + comment.rating, 0);
                        productToUpdate.rating = totalRatings / productToUpdate.comments.length;

                        // Guardar la lista de productos actualizada en localStorage
                        localStorage.setItem('productos', JSON.stringify(productos));
                    }
                    
                    alert(`¡Gracias por tu valoración y comentario! Has calificado este producto con ${selectedRating} estrellas.`);
                    
                    renderComments(product.comments, commentsSection);
                    document.getElementById('comment-form').reset();
                    selectedRating = 0; // Reiniciar la calificación seleccionada

                    // Volver a renderizar las tarjetas de productos para que muestren la nueva calificación
                    let productosAmostrar = productos;
                    const urlParams = new URLSearchParams(window.location.search);
                    const categoryFilter = urlParams.get('category');
                    if (categoryFilter) {
                        productosAmostrar = productos.filter(p => p.category.toLowerCase() === categoryFilter.toLowerCase());
                    }
                    renderProducts(productosAmostrar);
                } else {
                    alert('Por favor, ingresa tu nombre, tu comentario y selecciona una cantidad de estrellas.');
                }
            };
        }
    });
    
    function renderComments(comments, container) {
        container.innerHTML = '';
        if (comments.length === 0) {
            container.innerHTML = '<p class="text-muted">No hay comentarios aún.</p>';
            return;
        }

        comments.forEach(comment => {
            const commentEl = document.createElement('div');
            commentEl.className = 'card bg-secondary text-white mb-2';
            commentEl.innerHTML = `
                <div class="card-body">
                    <h6 class="card-title mb-1">${comment.author} <small class="text-muted float-end">${comment.date}</small></h6>
                    <div class="mb-2">${renderStars(comment.rating)}</div>
                    <p class="card-text">${comment.text}</p>
                </div>
            `;
            container.appendChild(commentEl);
        });
    }

    // Filtro de búsqueda en tiempo real
    searchBar.addEventListener('keyup', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        const filteredProducts = productos.filter(product => {
            return product.name.toLowerCase().includes(searchTerm) ||
                product.category.toLowerCase().includes(searchTerm);
        });
        renderProducts(filteredProducts);
    });

    // Vaciar carrito
    clearCartBtn.addEventListener('click', () => {
        cart = [];
        updateCartCount();
        renderCart();
    });

    // Lógica para el filtro de categoría desde la URL
    const urlParams = new URLSearchParams(window.location.search);
    const categoryFilter = urlParams.get('category');

    let productosAmostrar = productos;
    if (categoryFilter) {
        productosAmostrar = productos.filter(product => product.category.toLowerCase() === categoryFilter.toLowerCase());
    }

    // Escuchar clics en los botones de "Eliminar" del carrito
    document.addEventListener('click', (e) => {
        if (e.target.closest('.remove-item')) {
            const button = e.target.closest('.remove-item');
            const productId = button.dataset.productId;
            removeFromCart(productId);
        }
    });

    // Renderizado inicial
    renderProducts(productosAmostrar);
    updateCartCount();
    renderCart();
});

// Función de logout
function logout() {
    localStorage.removeItem('usuarioLogeado');
    window.location.href = "index.html";
}