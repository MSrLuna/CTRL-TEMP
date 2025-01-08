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
