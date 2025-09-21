let cart = JSON.parse(localStorage.getItem('cart')) || [];
let userPreferences = JSON.parse(localStorage.getItem('userPreferences')) || { categories: [] };

// Lee los productos desde localStorage. Si está vacío, usa un array de respaldo.
const products = JSON.parse(localStorage.getItem('products')) || [
    { id: "CAT01", name: "Catan", category: "Juegos de Mesa", price: 29990, description: "Un clásico juego de estrategia donde los jugadores compiten por colonizar y expandirse en la isla de Catan. Ideal para 3-4 jugadores y perfecto para noches de juego en familia o con amigos", image: "img/catan.png", stock: 15, stockCritico: 5, manufacturer: 'Kosmos', distributor: 'Devir Iberia' },
    { id: "CAR01", name: "Carcassonne", category: "Juegos de Mesa", price: 24990, description: "Un juego de colocación de fichas donde los jugadores construyen el paisaje alrededor de la fortaleza medieval de Carcassonne. Ideal para 2-5 jugadores y fácil de aprender", image: "img/carcasonne.png", stock: 20, stockCritico: 5, manufacturer: 'Hans im Glück', distributor: 'Devir Iberia' },
    { id: "XBX01", name: "Controlador Xbox Series X", category: "Accesorios", price: 59990, description: "Ofrece una experiencia de juego cómoda con botones mapeables y una respuesta táctil mejorada. Compatible con consolas Xbox y PC.", image: "img/control.png", stock: 10, stockCritico: 3, manufacturer: 'Microsoft', distributor: 'Microplay Chile' },
    { id: "HYP01", name: "Auriculares Gamer HyperX Cloud II", category: "Accesorios", price: 79990, description: "Proporcionan un sonido envolvente de calidad con un micrófono desmontable y almohadillas de espuma viscoelástica para mayor comodidad durante largas sesiones de juego", image: "img/audifonos.png", stock: 8, stockCritico: 2, manufacturer: 'HyperX', distributor: 'HyperX Latam' },
    { id: "PS501", name: "PlayStation 5", category: "Consolas", price: 549990, description: "La consola de última generación de Sony, que ofrece gráficos impresionantes y tiempos de carga ultrarrápidos para una experiencia de juego inmersiva", image: "img/ps55.png", stock: 5, stockCritico: 2, manufacturer: 'Sony Interactive Entertainment', distributor: 'Sony Chile' },
    { id: "PCG01", name: "PC Gamer ASUS ROG Strix", category: "Computadores Gamers", price: 1299990, description: "Un potente equipo diseñado para los gamers más exigentes, equipado con los últimos componentes para ofrecer un rendimiento excepcional en cualquier juego", image: "img/gabinete.png", stock: 3, stockCritico: 1, manufacturer: 'ASUS', distributor: 'ASUS Store Chile' },
    { id: "SGS01", name: "Silla Gamer Secretlab Titan", category: "Sillas Gamers", price: 349990, description: "Diseñada para el máximo confort, esta silla ofrece un soporte ergonómico y personalización ajustable para sesiones de juego prolongadas.", image: "img/silla.png", stock: 12, stockCritico: 3, manufacturer: 'Secretlab', distributor: 'SP Digital' },
    { id: "LOG01", name: "Mouse Gamer Logitech G502 HERO", category: "Mouse", price: 49990, description: "Con sensor de alta precisión y botones personalizables, este mouse es ideal para gamers que buscan un control preciso y personalización.", image: "img/mouse.png", stock: 25, stockCritico: 10, manufacturer: 'Logitech', distributor: 'Logitech Chile' },
    { id: "RAZ01", name: "Mousepad Razer Goliathus Extended Chroma", category: "Mousepad", price: 29990, description: "Ofrece un área de juego amplia con iluminación RGB personalizable, asegurando una superficie suave y uniforme para el movimiento del mouse.", image: "img/mousepad.jpg", stock: 30, stockCritico: 10, manufacturer: 'Razer', distributor: 'Razer Chile' },
    { id: "POL01", name: "Polera Gamer Personalizada 'Level-Up'", category: "Poleras Personalizadas", price: 14990, description: "Una camiseta cómoda y estilizada, con la posibilidad de personalizarla con tu gamer tag o diseño favorito.", image: "img/polera.png", stock: 50, stockCritico: 15, manufacturer: 'Fabricación Local', distributor: 'Level-Up Gamer' },
];

