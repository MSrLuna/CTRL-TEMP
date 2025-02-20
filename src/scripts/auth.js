document.getElementById('login-form').addEventListener('submit', async (event) => {
    event.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('http://localhost:3000/api/auth', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password }),
        });

        const data = await response.json();

        if (response.ok) {
            // Guardar el usuario en el almacenamiento local
            localStorage.setItem('isAuthenticated', 'true');
            localStorage.setItem('username', data.username); // Usar el nombre de usuario devuelto
            // Redirigir al índice
            window.location.href = '/';
        } else {
            // Mostrar el mensaje de error
            const errorMessage = document.getElementById('error-message');
            errorMessage.textContent = data.error;
            errorMessage.style.display = 'block';
        }
    } catch (error) {
        console.error('Error al iniciar sesión:', error);
        const errorMessage = document.getElementById('error-message');
        errorMessage.textContent = 'Error al conectar con el servidor';
        errorMessage.style.display = 'block';
    }
});