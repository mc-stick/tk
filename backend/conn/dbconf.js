import mysql from 'mysql2/promise';

export const pool = mysql.createPool({
  host: 'localhost',
  user: 'admin',
  password: 'admin',
  database: 'tk',
});