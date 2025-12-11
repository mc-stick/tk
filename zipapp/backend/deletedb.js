const mariadb = require('mariadb');

// Crear el pool de conexiones
const pool = mariadb.createPool({
  host: 'localhost',
  user: 'root',       // tu usuario
  password: 'oracle',
  database: 'tk',
  connectionLimit: 5   // número máximo de conexiones simultáneas
});

async function testConnection() {
  let conn;
  try {
    conn = await pool.getConnection();
    const rows = await conn.query("SELECT 1 as resultado");
    console.log(rows); // [{ resultado: 1 }]
  } catch (err) {
    console.error("Error al conectar a MariaDB:", err);
  } finally {
    if (conn) conn.release(); // liberar la conexión
  }
}

testConnection();

module.exports = pool;
