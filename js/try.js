
document.addEventListener("DOMContentLoaded", function () {
    const urlParams = new URLSearchParams(window.location.search);
    const categoriaSeleccionada = urlParams.get('categoria');

    const productos = document.querySelectorAll('.product-card');

    if (categoriaSeleccionada && categoriaSeleccionada !== 'all') {
        productos.forEach(producto => {
            const categoria = producto.getAttribute('data-category');
            if (categoria === categoriaSeleccionada) {
                producto.style.display = 'block';
            } else {
                producto.style.display = 'none';
            }
        });
    } else {
        // Si no hay categoría, o es "all", mostrar todos
        productos.forEach(producto => {
            producto.style.display = 'block';
        });
    }

    // BONUS: mostrar la categoría actual en el título
    const titulo = document.querySelector('h2');
    if (categoriaSeleccionada && titulo) {
        titulo.textContent = "Catálogo de " + categoriaSeleccionada;
    }
});
