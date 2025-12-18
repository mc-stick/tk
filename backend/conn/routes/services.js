import express from 'express';
import { pool } from '../dbconf.js';

const router = express.Router();

// 🔹 Obtener todos los servicios
router.get('/', async (req, res) => {
  try {
    const [results] = await pool.query('CALL sp_services_read_all()');
    const rows = results[0]; // <- aquí están tus filas reales
    // console.log('rows', rows);
    res.json(rows);
  } catch (error) {
    console.error('Error al obtener servicios:', error);
    res.status(500).json({ 
      message: 'Error al obtener servicios', 
      error: error.message 
    });
  }
});

// 🔹 Obtener un servicio por ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const [results] = await pool.query('CALL sp_services_read_by_id(?)', [id]);
    const rows = results[0];
    
    if (!rows || rows.length === 0) {
      return res.status(404).json({ 
        message: 'Servicio no encontrado' 
      });
    }
    
    res.json(rows[0]);
  } catch (error) {
    console.error('Error al obtener servicio:', error);
    res.status(500).json({ 
      message: 'Error al obtener servicio', 
      error: error.message 
    });
  }
});

// 🔹 Crear servicio
router.post('/', async (req, res) => {
  try {
    const { name, description, is_active, icon } = req.body;
    
    // Validaciones
    if (!name || !name.trim()) {
      return res.status(400).json({ 
        message: 'El nombre del servicio es obligatorio' 
      });
    }
    
    const [results] = await pool.query(
      'CALL sp_services_create(?, ?, ?, ?)', 
      [
        name, 
        description || null, 
        is_active !== undefined ? is_active : 1, 
        icon || null
      ]
    );
    
    const newService = results[0][0];
    res.status(201).json({ 
      message: 'Servicio creado exitosamente', 
      data: newService 
    });
  } catch (error) {
    console.error('Error al crear servicio:', error);
    res.status(500).json({ 
      message: 'Error al crear servicio', 
      error: error.message 
    });
  }
});

// 🔹 Actualizar servicio
router.put('/:id', async (req, res) => {
  try {
    const { name, description, is_active, icon } = req.body;
    const { id } = req.params;
    
    // Validaciones
    if (!name || !name.trim()) {
      return res.status(400).json({ 
        message: 'El nombre del servicio es obligatorio' 
      });
    }
    
    const [results] = await pool.query(
      'CALL sp_services_update(?, ?, ?, ?, ?)', 
      [
        id, 
        name, 
        description || null, 
        is_active !== undefined ? is_active : 1, 
        icon || null
      ]
    );
    
    const affectedRows = results[0][0].affected_rows;
    
    if (affectedRows === 0) {
      return res.status(404).json({ 
        message: 'Servicio no encontrado' 
      });
    }
    
    res.json({ 
      message: 'Servicio actualizado exitosamente' 
    });
  } catch (error) {
    console.error('Error al actualizar servicio:', error);
    res.status(500).json({ 
      message: 'Error al actualizar servicio', 
      error: error.message 
    });
  }
});

// 🔹 Eliminar servicio
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const [results] = await pool.query('CALL sp_services_delete(?)', [id]);
    const affectedRows = results[0][0].affected_rows;
    
    if (affectedRows === 0) {
      return res.status(404).json({ 
        message: 'Servicio no encontrado' 
      });
    }
    
    res.json({ 
      message: 'Servicio eliminado exitosamente' 
    });
  } catch (error) {
    console.error('Error al eliminar servicio:', error);
    res.status(500).json({ 
      message: 'Error al eliminar servicio', 
      error: error.message 
    });
  }
});

export default router;