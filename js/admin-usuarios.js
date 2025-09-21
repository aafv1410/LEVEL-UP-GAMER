document.addEventListener('DOMContentLoaded', () => {
    const userForm = document.getElementById('user-form');
    const userTableBody = document.getElementById('user-list-admin');
    let users = JSON.parse(localStorage.getItem('usuarios')) || [];

    function saveUsers() {
        localStorage.setItem('usuarios', JSON.stringify(users));
    }

    function renderUsers() {
        userTableBody.innerHTML = '';
        users.forEach((user, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${user.nombre} (${user.usuario})</td>
                <td>${user.correo}</td>
                <td>${user.rol}</td>
                <td>
                    <button class="btn btn-warning btn-sm" onclick="editUser(${index})">Editar</button>
                    <button class="btn btn-danger btn-sm" onclick="deleteUser(${index})">Eliminar</button>
                </td>
            `;
            userTableBody.appendChild(row);
        });
    }

    // Funciones globales para acceder desde HTML
    window.editUser = function(index) {
        const user = users[index];
        document.getElementById('user-index').value = index;
        document.getElementById('nombre').value = user.nombre;
        document.getElementById('correo').value = user.correo;
        document.getElementById('usuario').value = user.usuario;
        document.getElementById('fechaNacimiento').value = user.fechaNacimiento || '';
        document.getElementById('tipoUsuario').value = user.rol;
        document.getElementById('password').value = user.password;
        document.getElementById('correo').disabled = true;
        document.getElementById('password').required = false;
    };

    window.deleteUser = function(index) {
        if (confirm(`¿Estás seguro de que quieres eliminar a ${users[index].nombre}?`)) {
            users.splice(index, 1);
            saveUsers();
            renderUsers();
        }
    };

    userForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const index = document.getElementById('user-index').value;
        const newUser = {
            nombre: document.getElementById('nombre').value,
            correo: document.getElementById('correo').value,
            usuario: document.getElementById('usuario').value,
            fechaNacimiento: document.getElementById('fechaNacimiento').value,
            rol: document.getElementById('tipoUsuario').value,
            password: document.getElementById('password').value
        };

        if (index) { // Editando
            users[index] = newUser;
        } else { // Creando
            users.push(newUser);
        }
        
        saveUsers();
        renderUsers();
        userForm.reset();
        document.getElementById('correo').disabled = false;
        document.getElementById('password').required = true;
    });

    renderUsers();
});