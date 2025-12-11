// import express from 'express';
// import { pool } from '../dbconf.js';

// const router = express.Router();

// router.get('/', async (req, res) => {
//   const [rows] = await pool.query('SELECT * FROM document_types ORDER BY document_type_id ASC');
//   res.json(rows);
// });

// // 🔹 Obtener un doc por ID
// router.get('/:id', async (req, res) => {
//   const { id } = req.params;
//   const [rows] = await pool.query('SELECT * FROM document_types WHERE document_type_id = ?', [id]);
//   res.json(rows[0] || null);
// });

// // Crear doc
// router.post('/', async (req, res) => {
//   const { name, description, size } = req.body;
//   const [rows] = await pool.query('CALL sp_add_document_type(?, ?, ?)', [name, description, size]);
//   res.json({ message: 'identidad creado', data: rows[0] });
// });

// // Actualizar doc
// router.put('/:id', async (req, res) => {
//   const { name, description, size } = req.body;
//   console.log('actalizar', size)
//   const { id } = req.params;
//   await pool.query('CALL sp_update_document_type(?, ?, ?, ?)', [id, name, description, size]);
//   res.json({ message: 'identidad actualizado' });
// });

// // Eliminar doc
// router.delete('/:id', async (req, res) => {
//   const { id } = req.params;
//   await pool.query('CALL sp_delete_document_type(?)', [id]);
//   res.json({ message: 'identidad eliminado' });
// });

// export default router;


import express from 'express';
import { pool } from '../dbconf.js';

const router = express.Router();

// 🔹 Listar todos los documentos
router.get('/', async (req, res) => {
  let conn;
  try {
    conn = await pool.getConnection(); // 🔹 MariaDB requiere obtener conexión antes de query
    const rows = await conn.query('SELECT * FROM document_types ORDER BY document_type_id ASC'); 
    res.json(rows); // 🔹 en mariadb, query devuelve directamente un array de objetos, no [rows]
  } catch (err) {
    res.status(500).json({ error: err.message });
  } finally {
    if (conn) conn.release(); // 🔹 liberar conexión
  }
});

// 🔹 Obtener un doc por ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  let conn;
  try {
    conn = await pool.getConnection();
    const rows = await conn.query('SELECT * FROM document_types WHERE document_type_id = ?', [id]);
    res.json(rows[0] || null); // 🔹 mismo cambio, mariadb devuelve array directamente
  } catch (err) {
    res.status(500).json({ error: err.message });
  } finally {
    if (conn) conn.release();
  }
});

// 🔹 Crear doc usando procedimiento almacenado
router.post('/', async (req, res) => {
  const { name, description, size } = req.body;
  let conn;
  try {
    conn = await pool.getConnection();
    const rows = await conn.query('CALL sp_add_document_type(?, ?, ?)', [name, description, size]);
    res.json({ message: 'identidad creado', data: rows[0] }); 
    // 🔹 en mariadb, cada CALL devuelve un array de arrays por result sets, tomamos rows[0]
  } catch (err) {
    res.status(500).json({ error: err.message });
  } finally {
    if (conn) conn.release();
  }
});

// 🔹 Actualizar doc
router.put('/:id', async (req, res) => {
  const { name, description, size } = req.body;
  const { id } = req.params;
  let conn;
  try {
    conn = await pool.getConnection();
    await conn.query('CALL sp_update_document_type(?, ?, ?, ?)', [id, name, description, size]);
    res.json({ message: 'identidad actualizado' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  } finally {
    if (conn) conn.release();
  }
});

// 🔹 Eliminar doc
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  let conn;
  try {
    conn = await pool.getConnection();
    await conn.query('CALL sp_delete_document_type(?)', [id]);
    res.json({ message: 'identidad eliminado' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  } finally {
    if (conn) conn.release();
  }
});

export default router;
