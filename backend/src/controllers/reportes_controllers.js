import Venta from '../models/ventas.js';
import Producto from '../models/productos.js';

// Obtener información de ventas
export const obtenerInformacionVentas = async (req, res) => {
  try {
    const { fechaInicio, fechaFin } = req.query;
    
    let filtroFecha = {};
    if (fechaInicio && fechaFin) {
      filtroFecha = {
        fechaVenta: {
          $gte: new Date(fechaInicio),
          $lte: new Date(fechaFin)
        }
      };
    }

    // Ventas totales
    const ventasTotales = await Venta.countDocuments({ ...filtroFecha, estado: 'completada' });
    
    // Ingresos totales
    const ingresosTotales = await Venta.aggregate([
      { $match: { ...filtroFecha, estado: 'completada' } },
      { $group: { _id: null, total: { $sum: '$precioTotal' } } }
    ]);
    
    // Productos más vendidos
    const productosMasVendidos = await Venta.aggregate([
      { $match: { ...filtroFecha, estado: 'completada' } },
      { $group: { 
        _id: '$productoId', 
        nombreProducto: { $first: '$nombreProducto' },
        cantidadVendida: { $sum: '$cantidad' },
        ingresos: { $sum: '$precioTotal' }
      }},
      { $sort: { cantidadVendida: -1 } },
      { $limit: 10 }
    ]);

    // Ventas por método de pago
    const ventasPorMetodoPago = await Venta.aggregate([
      { $match: { ...filtroFecha, estado: 'completada' } },
      { $group: { 
        _id: '$metodoPago', 
        cantidad: { $sum: 1 },
        total: { $sum: '$precioTotal' }
      }},
      { $sort: { total: -1 } }
    ]);

    // Ventas por día (últimos 30 días)
    const ventasPorDia = await Venta.aggregate([
      { $match: { 
        ...filtroFecha, 
        estado: 'completada',
        fechaVenta: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
      }},
      { $group: { 
        _id: { 
          $dateToString: { format: "%Y-%m-%d", date: "$fechaVenta" }
        },
        ventas: { $sum: 1 },
        ingresos: { $sum: '$precioTotal' }
      }},
      { $sort: { _id: 1 } }
    ]);

    res.json({
      ventasTotales,
      ingresosTotales: ingresosTotales[0]?.total || 0,
      productosMasVendidos,
      ventasPorMetodoPago,
      ventasPorDia
    });
  } catch (error) {
    console.error('Error al obtener información de ventas:', error);
    res.status(500).json({ message: 'Error al obtener información de ventas' });
  }
};

// Obtener análisis general de la plataforma
export const obtenerAnalisisPlataforma = async (req, res) => {
  try {
    // Total de productos
    const totalProductos = await Producto.countDocuments();
    
    // Productos con stock bajo (menos de 5 unidades vendidas en el último mes)
    const productosStockBajo = await Venta.aggregate([
      { $match: { 
        fechaVenta: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
        estado: 'completada'
      }},
      { $group: { 
        _id: '$productoId',
        nombreProducto: { $first: '$nombreProducto' },
        ventasUltimoMes: { $sum: '$cantidad' }
      }},
      { $match: { ventasUltimoMes: { $lt: 5 } } }
    ]);

    // Clientes más activos
    const clientesMasActivos = await Venta.aggregate([
      { $match: { estado: 'completada' } },
      { $group: { 
        _id: '$clienteEmail',
        compras: { $sum: 1 },
        totalGastado: { $sum: '$precioTotal' }
      }},
      { $sort: { totalGastado: -1 } },
      { $limit: 10 }
    ]);

    // Tendencias de ventas (últimos 6 meses)
    const tendenciasVentas = await Venta.aggregate([
      { $match: { 
        fechaVenta: { $gte: new Date(Date.now() - 6 * 30 * 24 * 60 * 60 * 1000) },
        estado: 'completada'
      }},
      { $group: { 
        _id: { 
          $dateToString: { format: "%Y-%m", date: "$fechaVenta" }
        },
        ventas: { $sum: 1 },
        ingresos: { $sum: '$precioTotal' }
      }},
      { $sort: { _id: 1 } }
    ]);

    // Métricas de rendimiento
    const totalVentas = await Venta.countDocuments({ estado: 'completada' });
    const totalIngresos = await Venta.aggregate([
      { $match: { estado: 'completada' } },
      { $group: { _id: null, total: { $sum: '$precioTotal' } } }
    ]);

    const promedioTicket = totalVentas > 0 ? (totalIngresos[0]?.total || 0) / totalVentas : 0;

    res.json({
      totalProductos,
      productosStockBajo,
      clientesMasActivos,
      tendenciasVentas,
      metricasRendimiento: {
        totalVentas,
        totalIngresos: totalIngresos[0]?.total || 0,
        promedioTicket: Math.round(promedioTicket * 100) / 100
      }
    });
  } catch (error) {
    console.error('Error al obtener análisis de plataforma:', error);
    res.status(500).json({ message: 'Error al obtener análisis de plataforma' });
  }
};

// Crear una nueva venta (para simulación)
export const crearVenta = async (req, res) => {
  try {
    const { productoId, nombreProducto, cantidad, precioUnitario, clienteEmail, metodoPago } = req.body;
    
    const precioTotal = cantidad * precioUnitario;
    
    const nuevaVenta = new Venta({
      productoId,
      nombreProducto,
      cantidad,
      precioUnitario,
      precioTotal,
      clienteEmail,
      metodoPago: metodoPago || 'tarjeta'
    });

    await nuevaVenta.save();
    
    res.status(201).json({
      message: 'Venta creada exitosamente',
      venta: nuevaVenta
    });
  } catch (error) {
    console.error('Error al crear venta:', error);
    res.status(500).json({ message: 'Error al crear venta' });
  }
};

// Obtener todas las ventas (para administración)
export const obtenerTodasLasVentas = async (req, res) => {
  try {
    const ventas = await Venta.find()
      .sort({ fechaVenta: -1 })
      .limit(100);
    
    res.json(ventas);
  } catch (error) {
    console.error('Error al obtener ventas:', error);
    res.status(500).json({ message: 'Error al obtener ventas' });
  }
}; 