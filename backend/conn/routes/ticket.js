import express from 'express';
import { pool } from '../dbconf.js';

const router = express.Router();

// 🔹 Listar todos los tickets (vista general)
router.get('/', async (req, res) => {
  const [rows] = await pool.query(`
    SELECT 
    t.ticket_id,
    s.name AS service_name,
    t.client_identifier,
    ts.name AS status_name,
    e.full_name AS assigned_employee,
    p.nombre AS puesto_name,
    t.created_at,
    t.called_at,
    t.completed_at,
    t.notes
FROM tickets t
JOIN services s ON t.service_id = s.service_id
JOIN ticket_statuses ts ON t.status_id = ts.status_id
LEFT JOIN employees e ON t.assigned_employee_id = e.employee_id
LEFT JOIN puesto p ON t.puesto_id = p.id
ORDER BY t.ticket_id DESC;

  `);
  res.json(rows);
});

// 🔹 Obtener ticket por ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  const [rows] = await pool.query(`
    SELECT 
      t.ticket_id,
      s.name AS service_name,
      t.client_identifier,
      ts.name AS status_name,
      e.full_name AS assigned_employee,
      sc.name AS counter_name,
      t.created_at,
      t.called_at,
      t.completed_at,
      t.notes
    FROM tickets t
    JOIN services s ON t.service_id = s.service_id
    JOIN ticket_statuses ts ON t.status_id = ts.status_id
    LEFT JOIN employees e ON t.assigned_employee_id = e.employee_id
    LEFT JOIN puesto p ON t.puesto_id = p.id
    WHERE t.ticket_id = ?;
  `, [id]);
  res.json(rows[0] || null);
});


// Crear ticket
router.post('/', async (req, res) => {
  const { service_id, client_identifier, status_id, assigned_employee_id, counter_id, notes } = req.body;
  const [rows] = await pool.query('CALL sp_add_ticket(?, ?, ?, ?, ?, ?)', [
    service_id, client_identifier, status_id, assigned_employee_id, counter_id, notes
  ]);
  res.json({ message: 'Ticket creado', data: rows[0][0] });
});

// Actualizar estado del ticket
router.put('/:id/status', async (req, res) => {
  const { id } = req.params;
  const { new_status_id, employee_id, comment } = req.body;
  await pool.query('CALL sp_update_ticket_status(?, ?, ?, ?)', [
    id, new_status_id, employee_id, comment
  ]);
  res.json({ message: 'Estado del ticket actualizado' });
});

// Eliminar ticket
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  await pool.query('CALL sp_delete_ticket(?)', [id]);
  res.json({ message: 'Ticket eliminado' });
});

export default router;
