import express from 'express';
import cors from 'cors';

import serviceRoutes from './conn/routes/services.js';
import employeeRoutes from './conn/routes/employees.js';
import roleRoutes from './conn/routes/roles.js';
import imgRoutes from './conn/routes/images.js';
import docRoutes from './conn/routes/Identify.js';
import ticketRoutes from './conn/routes/ticket.js';
import puestoRoutes from './conn/routes/puesto.js';
import views from './conn/routes/views.js';
import dotenv from 'dotenv';

const app = express();
app.use(cors());
app.use(express.json());
dotenv.config();

const PORT = process.env.PORT || 4000;

// Rutas API
app.use('/api/services', serviceRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api/roles', roleRoutes);
app.use('/api/img', imgRoutes);
app.use('/api/docs', docRoutes);
app.use('/api/tickets', ticketRoutes);
app.use('/api/puesto', puestoRoutes);
app.use('/api/views', views);

app.listen(PORT, () => console.log(`Servidor corriendo en http://localhost:${PORT}`));
