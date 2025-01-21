document.addEventListener('DOMContentLoaded', () => {
    console.log('Página principal cargada.');
  
    const redirectButton = document.querySelector('button');
    if (redirectButton) {
      redirectButton.addEventListener('click', () => {
        console.log('Redirigiendo a la página de refrigeradores...');
        window.location.href = '/refrigeradores';
      });
    }
  });
  