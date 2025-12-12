import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

export const pool = mysql.createPool({

  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

//🔌 Conexión a MySQL
// export const pool = mysql.createPool({
//   host: 'localhost',
//   user: 'admin',
//   password: 'admin',
//   database: 'tk',
// });

// import mariadb from 'mariadb';

// export const pool = mariadb.createPool({
//   host: process.env.DB_HOST,
//   user: process.env.DB_USER,
//   password: process.env.DB_PASSWORD,
//   database: process.env.DB_NAME,
//   //connectionLimit: 5, // opcional: número máximo de conexiones simultáneas
// });

// // Función de prueba opcional
// export async function testConnection() {
//   let conn;
//   try {
//     conn = await pool.getConnection();
//     const rows = await conn.query("SELECT 1 as resultado");
//     console.log(rows); // [{ resultado: 1 }]
//   } catch (err) {
//     console.error("Error al conectar a MariaDB:", err);
//   } finally {
//     if (conn) conn.release(); // liberar la conexión
//   }
// }


// testConnection()