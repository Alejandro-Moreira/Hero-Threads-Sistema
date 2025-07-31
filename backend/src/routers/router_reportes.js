import express from 'express';
import { 
  obtenerInformacionVentas, 
  obtenerAnalisisPlataforma, 
  crearVenta, 
  obtenerTodasLasVentas 
} from '../controllers/reportes_controllers.js';

const routerReportes = express.Router();
routerReportes.use(express.json());

// Rutas para reportes y análisis
routerReportes.get('/ventas', obtenerInformacionVentas);
routerReportes.get('/analisis', obtenerAnalisisPlataforma);
routerReportes.get('/ventas/todas', obtenerTodasLasVentas);

// Ruta para crear ventas (simulación)
routerReportes.post('/ventas', crearVenta);

routerReportes.use((req, res) => res.status(404).end());

export default routerReportes; 