document.addEventListener('DOMContentLoaded', () => {
    console.log('Script auth.js cargado y ejecutándose.');

    // --- LÓGICA PARA MOSTRAR/OCULTAR ENLACES DE NAVEGACIÓN ---
    function isLoggedIn() {
        return localStorage.getItem('usuarioLogeado') !== null;
    }

    const navMiCuenta = document.getElementById('nav-mi-cuenta');
    const navIniciarSesion = document.getElementById('nav-iniciar-sesion');
    const navRegistrarse = document.getElementById('nav-registrarse'); // Nuevo ID si lo tienes en tu HTML

    if (isLoggedIn()) {
        if (navMiCuenta) navMiCuenta.style.display = 'block';
        if (navIniciarSesion) navIniciarSesion.style.display = 'none';
        if (navRegistrarse) navRegistrarse.style.display = 'none';
    } else {
        if (navMiCuenta) navMiCuenta.style.display = 'none';
        if (navIniciarSesion) navIniciarSesion.style.display = 'block';
        if (navRegistrarse) navRegistrarse.style.display = 'block';
    }

    // --- LÓGICA DEL FORMULARIO DE INICIO DE SESIÓN ---
    const loginForm = document.getElementById("loginForm");
    if (loginForm) {
        loginForm.addEventListener("submit", function(event) {
            event.preventDefault();

            const correo = document.getElementById("correoLogin").value.trim();
            const password = document.getElementById("passwordLogin").value;
            
            // Lógica para admin (puede seguir siendo la misma)
            if (correo === 'admin@duoc.cl' && password === 'admin123') {
                login({ correo, password, rol: 'admin' });
                return;
            }

            // Buscar usuario en el array guardado
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

            // Obtener los valores del formulario
            const nombre = document.getElementById("nombre").value.trim();
            const correo = document.getElementById("correo").value.trim();
            const usuario = document.getElementById("usuario").value.trim();
            const fechaNacimiento = document.getElementById("fechaNacimiento").value;
            const password = document.getElementById("password").value;
            const confirmPassword = document.getElementById("confirmPassword").value;

            // Validaciones (manteniendo tu lógica)
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

            // Validar edad (manteniendo tu lógica)
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

            // Obtener todos los usuarios y verificar si el correo ya existe
            const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
            const correoExistente = usuarios.find(user => user.correo === correo);

            if (correoExistente) {
                alert("❌ Este correo electrónico ya está registrado. Por favor, inicia sesión.");
                return;
            }

            // Crear el nuevo objeto de usuario con datos iniciales
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

            // Agregar el nuevo usuario al array y guardarlo
            usuarios.push(newUser);
            localStorage.setItem("usuarios", JSON.stringify(usuarios));

            // Iniciar sesión automáticamente después del registro
            login(newUser);
        });
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