import express from 'express';
import { pool } from '../dbconf.js';

const router = express.Router();

// Obtener tickets activos
router.get('/active', async (req, res) => {
  const [rows] = await pool.query('SELECT * FROM view_active_tickets');
  res.json(rows);
});

// Obtener historial detallado
router.get('/history', async (req, res) => {
  const [rows] = await pool.query('SELECT * FROM view_ticket_history_detailed');
  res.json(rows);
});

// Obtener estadísticas por servicio
router.get('/stats', async (req, res) => {
  const [rows] = await pool.query('SELECT * FROM view_service_statistics');
  res.json(rows);
});

// Rendimiento de operadores
router.get('/performance', async (req, res) => {
  const [rows] = await pool.query('SELECT * FROM view_operator_performance');
  res.json(rows);
});

export default router;
