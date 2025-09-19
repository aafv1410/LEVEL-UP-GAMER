document.addEventListener('DOMContentLoaded', () => {
    console.log('Script auth.js cargado y ejecutándose.');

    // --- LÓGICA PARA MOSTRAR/OCULTAR ENLACES DE NAVEGACIÓN ---
    function isLoggedIn() {
        return localStorage.getItem('isLoggedIn') === 'true';
    }

    const miCuentaItem = document.getElementById('nav-mi-cuenta');
    const iniciarSesionItem = document.getElementById('nav-iniciar-sesion');

    if (miCuentaItem && iniciarSesionItem) {
        miCuentaItem.style.display = 'none';
        iniciarSesionItem.style.display = 'none';

        if (isLoggedIn()) {
            miCuentaItem.style.display = 'block';
        } else {
            iniciarSesionItem.style.display = 'block';
        }
    }

    // --- LÓGICA DEL FORMULARIO DE INICIO DE SESIÓN ---
    const loginForm = document.getElementById("loginForm");
    if (loginForm) {
        loginForm.addEventListener("submit", function(event) {
            event.preventDefault();

            const correoInput = document.getElementById("correoLogin");
            const passwordInput = document.getElementById("passwordLogin");
            
            // Validación de Correo con dominios permitidos
            const allowedDomains = ['@duoc.cl', '@profesor.duoc.cl', '@gmail.com'];
            const isValidEmail = allowedDomains.some(domain => correoInput.value.endsWith(domain));
            
            if (!isValidEmail) {
                alert('Correo no válido. Dominios permitidos: @duoc.cl, @profesor.duoc.cl, @gmail.com.');
                return;
            }

            // Validación de Contraseña con rango de caracteres
            if (passwordInput.value.length < 4 || passwordInput.value.length > 10) {
                alert('La contraseña debe tener entre 4 y 10 caracteres.');
                return;
            }
            
            // Simulación de login: Si es admin, va al panel. Sino, va a su perfil.
            if (correoInput.value === 'admin@duoc.cl' && passwordInput.value === 'admin123') {
                alert('¡Bienvenido, Administrador!');
                login('admin'); // Pasa el rol 'admin'
            } else {
                 const usuarioRegistrado = JSON.parse(localStorage.getItem("usuarioRegistrado"));
                 if (usuarioRegistrado && usuarioRegistrado.correo === correoInput.value && usuarioRegistrado.password === passwordInput.value) {
                     alert("✅ ¡Inicio de sesión exitoso! Bienvenido/a " + usuarioRegistrado.usuario + ".");
                     login('cliente'); // Pasa el rol 'cliente'
                 } else {
                     alert("❌ Correo o contraseña incorrectos. Por favor, inténtalo de nuevo.");
                 }
            }
        });
    }

    // --- LÓGICA DEL FORMULARIO DE REGISTRO ---
    const registroForm = document.getElementById("registroForm");
    if (registroForm) {
        const correoInput = document.getElementById("correo");
        const passwordInput = document.getElementById("password");
        const confirmInput = document.getElementById("confirmPassword");
        const fechaInput = document.getElementById("fechaNacimiento");
        const correoError = document.getElementById("correoError");
        const passwordError = document.getElementById("passwordError");
        const confirmError = document.getElementById("confirmError");
        const edadError = document.getElementById("edadError");

        function calcularEdad(fechaNac) {
            const hoy = new Date();
            const nacimiento = new Date(fechaNac);
            let edad = hoy.getFullYear() - nacimiento.getFullYear();
            const m = hoy.getMonth() - nacimiento.getMonth();
            if (m < 0 || (m === 0 && hoy.getDate() < nacimiento.getDate())) {
                edad--;
            }
            return edad;
        }

        function validarContrasenas() {
            if (passwordInput.value.length < 4 || passwordInput.value.length > 10) {
                passwordError.textContent = "La contraseña debe tener entre 4 y 10 caracteres.";
            } else {
                passwordError.textContent = "";
            }
            if (confirmInput.value !== passwordInput.value) {
                confirmError.textContent = "Las contraseñas no coinciden.";
            } else {
                confirmError.textContent = "";
            }
        }

        correoInput.addEventListener("input", () => {
             const allowedDomains = ['@duoc.cl', '@profesor.duoc.cl', '@gmail.com'];
             const isValidEmail = allowedDomains.some(domain => correoInput.value.endsWith(domain));
             if(!isValidEmail && correoInput.value.length > 0) {
                correoError.textContent = "Dominio no permitido.";
             } else {
                correoError.textContent = "";
             }
        });
        passwordInput.addEventListener("input", validarContrasenas);
        confirmInput.addEventListener("input", validarContrasenas);
        fechaInput.addEventListener("input", () => {
            const edad = calcularEdad(fechaInput.value);
            if (edad < 18) {
                edadError.textContent = "Debes tener al menos 18 años para registrarte.";
            } else {
                edadError.textContent = "";
            }
        });

        registroForm.addEventListener("submit", function(event) {
            event.preventDefault();

            // Re-validar todo antes de enviar
            validarContrasenas();
            if(correoError.textContent || passwordError.textContent || confirmError.textContent || edadError.textContent) {
                alert("Por favor, corrige los errores en el formulario.");
                return;
            }

            const user = {
                nombre: document.getElementById("nombre").value.trim(),
                correo: correoInput.value.trim(),
                usuario: document.getElementById("usuario").value.trim(),
                fechaNacimiento: fechaInput.value,
                password: passwordInput.value
            };
            localStorage.setItem("usuarioRegistrado", JSON.stringify(user));

            alert("✅ ¡Registro exitoso! Bienvenido/a " + user.usuario + ".");
            login('cliente');
        });
    }
});

// --- FUNCIONES GLOBALES DE LOGIN/LOGOUT ---
function login(role) {
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('userRole', role); // Guardamos el rol
    
    if (role === 'admin') {
        window.location.href = "admin.html";
    } else {
        window.location.href = "perfil.html";
    }
}

function logout() {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userRole');
    window.location.href = "index.html";
}