const productListContainer = document.getElementById("product-list");
const recommendedProductsContainer = document.getElementById("recommended-products");


// Función para renderizar los productos en el DOM
function renderProducts(productsToRender) {
    if (!productListContainer) return;
    productListContainer.innerHTML = '';
    productsToRender.forEach(product => {
        const productCardHTML = `
            <div class="col-md-4 product-card"
                data-category="${product.category}"
                data-name="${product.name}"
                data-price="${product.price}"
                data-description="${product.description}"
                data-image="${product.image}"
                data-manufacturer="${product.manufacturer}"
                data-distributor="${product.distributor}">
                <div class="card h-100 p-3">
                    <img src="${product.image}" class="card-img-top product-image-trigger" alt="${product.name}">
                    <div class="card-body d-flex flex-column">
                        <h5 class="card-title">${product.name}</h5>
                        <p class="card-text">${product.description.substring(0, 80)}...</p>
                        <p class="fw-bold text-success mt-auto">$${product.price.toLocaleString('es-CL')} CLP</p>
                        <button class="btn btn-levelup w-100 add-to-cart"
                                data-name="${product.name}"
                                data-price="${product.price}">Agregar al carrito</button>
                    </div>
                </div>
            </div>
        `;
        productListContainer.innerHTML += productCardHTML;
    });
    attachProductEventListeners();
}

function attachProductEventListeners() {
    document.querySelectorAll(".add-to-cart").forEach(button => {
        button.addEventListener("click", () => {
            const name = button.getAttribute("data-name");
            const price = parseInt(button.getAttribute("data-price"));
            addToCart(name, price);
        });
    });

    document.querySelectorAll(".product-image-trigger").forEach(image => {
        image.addEventListener('click', function() {
            const productCard = this.closest('.product-card');
            const productData = {
                name: productCard.getAttribute('data-name'),
                description: productCard.getAttribute('data-description'),
                imageSrc: this.src,
                price: parseInt(productCard.getAttribute('data-price')),
                manufacturer: productCard.getAttribute('data-manufacturer'),
                distributor: productCard.getAttribute('data-distributor')
            };
            // Llama a la función global showProductModal (definida en try.js)
            if (window.showProductModal) {
                window.showProductModal(productData);
            }
        });
    });
}

function renderCart() {
    const cartItemsContainer = document.getElementById("cart-items");
    const cartCount = document.getElementById("cart-count");
    const cartTotal = document.getElementById("cart-total");

    if (!cartItemsContainer) return;

    cartItemsContainer.innerHTML = "";
    let total = 0;
    let totalItems = 0;

    cart.forEach((item, index) => {
        const subtotal = item.price * item.quantity;
        total += subtotal;
        totalItems += item.quantity;

        cartItemsContainer.innerHTML += `
            <tr>
                <td>${item.name}</td>
                <td>
<<<<<<< HEAD
                    <input type="number" min="1" value="${item.quantity}"
                               class="form-control form-control-sm"
                               style="width:70px"
                               onchange="updateQuantity(${index}, this.value)">
=======
                    <input type="number" min="1" value="${item.quantity}" 
                        class="form-control form-control-sm" 
                        style="width:70px"
                        onchange="updateQuantity(${index}, this.value)">
>>>>>>> 33f35ee47487616c4481a3326591e203aea2ba1d
                </td>
                <td>$${item.price.toLocaleString("es-CL")}</td>
                <td>$${subtotal.toLocaleString("es-CL")}</td>
                <td>
                    <button class="btn btn-danger btn-sm" onclick="removeFromCart(${index})">X</button>
                </td>
            </tr>
        `;
    });
    
    
    cartCount.textContent = cart.reduce((acc, item) => acc + item.quantity, 0);
    cartTotal.textContent = "$" + total.toLocaleString("es-CL") + " CLP";
    localStorage.setItem('cart', JSON.stringify(cart));
    
}

