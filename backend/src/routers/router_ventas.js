import express from 'express';
import { 
  getVentas, 
  crearVenta, 
  getEstadisticasVentas,
  getVenta,
  actualizarVenta,
  eliminarVenta
} from '../controllers/ventas_controllers.js';

const routerVentas = express.Router();

routerVentas.use(express.json());

// GET - Obtener todas las ventas
routerVentas.get('/', getVentas);

// POST - Crear una nueva venta
routerVentas.post('/', crearVenta);

// GET - Obtener estadísticas de ventas
routerVentas.get('/stats', getEstadisticasVentas);

// GET - Obtener una venta específica
routerVentas.get('/:id', getVenta);

// PUT - Actualizar una venta
routerVentas.put('/:id', actualizarVenta);

// DELETE - Eliminar una venta
routerVentas.delete('/:id', eliminarVenta);

routerVentas.use((req, res) => res.status(404).end());

export default routerVentas; 