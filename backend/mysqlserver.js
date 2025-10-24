require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');

const app = express();
app.use(cors());
app.use(express.json());

// 🔌 Conexión a MySQL
const db = mysql.createConnection({
  host: 'localhost',
  user: 'admin',
  password: 'admin',
  database: 'tk',
});
// const db = mysql.createConnection({
//   host: process.env.DB_HOST,
//   user: process.env.DB_USER,
//   password: process.env.DB_PASSWORD,
//   database: process.env.DB_NAME,
// });

db.connect((err) => {
  if (err) {
    console.error('❌ Error al conectar a MySQL:', err);
  } else {
    console.log('✅ Conectado a MySQL');
  }
});

// 📋 Ruta para obtener empleados
app.get('/api/empleados', (req, res) => {
  db.query('SELECT * FROM empleados', (err, results) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.json(results);
  });
});

// 📋 Ruta para agregar un empleado
app.post('/api/empleados', (req, res) => {
  const { nombre, apellido, email, puesto } = req.body;
  const sql = 'INSERT INTO empleados (nombre, apellido, email, puesto) VALUES (?, ?, ?, ?)';
  db.query(sql, [nombre, apellido, email, puesto], (err, result) => {
    if (err) return res.status(500).send(err);
    res.json({ id: result.insertId, nombre, apellido, email, puesto });
  });
});

app.listen(process.env.PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${process.env.PORT}`);
});
