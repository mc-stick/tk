import express from 'express';
import { pool } from '../dbconf.js';

const router = express.Router();

// 🔹 Obtener todos los servicios
router.get('/', async (req, res) => {
  const [rows] = await pool.query('SELECT * FROM services ORDER BY service_id ASC');
  res.json(rows);
});

// 🔹 Obtener un servicio por ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  const [rows] = await pool.query('SELECT * FROM services WHERE service_id = ?', [id]);
  res.json(rows[0] || null);
});

// Crear servicio
router.post('/', async (req, res) => {
  const { name, description } = req.body;
  const [rows] = await pool.query('CALL sp_add_service(?, ?)', [name, description]);
  res.json({ message: 'Servicio creado', data: rows[0][0] });
});

// Actualizar servicio
router.put('/:id', async (req, res) => {
  const { name, description, is_active } = req.body;
  const { id } = req.params;
  await pool.query('CALL sp_update_service(?, ?, ?, ?)', [id, name, description, is_active]);
  res.json({ message: 'Servicio actualizado' });
});

// Eliminar servicio
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  await pool.query('CALL sp_delete_service(?)', [id]);
  res.json({ message: 'Servicio eliminado' });
});

export default router;
