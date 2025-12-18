import express from 'express';
import { pool } from '../dbconf.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

const JWT_SECRET = process.env.JWT_SECRET || "mi_clave_secreta_muy_segura";

const router = express.Router();

// 🔹 Obtener todos los empleados
router.get('/', async (req, res) => {
  try {
    const [results] = await pool.query('CALL sp_employees_read_all()');
    const rows = results[0];
    console.log('Empleados:', rows);
    res.json(rows);
  } catch (error) {
    console.error('Error al obtener empleados:', error);
    res.status(500).json({ 
      message: 'Error al obtener empleados', 
      error: error.message 
    });
  }
});

// 🔹 Obtener empleado por ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const [results] = await pool.query('CALL sp_employees_read_by_id(?)', [id]);
    const rows = results[0];
    
    if (!rows || rows.length === 0) {
      return res.status(404).json({ 
        message: 'Empleado no encontrado' 
      });
    }
    
    res.json(rows[0]);
  } catch (error) {
    console.error('Error al obtener empleado:', error);
    res.status(500).json({ 
      message: 'Error al obtener empleado', 
      error: error.message 
    });
  }
});

// 🔹 Crear empleado
router.post('/', async (req, res) => {
  try {
    const { username, password, full_name, puesto_id, is_active, rol } = req.body;

    // Validaciones
    if (!username || !username.trim()) {
      return res.status(400).json({ 
        message: 'El nombre de usuario es obligatorio' 
      });
    }

    if (!full_name || !full_name.trim()) {
      return res.status(400).json({ 
        message: 'El nombre completo es obligatorio' 
      });
    }

    if (!password || !password.trim()) {
      return res.status(400).json({ 
        message: 'La contraseña es obligatoria' 
      });
    }

    // Hashear la contraseña
    const password_hash = await bcrypt.hash(password, 10);

    const [results] = await pool.query(
      'CALL sp_employees_create(?, ?, ?, ?, ?, ?)',
      [
        username,
        password_hash,
        full_name,
        puesto_id || null,
        is_active !== undefined ? is_active : 1,
        rol !== undefined ? rol : 0  // Default: Operador
      ]
    );

    const newEmployee = results[0][0];
    res.status(201).json({
      message: 'Empleado creado exitosamente',
      data: newEmployee
    });
  } catch (error) {
    console.error('Error al crear empleado:', error);
    
    // Manejo de errores específicos
    if (error.sqlState === '45000') {
      return res.status(400).json({ 
        message: error.message 
      });
    }
    
    res.status(500).json({
      message: 'Error al crear empleado',
      error: error.message
    });
  }
});

// 🔹 Actualizar empleado
router.put('/:id', async (req, res) => {
  try {
    const { username, password, full_name, puesto_id, is_active, rol } = req.body;
    const { id } = req.params;

    // Validaciones
    if (!username || !username.trim()) {
      return res.status(400).json({ 
        message: 'El nombre de usuario es obligatorio' 
      });
    }

    if (!full_name || !full_name.trim()) {
      return res.status(400).json({ 
        message: 'El nombre completo es obligatorio' 
      });
    }

    // Si se proporciona nueva contraseña, hashearla
    let password_hash = null;
    if (password && password.trim()) {
      password_hash = await bcrypt.hash(password, 10);
    }

    const [results] = await pool.query(
      'CALL sp_employees_update(?, ?, ?, ?, ?, ?, ?)',
      [
        id,
        username,
        password_hash,  // Puede ser null si no se cambia
        full_name,
        puesto_id || null,
        is_active !== undefined ? is_active : 1,
        rol !== undefined ? rol : 0
      ]
    );

    const affectedRows = results[0][0].affected_rows;
    
    if (affectedRows === 0) {
      return res.status(404).json({ 
        message: 'Empleado no encontrado' 
      });
    }

    res.json({
      message: 'Empleado actualizado exitosamente'
    });
  } catch (error) {
    console.error('Error al actualizar empleado:', error);
    
    // Manejo de errores específicos
    if (error.sqlState === '45000') {
      return res.status(400).json({ 
        message: error.message 
      });
    }
    
    res.status(500).json({
      message: 'Error al actualizar empleado',
      error: error.message
    });
  }
});

// 🔹 Eliminar empleado
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const [results] = await pool.query('CALL sp_employees_delete(?)', [id]);
    const affectedRows = results[0][0].affected_rows;
    
    if (affectedRows === 0) {
      return res.status(404).json({ 
        message: 'Empleado no encontrado' 
      });
    }
    
    res.json({
      message: 'Empleado eliminado exitosamente'
    });
  } catch (error) {
    console.error('Error al eliminar empleado:', error);
    res.status(500).json({
      message: 'Error al eliminar empleado',
      error: error.message
    });
  }
});

// 🔹 LOGIN
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ 
      message: 'Usuario y contraseña son requeridos' 
    });
  }

  try {
    // Buscar empleado por username
    const [results] = await pool.query(`
      SELECT 
        e.employee_id,
        e.username,
        e.password_hash,
        e.full_name,
        e.puesto_id,
        e.is_active,
        e.rol,
        p.nombre AS puesto_nombre
      FROM employees e
      LEFT JOIN puesto p ON e.puesto_id = p.id
      WHERE e.username = ?
    `, [username]);


    if (results.length === 0) {
      return res.status(401).json({ 
        message: 'Usuario o contraseña incorrecta' 
      });
    }

    const user = results[0];

    // Verificar si el usuario está activo
    if (!user.is_active) {
      return res.status(401).json({ 
        message: 'Usuario inactivo. Contacte al administrador.' 
      });
    }

    // Comparar contraseña
    const validPass = await bcrypt.compare(password, user.password_hash);
    console.log(validPass, "pass:",password, "hash",user.password_hash)
    
    if (!validPass) {
      return res.status(401).json({ 
        message: 'Usuario o contraseña incorrecta' 
      });
    }

    // Crear payload para JWT
    const payload = {
      employee_id: user.employee_id,
      username: user.username,
      full_name: user.full_name,
      puesto_id: user.puesto_id,
      puesto_name: user.puesto_nombre,  // Usar 'puesto_name' para compatibilidad con AuthContext
      is_active: user.is_active,
      rol: user.rol,  // 1 = Admin, 0 = Operador
      role: user.rol === 1 ? 'admin' : 'operador',  // Agregar 'role' string para AuthContext
      roles: user.rol === 1 ? 'admin' : 'operador'  // Agregar 'roles' para compatibilidad
    };

    // Generar token JWT (1 hora de expiración)
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });

    res.json({ 
      token,
      user: {
        employee_id: user.employee_id,
        username: user.username,
        full_name: user.full_name,
        puesto_name: user.puesto_nombre,
        rol: user.rol === 1 ? 'Admin' : 'Operador',
        role: user.rol === 1 ? 'admin' : 'operador'
      }
    });
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ 
      message: 'Error interno del servidor' 
    });
  }
});


export default router;