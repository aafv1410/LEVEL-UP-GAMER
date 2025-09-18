let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Array de productos con todos los datos
const products = [
    { name: "Catan", category: "Juegos de Mesa", price: 29990, description: "Un clásico juego de estrategia donde los jugadores compiten por colonizar y expandirse en la isla de Catan. Ideal para 3-4 jugadores y perfecto para noches de juego en familia o con amigos", image: "img/catan.png" },
    { name: "Carcassonne", category: "Juegos de Mesa", price: 24990, description: "Un juego de colocación de fichas donde los jugadores construyen el paisaje alrededor de la fortaleza medieval de Carcassonne. Ideal para 2-5 jugadores y fácil de aprender", image: "img/carcasonne.png" },
    { name: "Controlador Xbox Series X", category: "Accesorios", price: 59990, description: "Ofrece una experiencia de juego cómoda con botones mapeables y una respuesta táctil mejorada. Compatible con consolas Xbox y PC.", image: "img/control.png" },
    { name: "Auriculares Gamer HyperX Cloud II", category: "Accesorios", price: 79990, description: "Proporcionan un sonido envolvente de calidad con un micrófono desmontable y almohadillas de espuma viscoelástica para mayor comodidad durante largas sesiones de juego", image: "img/audifonos.png" },
    { name: "PlayStation 5", category: "Consolas", price: 549990, description: "La consola de última generación de Sony, que ofrece gráficos impresionantes y tiempos de carga ultrarrápidos para una experiencia de juego inmersiva", image: "img/ps55.png" },
    { name: "PC Gamer ASUS ROG Strix", category: "Computadores Gamers", price: 1299990, description: "Un potente equipo diseñado para los gamers más exigentes, equipado con los últimos componentes para ofrecer un rendimiento excepcional en cualquier juego", image: "img/gabinete.png" },
    { name: "Silla Gamer Secretlab Titan", category: "Sillas Gamers", price: 349990, description: "Diseñada para el máximo confort, esta silla ofrece un soporte ergonómico y personalización ajustable para sesiones de juego prolongadas.", image: "img/silla.png" },
    { name: "Mouse Gamer Logitech G502 HERO", category: "Mouse", price: 49990, description: "Con sensor de alta precisión y botones personalizables, este mouse es ideal para gamers que buscan un control preciso y personalización.", image: "img/mouse.png" },
    { name: "Mousepad Razer Goliathus Extended Chroma", category: "Mousepad", price: 29990, description: "Ofrece un área de juego amplia con iluminación RGB personalizable, asegurando una superficie suave y uniforme para el movimiento del mouse.", image: "img/mousepad.jpg" },
    { name: "Polera Gamer Personalizada 'Level-Up'", category: "Poleras Personalizadas", price: 14990, description: "Una camiseta cómoda y estilizada, con la posibilidad de personalizarla con tu gamer tag o diseño favorito.", image: "img/polera.png" },
];

const productListContainer = document.getElementById("product-list");

// Función para renderizar los productos en el DOM
function renderProducts(productsToRender) {
    productListContainer.innerHTML = '';
    productsToRender.forEach(product => {
        const productCardHTML = `
            <div class="col-md-4 product-card" 
                data-category="${product.category}" 
                data-name="${product.name}" 
                data-price="${product.price}" 
                data-description="${product.description}"
                data-image="${product.image}">
                <div class="card h-100 p-3">
                    <img src="${product.image}" class="card-img-top product-image-trigger" alt="${product.name}">
                    <div class="card-body">
                        <h5 class="card-title">${product.name}</h5>
                        <p class="card-text">${product.description}</p>
                        <p class="fw-bold text-success">$${product.price.toLocaleString('es-CL')} CLP</p>
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
                price: parseInt(productCard.getAttribute('data-price'))
            };
            showProductModal(productData);
        });
    });
}

function renderCart() {
    const cartItemsContainer = document.getElementById("cart-items");
    const cartCount = document.getElementById("cart-count");
    const cartTotal = document.getElementById("cart-total");
    cartItemsContainer.innerHTML = "";
    
    let total = 0;
    cart.forEach((item, index) => {
        const subtotal = item.price * item.quantity;
        total += subtotal;

        cartItemsContainer.innerHTML += `
            <tr>
                <td>${item.name}</td>
                <td>
                    <input type="number" min="1" value="${item.quantity}" 
                           class="form-control form-control-sm" 
                           style="width:70px"
                           onchange="updateQuantity(${index}, this.value)">
                </td>
                <td>$${item.price.toLocaleString("es-CL")}</td>
                <td>$${subtotal.toLocaleString("es-CL")}</td>
                <td>
                    <button class="btn btn-danger btn-sm" onclick="removeFromCart(${index})">
                        <i class="bi bi-trash"></i>
                    </button>
                </td>
            </tr>
        `;
    });

    cartCount.textContent = cart.length;
    cartTotal.textContent = "$" + total.toLocaleString("es-CL") + " CLP";
    
    // Guarda el carrito en localStorage
    localStorage.setItem('cart', JSON.stringify(cart));
}

function updateQuantity(index, quantity) {
    cart[index].quantity = parseInt(quantity);
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
}

function removeFromCart(index) {
    cart.splice(index, 1);
    renderCart();
}

document.getElementById("clear-cart").addEventListener("click", () => {
    cart = [];
    renderCart();
});

document.getElementById("searchBar").addEventListener("keyup", function () {
    const searchTerm = this.value.toLowerCase();
    const filteredProducts = products.filter(product => product.name.toLowerCase().includes(searchTerm));
    renderProducts(filteredProducts);
});

function filterCategory(category) {
    const filteredProducts = products.filter(product => category === "all" || product.category === category);
    renderProducts(filteredProducts);
}

// Función para mostrar el modal de detalles del producto
function showProductModal(productData) {
    // Asegúrate de tener los elementos del modal en tu HTML con estos IDs
    const modalTitle = document.getElementById('productModalLabel');
    const modalImage = document.getElementById('productModalImage');
    const modalDescription = document.getElementById('productModalDescription');
    const modalPrice = document.getElementById('productModalPrice');
    const modalAddToCartBtn = document.getElementById('productModalAddToCart');

    modalTitle.textContent = productData.name;
    modalImage.src = productData.imageSrc;
    modalImage.alt = productData.name;
    modalDescription.textContent = productData.description;
    modalPrice.textContent = `$${productData.price.toLocaleString('es-CL')} CLP`;

    // Asocia la función de agregar al carrito con los datos del producto
    modalAddToCartBtn.onclick = () => {
        addToCart(productData.name, productData.price);
        const productModal = new bootstrap.Modal(document.getElementById('productModal'));
        productModal.hide();
    };

    // Muestra el modal
    const productModal = new bootstrap.Modal(document.getElementById('productModal'));
    productModal.show();
}

document.addEventListener("DOMContentLoaded", () => {
    renderProducts(products);
    renderCart(); // Carga el carrito del localStorage al iniciar

    const urlParams = new URLSearchParams(window.location.search);
    const categoryFromUrl = urlParams.get('categoria');

    if (categoryFromUrl) {
        filterCategory(decodeURIComponent(categoryFromUrl));
    }
});