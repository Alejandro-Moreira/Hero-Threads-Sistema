import Venta from '../models/ventas.js';
import mongoose from 'mongoose';

// GET - Obtener todas las ventas
const getVentas = async (req, res) => {
  try {
    const ventas = await Venta.find().sort({ createdAt: -1 });
    res.status(200).json(ventas);
  } catch (error) {
    console.log('Error al obtener ventas:', error);
    res.status(500).json({ message: 'Error al obtener ventas' });
  }
};

// POST - Crear una nueva venta
const crearVenta = async (req, res) => {
  try {
    const {
      customer,
      items,
      total,
      paymentMethod,
      receiptFile,
      status = 'completed'
    } = req.body;

    if (!customer || !items || !total || !paymentMethod) {
      return res.status(400).json({ 
        message: 'Todos los campos son obligatorios: customer, items, total, paymentMethod' 
      });
    }

    const nuevaVenta = new Venta({
      _id: new mongoose.Types.ObjectId(),
      customer,
      items,
      total: parseFloat(total),
      paymentMethod,
      receiptFile,
      status,
      createdAt: new Date()
    });

    const ventaGuardada = await nuevaVenta.save();
    res.status(201).json(ventaGuardada);
  } catch (error) {
    console.log('Error al crear venta:', error);
    res.status(500).json({ message: 'Error al crear venta' });
  }
};

// GET - Obtener estadísticas de ventas
const getEstadisticasVentas = async (req, res) => {
  try {
    const ventas = await Venta.find();
    
    const stats = {
      totalVentas: ventas.length,
      ingresosTotales: ventas.reduce((sum, venta) => sum + venta.total, 0),
      promedioVenta: ventas.length > 0 ? ventas.reduce((sum, venta) => sum + venta.total, 0) / ventas.length : 0,
      metodosPago: {},
      ventasRecientes: ventas.slice(-5) // Últimas 5 ventas
    };

    // Calcular estadísticas por método de pago
    ventas.forEach(venta => {
      const metodo = venta.paymentMethod || 'unknown';
      stats.metodosPago[metodo] = (stats.metodosPago[metodo] || 0) + 1;
    });

    res.status(200).json(stats);
  } catch (error) {
    console.log('Error al obtener estadísticas:', error);
    res.status(500).json({ message: 'Error al obtener estadísticas' });
  }
};

// GET - Obtener una venta específica
const getVenta = async (req, res) => {
  try {
    const { id } = req.params;
    const venta = await Venta.findById(id);
    
    if (!venta) {
      return res.status(404).json({ message: 'Venta no encontrada' });
    }
    
    res.status(200).json(venta);
  } catch (error) {
    console.log('Error al obtener venta:', error);
    res.status(500).json({ message: 'Error al obtener venta' });
  }
};

// PUT - Actualizar una venta
const actualizarVenta = async (req, res) => {
  try {
    const { id } = req.params;
    const ventaActualizada = await Venta.findByIdAndUpdate(id, req.body, { new: true });
    
    if (!ventaActualizada) {
      return res.status(404).json({ message: 'Venta no encontrada' });
    }
    
    res.status(200).json(ventaActualizada);
  } catch (error) {
    console.log('Error al actualizar venta:', error);
    res.status(500).json({ message: 'Error al actualizar venta' });
  }
};

// DELETE - Eliminar una venta
const eliminarVenta = async (req, res) => {
  try {
    const { id } = req.params;
    const ventaEliminada = await Venta.findByIdAndDelete(id);
    
    if (!ventaEliminada) {
      return res.status(404).json({ message: 'Venta no encontrada' });
    }
    
    res.status(200).json({ message: 'Venta eliminada exitosamente' });
  } catch (error) {
    console.log('Error al eliminar venta:', error);
    res.status(500).json({ message: 'Error al eliminar venta' });
  }
};

export {
  getVentas,
  crearVenta,
  getEstadisticasVentas,
  getVenta,
  actualizarVenta,
  eliminarVenta
}; 