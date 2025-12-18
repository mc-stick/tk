import express from 'express';
import { pool } from '../dbconf.js';

const router = express.Router();

// 🔹 Obtener todos los puestos
router.get('/', async (req, res) => {
  try {
    const [results] = await pool.query('CALL sp_puesto_read_all()');
    const rows = results[0]; // <- aquí están tus filas reales
    // console.log('puestos:', rows);
    res.json(rows);
  } catch (error) {
    console.error('Error al obtener puestos:', error);
    res.status(500).json({ 
      message: 'Error al obtener puestos', 
      error: error.message 
    });
  }
});

// 🔹 Obtener puesto por ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const [results] = await pool.query('CALL sp_puesto_read_by_id(?)', [id]);
    const rows = results[0];
    
    if (!rows || rows.length === 0) {
      return res.status(404).json({ 
        message: 'Puesto no encontrado' 
      });
    }
    
    res.json(rows[0]);
  } catch (error) {
    console.error('Error al obtener puesto:', error);
    res.status(500).json({ 
      message: 'Error al obtener puesto', 
      error: error.message 
    });
  }
});

// 🔹 Crear puesto
router.post('/', async (req, res) => {
  try {
    const { nombre, descripcion, icono } = req.body;
    
    // Validaciones
    if (!nombre || !nombre.trim()) {
      return res.status(400).json({ 
        message: 'El nombre del puesto es obligatorio' 
      });
    }
    
    const [results] = await pool.query(
      'CALL sp_puesto_create(?, ?, ?)', 
      [
        nombre, 
        descripcion || null,
        icono || null
      ]
    );
    
    const newPuesto = results[0][0];
    res.status(201).json({ 
      message: 'Puesto creado exitosamente', 
      data: newPuesto 
    });
  } catch (error) {
    console.error('Error al crear puesto:', error);
    
    // Manejo de errores específicos
    if (error.sqlState === '45000') {
      return res.status(400).json({ 
        message: error.message 
      });
    }
    
    res.status(500).json({ 
      message: 'Error al crear puesto', 
      error: error.message 
    });
  }
});

// 🔹 Actualizar puesto
router.put('/:id', async (req, res) => {
  try {
    const { nombre, descripcion, icono } = req.body;
    const { id } = req.params;
    
    // Validaciones
    if (!nombre || !nombre.trim()) {
      return res.status(400).json({ 
        message: 'El nombre del puesto es obligatorio' 
      });
    }
    
    const [results] = await pool.query(
      'CALL sp_puesto_update(?, ?, ?, ?)', 
      [
        id, 
        nombre, 
        descripcion || null,
        icono || null
      ]
    );
    
    const affectedRows = results[0][0].affected_rows;
    
    if (affectedRows === 0) {
      return res.status(404).json({ 
        message: 'Puesto no encontrado' 
      });
    }
    
    res.json({ 
      message: 'Puesto actualizado exitosamente' 
    });
  } catch (error) {
    console.error('Error al actualizar puesto:', error);
    
    // Manejo de errores específicos
    if (error.sqlState === '45000') {
      return res.status(400).json({ 
        message: error.message 
      });
    }
    
    res.status(500).json({ 
      message: 'Error al actualizar puesto', 
      error: error.message 
    });
  }
});

// 🔹 Eliminar puesto
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const [results] = await pool.query('CALL sp_puesto_delete(?)', [id]);
    const affectedRows = results[0][0].affected_rows;
    
    if (affectedRows === 0) {
      return res.status(404).json({ 
        message: 'Puesto no encontrado' 
      });
    }
    
    res.json({ 
      message: 'Puesto eliminado exitosamente' 
    });
  } catch (error) {
    console.error('Error al eliminar puesto:', error);
    
    // Manejo de errores específicos (ej: ID 1 protegido)
    if (error.sqlState === '45000') {
      return res.status(400).json({ 
        message: error.message 
      });
    }
    
    res.status(500).json({ 
      message: 'Error al eliminar puesto', 
      error: error.message 
    });
  }
});

export default router;