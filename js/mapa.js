
        document.addEventListener('DOMContentLoaded', () => {
            // Inicializa los puntos de LevelUp
            let levelupPoints = localStorage.getItem('levelupPoints') || 0;
            const pointsDisplay = document.getElementById('current-points');
            pointsDisplay.textContent = levelupPoints;

            // Datos de los eventos de videojuegos
            const events = [
                {
                    name: 'Festigame Caja Los Andes 2025',
                    location: 'Movistar Arena, Santiago',
                    coords: [-33.4549, -70.6622],
                    points: 50,
                    description: 'El festival de videojuegos más grande de Chile.'
                },
                {
                    name: 'ExpoGame 2025',
                    location: 'Estación Mapocho, Santiago',
                    coords: [-33.4357, -70.6521],
                    points: 40,
                    description: 'El evento gamer del año con videojuegos, esports y cosplay.'
                },
                {
                    name: 'ExpoAtari 2025',
                    location: 'Biblioteca de Santiago, Santiago',
                    coords: [-33.4475, -70.6659],
                    points: 30,
                    description: 'Evento para los amantes de la cultura gamer clásica.'
                },
                {
                    name: 'PowerUP Festival',
                    location: 'Gimnasio Olímpico de San Miguel, Santiago',
                    coords: [-33.4932, -70.6559],
                    points: 25,
                    description: 'Torneos, artistas, cosplayers y más en San Miguel.'
                },
                {
                    name: 'Movistar GameClub',
                    location: 'Mallplaza Vespucio, Santiago',
                    coords: [-33.5181, -70.5971],
                    points: 20,
                    description: 'Torneos y competencias de esports todo el año.'
                }
            ];

            // Inicializa el mapa
            const mymap = L.map('mapid').setView([-33.4489, -70.6693], 12); // Coordenadas de Santiago

            // Añade la capa de tiles de OpenStreetMap
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                maxZoom: 19,
                attribution: '© <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            }).addTo(mymap);

            // Crea y añade los marcadores al mapa
            const eventListContainer = document.getElementById('event-list');
            events.forEach(event => {
                const marker = L.marker(event.coords).addTo(mymap);
                marker.bindPopup(`
                    <b>${event.name}</b><br>
                    Ubicación: ${event.location}<br>
                    <button class="levelup-btn" onclick="addPoints(${event.points}, '${event.name}')">Ganar ${event.points} Puntos LevelUp</button>
                `);

                // Añade el evento a la lista
                const listItem = document.createElement('li');
                listItem.className = 'event-list-item';
                listItem.innerHTML = `
                    <span>${event.name} - ${event.location}</span>
                    <button class="levelup-btn" onclick="addPoints(${event.points}, '${event.name}')">Ganar ${event.points} Puntos</button>
                `;
                eventListContainer.appendChild(listItem);
            });

            // Función para añadir puntos LevelUp
            window.addPoints = (points, eventName) => {
                const updatedPoints = parseInt(levelupPoints) + points;
                localStorage.setItem('levelupPoints', updatedPoints);
                pointsDisplay.textContent = updatedPoints;
                alert(`¡Has ganado ${points} Puntos LevelUp por asistir a ${eventName}! Puntos totales: ${updatedPoints}`);
            };
        });
