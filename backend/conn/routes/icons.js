import express from 'express';
import { pool } from '../dbconf.js';

const router = express.Router();

// 🔹 Obtener todos los iconos
router.get('/', async (req, res) => {
  try {
    const [results] = await pool.query('CALL sp_icons_read_all()');
    const rows = results[0]; // <- aquí están tus filas reales
    // console.log('rows', rows);
    res.json(rows);
  } catch (error) {
    console.error('Error al obtener iconos:', error);
    res.status(500).json({ message: 'Error al obtener iconos', error: error.message });
  }
});

// 🔹 Obtener un icono por ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const [results] = await pool.query('CALL sp_icons_read_by_id(?)', [id]);
    const rows = results[0];
    res.json(rows[0] || null);
  } catch (error) {
    console.error('Error al obtener icono:', error);
    res.status(500).json({ message: 'Error al obtener icono', error: error.message });
  }
});


// 🔹 Crear icono
router.post('/', async (req, res) => {
  try {
    const { name_icon, code_icon } = req.body;
    
    // Validaciones
    if (!name_icon || !code_icon) {
      return res.status(400).json({ 
        message: 'El nombre y código del icono son obligatorios' 
      });
    }

    const [results] = await pool.query(
      'CALL sp_icons_create(?, ?)', 
      [name_icon, code_icon]
    );
    
    const newIcon = results[0][0];
    res.status(201).json({ 
      message: 'Icono creado exitosamente', 
      data: newIcon 
    });
  } catch (error) {
    console.error('Error al crear icono:', error);
    
    // Manejo de errores específicos
    if (error.sqlState === '45000') {
      return res.status(400).json({ 
        message: error.message 
      });
    }
    
    res.status(500).json({ 
      message: 'Error al crear icono', 
      error: error.message 
    });
  }
});

// 🔹 Actualizar icono
router.put('/:id', async (req, res) => {
  try {
    const { name_icon, code_icon } = req.body;
    const { id } = req.params;
    
    // Validaciones
    if (!name_icon || !code_icon) {
      return res.status(400).json({ 
        message: 'El nombre y código del icono son obligatorios' 
      });
    }

    await pool.query(
      'CALL sp_icons_update(?, ?, ?)', 
      [id, name_icon, code_icon]
    );
    
    res.json({ message: 'Icono actualizado exitosamente' });
  } catch (error) {
    console.error('Error al actualizar icono:', error);
    
    // Manejo de errores específicos
    if (error.sqlState === '45000') {
      return res.status(400).json({ 
        message: error.message 
      });
    }
    
    res.status(500).json({ 
      message: 'Error al actualizar icono', 
      error: error.message 
    });
  }
});

// 🔹 Eliminar icono
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const [results] = await pool.query('CALL sp_icons_delete(?)', [id]);
    const affectedRows = results[0][0].affected_rows;
    
    if (affectedRows === 0) {
      return res.status(404).json({ 
        message: 'Icono no encontrado' 
      });
    }
    
    res.json({ message: 'Icono eliminado exitosamente' });
  } catch (error) {
    console.error('Error al eliminar icono:', error);
    res.status(500).json({ 
      message: 'Error al eliminar icono', 
      error: error.message 
    });
  }
});

export default router;