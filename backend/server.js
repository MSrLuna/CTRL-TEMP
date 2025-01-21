const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const WebSocket = require('ws');
const moment = require('moment-timezone'); // Para manejar zonas horarias

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

// Configuración de conexión MySQL
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '0808', // Ajusta la contraseña según tu configuración
  database: 'pasteleria_rhenania',
  timezone: 'Z', // Usamos UTC en la conexión.
});

// Verificar conexión a la base de datos
db.connect((err) => {
  if (err) {
    console.error('Error al conectar a la base de datos:', err.stack);
    return;
  }
  console.log('Conexión a la base de datos establecida');
});

// Servidor WebSocket
const wss = new WebSocket.Server({ noServer: true });

wss.on('connection', (ws) => {
  console.log('Cliente WebSocket conectado');
  ws.on('message', (message) => {
    console.log('Mensaje del cliente:', message);
  });
});

// Ruta principal
app.get('/', (req, res) => {
  res.send('Servidor funcionando correctamente');
});

// Obtener refrigeradores
app.get('/api/refrigeradores', (req, res) => {
  db.query('SELECT * FROM refrigeradores', (err, results) => {
    if (err) {
      console.error('Error al obtener refrigeradores:', err.stack);
      res.status(500).json({ error: 'Error al obtener refrigeradores' });
    } else {
      res.json(results);
    }
  });
});

// Insertar datos de temperatura
app.post('/api/refrigerador/datos', (req, res) => {
  const { refrigeradorId, uid, temperatura, ip, equipo } = req.body;

  if (!refrigeradorId || !uid || !temperatura || !ip || !equipo) {
    return res.status(400).json({ error: 'Todos los campos son obligatorios' });
  }

  const fecha = new Date(); // Obtener la fecha y hora tal como está

  const query = `
    INSERT INTO datos_temperatura (refrigerador_id, uid, fecha, temperatura, ip, equipo) 
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  db.query(query, [refrigeradorId, uid, fecha, temperatura, ip, equipo], (err, results) => {
    if (err) {
      console.error('Error al insertar los datos:', err.stack);
      res.status(500).json({ error: 'Error al insertar los datos' });
    } else {
      console.log('Dato insertado correctamente:', results);
      const newData = {
        message: 'Nuevo dato de temperatura',
        data: [{ refrigerador_id: refrigeradorId, uid, fecha, temperatura, ip, equipo }],
      };
      wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify(newData));
        }
      });
      res.status(201).json({ message: 'Dato insertado correctamente' });
    }
  });
});

// Obtener datos de temperatura de un refrigerador específico
app.get('/api/refrigerador/:id/datos', (req, res) => {
  const refrigeradorId = req.params.id;

  db.query('SELECT * FROM datos_temperatura WHERE refrigerador_id = ?', [refrigeradorId], (err, results) => {
    if (err) {
      console.error('Error al obtener los datos de temperatura:', err.stack);
      res.status(500).json({ error: 'Error al obtener los datos de temperatura' });
    } else {
      res.json(results); // Devolvemos la fecha tal cual está
    }
  });
});

// Actualizar nombre del equipo
app.put('/api/updateEquipo/:id', (req, res) => {
  const equipoId = req.params.id;
  const { nombre } = req.body;

  if (!nombre) {
    return res.status(400).json({ error: 'El nombre es obligatorio' });
  }

  const query = `UPDATE refrigeradores SET nombre = ? WHERE id = ?`;

  db.query(query, [nombre, equipoId], (err, results) => {
    if (err) {
      console.error('Error al actualizar el nombre del equipo:', err.stack);
      return res.status(500).json({ error: 'Error al actualizar el nombre del equipo' });
    }

    if (results.affectedRows > 0) {
      return res.json({ message: 'Nombre del equipo actualizado correctamente' });
    } else {
      return res.status(404).json({ error: 'Equipo no encontrado' });
    }
  });
});

// Iniciar servidor
app.server = app.listen(port, () => {
  console.log(`Servidor en ejecución en http://localhost:${port}`);
});

// Configurar WebSocket con Express
app.server.on('upgrade', (request, socket, head) => {
  wss.handleUpgrade(request, socket, head, (ws) => {
    wss.emit('connection', ws, request);
  });
});
