const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const WebSocket = require('ws'); // Importa WebSocket

const app = express();
const port = 3000;

// Configuración CORS
app.use(cors());
app.use(express.json());

// Configurar conexión a la base de datos MySQL
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Luna0808.',
  database: 'pasteleria_rhenania'
});

// Verificar conexión
db.connect((err) => {
  if (err) {
    console.error('Error al conectar a la base de datos:', err.stack);
    return;
  }
  console.log('Conexión a la base de datos establecida');
});

// Crear el servidor de WebSocket
const wss = new WebSocket.Server({ noServer: true });

// Gestionar las conexiones WebSocket
wss.on('connection', (ws) => {
  console.log('Cliente conectado');
  
  // Enviar datos de temperatura cada vez que se actualice la base de datos
  ws.on('message', (message) => {
    console.log('Mensaje del cliente: ', message);
  });
});

// Ruta para obtener los refrigeradores
app.get('/api/refrigeradores', (req, res) => {
  db.query('SELECT * FROM refrigeradores', (err, results) => {
    if (err) {
      console.error('Error al obtener refrigeradores:', err.stack);
      res.status(500).send('Error al obtener refrigeradores');
    } else {
      res.json(results);
    }
  });
});

// Ruta para obtener los datos de temperatura de un refrigerador
app.get('/api/refrigerador/:id/datos', (req, res) => {
  const refrigeradorId = req.params.id;
  db.query('SELECT * FROM datos_temperatura WHERE refrigerador_id = ?', [refrigeradorId], (err, results) => {
    if (err) {
      console.error('Error al obtener los datos de temperatura:', err.stack);
      res.status(500).send('Error al obtener los datos de temperatura');
    } else {
      res.json(results);
    }
  });
});

// Método para detectar cambios en la base de datos y notificar a los clientes WebSocket
setInterval(() => {
  // Aquí puedes poner lógica para verificar si hay cambios en la base de datos
  // Si hay un cambio, notificamos a todos los clientes conectados

  const data = { message: 'Nueva actualización en los datos' }; // Simulando una actualización
  wss.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(data));
    }
  });
}, 5000); // Revisa cambios cada 5 segundos

// Iniciar el servidor de WebSocket
app.server = app.listen(port, () => {
  console.log(`Servidor en ejecución en http://localhost:${port}`);
});

// WebSocket escucha la misma URL que el servidor de Express
app.server.on('upgrade', (request, socket, head) => {
  wss.handleUpgrade(request, socket, head, (ws) => {
    wss.emit('connection', ws, request);
  });
});
