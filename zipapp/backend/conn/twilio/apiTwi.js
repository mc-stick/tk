import express from 'express';
import { createMessage } from './twi.js';

const router = express.Router();

// Crear msg
router.post('/', async (req, res) => {
  const { msg,to } = req.body;
  console.log(msg,from,to)
  try {
    //console.log(msg,from,to)
    const result = await createMessage(msg,to);
    res.json({ success: true, result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Error creando el mensaje' });
  }
});

export default router;
