document.addEventListener('DOMContentLoaded', () => {

    // Función para mostrar mensajes de error
    function mostrarError(elemento, mensaje) {
        const errorElement = document.getElementById(elemento);
        
        if (errorElement) {
            errorElement.textContent = mensaje;
            errorElement.style.display = 'block';
        }
    }
    const logoutBtn = document.getElementById('logout-btn');

    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            
            logout();
        });
    }
    function limpiarErrores() {
        const errorElements = document.querySelectorAll('.error-msg');
        errorElements.forEach(el => {
            el.textContent = '';
            el.style.display = 'none';
        });
    }

    // logica de la barra de navegacion
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

    // logica del formulario de inicio de sesion
    const loginForm = document.getElementById("loginForm");
    if (loginForm) {
        loginForm.addEventListener("submit", function(event) {
            event.preventDefault();
            limpiarErrores();

            const correo = document.getElementById("correoLogin").value.trim();
            const password = document.getElementById("passwordLogin").value;

            if (correo === 'admin@duoc.cl' && password === 'admin123') {
                login({ correo, password, rol: 'admin' });
                return;
            }

            const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
            const usuarioEncontrado = usuarios.find(user => user.correo === correo && user.password === password);

            if (usuarioEncontrado) {
                login(usuarioEncontrado);
            } else {
                mostrarError('loginError', ' Correo o contraseña incorrectos.');
            }
        });
    }

    // logica del formulario de registro
    const registroForm = document.getElementById("registroForm");
    if (registroForm) {
        registroForm.addEventListener("submit", function(event) {
            event.preventDefault();
            limpiarErrores();

            const nombre = document.getElementById("nombre").value.trim();
            const correo = document.getElementById("correo").value.trim();
            const usuario = document.getElementById("usuario").value.trim();
            const fechaNacimiento = document.getElementById("fechaNacimiento").value;
            const password = document.getElementById("password").value;
            const confirmPassword = document.getElementById("confirmPassword").value;

            let tieneErrores = false;

            const allowedDomains = ['@duoc.cl', '@profesor.duoc.cl', '@gmail.com'];
            if (!allowedDomains.some(domain => correo.endsWith(domain))) {
                mostrarError('correoError', 'Correo no válido. Dominios permitidos: @duoc.cl, @profesor.duoc.cl, @gmail.com.');
                tieneErrores = true;
            }
            if (password.length < 4 || password.length > 10) {
                mostrarError('passwordError', 'La contraseña debe tener entre 4 y 10 caracteres.');
                tieneErrores = true;
            }
            if (password !== confirmPassword) {
                mostrarError('confirmError', 'Las contraseñas no coinciden.');
                tieneErrores = true;
            }
            const hoy = new Date();
            const nacimiento = new Date(fechaNacimiento);
            let edad = hoy.getFullYear() - nacimiento.getFullYear();
            const m = hoy.getMonth() - nacimiento.getMonth();
            if (m < 0 || (m === 0 && hoy.getDate() < nacimiento.getDate())) {
                edad--;
            }
            if (edad < 18) {
                mostrarError('edadError', 'Debes tener al menos 18 años para registrarte.');
                tieneErrores = true;
            }

            const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
            const correoExistente = usuarios.find(user => user.correo === correo);
            if (correoExistente) {
                mostrarError('correoError', 'Este correo electrónico ya está registrado.');
                tieneErrores = true;
            }

            if (tieneErrores) {
                return;
            }

            // Lógica para el descuento del 20%
            let descuento = 0;
            if (correo.endsWith('@duoc.cl') || correo.endsWith('@profesor.duoc.cl')) {
                descuento = 20;
            }

            const newUser = {
                nombre,
                correo,
                usuario,
                fechaNacimiento,
                password,
                referralCode: 'REF-' + usuario.toUpperCase(),
                puntos: 0,
                nivel: 'Madera',
                descuento: descuento
            };

            usuarios.push(newUser);
            localStorage.setItem("usuarios", JSON.stringify(usuarios));

            login(newUser);
        });
    }

    // logica especifica de la pagina de perfil
    const perfilForm = document.getElementById('perfilForm');
    const preferenciasForm = document.getElementById('preferenciasForm');

    if (perfilForm) {
        if (usuarioLogeado) {
            document.getElementById('nombre').value = usuarioLogeado.nombre || '';
            document.getElementById('correo').value = usuarioLogeado.correo || '';
            document.getElementById('usuario').value = usuarioLogeado.usuario || '';
            document.getElementById('fechaNacimiento').value = usuarioLogeado.fechaNacimiento || '';

            const userPointsEl = document.getElementById('user-points');
            const userLevelEl = document.getElementById('user-level');
            const addPointsBtn = document.getElementById('add-points-btn');
            const redeemPointsBtn = document.getElementById('redeem-points-btn');
            const referralCodeEl = document.getElementById('referral-code');
            const referralLinkEl = document.getElementById('referral-link');
            const copyReferralBtn = document.getElementById('copy-referral-btn');
            const descuentoInfoEl = document.getElementById('descuento-info');

            if (descuentoInfoEl && usuarioLogeado.descuento > 0) {
                descuentoInfoEl.textContent = `¡Felicidades! Tienes un descuento del ${usuarioLogeado.descuento}% de por vida.`;
                descuentoInfoEl.style.display = 'block';
            }

            const updateUI = () => {
                if (userPointsEl) userPointsEl.textContent = usuarioLogeado.puntos;
                if (userLevelEl) userLevelEl.textContent = usuarioLogeado.nivel;
                const navUserPointsEl = document.getElementById('nav-user-points');
                if (navUserPointsEl) navUserPointsEl.textContent = usuarioLogeado.puntos;
            };

            const updateLevel = () => {
                if (usuarioLogeado.puntos >= 2000) {
                    usuarioLogeado.nivel = 'Platino';
                } else if (usuarioLogeado.puntos >= 1000) {
                    usuarioLogeado.nivel = 'Diamante';
                } else if (usuarioLogeado.puntos >= 500) {
                    usuarioLogeado.nivel = 'Oro';
                } else if (usuarioLogeado.puntos >= 100) {
                    usuarioLogeado.nivel = 'Plata';
                } else {
                    usuarioLogeado.nivel = 'Madera';
                }
                localStorage.setItem('usuarioLogeado', JSON.stringify(usuarioLogeado));
            };

            if (addPointsBtn) {
                addPointsBtn.addEventListener('click', () => {
                    usuarioLogeado.puntos += 100;
                    updateLevel();
                    updateUI();
                });
            }

            if (redeemPointsBtn) {
                redeemPointsBtn.addEventListener('click', () => {
                    const pointsToRedeem = 500;
                    const discountAmount = 5000;

                    if (usuarioLogeado.descuentoCanjeado) {
                        alert('Ya tienes un descuento canjeado y no se puede acumular.');
                        return;
                    }
                    
                    if (usuarioLogeado.puntos >= pointsToRedeem) {
                        usuarioLogeado.puntos -= pointsToRedeem;
                        usuarioLogeado.descuentoCanjeado = discountAmount;
                        updateLevel();
                        localStorage.setItem('usuarioLogeado', JSON.stringify(usuarioLogeado));
                        updateUI();
                        alert(`¡Has canjeado ${pointsToRedeem} puntos y obtenido un descuento de $${discountAmount}!`);
                        window.location.reload();
                    } else {
                        alert('No tienes suficientes puntos para canjear.');
                    }
                });
            }

            if (usuarioLogeado.referralCode) {
                if (referralCodeEl) referralCodeEl.value = usuarioLogeado.referralCode;
                if (referralLinkEl) referralLinkEl.href = `registro.html?ref=${usuarioLogeado.referralCode}`;
            }

            if (copyReferralBtn) {
                copyReferralBtn.addEventListener('click', () => {
                    if (referralCodeEl) {
                        navigator.clipboard.writeText(referralCodeEl.value);
                    }
                });
            }

            updateLevel();
            updateUI();

            perfilForm.addEventListener('submit', function(event) {
                event.preventDefault();

                let todosLosUsuarios = JSON.parse(localStorage.getItem('usuarios'));
                const index = todosLosUsuarios.findIndex(user => user.correo === usuarioLogeado.correo);

                if (index !== -1) {
                    todosLosUsuarios[index].nombre = document.getElementById('nombre').value;
                    todosLosUsuarios[index].correo = document.getElementById('correo').value;
                    todosLosUsuarios[index].usuario = document.getElementById('usuario').value;
                    todosLosUsuarios[index].fechaNacimiento = document.getElementById('fechaNacimiento').value;

                    if (document.getElementById('password').value.length > 0) {
                        todosLosUsuarios[index].password = document.getElementById('password').value;
                    }

                    localStorage.setItem('usuarios', JSON.stringify(todosLosUsuarios));
                    localStorage.setItem('usuarioLogeado', JSON.stringify(todosLosUsuarios[index]));
                    location.reload();
                }
            });

            if (preferenciasForm) {
                // Leer preferencias guardadas al cargar la página
                const preferenciasGuardadas = usuarioLogeado.preferencias || [];
                document.querySelectorAll('#preferenciasForm input[type="checkbox"]').forEach(checkbox => {
                    if (preferenciasGuardadas.includes(checkbox.value)) {
                        checkbox.checked = true;
                    }
                });

                preferenciasForm.addEventListener('submit', function(event) {
                    event.preventDefault();
                    
                    const categoriasSeleccionadas = [];
                    document.querySelectorAll('#preferenciasForm input[type="checkbox"]:checked').forEach(checkbox => {
                        categoriasSeleccionadas.push(checkbox.value);
                    });
                    
                    // Actualizar las preferencias del usuario logeado en localStorage
                    usuarioLogeado.preferencias = categoriasSeleccionadas;
                    localStorage.setItem('usuarioLogeado', JSON.stringify(usuarioLogeado));

                    // También actualizar en la lista de todos los usuarios
                    let todosLosUsuarios = JSON.parse(localStorage.getItem('usuarios'));
                    const userIndex = todosLosUsuarios.findIndex(user => user.correo === usuarioLogeado.correo);
                    if (userIndex !== -1) {
                        todosLosUsuarios[userIndex].preferencias = categoriasSeleccionadas;
                        localStorage.setItem('usuarios', JSON.stringify(todosLosUsuarios));
                    }
                    
                    alert('Preferencias guardadas correctamente. ');
                });
            }

        } else {
            window.location.href = 'inicio.html';
        }
    }

    // logica especifica de la pagina de checkout
    function loadCartSummary() {
        // Obtenemos los productos del localStorage
        const cartItems = JSON.parse(localStorage.getItem('cart')) || [];
        const cartSummaryList = document.getElementById('cart-summary-list');
        const totalAmountEl = document.getElementById('total-amount');
        const shippingCost = 5000; 
        const usuarioLogeado = JSON.parse(localStorage.getItem('usuarioLogeado'));

        let subtotal = 0;

        if (!cartSummaryList || !totalAmountEl) return; 


        cartSummaryList.innerHTML = '';

        // Si el carrito está vacío, mostramos un mensaje
        if (cartItems.length === 0) {
            cartSummaryList.innerHTML = `
                <li class="list-group-item d-flex justify-content-between align-items-center bg-secondary text-white">
                    El carrito está vacío.
                </li>
            `;
            totalAmountEl.textContent = `$${shippingCost.toLocaleString('es-CL')}`;
            return;
        }

        // Recorremos los productos del carrito para crear los elementos de la lista
        cartItems.forEach(item => {
            const listItem = document.createElement('li');
            listItem.className = 'list-group-item d-flex justify-content-between align-items-center bg-secondary text-white';

            listItem.innerHTML = `
                <div class="d-flex align-items-center">
                    <img src="${item.imagen}" alt="${item.nombre}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 5px;" class="me-3">
                    <div>
                        <h6 class="my-0 text-white">${item.nombre} x ${item.cantidad}</h6>
                        <small class="text-secondary">${item.descripcion}</small>
                    </div>
                </div>
                <span class="text-white">$${(item.precio * item.cantidad).toLocaleString('es-CL')}</span>
            `;

            cartSummaryList.appendChild(listItem);
            subtotal += item.precio * item.cantidad;
        });

        // Agregamos el subtotal a la lista
        const subtotalItem = document.createElement('li');
        subtotalItem.className = 'list-group-item d-flex justify-content-between align-items-center bg-secondary text-white';
        subtotalItem.innerHTML = `
            <p class="mb-0 text-white">Subtotal</p>
            <p class="mb-0 text-white">$${subtotal.toLocaleString('es-CL')}</p>
        `;
        cartSummaryList.appendChild(subtotalItem);

        // Aplicamos el descuento si existe
        let total = subtotal + shippingCost;
        if (usuarioLogeado && usuarioLogeado.descuentoCanjeado) {
            const discountItem = document.createElement('li');
            discountItem.className = 'list-group-item d-flex justify-content-between align-items-center bg-secondary text-white';
            discountItem.innerHTML = `
                <p class="mb-0 text-warning">Descuento Canjeado</p>
                <p class="mb-0 text-warning">-$${usuarioLogeado.descuentoCanjeado.toLocaleString('es-CL')}</p>
            `;
            cartSummaryList.appendChild(discountItem);
            total -= usuarioLogeado.descuentoCanjeado;
        }

        // Calculamos el total final
        totalAmountEl.textContent = `$${total.toLocaleString('es-CL')}`;
    }

    // Llamamos a la función para cargar el resumen del carrito al iniciar la página
    if (document.getElementById('cart-summary-list')) {
        loadCartSummary();
    }

    // logica del boton finalizar compra
    const finalizarCompraBtn = document.querySelector('.btn-levelup.btn-lg');
    if (finalizarCompraBtn) {
        finalizarCompraBtn.addEventListener('click', (event) => {
            event.preventDefault();

            // Lógica de validación
            const shippingForm = document.getElementById('shippingForm');
            const paymentForm = document.getElementById('paymentForm');

            if (!shippingForm.checkValidity() || !paymentForm.checkValidity()) {
                alert('Por favor, completa todos los campos requeridos correctamente.');
                shippingForm.classList.add('was-validated');
                paymentForm.classList.add('was-validated');
                return;
            }

            // Aquí se simula la compra exitosa
            alert('¡Compra finalizada con éxito! 🎉');

            const usuarioLogeado = JSON.parse(localStorage.getItem('usuarioLogeado'));
            
            // Si el usuario tenía un descuento canjeado, lo eliminamos
            if (usuarioLogeado && usuarioLogeado.descuentoCanjeado) {
                delete usuarioLogeado.descuentoCanjeado;
                localStorage.setItem('usuarioLogeado', JSON.stringify(usuarioLogeado));
            }

            // Limpiar el carrito después de la compra
            localStorage.removeItem('cart');
            window.location.href = "index.html";
        });
    }

});


// funciones de login/logout
function login(userData) {
    localStorage.setItem('usuarioLogeado', JSON.stringify(userData));
    if (userData.rol === 'admin') {
        window.location.href = "admin.html";
    } else {
        window.location.href = "perfil.html";
    }
}

function logout() {
    localStorage.removeItem('usuarioLogeado');
    window.location.href = "index.html";
}