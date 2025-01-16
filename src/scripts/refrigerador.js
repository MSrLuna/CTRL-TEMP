document.addEventListener('DOMContentLoaded', function () {
  const urlParams = new URLSearchParams(window.location.search);
  const refrigeradorId = urlParams.get('id');
  const temperatureTable = document.querySelector('#temperature-table tbody');

  // Función para formatear la fecha y hora
  function formatFecha(fecha) {
    const opciones = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    };
    const fechaObj = new Date(fecha);
    return new Intl.DateTimeFormat('es-ES', opciones).format(fechaObj);
  }

  // Función para mostrar el modal con los datos adicionales
  function showModal(uid, ip) {
    document.getElementById('modal-uid').textContent = uid;
    document.getElementById('modal-ip').textContent = ip;
    document.getElementById('modal').style.display = 'block'; // Muestra el modal
  }

  // Función para cerrar el modal
  function closeModal() {
    document.getElementById('modal').style.display = 'none'; // Oculta el modal
    console.log('Modal cerrado');
  }

  // Asignamos el evento de clic al botón de cerrar modal
  const closeButton = document.querySelector('#modal button');
  closeButton.addEventListener('click', closeModal);

  if (refrigeradorId) {
    fetch(`http://localhost:3000/api/refrigerador/${refrigeradorId}/datos`)
      .then(response => response.json())
      .then(datos => {
        datos.forEach(dato => {
          const row = temperatureTable.insertRow();

          // Insertar fecha formateada, temperatura y equipo
          row.insertCell(0).textContent = formatFecha(dato.fecha);
          row.insertCell(1).textContent = dato.temperatura;
          row.insertCell(2).textContent = dato.equipo;  // Mostrar 'equipo'

          // Añadir evento de clic para mostrar los datos adicionales
          row.addEventListener('click', () => {
            showModal(dato.uid, dato.ip);
          });
        });
      })
      .catch(error => console.error('Error al cargar los datos:', error));
  }

  const socket = new WebSocket('ws://localhost:3000'); // Conexión al servidor WebSocket

  socket.onopen = () => {
    console.log('Conectado al servidor WebSocket');
  };

  socket.onmessage = (event) => {
    const data = JSON.parse(event.data);
    console.log('Datos actualizados:', data);

    if (data.data && data.data.length > 0) {
      const temperatureTable = document.querySelector('#temperature-table tbody');
      data.data.forEach(dato => {
        const row = temperatureTable.insertRow();

        // Insertar fecha formateada, temperatura y equipo
        row.insertCell(0).textContent = formatFecha(dato.fecha);
        row.insertCell(1).textContent = dato.temperatura;
        row.insertCell(2).textContent = dato.equipo;  // Mostrar 'equipo'

        // Añadir evento de clic para mostrar los datos adicionales
        row.addEventListener('click', () => {
          showModal(dato.uid, dato.ip);
        });
      });
    }
  };

  socket.onerror = (error) => {
    console.error('Error en la conexión WebSocket:', error);
  };
});
