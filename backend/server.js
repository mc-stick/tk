const express = require('express');
const initSqlJs = require('sql.js');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const SECRET = 'tu_clave_secreta';
const DB_FILE = './users.sqlite';
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// Middleware para loguear las rutas que llegan
app.use((req, res, next) => {
  console.log('➡️ Ruta solicitada:', req.method, req.path);
  next();
});

// Guardar la DB a disco
function saveDatabase() {
  const data = db.export();
  const buffer = Buffer.from(data);
  fs.writeFileSync(DB_FILE, buffer);
}

let SQL, db;

(async () => {
  SQL = await initSqlJs();

  if (fs.existsSync(DB_FILE)) {
    const filebuffer = fs.readFileSync(DB_FILE);
    db = new SQL.Database(filebuffer);
  } else {
    db = new SQL.Database();
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
        tipo TEXT NOT NULL,
        numero INTEGER NOT NULL,
        fecha TEXT NOT NULL,
        puesto TEXT NOT NULL,
        estado TEXT
      );
    `);

    // 🔄 [TURNOS] Crear tabla de contador si no existe
db.run(`
  CREATE TABLE IF NOT EXISTS contador (
    id INTEGER PRIMARY KEY,
    valor INTEGER
  );
`);

// 🔄 [TURNOS] Insertar contador inicial si no existe
const contadorCheck = db.exec("SELECT * FROM contador WHERE id = 1");
if (contadorCheck.length === 0) {
  db.run("INSERT INTO contador (id, valor) VALUES (1, 0)");
}

    // db.run(`
    //   CREATE TABLE IF NOT EXISTS servicios (
    //     id INTEGER PRIMARY KEY AUTOINCREMENT,
    //     icon TEXT NOT NULL,
    //     nombre TEXT NOT NULL,
    //   );
    // `);

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
    console.log('Base de datos y usuarios por defecto creados.');
  }

  // Servir archivos estáticos React build
  app.use(express.static(path.join(__dirname, 'dist')));

  // Ruta API: Registro
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

  // Ruta API: Login
  app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password)
      return res.status(400).json({ message: 'Faltan datos' });

    const safeUsername = username.replace(/'/g, "''");
    const result = db.exec(`SELECT * FROM users WHERE username = '${safeUsername}'`);

    if (result.length === 0)
      return res.status(401).json({ message: 'Usuario no encontrado' });

    const user = result[0];
    const row = user.values[0];
    const [id, uname, hash, role] = row;

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

  // Ruta protegida de ejemplo
  app.get('/protected', authenticateToken, (req, res) => {
    res.json({ message: `Hola ${req.user.username}, rol: ${req.user.role}` });
  });


  //TUNROS DB /////////////////////////////////////////////////////////////////////////////////////////////////////////

  // 🔄 [TURNOS] Obtener turno actual
app.get('/turnoactual', (req, res) => {
  const result = db.exec("SELECT * FROM turnos WHERE estado = 'actual' LIMIT 1");
  if (result.length > 0) {
    const row = result[0].values[0];
    const [id, numero, tipo, puesto, estado] = row;
    res.json({ id, numero, tipo, puesto, estado });
  } else {
    res.json(null);
  }
});

// 🔄 [TURNOS] Obtener cola
app.get('/cola', (req, res) => {
  const result = db.exec("SELECT * FROM turnos WHERE estado = 'en_espera' ORDER BY id ASC");
  const cola = result.length > 0
    ? result[0].values.map(([id, numero, tipo, puesto, estado]) => ({ id, numero, tipo, puesto, estado }))
    : [];
  res.json(cola);
});

// 🔄 [TURNOS] Generar nuevo turno
app.post('/generarturno', (req, res) => {
  const { tipo } = req.body;
  if (!tipo) return res.status(400).json({ message: 'Tipo requerido' });

  const contadorResult = db.exec("SELECT valor FROM contador WHERE id = 1");
  const contador = contadorResult.length > 0 ? contadorResult[0].values[0][0] : 0;
  const nuevoNumero = contador + 1;

  const fecha = new Date().toISOString();
console.log(nuevoNumero,tipo,fecha)
  db.run(
  `INSERT INTO turnos (numero, tipo, estado, fecha, puesto) VALUES (?, ?, ?, ?, ?)`,
  [nuevoNumero, tipo, 'en_espera', fecha, 't']
);
  db.run(`UPDATE contador SET valor = ? WHERE id = 1`, [nuevoNumero]);
  saveDatabase();

  res.json({ numero: nuevoNumero, tipo });
});

// 🔄 [TURNOS] Llamar siguiente turno
app.post('/llamarsiguiente', (req, res) => {
  const { puesto } = req.body;

  // Marcar actual como atendido
  db.run(`UPDATE turnos SET estado = 'atendido' WHERE estado = 'actual'`);

  // Obtener siguiente en cola
  const result = db.exec("SELECT * FROM turnos WHERE estado = 'en_espera' ORDER BY id ASC LIMIT 1");
  if (result.length > 0) {
    const row = result[0].values[0];
    const [id, numero, tipo] = row;

    db.run(`UPDATE turnos SET estado = 'actual', puesto = ? WHERE id = ?`, [puesto, id]);
    saveDatabase();

    res.json({ id, numero, tipo, puesto, estado: 'actual' });
  } else {
    res.json(null);
  }
});


  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  // Cambiar contraseña
  app.post('/change-password', authenticateToken, async (req, res) => {
    const { currentPassword, newPassword } = req.body;
    const username = req.user.username;

    if (!currentPassword || !newPassword)
      return res.status(400).json({ message: 'Faltan datos' });

    const safeUsername = username.replace(/'/g, "''");
    const result = db.exec(`SELECT * FROM users WHERE username = '${safeUsername}'`);
    if (result.length === 0)
      return res.status(404).json({ message: 'Usuario no encontrado' });

    const user = result[0];
    const row = user.values[0];
    const [id, uname, password_hash, role] = row;

    const valid = await bcrypt.compare(currentPassword, password_hash);
    if (!valid)
      return res.status(401).json({ message: 'Contraseña actual incorrecta' });

    const newHash = await bcrypt.hash(newPassword, 10);
    db.run(`UPDATE users SET password_hash = ? WHERE username = ?`, [newHash, safeUsername]);
    saveDatabase();

    res.json({ success: true, message: 'Contraseña actualizada correctamente' });
  });

  // Middleware para filtrar URLs mal formadas y evitar error path-to-regexp
  app.get('', (req, res, next) => {
  if (req.path.startsWith('/http') || req.path.includes('://')) {
    console.log('Redirigiendo por ruta mal formada:', req.path);
    return res.redirect('/');
  }
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

  // Iniciar servidor
  app.listen(PORT,'0.0.0.0', () => {
    console.log(`🚀 Servidor iniciado en http://0.0.0.0:${PORT}`);
  });
})();
