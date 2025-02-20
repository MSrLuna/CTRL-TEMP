document.addEventListener('DOMContentLoaded', function () {
    const wifiForm = document.getElementById('wifi-form');

    wifiForm.addEventListener('submit', function (e) {
        e.preventDefault(); // Evita que el formulario se envíe de forma tradicional

        // Obtiene los datos del formulario
        const formData = new FormData(wifiForm);
        const data = {
            wifiName: formData.get('wifi-name'),
            wifiPassword: formData.get('wifi-password'),
            wifiIp: formData.get('wifi-ip'),
            medicionIntervalo: parseInt(formData.get('medicion-intervalo'), 10),
        };

        // Envía los datos al servidor
        fetch('/api/guardarWifi', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })
            .then((response) => response.json())
            .then((result) => {
                if (result.message) {
                    alert(result.message); // Muestra un mensaje de éxito
                } else {
                    alert('Configuración guardada correctamente');
                }
            })
            .catch((error) => {
                console.error('Error:', error);
                alert('Error al guardar la configuración');
            });
    });
});