import express from 'express';
import { pool } from '../dbconf.js';

const router = express.Router();

// 🔹 Listar todos los tickets (vista general)
router.get('/', async (req, res) => {
  const [rows] = await pool.query(`
    SELECT 
    t.ticket_id,
    t.nticket,
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
  //console.log(res.json(rows))
  res.json(rows);
});

//get all details.
router.get('/detail', async (req, res) => {
  const [rows] = await pool.query('SELECT * FROM view_tickets');
  res.json(rows);
});

// 🔹 Obtener ticket por ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  const [rows] = await pool.query(`
   SELECT 
    t.ticket_id,
    t.nticket,
    s.name AS service_name,
    t.client_identifier,
    ts.name AS status_name,
    e.full_name AS assigned_employee,
    p.nombre AS puesto_name,      -- renamed alias here
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


// // Crear ticket
// router.post('/', async (req, res) => {
//   const { service_id, client_identifier, status_id, assigned_employee_id, counter_id, notes } = req.body;
//   const [rows] = await pool.query('CALL sp_add_ticket(?, ?, ?, ?, ?, ?)', [
//     service_id, client_identifier, status_id, assigned_employee_id, counter_id, notes
//   ]);
//   res.json({ message: 'Ticket creado', data: rows[0][0] });
// });

// Crear ticket
// router.post('/', async (req, res) => {
//   try {
//     const {
//       service_id,
//       client_identifier,
//       status_id,
//       assigned_employee_id,
//       puesto_id,
//       called_at,
//       completed_at,
//       notes
//     } = req.body;

//     // Llamada al nuevo procedimiento insert_ticket
//     const [rows] = await pool.query(
//       'CALL insert_ticket(?, ?, ?, ?, ?, ?, ?, ?)',
//       [
//         service_id,
//         client_identifier,
//         status_id,
//         assigned_employee_id,
//         puesto_id,
//         called_at || null,
//         completed_at || null,
//         notes || null
//       ]
//     );

//     // El procedimiento devuelve {"ticket_id": X}
//     res.json(rows[0]);
//   } catch (error) {
//     console.error('Error al crear ticket:', error);
//     res.status(500).json({ error: 'Error al crear el ticket' });
//   }
// });
router.post('/', async (req, res) => {
  try {
    const {
      service_id,
      client_identifier,
      status_id,
      assigned_employee_id,
      puesto_id,
      called_at,
      completed_at,
      notes
    } = req.body;

    // 1️⃣ Generar la parte de la fecha (YYMMDD)
    const now = new Date();
    const year = String(now.getFullYear()).slice(-2);
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    const datePart = `${year}${month}${day}`; // => 250929

    //console.log(datePart,"fecha num")

    // 2️⃣ Buscar el último ticket del día actual
    const [last] = await pool.query(
      `SELECT nticket 
       FROM tickets 
       WHERE nticket LIKE ? 
       ORDER BY ticket_id DESC 
       LIMIT 1`,
      [`T${datePart}-%`]
    );

    let nextSeq = 1;

    if (last.length > 0) {
      // Extraer el número secuencial de nticket (parte después del guion)
      const lastNum = parseInt(last[0].nticket.split("-")[1]);
      nextSeq = lastNum + 1;
    }

    // 3️⃣ Generar nuevo código
    const nticket = `T${datePart}-${String(nextSeq).padStart(3, "0")}`;
    //console.log(nticket)

    // 4️⃣ Insertar en la DB con la nueva columna `nticket`
    const [rows] = await pool.query(
      'CALL insert_ticket(?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [
        nticket,
        service_id,
        client_identifier,
        status_id,
        assigned_employee_id,
        puesto_id,
        called_at || null,
        completed_at || null,
        notes || null
      ]
    );

    // res.json(rows[0]);
    res.json(nticket);
  } catch (error) {
    console.error('Error al crear ticket:', error);
    res.status(500).json({ error: 'Error al crear el ticket' });
  }
});


// Actualizar estado del ticket
router.put('/:id/status', async (req, res) => {
  const { id } = req.params;
  const { status_id, employee_id, service_id, notes="actualizar" } = req.body;
  //console.log(id,status_id, employee_id,service_id, notes," updated ticket")
  await pool.query('CALL sp_update_ticket_status_full(?, ?, ?, ?, ?)', [
    id, status_id, employee_id, service_id, notes
  ]);
  res.json({ message: `Estado del ticket ${id} actualizado a ${status_id}, ${employee_id}, ${ notes}` });
});

// Eliminar ticket
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  await pool.query('CALL sp_delete_ticket(?)', [id]);
  res.json({ message: 'Ticket eliminado' });
});

export default router;
