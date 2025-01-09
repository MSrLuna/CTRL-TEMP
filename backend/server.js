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
  password: '0808',
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

// Ruta para insertar un dato de temperatura
app.post('/api/refrigerador/:id/datos', (req, res) => {
  const { refrigeradorId, uid, fecha, temperatura, ip } = req.body;
  const query = 'INSERT INTO datos_temperatura (refrigerador_id, uid, fecha, temperatura, ip) VALUES (?, ?, ?, ?, ?)';

  db.query(query, [refrigeradorId, uid, fecha, temperatura, ip], (err, results) => {
    if (err) {
      console.error('Error al insertar los datos:', err.stack);
      res.status(500).send('Error al insertar los datos');
    } else {
      // Enviar notificación a los clientes WebSocket cuando se inserta un nuevo dato
      const newData = { message: 'Nuevo dato de temperatura', data: [{ refrigerador_id: refrigeradorId, uid, fecha, temperatura, ip }] };
      wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify(newData));
        }
      });

      res.status(201).send('Dato insertado correctamente');
    }
  });
});

// Ruta para eliminar un dato de temperatura
app.delete('/api/datos_temperatura/:id', (req, res) => {
  const { id } = req.params;
  const query = 'DELETE FROM datos_temperatura WHERE id = ?';

  db.query(query, [id], (err, results) => {
    if (err) {
      console.error('Error al eliminar los datos:', err.stack);
      res.status(500).send('Error al eliminar los datos');
    } else {
      // Enviar notificación a los clientes WebSocket cuando se elimina un dato
      const deletedData = { message: 'Dato de temperatura eliminado', data: [{ id }] };
      wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify(deletedData));
        }
      });

      res.status(200).send('Dato eliminado correctamente');
    }
  });
});

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
