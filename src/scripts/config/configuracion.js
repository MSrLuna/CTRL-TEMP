// Agregar evento al formulario de autenticación
document.getElementById('auth-form').addEventListener('submit', function (event) {
  event.preventDefault(); // Prevenir el envío del formulario

  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  // Credenciales por defecto
  const defaultUsername = 'admin';
  const defaultPassword = '123';

  // Validar si coinciden con las credenciales por defecto
  if (username === defaultUsername && password === defaultPassword) {
    console.log('Autenticación exitosa con credenciales por defecto');
    showMessageModal('Autenticación exitosa', 'Ha iniciado sesión con las credenciales por defecto.');
    closeAuthModal(); // Cerrar modal al autenticar
    return;
  }

  // Enviar datos al backend
  fetch('/api/auth', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, password }),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log('Respuesta del servidor:', data);
      if (data.message === 'Autenticación exitosa') {
        showMessageModal('Autenticación exitosa', 'Inicio de sesión exitoso.');
        closeAuthModal(); // Cerrar modal al autenticar
      } else {
        const errorMessage =
          data.error === 'Usuario no encontrado'
            ? 'El usuario no existe. Verifique las credenciales.'
            : data.error === 'Contraseña incorrecta'
            ? 'Contraseña incorrecta. Inténtelo de nuevo.'
            : 'Error desconocido. Inténtelo más tarde.';
        showMessageModal('Error de autenticación', errorMessage);
      }
    })
    .catch((error) => {
      console.error('Error al intentar autenticar:', error);
      showMessageModal('Error de autenticación', 'Hubo un error al intentar autenticar. Inténtelo más tarde.');
    });
});

// Función para cerrar el modal de autenticación
function closeAuthModal() {
  const modal = document.getElementById('modal');
  if (modal) {
    modal.style.display = 'none';
  }
}

// Función para mostrar el modal de mensajes
function showMessageModal(title, message) {
  const messageModal = document.getElementById('message-modal');
  const messageTitle = document.getElementById('message-title');
  const messageText = document.getElementById('message-text');

  if (messageModal && messageTitle && messageText) {
    messageTitle.textContent = title;
    messageText.textContent = message;
    messageModal.style.display = 'block';

    const closeButton = document.getElementById('message-close-button');
    if (closeButton) {
      closeButton.addEventListener('click', function () {
        messageModal.style.display = 'none';
      });
    }
  }
}
