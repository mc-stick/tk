import express from 'express';
import { pool } from '../dbconf.js';

const router = express.Router();

router.get('/', async (req, res) => {
  const [rows] = await pool.query('SELECT * FROM roles ORDER BY role_id ASC');
  res.json(rows);
});

// 🔹 Obtener un rol por ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  const [rows] = await pool.query('SELECT * FROM roles WHERE role_id = ?', [id]);
  res.json(rows[0] || null);
});

// Crear rol
router.post('/', async (req, res) => {
  const { name, description } = req.body;
  const [rows] = await pool.query('CALL sp_add_role(?, ?)', [name, description]);
  res.json({ message: 'Rol creado', data: rows[0][0] });
});

// Actualizar rol
router.put('/:id', async (req, res) => {
  const { name, description } = req.body;
  const { id } = req.params;
  await pool.query('CALL sp_update_role(?, ?, ?)', [id, name, description]);
  res.json({ message: 'Rol actualizado' });
});

// Eliminar rol
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  await pool.query('CALL sp_delete_role(?)', [id]);
  res.json({ message: 'Rol eliminado' });
});

export default router;
