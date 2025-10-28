import express from 'express';
import { pool } from '../dbconf.js';

import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

const JWT_SECRET = process.env.JWT_SECRET || "mi_clave_secreta_muy_segura";

const router = express.Router();

// 🔹 Listar todos los empleados
router.get('/', async (req, res) => {
  const [rows] = await pool.query(`
    SELECT e.*,p.nombre AS puesto_nombre,
     GROUP_CONCAT(r.name SEPARATOR ', ') AS roles
    FROM employees e
    LEFT JOIN employee_roles er ON e.employee_id = er.employee_id
    LEFT JOIN roles r ON er.role_id = r.role_id
    LEFT JOIN puesto p ON e.puesto_id = p.id
    GROUP BY e.employee_id
    ORDER BY e.employee_id;
  `);
  res.json(rows);
});

// 🔹 Obtener un empleado por ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  const [rows] = await pool.query(`
    SELECT e.*,p.nombre AS puesto_nombre,
     GROUP_CONCAT(r.name SEPARATOR ', ') AS roles
    FROM employees e
    LEFT JOIN employee_roles er ON e.employee_id = er.employee_id
    LEFT JOIN roles r ON er.role_id = r.role_id
    LEFT JOIN puesto p ON e.puesto_id = p.id
    WHERE e.employee_id = ?
    GROUP BY e.employee_id;
  `, [id]);
  res.json(rows[0] || null);
});

// Crear empleado
router.post('/', async (req, res) => {
  const { username, password_hash, full_name, puesto_id } = req.body;
  const [rows] = await pool.query('CALL sp_add_employee(?, ?, ?, ?)', [
    username, password_hash, full_name, puesto_id
  ]);
  res.json({ message: 'Empleado agregado', data: rows[0][0] });
});

// Actualizar empleado
router.put('/:id', async (req, res) => {
  const { username,password_hash, full_name, puesto_id, is_active, edit } = req.body;
  const { id } = req.params;
  

  edit ? (
    
    await pool.query('CALL sp_update_employee_editpfl(?, ?, ?, ?)', [
        id, username, full_name, password_hash
      ])
     

  ) : (

      await pool.query('CALL sp_update_employee(?, ?, ?, ?, ?, ?)', [
      id, username, full_name, puesto_id, is_active, password_hash
    ])

  )

 

  
  res.json({ message: 'Empleado actualizado' });
});

// Eliminar empleado
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  await pool.query('CALL sp_delete_employee(?)', [id]);
  res.json({ message: 'Empleado eliminado' });
});


// LOGIN
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Usuario y contraseña son requeridos' });
  }

  try {
    // Obtener empleado y password_hash y roles
    const [rows] = await pool.query(`
      SELECT 
    e.*,
    p.nombre AS puesto_name,           
    GROUP_CONCAT(r.name SEPARATOR ', ') AS roles
FROM employees e
LEFT JOIN puesto p ON e.puesto_id = p.id 
LEFT JOIN employee_roles er ON e.employee_id = er.employee_id
LEFT JOIN roles r ON er.role_id = r.role_id
WHERE e.username = ?
GROUP BY e.employee_id;
    `, [username]);

    if (rows.length === 0) {
      return res.status(401).json({ message: 'Usuario o contraseña incorrecta.' });
    }

    const user = rows[0];

    // Comparar password con hash
    const validPass = await bcrypt.compare(password, user.password_hash);
    //console.log(password,user.is_active)
    if (validPass) {
      return res.status(401).json({ message: 'Usuario o contraseña incorrecta.' });
    }


    

    // Crear payload para JWT
    //console.log(user,"user from employee")
    const payload = {
      employee_id: user.employee_id,
      username: user.username,
      is_active: user.is_active,
      full_name: user.full_name,
      roles: user.roles,// string con roles separados por coma
      puesto_id: user.puesto_id, 
      puesto_name: user.puesto_name, 
    };

   
      if (user.puesto_id === 1 && user.roles !=='admin') {
        console.log('user', user.puesto_id, user.roles )
        return res.status(401).json({ message: 'No tienes un puesto asignado.' })
      }

    // Generar token (1h expiracion)
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});


export default router;

