document.addEventListener('DOMContentLoaded', () => {
  // Manejar clic en el botón "Volver"
  const backButton = document.getElementById('back-button');
  backButton.addEventListener('click', () => {
    if (document.referrer) {
      window.history.back(); // Navega a la página anterior si existe
    } else {
      window.location.href = '/'; // Redirige a la página de inicio si no hay historial
    }
  });

  // Cargar botones de equipos
  const container = document.getElementById('refrigerador-buttons-container');
  fetch('http://localhost:3000/api/refrigeradores')
    .then(response => response.json())
    .then(refrigeradores => {
      refrigeradores.forEach((refrigerador, index) => {
        // Crear un contenedor para cada equipo
        const teamContainer = document.createElement('div');
        teamContainer.className = 'team-container';
        
        // Recuperar el nombre guardado en localStorage, si existe
        let savedName = localStorage.getItem(`teamName_${refrigerador.id}`);
        if (!savedName) {
          savedName = `Equipo ${index + 1}`; // Nombre por defecto
        }

        // Crear un botón para el equipo (con el nombre guardado o por defecto)
        const button = document.createElement('button');
        button.textContent = savedName;
        button.className = 'refrigerador-button';

        // Crear botón de "Editar"
        const editButton = document.createElement('button');
        editButton.textContent = 'Editar';
        editButton.className = 'edit-button';

        // Crear un campo de entrada y botón de guardar (inicialmente ocultos)
        const input = document.createElement('input');
        input.type = 'text';
        input.value = savedName;
        input.className = 'edit-team-name';
        input.style.display = 'none'; // Ocultar al principio

        const saveButton = document.createElement('button');
        saveButton.textContent = 'Guardar';
        saveButton.className = 'save-team-name';
        saveButton.style.display = 'none'; // Ocultar al principio

        // Evento para editar el nombre del equipo
        editButton.onclick = () => {
          // Mostrar el modal
          const modal = document.getElementById('edit-modal');
          const modalInput = document.getElementById('team-name-input');
          const saveModalButton = document.getElementById('save-name-button');

          modal.style.display = 'flex'; // Mostrar modal

          // Prellenar el campo de entrada con el nombre actual
          modalInput.value = savedName;

          // Evento para guardar el nombre editado desde el modal
          saveModalButton.onclick = () => {
            const newName = modalInput.value.trim();
            if (newName) {
              // Actualizar el nombre en el botón
              button.textContent = newName;
              localStorage.setItem(`teamName_${refrigerador.id}`, newName); // Guardar en localStorage
              modal.style.display = 'none'; // Ocultar el modal
              // Actualizar el nombre del equipo en el servidor
              fetch(`http://localhost:3000/api/updateEquipo/${refrigerador.id}`, {
                method: 'PUT',
                body: JSON.stringify({ nombre: newName }),
                headers: { 'Content-Type': 'application/json' },
              })
              .then(response => response.json())
              .then(data => {
                if (data.message) {
                  showMessageModal('Éxito', data.message); // Mostrar el modal de éxito
                }
              })
              .catch(error => {
                console.error('Error al actualizar el equipo:', error);
                showMessageModal('Error', 'Hubo un error al guardar el nombre del equipo.'); // Mostrar el modal de error
              });
            } else {
              showMessageModal('Error', 'El nombre no puede estar vacío.'); // Mostrar el modal de error
            }
          };
        };

        // Agregar los elementos al contenedor del equipo
        teamContainer.appendChild(button);
        teamContainer.appendChild(editButton);
        teamContainer.appendChild(input);
        teamContainer.appendChild(saveButton);
        
        // Cuando el botón del equipo sea clickeado, redirige a la página correspondiente
        button.onclick = () => {
          window.location.href = `/views/refrigerador?id=${refrigerador.id}`;
        };

        // Agregar el contenedor del equipo al contenedor principal
        container.appendChild(teamContainer);
      });
    })
    .catch(error => console.error('Error al cargar los refrigeradores:', error));
});

// Función para mostrar el modal con un mensaje específico
function showMessageModal(title, message) {
  const modal = document.getElementById('message-modal');
  const modalTitle = document.getElementById('message-title');
  const modalText = document.getElementById('message-text');
  
  // Establecer el contenido del título y el mensaje
  modalTitle.textContent = title;
  modalText.textContent = message;
  
  // Mostrar el modal
  modal.style.display = 'flex';
  
  // Evento para cerrar el modal
  const closeButton = document.getElementById('message-close-button');
  closeButton.onclick = () => {
    modal.style.display = 'none';
  };
}

// Configuración del WebSocket y demás funcionalidades
const socket = new WebSocket('ws://localhost:3000'); 

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

// Registrar el Service Worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js').then((registration) => {
      console.log('Service Worker registrado con éxito:', registration);
    }).catch((error) => {
      console.log('Error al registrar el Service Worker:', error);
    });
  });
}
