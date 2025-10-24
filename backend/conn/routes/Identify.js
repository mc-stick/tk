import express from 'express';
import { pool } from '../dbconf.js';

const router = express.Router();

router.get('/', async (req, res) => {
  const [rows] = await pool.query('SELECT * FROM document_types ORDER BY document_type_id ASC');
  res.json(rows);
});

// 🔹 Obtener un doc por ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  const [rows] = await pool.query('SELECT * FROM document_types WHERE document_type_id = ?', [id]);
  res.json(rows[0] || null);
});

// Crear doc
router.post('/', async (req, res) => {
  const { name, description, size } = req.body;
  const [rows] = await pool.query('CALL sp_add_document_type(?, ?, ?)', [name, description, size]);
  res.json({ message: 'identidad creado', data: rows[0] });
});

// Actualizar doc
router.put('/:id', async (req, res) => {
  const { name, description, size } = req.body;
  console.log('actalizar', size)
  const { id } = req.params;
  await pool.query('CALL sp_update_document_type(?, ?, ?, ?)', [id, name, description, size]);
  res.json({ message: 'identidad actualizado' });
});

// Eliminar doc
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  await pool.query('CALL sp_delete_document_type(?)', [id]);
  res.json({ message: 'identidad eliminado' });
});

export default router;
