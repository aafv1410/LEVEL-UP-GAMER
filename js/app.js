let cart = [];

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
      </tr>
    `;
  });

  cartCount.textContent = cart.length;
  cartTotal.textContent = "$" + total.toLocaleString("es-CL") + " CLP";
}


function updateQuantity(index, quantity) {
  cart[index].quantity = parseInt(quantity);
  renderCart();
}


document.querySelectorAll(".add-to-cart").forEach(button => {
  button.addEventListener("click", () => {
    const name = button.getAttribute("data-name");
    const price = parseInt(button.getAttribute("data-price"));

    const existing = cart.find(item => item.name === name);
    if (existing) {
      existing.quantity++;
    } else {
      cart.push({ name, price, quantity: 1 });
    }
    renderCart();
  });
});


document.getElementById("clear-cart").addEventListener("click", () => {
  cart = [];
  renderCart();
});


document.getElementById("searchBar").addEventListener("keyup", function () {
  let search = this.value.toLowerCase();
  document.querySelectorAll(".product-card").forEach(card => {
    let name = card.getAttribute("data-name").toLowerCase();
    card.style.display = name.includes(search) ? "block" : "none";
  });
});

function filterCategory(category) {
  document.querySelectorAll(".product-card").forEach(card => {
    if (category === "all" || card.getAttribute("data-category") === category) {
      card.style.display = "block";
    } else {
      card.style.display = "none";
    }
  });
}
