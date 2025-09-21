// Simula la base de datos de productos usando el mismo array de la tienda
let products = JSON.parse(localStorage.getItem('products')) || [
    { id: "CAT01", name: "Catan", category: "Juegos de Mesa", price: 29990, description: "Un clásico juego de estrategia...", image: "img/catan.png", stock: 15, stockCritico: 5, rating: 4.8, comments: [] },
    { id: "CAR01", name: "Carcassonne", category: "Juegos de Mesa", price: 24990, description: "Un juego de colocación de fichas...", image: "img/carcasonne.png", stock: 20, stockCritico: 5, rating: 4.6, comments: [] },
    { id: "XBX01", name: "Controlador Xbox Series X", category: "Accesorios", price: 59990, description: "Ofrece una experiencia de juego cómoda...", image: "img/control.png", stock: 10, stockCritico: 3, rating: 4.9, comments: [] },
    { id: "GBC01", name: "Gabinete PC Gamer", category: "Computadores Gamers", price: 99990, description: "Un potente equipo diseñado para los gamers...", image: "img/gabinete.png", stock: 3, stockCritico: 1, rating: 4.9, comments: [] },
    { id: "SGS01", name: "Silla Gamer Secretlab Titan", category: "Sillas Gamers", price: 349990, description: "Diseñada para el máximo confort...", image: "img/silla.png", stock: 12, stockCritico: 3, rating: 4.6, comments: [] },
    { id: "LOG01", name: "Mouse Gamer Logitech G502 HERO", category: "Mouse", price: 45000, description: "Un mouse de alto rendimiento con sensores HERO...", image: "img/mouse.png", stock: 25, stockCritico: 5, rating: 4.7, comments: [] },
    { id: "LOGM01", name: "Mouse Pad Logitech", category: "Mousepad", price: 15000, description: "Mouse pad de gran tamaño...", image: "img/mousepad.png", stock: 18, stockCritico: 4, rating: 4.5, comments: [] },
    { id: "PS501", name: "Consola PlayStation 5", category: "Consolas", price: 599990, description: "La última consola de Sony...", image: "img/ps5.png", stock: 5, stockCritico: 2, rating: 5.0, comments: [] },
];
const productForm = document.getElementById('product-form');
const productTableBody = document.getElementById('product-list-admin');
const formTitle = document.getElementById('form-title');
const productIdField = document.getElementById('product-id');
const cancelEditBtn = document.getElementById('cancel-edit');
// Función para renderizar los productos en la tabla
function renderProducts() {
    productTableBody.innerHTML = '';
    products.forEach((product, index) => {
        const row = document.createElement('tr');
        // Alerta si el stock es bajo
        const stockClass = product.stock <= product.stockCritico ? 'text-danger fw-bold' : '';
        
        row.innerHTML = `
            <td>${product.id}</td>
            <td>${product.name}</td>
            <td>$${product.price.toLocaleString('es-CL')}</td>
            <td class="${stockClass}">${product.stock} ${product.stock <= product.stockCritico ? '(Stock Bajo!)' : ''}</td>
            <td>${product.category}</td>
            <td>
                <button class="btn btn-warning btn-sm" onclick="editProduct(${index})">Editar</button>
                <button class="btn btn-danger btn-sm" onclick="deleteProduct(${index})">Eliminar</button>
            </td>
        `;
        productTableBody.appendChild(row);
    });
}

// Guardar en LocalStorage
function saveProducts() {
    localStorage.setItem('products', JSON.stringify(products));
}

// Lógica del formulario
productForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Validar precio y stock
    const precio = parseFloat(document.getElementById('precio').value);
    const stock = parseInt(document.getElementById('stock').value);

    if (precio < 0) {
        alert('El precio no puede ser negativo.');
        return;
    }
    if (stock < 0) {
        alert('El stock no puede ser negativo.');
        return;
    }

    const productData = {
        id: document.getElementById('codigo').value,
        name: document.getElementById('nombre').value,
        description: document.getElementById('descripcion').value,
        price: precio,
        stock: stock,
        stockCritico: parseInt(document.getElementById('stock-critico').value) || 0,
        category: document.getElementById('categoria').value,
        image: document.getElementById('imagen').value || 'img/default.png'
    };

    const id = productIdField.value;
    if (id) {
        const index = parseInt(id);
        products[index] = { ...products[index], ...productData }; // Conservar la calificación y comentarios
    } else {
        // Validar que el código no se repita
        if (products.some(p => p.id === productData.id)) {
            alert('Error: El código del producto ya existe.');
            return;
        }
        products.push({ ...productData, rating: 0, comments: [] });
    }
    
    saveProducts();
    renderProducts();
    resetForm();
});

// Función para cargar datos de un producto en el formulario para editar
function editProduct(index) {
    const product = products[index];
    formTitle.textContent = 'Editar Producto';
    productIdField.value = index;
    
    document.getElementById('codigo').value = product.id;
    document.getElementById('codigo').disabled = true; 
    document.getElementById('nombre').value = product.name;
    document.getElementById('descripcion').value = product.description;
    document.getElementById('precio').value = product.price;
    document.getElementById('stock').value = product.stock;
    document.getElementById('stock-critico').value = product.stockCritico;
    document.getElementById('categoria').value = product.category;
    document.getElementById('imagen').value = product.image;
    
    cancelEditBtn.style.display = 'inline-block';
    window.scrollTo(0, 0); 
}

// Función para eliminar un producto
function deleteProduct(index) {
    if (confirm(`¿Estás seguro de que quieres eliminar el producto "${products[index].name}"?`)) {
        products.splice(index, 1);
        saveProducts();
        renderProducts();
    }
}

// Función para limpiar el formulario
function resetForm() {
    productForm.reset();
    formTitle.textContent = 'Nuevo Producto';
    productIdField.value = '';
    document.getElementById('codigo').disabled = false;
    cancelEditBtn.style.display = 'none';
}

// Evento para el botón de cancelar edición
cancelEditBtn.addEventListener('click', resetForm);
document.addEventListener('DOMContentLoaded', () => {
    renderProducts();
    resetForm();
});