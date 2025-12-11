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
  console.log("get emplid",rows)
});

// 🔹 Obtener un empleado por ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  const [rows] = await pool.query(`
    SELECT e.*, p.nombre AS puesto_nombre,
  GROUP_CONCAT(r.name SEPARATOR ', ') AS roles,
  GROUP_CONCAT(r.role_id SEPARATOR ', ') AS role_ids
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
// router.post('/', async (req, res) => {
//   const { username, password_hash, full_name, puesto_id, roles, id } = req.body;


//   const [rows] = await pool.query('CALL sp_add_employee(?, ?, ?, ?)', [
//     username, password_hash, full_name, puesto_id
//   ]);

//   const [rows1] = await pool.query('CALL sp_add_employee_role(?,?)', [
//     rows[0][0].new_employee_id, roles
//   ]);


//   res.json({ message: 'Empleado agregado', data: rows[0][0] });
// });

// Crear empleado
router.post('/', async (req, res) => {
  try {
    const { username, password_hash, full_name, puesto_id, roles } = req.body;

    // Crear empleado
    const [rows] = await pool.query('CALL sp_add_employee(?, ?, ?, ?)', [
      username,
      password_hash,
      full_name,
      puesto_id,
    ]);

    const newId = rows[0][0].new_employee_id;

    // Convertir roles a array si vienen como texto
    const parsedRoles = Array.isArray(roles)
      ? roles
      : typeof roles === "string"
      ? roles.split(",").map((r) => r.trim())
      : [];

    // Insertar roles uno por uno
    for (const roleId of parsedRoles) {
      await pool.query('CALL sp_add_employee_role(?, ?)', [newId, roleId]);
    }

    res.json({ message: "Empleado agregado", data: rows[0][0] });
  } catch (err) {
    console.error("Error al crear empleado:", err);
    res.status(500).json({ message: "Error al crear empleado" });
  }
});


// Actualizar empleado
// router.put('/:id', async (req, res) => {
//   const { username,password_hash, full_name, puesto_id, is_active, edit, roles } = req.body;
//   const { id } = req.params;
  

//   edit ? (
    
//     await pool.query('CALL sp_update_employee_editpfl(?, ?, ?, ?)', [
//         id, username, full_name, password_hash
//       ])
     

//   ) : (

//       await pool.query('CALL sp_update_employee(?, ?, ?, ?, ?, ?)', [
//       id, username, full_name, puesto_id, is_active, password_hash
//     ])

//   )

//   await pool.query('CALL sp_add_employee_role(?,?)', [
//     id, roles
//   ]);

 

  
//   res.json({ message: 'Empleado actualizado' });
// });
router.put('/:id', async (req, res) => {
  try {
    const { username, password_hash, full_name, puesto_id, is_active, edit, roles } = req.body;
    const { id } = req.params;
    
     

    if (edit) {
      await pool.query('CALL sp_update_employee_editpfl(?, ?, ?, ?, ?)', [
        id, username, full_name, password_hash, roles
      ]);
      
      console.log('entro en emplidPROFILE --------- ')
    } else {
      await pool.query('CALL sp_update_employee(?, ?, ?, ?, ?, ?)', [
        id, username, full_name, puesto_id, is_active, password_hash
      ]);
      console.log('----------- NO ENTOR EN PFORL')
    }

    // 🔹 Eliminar roles actuales del empleado
    await pool.query('DELETE FROM employee_roles WHERE employee_id = ?', [id]);

    // 🔹 Volver a insertar los nuevos roles

      const parsedRoles = Array.isArray(roles)
        ? roles
        : typeof roles === "string"
        ? roles.split(",").map((r) => r.trim())
        : [];

      for (const roleId of parsedRoles) {
        await pool.query('CALL sp_add_employee_role(?, ?)', [id, roleId]);
      }
    

    res.json({ message: "Empleado actualizado" });
  } catch (err) {
    console.error("Error al actualizar empleado:", err);
    res.status(500).json({ message: "Error al actualizar empleado" });
  }
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