function updateQuantity(index, quantity) {
    const newQuantity = parseInt(quantity);
    if (newQuantity > 0) {
        cart[index].quantity = newQuantity;
    } else {
        cart.splice(index, 1);
    }
    renderCart();
}

function addToCart(name, price) {
    const existing = cart.find(item => item.name === name);
    if (existing) {
        existing.quantity++;
    } else {
        cart.push({ name, price, quantity: 1 });
    }
    renderCart();
    // Opcional: Mostrar una pequeña alerta o notificación
    alert(`"${name}" ha sido añadido al carrito.`);
}

function removeFromCart(index) {
    cart.splice(index, 1);
    renderCart();
}

function filterCategory(category) {
    const filteredProducts = products.filter(product => category === "all" || product.category === category);
    renderProducts(filteredProducts);
}

// Función para renderizar las recomendaciones
function renderRecommendations() {
    if (!recommendedProductsContainer || userPreferences.categories.length === 0) {
        if(recommendedProductsContainer) {
             recommendedProductsContainer.innerHTML = '<p>No hay recomendaciones personalizadas por el momento.</p>';
        }
        return;
    }

    const recommended = products.filter(product => userPreferences.categories.includes(product.category));
    
    recommendedProductsContainer.innerHTML = ''; // Limpia el contenedor antes de renderizar
    if (recommended.length > 0) {
        recommended.forEach(product => {
            const productCard = document.createElement('div');
            productCard.className = 'col-md-4 mb-4';
            productCard.innerHTML = `
                <div class="card h-100">
                    <img src="${product.image}" class="card-img-top" alt="${product.name}">
                    <div class="card-body">
                        <h5 class="card-title">${product.name}</h5>
                        <p class="card-text">$${product.price.toLocaleString('es-CL')} CLP</p>
                        <a href="#" class="btn btn-levelup">Ver Producto</a>
                    </div>
                </div>
            `;
            recommendedProductsContainer.appendChild(productCard);
        });
    } else {
        recommendedProductsContainer.innerHTML = '<p>No hay recomendaciones que coincidan con tus preferencias.</p>';
    }
}

// Eventos que se ejecutan cuando el DOM está listo
document.addEventListener("DOMContentLoaded", () => {
    // Renderizar productos en la página de catálogo
    if (document.getElementById("product-list")) {
        renderProducts(products);
    }
    
    // Cargar carrito
    renderCart();

    // Renderizar recomendaciones
    renderRecommendations();

    // Lógica para filtro por categoría desde la URL
    const urlParams = new URLSearchParams(window.location.search);
    const categoryFromUrl = urlParams.get('categoria');
    if (categoryFromUrl) {
        filterCategory(decodeURIComponent(categoryFromUrl));
    }

    // Lógica del buscador
    const searchBar = document.getElementById("searchBar");
    if (searchBar) {
        searchBar.addEventListener("keyup", function () {
            const searchTerm = this.value.toLowerCase();
            const filteredProducts = products.filter(product => product.name.toLowerCase().includes(searchTerm));
            renderProducts(filteredProducts);
        });
    }
    
    // Lógica para vaciar carrito
    const clearCartBtn = document.getElementById("clear-cart");
    if(clearCartBtn){
        clearCartBtn.addEventListener("click", () => {
            if (confirm("¿Estás seguro de que quieres vaciar el carrito?")) {
                cart = [];
                renderCart();
            }
        });
    }
});