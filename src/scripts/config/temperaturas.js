document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('danger-level-form');

  // Función para enviar los datos al servidor
  async function updateDangerLevels(data) {
    try {
      const response = await fetch('http://localhost:3000/api/configuracion', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`Error al actualizar los niveles de peligro: ${response.statusText}`);
      }

      const result = await response.json(); // Parsea la respuesta del servidor
      alert(result.message || 'Niveles de peligro actualizados correctamente');
    } catch (error) {
      console.error(error);
      alert('Ocurrió un error al actualizar los niveles de peligro');
    }
  }

  // Manejador del formulario
  form.addEventListener('submit', function (event) {
    event.preventDefault(); // Evita que el formulario se envíe de forma predeterminada

    // Obtener los valores del formulario
    const formData = new FormData(form);
    const data = {
      refrigerador: {
        muyCaliente: parseFloat(formData.get('refrigerador-muy-caliente')),
        caliente: parseFloat(formData.get('refrigerador-caliente')),
        frio: parseFloat(formData.get('refrigerador-frio')),
        muyFrio: parseFloat(formData.get('refrigerador-muy-frio')),
      },
      congelador: {
        muyCaliente: parseFloat(formData.get('congelador-muy-caliente')),
        caliente: parseFloat(formData.get('congelador-caliente')),
        frio: parseFloat(formData.get('congelador-frio')),
        muyFrio: parseFloat(formData.get('congelador-muy-frio')),
      },
    };

    // Validar que los valores sean números válidos
    const isValid = Object.values(data.refrigerador).every((value) => !isNaN(value)) &&
                    Object.values(data.congelador).every((value) => !isNaN(value));

    if (!isValid) {
      alert('Por favor, ingresa valores numéricos válidos en todos los campos.');
      return;
    }

    // Enviar los datos al servidor
    updateDangerLevels(data);
  });
});