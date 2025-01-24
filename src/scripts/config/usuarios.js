document.addEventListener('DOMContentLoaded', function () {
  const apiUrl = 'http://localhost:3000/api/usuarios';
  const tableBody = document.getElementById('user-table-body');
  const modal = document.getElementById('modal');
  const modalUsername = document.getElementById('modal-username');
  const modalEmail = document.getElementById('modal-email');
  const searchInput = document.getElementById('search-input');
  const filterSelect = document.getElementById('filter-select');
  let allUsers = []; // Para almacenar todos los usuarios cargados

  // Función para mostrar el modal con los datos del usuario
  function showModal(user) {
    modalUsername.textContent = user.usuario;
    modalEmail.textContent = user.email || 'Sin email';
    modal.style.display = 'block';
  }

  // Función para cerrar el modal
  function closeModal() {
    modal.style.display = 'none';
  }
  window.closeModal = closeModal; // Hacer accesible desde el HTML

  // Función para cargar usuarios
  async function loadUsers() {
    try {
      const response = await fetch(apiUrl);
      if (!response.ok) throw new Error('Error al obtener los usuarios');

      const users = await response.json();
      allUsers = users; // Guardar todos los usuarios
      renderUsers(users);
    } catch (error) {
      console.error('Error al cargar los usuarios:', error);
    }
  }

  // Función para renderizar usuarios en la tabla
  function renderUsers(users) {
    tableBody.innerHTML = ''; // Limpiar la tabla

    users.forEach((user) => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${user.id}</td>
        <td>${user.nombre}</td>
        <td>${user.apellido}</td>
      `;
      tableBody.appendChild(row);

      // Asignar evento de clic a la fila
      row.addEventListener('click', async () => {
        try {
          const userResponse = await fetch(`${apiUrl}/${user.id}`);
          if (!userResponse.ok) throw new Error('Error al obtener datos del usuario');

          const userData = await userResponse.json();
          showModal(userData);
        } catch (error) {
          console.error('Error al mostrar el modal:', error);
        }
      });
    });
  }

  // Función para filtrar usuarios
  function filterUsers() {
    const filterField = filterSelect.value; // Campo seleccionado
    const searchTerm = searchInput.value.toLowerCase(); // Término de búsqueda

    const filteredUsers = allUsers.filter((user) => {
      const fieldValue = user[filterField]?.toString().toLowerCase() || '';
      return fieldValue.includes(searchTerm);
    });

    renderUsers(filteredUsers); // Volver a renderizar los usuarios filtrados
  }

  // Eventos para la barra de búsqueda
  searchInput.addEventListener('input', filterUsers);
  filterSelect.addEventListener('change', filterUsers);

  // Cargar usuarios al iniciar
  loadUsers();
});