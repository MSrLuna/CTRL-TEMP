document.addEventListener('DOMContentLoaded', () => {
    const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
    const loginButton = document.getElementById('login-button');
    const logoutButton = document.getElementById('logout-button');
    const configButton = document.getElementById('config-button');
  
    if (isAuthenticated) {
      loginButton.style.display = 'none';
      logoutButton.style.display = 'inline-block';
      configButton.style.display = 'inline-block';
    } else {
      loginButton.style.display = 'inline-block';
      logoutButton.style.display = 'none';
      configButton.style.display = 'none';
    }
  
    logoutButton.addEventListener('click', () => {
      // Borrar estado de sesión
      localStorage.removeItem('isAuthenticated');
      localStorage.removeItem('username');
      // Recargar la página para aplicar cambios
      window.location.reload();
    });
  });
  