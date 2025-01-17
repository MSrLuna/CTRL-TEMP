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
  password: '0808', // Cambia por tu contraseña de MySQL
  database: 'pasteleria_rhenania'
});

// Verificar conexión a la base de datos
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
  console.log('Cliente WebSocket conectado');

  ws.on('message', (message) => {
    console.log('Mensaje del cliente:', message);
  });
});

// Ruta para la raíz
app.get('/', (req, res) => {
  res.send('Servidor funcionando correctamente');
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

// Ruta para insertar un dato de temperatura
app.post('/api/refrigerador/datos', (req, res) => {
  const { refrigeradorId, uid, temperatura, ip, equipo } = req.body;

  const query = `
    INSERT INTO datos_temperatura (refrigerador_id, uid, temperatura, ip, equipo) 
    VALUES (?, ?, ?, ?, ?)
  `;

  db.query(query, [refrigeradorId, uid, temperatura, ip, equipo], (err, results) => {
    if (err) {
      console.error('Error al insertar los datos:', err.stack);
      res.status(500).send('Error al insertar los datos');
    } else {
      console.log('Dato insertado correctamente:', results);

      // Notificar a los clientes WebSocket cuando se inserta un nuevo dato
      const newData = {
        message: 'Nuevo dato de temperatura',
        data: [{ refrigerador_id: refrigeradorId, uid, temperatura, ip, equipo }]
      };
      wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify(newData));
        }
      });

      res.status(201).send('Dato insertado correctamente');
    }
  });
});

// Ruta para obtener los datos de temperatura de un refrigerador específico
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

// Iniciar el servidor HTTP y WebSocket
app.server = app.listen(port, () => {
  console.log(`Servidor en ejecución en http://localhost:${port}`);
});

// WebSocket escucha la misma URL que el servidor de Express
app.server.on('upgrade', (request, socket, head) => {
  wss.handleUpgrade(request, socket, head, (ws) => {
    wss.emit('connection', ws, request);
  });
});
