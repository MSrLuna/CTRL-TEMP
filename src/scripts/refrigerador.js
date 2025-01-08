document.addEventListener('DOMContentLoaded', function () {
    const urlParams = new URLSearchParams(window.location.search);
    const refrigeradorId = urlParams.get('id');
    const temperatureTable = document.querySelector('#temperature-table tbody');
  
    if (refrigeradorId) {
      fetch(`http://localhost:3000/api/refrigerador/${refrigeradorId}/datos`)
        .then(response => response.json())
        .then(datos => {
          datos.forEach(dato => {
            const row = temperatureTable.insertRow();
            row.insertCell(0).textContent = dato.uid;
            row.insertCell(1).textContent = dato.fecha;
            row.insertCell(2).textContent = dato.temperatura;
            row.insertCell(3).textContent = dato.ip;
          });
        })
        .catch(error => console.error('Error al cargar los datos:', error));
    }
  });
  
  const socket = new WebSocket('ws://localhost:3000'); // Conexión al servidor WebSocket

  socket.onopen = () => {
    console.log('Conectado al servidor WebSocket');
  };
  
  socket.onmessage = (event) => {
    const data = JSON.parse(event.data);
    console.log('Datos actualizados:', data);
  
    // Lógica para actualizar los datos en la interfaz
    // Ejemplo: Si es un cambio en los refrigeradores, actualiza el DOM
    if (data.message) {
      // Actualiza la UI con los nuevos datos
      alert(data.message);
    }
  };
  
  socket.onerror = (error) => {
    console.error('Error en la conexión WebSocket:', error);
  };
  