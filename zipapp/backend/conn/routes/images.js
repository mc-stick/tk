import express from 'express';
import { pool } from '../dbconf.js';
import multer from 'multer';

const router = express.Router();

// Configuración de multer para leer archivos binarios
const storage = multer.memoryStorage();
const upload = multer({ storage });

// 🔹 Obtener todas las imágenes
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT id, nombre, tipo, datos, estado, fecha_subida FROM imagenes ORDER BY id ASC');
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener imágenes' });
  }
});

// 🔹 Obtener una imagen específica
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query('SELECT * FROM imagenes WHERE id = ?', [id]);

    if (rows.length === 0) return res.status(404).json({ message: 'Imagen no encontrada' });

    const img = rows[0];
    res.setHeader('Content-Type', img.tipo);
    res.send(img.datos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener la imagen' });
  }
});

// 🔹 Subir una nueva imagen
router.post('/', upload.single('imagen'), async (req, res) => {
  try {
    const { originalname, mimetype, buffer } = req.file;
    await pool.query('INSERT INTO imagenes (nombre, tipo, datos) VALUES (?, ?, ?)', [
      originalname,
      mimetype,
      buffer,
    ]);
    res.json({ message: 'Imagen guardada exitosamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al guardar la imagen' });
  }
});

// 🔹 Actualizar el estado (activar/desactivar)
router.put('/estado/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { estado } = req.body; // 1 o 0
    await pool.query('UPDATE imagenes SET estado = ? WHERE id = ?', [estado, id]);
    res.json({ message: 'Estado actualizado' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al actualizar el estado' });
  }
});

// 🔹 Eliminar una imagen
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM imagenes WHERE id = ?', [id]);
    res.json({ message: 'Imagen eliminada' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al eliminar la imagen' });
  }
});

export default router;
