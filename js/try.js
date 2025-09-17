document.addEventListener('DOMContentLoaded', () => {

    const productModal = new bootstrap.Modal(document.getElementById('productModal'));
    const modalTitle = document.getElementById('productModalLabel');
    const modalImage = document.getElementById('modal-product-image');
    const modalDescription = document.getElementById('modal-product-description');
    const modalPrice = document.getElementById('modal-product-price');
    const modalAddToCartButton = document.getElementById('modal-add-to-cart');

    const ratingStars = document.getElementById('rating-stars');
    const commentsSection = document.getElementById('comments-section');
    const commentForm = document.getElementById('comment-form');
    const commentAuthor = document.getElementById('comment-author');
    const commentText = document.getElementById('comment-text');

    let currentProductName = null;
    let userTempRating = 0;

    // **NUEVA FUNCIÓN:** para mostrar el modal de un producto específico
    window.showProductModal = function(productData) {
        currentProductName = productData.name;
        
        modalTitle.textContent = productData.name;
        modalImage.src = productData.imageSrc;
        modalDescription.textContent = productData.description;
        modalPrice.textContent = `$${productData.price.toLocaleString('es-CL')} CLP`;
        
        modalAddToCartButton.setAttribute('data-name', productData.name);
        modalAddToCartButton.setAttribute('data-price', productData.price);

        renderCommentsAndRating();
        productModal.show();
    };

    modalAddToCartButton.addEventListener('click', function() {
        const name = this.getAttribute('data-name');
        const price = parseInt(this.getAttribute('data-price'));
        
        if (typeof addToCart === 'function') {
            addToCart(name, price);
        } else {
            console.error("Función 'addToCart' no encontrada. Asegúrate de que 'productos.js' se carga antes que 'try.js'.");
        }
        productModal.hide();
    });

    // Lógica para comentarios y calificaciones (mismo código)
    ratingStars.addEventListener('click', function(e) {
        if (e.target.classList.contains('star')) {
            const value = parseInt(e.target.getAttribute('data-value'));
            userTempRating = value;
            updateStarDisplay(value);
        }
    });

    commentForm.addEventListener('submit', function(event) {
        event.preventDefault();
        if (!commentAuthor.value || !commentText.value || userTempRating === 0) {
            alert('Por favor, ingresa tu nombre, comentario y selecciona una calificación.');
            return;
        }

        const comments = loadComments(currentProductName);
        const newComment = {
            author: commentAuthor.value,
            text: commentText.value,
            rating: userTempRating,
            date: new Date().toISOString()
        };
        comments.push(newComment);
        saveComments(currentProductName, comments);
        
        commentForm.reset();
        userTempRating = 0;
        updateStarDisplay(0);

        renderCommentsAndRating();
    });

    function renderCommentsAndRating() {
        const comments = loadComments(currentProductName);
        const avgRating = calculateAverageRating(comments);
        updateStarDisplay(avgRating);

        commentsSection.innerHTML = '';
        if (comments.length === 0) {
            commentsSection.innerHTML = '<p class="text-center text-muted">Aún no hay comentarios. Sé el primero en opinar.</p>';
        } else {
            comments.forEach(comment => {
                const commentDiv = document.createElement('div');
                commentDiv.classList.add('card', 'bg-dark', 'text-white-50', 'mb-2');
                commentDiv.innerHTML = `
                    <div class="card-body">
                        <h6 class="card-title mb-0">${comment.author}</h6>
                        <small class="text-info">${'★'.repeat(comment.rating)}</small>
                        <p class="card-text mt-1">${comment.text}</p>
                    </div>
                `;
                commentsSection.appendChild(commentDiv);
            });
        }
    }

    function saveComments(productName, comments) {
        localStorage.setItem(`comments-${productName}`, JSON.stringify(comments));
    }

    function loadComments(productName) {
        const comments = localStorage.getItem(`comments-${productName}`);
        return comments ? JSON.parse(comments) : [];
    }

    function calculateAverageRating(comments) {
        if (comments.length === 0) return 0;
        const totalRating = comments.reduce((sum, comment) => sum + comment.rating, 0);
        return Math.round(totalRating / comments.length);
    }

    function updateStarDisplay(rating) {
        const stars = ratingStars.querySelectorAll('.star');
        stars.forEach(star => {
            star.style.color = star.getAttribute('data-value') <= rating ? '#ffc107' : '#ccc';
        });
    }

});