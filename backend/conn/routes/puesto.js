import express from 'express';
import { pool } from '../dbconf.js';

const router = express.Router();

// 🔹 Listar todos los puestos
router.get('/', async (req, res) => {
  const [rows] = await pool.query(`
    SELECT p.*, p.nombre AS service_nombre
    FROM puesto p
    ORDER BY p.id;
  `);
  res.json(rows);
});

// 🔹 Obtener puesto por ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  const [rows] = await pool.query(`
    SELECT p.*, p.nombre AS service_nombre
    FROM puesto p
    WHERE p.id = ?;
  `, [id]);
  res.json(rows[0] || null);
});

// Crear puesto
router.post('/', async (req, res) => {
  const { nombre, descripcion } = req.body;
  const [rows] = await pool.query('CALL sp_add_puesto(?, ?)', [
    nombre, descripcion
  ]);
  res.json({ message: 'Puesto creado', data: rows[0] });
});

// Actualizar puesto
router.put('/:id', async (req, res) => {
  const { nombre, descripcion } = req.body;
  const { id } = req.params;
  await pool.query('CALL sp_update_puesto(?, ?, ?)', [
    id, nombre, descripcion
  ]);
  res.json({ message: 'Puesto actualizado' });
});

// Eliminar puesto
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  await pool.query('CALL sp_delete_puesto(?)', [id]);
  res.json({ message: 'Puesto eliminado' });
});

export default router;
