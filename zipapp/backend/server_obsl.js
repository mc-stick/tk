//  Importación de módulos
const express = require('express');
const initSqlJs = require('sql.js');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
require('dotenv').config();
const twilio = require('twilio'); 

// Constantes de configuración
const app = express();
const SECRET = 'tu_clave_secreta';
const DB_FILE = './users.sqlite';
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

//  Middleware para log de rutas
app.use((req, res, next) => {
  console.log('Ruta solicitada:', req.method, req.path);
  next();
});

//  Guardar base de datos a disco
function saveDatabase() {
  const data = db.export();
  const buffer = Buffer.from(data);
  fs.writeFileSync(DB_FILE, buffer);
}

// Twilio cli
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);


let SQL, db;

// Inicialización de la base de datos
(async () => {
  SQL = await initSqlJs();

  if (fs.existsSync(DB_FILE)) {
    const filebuffer = fs.readFileSync(DB_FILE);
    db = new SQL.Database(filebuffer);
  } else {
    db = new SQL.Database();

    // Crear tablas iniciales
    db.run(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE,
        password_hash TEXT,
        role TEXT
      );
    `);

    db.run(`
      CREATE TABLE IF NOT EXISTS turnos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        numero INTEGER NOT NULL,
        tipo TEXT NOT NULL,
        fecha TEXT NOT NULL,
        puesto TEXT NOT NULL,
        estado TEXT,
        isactive BOOL
      );
    `);

    db.run(`
      CREATE TABLE IF NOT EXISTS contador (
        id INTEGER PRIMARY KEY,
        valor INTEGER
      );
    `);

    // Inicializar contador si no existe
    const contadorCheck = db.exec("SELECT * FROM contador WHERE id = 1");
    if (contadorCheck.length === 0) {
      db.run("INSERT INTO contador (id, valor) VALUES (1, 0)");
    }

    // Usuarios por defecto
    const defaultUsers = [
      { username: 'admin', password: 'admin', role: 'admin' },
      { username: 'operator', password: 'operator', role: 'operator' },
      { username: 'operator2', password: 'operator', role: 'operator' },
      { username: 'operator3', password: 'operator', role: 'operator' },
    ];

    for (const user of defaultUsers) {
      const hash = await bcrypt.hash(user.password, 10);
      db.run(
        `INSERT INTO users (username, password_hash, role) VALUES (?, ?, ?)`,
        [user.username, hash, user.role]
      );
    }

    saveDatabase();
    console.log('📦 Base de datos y usuarios por defecto creados.');
  }

  // Servir aplicación estática (React)
  app.use(express.static(path.join(__dirname, 'dist')));

  // Registro de usuario
  app.post('/register', async (req, res) => {
    const { username, password, role } = req.body;
    if (!username || !password || !role)
      return res.status(400).json({ message: 'Faltan datos' });

    const existing = db.exec(`SELECT * FROM users WHERE username = '${username.replace(/'/g, "''")}'`);
    if (existing.length > 0)
      return res.status(409).json({ message: 'Usuario ya existe' });

    const hash = await bcrypt.hash(password, 10);
    db.run(
      `INSERT INTO users (username, password_hash, role) VALUES (?, ?, ?)`,
      [username, hash, role]
    );
    saveDatabase();

    res.json({ username, role });
  });

  // Login de usuario
  app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password)
      return res.status(400).json({ message: 'Faltan datos' });

    const safeUsername = username.replace(/'/g, "''");
    const result = db.exec(`SELECT * FROM users WHERE username = '${safeUsername}'`);
    if (result.length === 0)
      return res.status(401).json({ message: 'Usuario no encontrado' });

    const [id, uname, hash, role] = result[0].values[0];

    const valid = await bcrypt.compare(password, hash);
    if (!valid)
      return res.status(401).json({ message: 'Contraseña incorrecta' });

    const token = jwt.sign({ id, username: uname, role }, SECRET, { expiresIn: '2h' });

    res.json({ token, username: uname, role });
  });

  // Middleware de autenticación
  const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader?.split(' ')[1];
    if (!token)
      return res.status(401).json({ message: 'Token no proporcionado' });

    jwt.verify(token, SECRET, (err, user) => {
      if (err)
        return res.status(403).json({ message: 'Token inválido' });

      req.user = user;
      next();
    });
  };

  // Ruta protegida de prueba
  app.get('/protected', authenticateToken, (req, res) => {
    res.json({ message: `Hola ${req.user.username}, rol: ${req.user.role}` });
  });

  // TURNOS — Obtener turno actual
  app.get('/turnoactual', (req, res) => {
    const result = db.exec("SELECT * FROM turnos WHERE estado = 'atendiendo'");
    if (result.length > 0) {
      const [id, numero, tipo, fecha, puesto, estado, isactive] = result;
      res.json({ id, numero, tipo, fecha, puesto, estado, isactive });
    } else {
      res.json(null);
    }
  });

  //turnos atendiendo

  //  app.get('/atendiendo', (req, res) => {
  //   const result = db.exec("SELECT * FROM turnos WHERE estado = 'atendiendo' ORDER BY id ASC");
  //   const cola = result.length > 0
  //     ? result[0].values.map(([id, numero, tipo, fecha, puesto, estado, isactive]) => ({
  //         id, numero, tipo, fecha, puesto, estado, isactive
  //       }))
  //     : [];
  //   res.json(cola);
  // });

  // TURNOS — Obtener cola
  app.get('/cola', (req, res) => {
    const result = db.exec("SELECT * FROM turnos WHERE estado = 'espera' ORDER BY id ASC");
    const cola = result.length > 0
      ? result[0].values.map(([id, numero, tipo, fecha, puesto, estado, isactive]) => ({
          id, numero, tipo, fecha, puesto, estado, isactive
        }))
      : [];
    res.json(cola);
  });

  // TURNOS — Ver todos los datos
  app.get('/alldata', (req, res) => {
    const result = db.exec("SELECT * FROM turnos");
    const all = result.length > 0
      ? result[0].values.map(([id, numero, tipo, fecha, puesto, estado, isactive]) => ({
          id, numero, tipo, fecha, puesto, estado, isactive
        }))
      : [];
    res.json(all);
  });

  // TURNOS — Generar nuevo turno
  app.post('/generarturno', (req, res) => {
    const { tipo } = req.body;
    if (!tipo) return res.status(400).json({ message: 'Tipo requerido' });

    const contadorResult = db.exec("SELECT valor FROM contador WHERE id = 1");
    const contador = contadorResult.length > 0 ? contadorResult[0].values[0][0] : 0;
    const nuevoNumero = contador + 1;
    const fecha = new Date().toISOString();

    db.run(
      `INSERT INTO turnos (numero, tipo, estado, fecha, puesto, isactive) VALUES (?, ?, ?, ?, ?, ?)`,
      [nuevoNumero, tipo, 'espera', fecha, 'espera', true]
    );

    db.run(`UPDATE contador SET valor = ? WHERE id = 1`, [nuevoNumero]);
    saveDatabase();

    res.json({ numero: nuevoNumero, tipo });
  });

  // TURNOS — Llamar siguiente turno
  app.post('/llamarsiguiente', (req, res) => {
    const { puesto } = req.body;

    const result = db.exec("SELECT * FROM turnos WHERE estado = 'espera' ORDER BY id ASC LIMIT 1");

    if (result.length > 0) {
      const [id, numero, tipo] = result[0].values[0];
      db.run(`UPDATE turnos SET estado = 'actual', puesto = ? WHERE id = ?`, [puesto, id]);
      saveDatabase();

      res.json({ id, numero, tipo, puesto, estado: 'actual' });
    } else {
      res.json(null);
    }
  });

  // TURNOS — Llamar por ID
  app.post('/llamarporid', (req, res) => {
    const { id, puesto } = req.body;
    if (!id || !puesto) return res.status(400).json({ error: 'Faltan parámetros' });

    const result = db.exec(`SELECT * FROM turnos WHERE id = ${id}`);
    if (result.length > 0) {
      const [_, numero, tipo] = result[0].values[0];
      db.run(`UPDATE turnos SET isactive = 0 WHERE puesto = ? AND estado = 'atendiendo'`, [puesto]); //DESACTIVA EL TURNO ANTERIOR

      db.run(`UPDATE turnos SET estado = 'atendiendo', puesto = ? WHERE id = ?`, [puesto, id]);
      console.log(puesto)
      saveDatabase();

      res.json({ id, numero, tipo, puesto, estado: 'atendiendo' });
    } else {
      res.status(404).json({ error: 'Turno no encontrado' });
    }
  });

  // Configuracion Twilio //////////////////////////////////////////////////////
  app.post('/api/SendSms', express.json(), (req, res) => {
  const { numeroDestino, mensaje } = req.body;

  client.messages
    .create({
      body: mensaje,
      from: process.env.TWILIO_PHONE_NUMBER, // tu número Twilio
      to: numeroDestino
    })
    .then(message => {
      console.log('Mensaje enviado:', message.sid);
      res.status(200).send({ success: true, sid: message.sid });
    })
    .catch(err => {
      console.error('Error enviando SMS:', err);
      res.status(500).send({ success: false, error: err.message });
    });
});

  // Cambiar contraseña
  app.post('/change-password', authenticateToken, async (req, res) => {
    const { currentPassword, newPassword } = req.body;
    const username = req.user.username;

    if (!currentPassword || !newPassword)
      return res.status(400).json({ message: 'Faltan datos' });

    const result = db.exec(`SELECT * FROM users WHERE username = '${username.replace(/'/g, "''")}'`);
    if (result.length === 0)
      return res.status(404).json({ message: 'Usuario no encontrado' });

    const [id, uname, hash, role] = result[0].values[0];
    const valid = await bcrypt.compare(currentPassword, hash);

    if (!valid)
      return res.status(401).json({ message: 'Contraseña actual incorrecta' });

    const newHash = await bcrypt.hash(newPassword, 10);
    db.run(`UPDATE users SET password_hash = ? WHERE username = ?`, [newHash, username]);
    saveDatabase();

    res.json({ success: true, message: 'Contraseña actualizada correctamente' });
  });

  // Filtro de rutas mal formadas
  app.get('', (req, res) => {
    if (req.path.startsWith('/http') || req.path.includes('://')) {
      console.log('Redirigiendo por ruta mal formada:', req.path);
      return res.redirect('/');
    }
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
  });

  // Iniciar servidor
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Servidor iniciado en http://0.0.0.0:${PORT}`);
  });
})();
