document.addEventListener('DOMContentLoaded', () => {
    console.log('Script auth.js cargado y ejecutándose.');

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

    // Lógica del formulario de registro
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

        function validarCampo(input, errorElement, regex = null, mensajeError = "") {
            const valor = input.value.trim();
            if (valor === "") {
                errorElement.textContent = "Este campo es obligatorio.";
            } else if (regex && !regex.test(valor)) {
                errorElement.textContent = mensajeError;
            } else {
                errorElement.textContent = "";
            }
        }

        function validarContrasenas() {
            if (passwordInput.value.length < 6) {
                passwordError.textContent = "La contraseña debe tener al menos 6 caracteres.";
            } else {
                passwordError.textContent = "";
            }
            if (confirmInput.value !== passwordInput.value) {
                confirmError.textContent = "Las contraseñas no coinciden.";
            } else {
                confirmError.textContent = "";
            }
        }

        correoInput.addEventListener("input", () => validarCampo(correoInput, correoError, /^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Ingresa un correo válido."));
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

            const nombre = document.getElementById("nombre").value.trim();
            const correo = correoInput.value.trim();
            const usuario = document.getElementById("usuario").value.trim();
            const pass = passwordInput.value;
            const confirm = confirmInput.value;
            const fechaNacimiento = fechaInput.value;

            const esCorreoValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo);
            const esPasswordValido = pass.length >= 6;
            const contrasenasCoinciden = pass === confirm;
            const esMayorDeEdad = calcularEdad(fechaNacimiento) >= 18;

            if (!esCorreoValido || !esPasswordValido || !contrasenasCoinciden || !esMayorDeEdad) {
                alert("Por favor, corrige los errores en el formulario antes de continuar.");
                return;
            }

            const user = {
                nombre: nombre,
                correo: correo,
                usuario: usuario,
                fechaNacimiento: fechaNacimiento,
                password: pass
            };
            localStorage.setItem("usuarioRegistrado", JSON.stringify(user));

            alert("✅ ¡Registro exitoso! Bienvenido/a " + usuario + ".");
            login();
        });
    }

    // Lógica del formulario de inicio de sesión
    const loginForm = document.getElementById("loginForm");
    if (loginForm) {
        loginForm.addEventListener("submit", function(event) {
            event.preventDefault();

            const correo = document.getElementById("correoLogin").value.trim();
            const password = document.getElementById("passwordLogin").value;
            const usuarioRegistrado = JSON.parse(localStorage.getItem("usuarioRegistrado"));

            if (usuarioRegistrado && usuarioRegistrado.correo === correo && usuarioRegistrado.password === password) {
                alert("✅ ¡Inicio de sesión exitoso! Bienvenido/a " + usuarioRegistrado.usuario + ".");
                login();
            } else {
                alert("❌ Correo o contraseña incorrectos. Por favor, inténtalo de nuevo.");
            }
        });
    }

});

function login() {
    localStorage.setItem('isLoggedIn', 'true');
    window.location.href = "perfil.html";
}

function logout() {
    localStorage.removeItem('isLoggedIn');
    window.location.reload();
}