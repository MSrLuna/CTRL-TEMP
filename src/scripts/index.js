document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('refrigerador-buttons-container');
  fetch('http://localhost:3000/api/refrigeradores')
    .then(response => response.json())
    .then(refrigeradores => {
      refrigeradores.forEach(refrigerador => {
        const button = document.createElement('button');
        button.textContent = refrigerador.nombre;
        button.className = 'refrigerador-button';
        button.onclick = () => {
          window.location.href = `/refrigerador?id=${refrigerador.id}`;
        };
        container.appendChild(button);
      });
    })
    .catch(error => console.error('Error al cargar los refrigeradores:', error));
});

const socket = new WebSocket('ws://localhost:3000'); // Conexión al servidor WebSocket

socket.onopen = () => {
  console.log('Conectado al servidor WebSocket');
};

socket.onmessage = (event) => {
  const data = JSON.parse(event.data);
  console.log('Datos actualizados:', data);

  // Actualiza la tabla con los nuevos datos
  if (data.data && data.data.length > 0) {
    const temperatureTable = document.querySelector('#temperature-table tbody');
    data.data.forEach(dato => {
      const row = temperatureTable.insertRow();
      row.insertCell(0).textContent = dato.uid;
      row.insertCell(1).textContent = dato.fecha;
      row.insertCell(2).textContent = dato.temperatura;
      row.insertCell(3).textContent = dato.ip;
    });
  }
};

socket.onerror = (error) => {
  console.error('Error en la conexión WebSocket:', error);
};
