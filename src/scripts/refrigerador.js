document.addEventListener('DOMContentLoaded', function () {
  const urlParams = new URLSearchParams(window.location.search);
  const refrigeradorId = urlParams.get('id');
  const temperatureTable = document.querySelector('#temperature-table tbody');

  // Función para determinar el nivel de peligro basado en la temperatura y el tipo de equipo
  function getDangerLevel(temperature, equipo) {
    if (equipo === 'Refrigerador') {
      // Rangos para refrigeradores (pasteles)
      if (temperature > 25) {
        return { text: '⚠️ MUY CALIENTE ⚠️', color: 'black', bgColor: '#ffcccc', fontWeight: 'bold' }; // Rosa claro
      } else if (temperature > 20) {
        return { text: '⚠️ CALIENTE ⚠️', color: 'black', bgColor: '#ffe6cc', fontWeight: 'bold' }; // Naranja claro
      } else if (temperature < 2) {
        return { text: '❄️ MUY FRÍO ❄️', color: 'black', bgColor: '#cce6ff', fontWeight: 'bold' }; // Azul claro
      } else if (temperature < 5) {
        return { text: '❄️ FRÍO ❄️', color: 'black', bgColor: '#e6f2ff', fontWeight: 'bold' }; // Azul muy claro
      } else {
        return { text: '✔️ IDEAL ✔️', color: 'black', bgColor: '#d6ffd6', fontWeight: 'bold' }; // Verde claro
      }
    } else if (equipo === 'Congelador') {
      // Rangos para congeladores (productos congelados)
      if (temperature > -10) {
        return { text: '⚠️ MUY CALIENTE ⚠️', color: 'black', bgColor: '#ffcccc', fontWeight: 'bold' }; // Rosa claro
      } else if (temperature > -15) {
        return { text: '⚠️ CALIENTE ⚠️', color: 'black', bgColor: '#ffe6cc', fontWeight: 'bold' }; // Naranja claro
      } else if (temperature < -25) {
        return { text: '❄️ MUY FRÍO ❄️', color: 'black', bgColor: '#cce6ff', fontWeight: 'bold' }; // Azul claro
      } else if (temperature < -20) {
        return { text: '❄️ FRÍO ❄️', color: 'black', bgColor: '#e6f2ff', fontWeight: 'bold' }; // Azul muy claro
      } else {
        return { text: '✔️ IDEAL ✔️', color: 'black', bgColor: '#d6ffd6', fontWeight: 'bold' }; // Verde claro
      }
    } else {
      // Si el equipo no es reconocido, marcar como desconocido
      return { text: '❓ DESCONOCIDO ❓', color: 'black', bgColor: '#f2f2f2', fontWeight: 'bold' }; // Gris claro
    }
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

  // Función para agregar una fila a la tabla
  function addRowToTable(dato) {
    const row = temperatureTable.insertRow(0); // Insertar en la primera posición

    // Insertar fecha
    row.insertCell(0).textContent = new Date(dato.fecha).toLocaleString('es-CL'); // Chile

    // Insertar temperatura
    row.insertCell(1).textContent = dato.temperatura;

    // Insertar nivel de peligro
    const dangerLevelCell = row.insertCell(2);
    const dangerLevel = getDangerLevel(dato.temperatura, dato.equipo);
    dangerLevelCell.textContent = dangerLevel.text;
    dangerLevelCell.style.color = dangerLevel.color;
    dangerLevelCell.style.backgroundColor = dangerLevel.bgColor;
    dangerLevelCell.style.fontWeight = dangerLevel.fontWeight;
    dangerLevelCell.style.fontSize = '20px'; // Texto más grande
    dangerLevelCell.style.textTransform = 'uppercase'; // Mayúsculas
    dangerLevelCell.style.padding = '15px'; // Espaciado interno
    dangerLevelCell.style.borderRadius = '8px'; // Bordes redondeados
    dangerLevelCell.style.textAlign = 'center'; // Centrado del texto

    // Insertar equipo
    row.insertCell(3).textContent = dato.equipo;

    // Añadir evento de clic para mostrar los datos adicionales
    row.addEventListener('click', () => {
      showModal(dato.uid, dato.ip);
    });
  }

  // Cargar datos iniciales desde la API
  if (refrigeradorId) {
    fetch(`http://localhost:3000/api/refrigerador/${refrigeradorId}/datos`)
      .then((response) => response.json())
      .then((datos) => {
        datos.forEach((dato) => {
          addRowToTable(dato);
        });
      })
      .catch((error) => console.error('Error al cargar los datos:', error));
  }

  // Conexión WebSocket para recibir actualizaciones en tiempo real
  const socket = new WebSocket('ws://localhost:3000'); // Conexión al servidor WebSocket

  socket.onopen = () => {
    console.log('Conectado al servidor WebSocket');
  };

  socket.onmessage = (event) => {
    const data = JSON.parse(event.data);
    console.log('Datos actualizados:', data);

    if (data.data && data.data.length > 0) {
      data.data.forEach((dato) => {
        addRowToTable(dato);
      });
    }
  };

  socket.onerror = (error) => {
    console.error('Error en la conexión WebSocket:', error);
  };
});