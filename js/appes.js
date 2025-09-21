document.addEventListener('DOMContentLoaded', () => {

    // --- LÓGICA COMPARTIDA PARA GESTIÓN DE SESIÓN Y VISTA DEL NAVBAR ---

    const navMiCuenta = document.getElementById('nav-mi-cuenta');
    const navIniciarSesion = document.getElementById('nav-iniciar-sesion');
    const navRegistrarse = document.getElementById('nav-registrarse');

    const usuarioLogeado = JSON.parse(localStorage.getItem('usuarioLogeado'));

    function actualizarNavbar() {
        if (usuarioLogeado) {
            if (navMiCuenta) navMiCuenta.style.display = 'block';
            if (navIniciarSesion) navIniciarSesion.style.display = 'none';
            if (navRegistrarse) navRegistrarse.style.display = 'none';

            const navUserPointsEl = document.getElementById('nav-user-points');
            if (navUserPointsEl && usuarioLogeado.puntos !== undefined) {
                navUserPointsEl.textContent = usuarioLogeado.puntos;
            }
        } else {
            if (navMiCuenta) navMiCuenta.style.display = 'none';
            if (navIniciarSesion) navIniciarSesion.style.display = 'block';
            if (navRegistrarse) navRegistrarse.style.display = 'block';
        }
    }

    actualizarNavbar();

    // --- LÓGICA DEL FORMULARIO DE INICIO DE SESIÓN ---

    const loginForm = document.getElementById("loginForm");
    if (loginForm) {
        loginForm.addEventListener("submit", function(event) {
            event.preventDefault();

            const correo = document.getElementById("correoLogin").value.trim();
            const password = document.getElementById("passwordLogin").value;
            
            if (correo === 'admin@duoc.cl' && password === 'admin123') {
                login({ correo, password, rol: 'admin' });
                return;
            }

            const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
            const usuarioEncontrado = usuarios.find(user => user.correo === correo && user.password === password);

            if (usuarioEncontrado) {
                alert("✅ ¡Inicio de sesión exitoso! Bienvenido/a " + usuarioEncontrado.usuario + ".");
                login(usuarioEncontrado);
            } else {
                alert("❌ Correo o contraseña incorrectos. Por favor, inténtalo de nuevo.");
            }
        });
    }

    // --- LÓGICA DEL FORMULARIO DE REGISTRO ---

    const registroForm = document.getElementById("registroForm");
    if (registroForm) {
        registroForm.addEventListener("submit", function(event) {
            event.preventDefault();

            const nombre = document.getElementById("nombre").value.trim();
            const correo = document.getElementById("correo").value.trim();
            const usuario = document.getElementById("usuario").value.trim();
            const fechaNacimiento = document.getElementById("fechaNacimiento").value;
            const password = document.getElementById("password").value;
            const confirmPassword = document.getElementById("confirmPassword").value;

            const allowedDomains = ['@duoc.cl', '@profesor.duoc.cl', '@gmail.com'];
            if (!allowedDomains.some(domain => correo.endsWith(domain))) {
                alert('Correo no válido. Dominios permitidos: @duoc.cl, @profesor.duoc.cl, @gmail.com.');
                return;
            }
            if (password.length < 4 || password.length > 10) {
                alert('La contraseña debe tener entre 4 y 10 caracteres.');
                return;
            }
            if (password !== confirmPassword) {
                alert('Las contraseñas no coinciden.');
                return;
            }
            const hoy = new Date();
            const nacimiento = new Date(fechaNacimiento);
            let edad = hoy.getFullYear() - nacimiento.getFullYear();
            const m = hoy.getMonth() - nacimiento.getMonth();
            if (m < 0 || (m === 0 && hoy.getDate() < nacimiento.getDate())) {
                edad--;
            }
            if (edad < 18) {
                alert("Debes tener al menos 18 años para registrarte.");
                return;
            }
            
            const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
            const correoExistente = usuarios.find(user => user.correo === correo);
            if (correoExistente) {
                alert("❌ Este correo electrónico ya está registrado. Por favor, inicia sesión.");
                return;
            }
            const newUser = {
                nombre,
                correo,
                usuario,
                fechaNacimiento,
                password,
                referralCode: 'REF-' + usuario.toUpperCase(),
                puntos: 0,
                nivel: 'Madera'
            };
            usuarios.push(newUser);
            localStorage.setItem("usuarios", JSON.stringify(usuarios));
            
            login(newUser);
        });
    }

    // --- LÓGICA ESPECÍFICA DE LA PÁGINA DE PERFIL ---

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

            const updateUI = () => {
                if (userPointsEl) userPointsEl.textContent = usuarioLogeado.puntos;
                if (userLevelEl) userLevelEl.textContent = usuarioLogeado.nivel;
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
                    alert('¡Has ganado 100 puntos LevelUp!');
                });
            }

            if (redeemPointsBtn) {
                redeemPointsBtn.addEventListener('click', () => {
                    const pointsToRedeem = 500;
                    if (usuarioLogeado.puntos >= pointsToRedeem) {
                        usuarioLogeado.puntos -= pointsToRedeem;
                        updateLevel();
                        updateUI();
                        alert('¡Puntos canjeados! Se ha aplicado un cupón de descuento.');
                    } else {
                        alert('No tienes suficientes puntos para canjear.');
                    }
                });
            }

            if (usuarioLogeado.referralCode) {
                if(referralCodeEl) referralCodeEl.value = usuarioLogeado.referralCode;
                if(referralLinkEl) referralLinkEl.href = `registro.html?ref=${usuarioLogeado.referralCode}`;
            }
            
            if (copyReferralBtn) {
                copyReferralBtn.addEventListener('click', () => {
                    if(referralCodeEl) {
                        navigator.clipboard.writeText(referralCodeEl.value);
                        alert('Código copiado: ' + referralCodeEl.value);
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
                    alert('✅ Información actualizada con éxito');
                    location.reload();
                } else {
                    alert('Error al actualizar: usuario no encontrado.');
                }
            });

            preferenciasForm.addEventListener('submit', function(event) {
                event.preventDefault();
                const categoriasSeleccionadas = [];
                document.querySelectorAll('#preferenciasForm input[type="checkbox"]:checked').forEach(checkbox => {
                    categoriasSeleccionadas.push(checkbox.value);
                });
                localStorage.setItem('preferenciasUsuario', JSON.stringify({ categorias: categoriasSeleccionadas }));
                alert('✅ Preferencias guardadas con éxito');
            });

            const preferencias = JSON.parse(localStorage.getItem('preferenciasUsuario')) || {};
            if (preferencias.categorias) {
                document.querySelectorAll('#preferenciasForm input[type="checkbox"]').forEach(checkbox => {
                    if (preferencias.categorias.includes(checkbox.value)) {
                        checkbox.checked = true;
                    }
                });
            }
        } else {
            window.location.href = 'inicio.html';
        }
    }
});

// --- FUNCIONES GLOBALES DE LOGIN/LOGOUT ---
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