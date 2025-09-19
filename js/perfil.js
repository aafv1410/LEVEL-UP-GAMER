document.addEventListener('DOMContentLoaded', () => {
    // 1. Cargar la información del usuario desde localStorage
    const usuarioRegistrado = JSON.parse(localStorage.getItem('usuarioRegistrado'));

    // 2. Verificar si el usuario existe en localStorage
    if (usuarioRegistrado) {
        // 3. Rellenar los campos del formulario con los datos guardados
        document.getElementById('nombre').value = usuarioRegistrado.nombre || '';
        document.getElementById('correo').value = usuarioRegistrado.correo || '';
        document.getElementById('usuario').value = usuarioRegistrado.usuario || '';
        document.getElementById('fechaNacimiento').value = usuarioRegistrado.fechaNacimiento || '';
    } else {
        // Opcional: Si no hay datos, redirigir al inicio de sesión
        alert('No se encontraron datos de usuario. Por favor, inicia sesión.');
        window.location.href = 'inicio.html';
    }

    // Lógica para el formulario de actualización (si el usuario cambia sus datos)
    const perfilForm = document.getElementById('perfilForm');
    if (perfilForm) {
        perfilForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // Actualizar el objeto con los nuevos datos del formulario
            const usuarioActualizado = {
                ...usuarioRegistrado, // Mantiene los datos que no se cambian
                nombre: document.getElementById('nombre').value,
                correo: document.getElementById('correo').value,
                usuario: document.getElementById('usuario').value,
                fechaNacimiento: document.getElementById('fechaNacimiento').value,
            };
            
            // Si el campo de contraseña no está vacío, actualízala
            const nuevaPassword = document.getElementById('password').value;
            if (nuevaPassword) {
                usuarioActualizado.password = nuevaPassword;
            }

            // Guardar los datos actualizados en localStorage
            localStorage.setItem('usuarioRegistrado', JSON.stringify(usuarioActualizado));

            alert('¡Tu información ha sido actualizada correctamente!');
        });
    }
});