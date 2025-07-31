import dotenv from "dotenv";
dotenv.config();

import connection from "./database.js";
import Venta from "./models/ventas.js";
import Producto from "./models/productos.js";

const ventasEjemplo = [
  {
    productoId: null, // Se asignará dinámicamente
    nombreProducto: "Batman Classic",
    cantidad: 3,
    precioUnitario: 29.99,
    precioTotal: 89.97,
    clienteEmail: "cliente1@example.com",
    fechaVenta: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 días atrás
    metodoPago: "tarjeta",
    estado: "completada",
  },
  {
    productoId: null,
    nombreProducto: "Spider-Man Web",
    cantidad: 2,
    precioUnitario: 34.99,
    precioTotal: 69.98,
    clienteEmail: "cliente2@example.com",
    fechaVenta: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 días atrás
    metodoPago: "efectivo",
    estado: "completada",
  },
  {
    productoId: null,
    nombreProducto: "Superman Shield",
    cantidad: 1,
    precioUnitario: 39.99,
    precioTotal: 39.99,
    clienteEmail: "cliente3@example.com",
    fechaVenta: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 día atrás
    metodoPago: "transferencia",
    estado: "completada",
  },
  {
    productoId: null,
    nombreProducto: "Wonder Woman",
    cantidad: 4,
    precioUnitario: 27.99,
    precioTotal: 111.96,
    clienteEmail: "cliente1@example.com",
    fechaVenta: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 días atrás
    metodoPago: "tarjeta",
    estado: "completada",
  },
  {
    productoId: null,
    nombreProducto: "Iron Man Arc Reactor",
    cantidad: 2,
    precioUnitario: 44.99,
    precioTotal: 89.98,
    clienteEmail: "cliente4@example.com",
    fechaVenta: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 días atrás
    metodoPago: "tarjeta",
    estado: "completada",
  },
  {
    productoId: null,
    nombreProducto: "Captain America",
    cantidad: 1,
    precioUnitario: 32.99,
    precioTotal: 32.99,
    clienteEmail: "cliente2@example.com",
    fechaVenta: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000), // 4 días atrás
    metodoPago: "efectivo",
    estado: "completada",
  },
  {
    productoId: null,
    nombreProducto: "Black Panther",
    cantidad: 3,
    precioUnitario: 36.99,
    precioTotal: 110.97,
    clienteEmail: "cliente5@example.com",
    fechaVenta: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000), // 6 días atrás
    metodoPago: "tarjeta",
    estado: "completada",
  },
  {
    productoId: null,
    nombreProducto: "Thor Hammer",
    cantidad: 2,
    precioUnitario: 41.99,
    precioTotal: 83.98,
    clienteEmail: "cliente1@example.com",
    fechaVenta: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000), // 8 días atrás
    metodoPago: "transferencia",
    estado: "completada",
  },
  {
    productoId: null,
    nombreProducto: "Hulk Smash",
    cantidad: 1,
    precioUnitario: 29.99,
    precioTotal: 29.99,
    clienteEmail: "cliente3@example.com",
    fechaVenta: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000), // 9 días atrás
    metodoPago: "efectivo",
    estado: "completada",
  },
  {
    productoId: null,
    nombreProducto: "Flash Speed",
    cantidad: 2,
    precioUnitario: 33.99,
    precioTotal: 67.98,
    clienteEmail: "cliente4@example.com",
    fechaVenta: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), // 10 días atrás
    metodoPago: "tarjeta",
    estado: "completada",
  },
];

const poblarVentas = async () => {
  try {
    await connection();

    // Limpiar ventas existentes
    await Venta.deleteMany({});
    console.log("Ventas existentes eliminadas");

    // Obtener productos para asignar IDs
    const productos = await Producto.find();
    if (productos.length === 0) {
      console.log(
        "No hay productos en la base de datos. Ejecuta primero npm run seed"
      );
      process.exit(1);
    }

    // Asignar IDs de productos a las ventas
    const ventasConProductos = ventasEjemplo.map((venta, index) => {
      const producto = productos[index % productos.length];
      return {
        ...venta,
        productoId: producto._id,
      };
    });

    // Insertar ventas
    await Venta.insertMany(ventasConProductos);
    console.log(`${ventasConProductos.length} ventas de ejemplo insertadas`);

    console.log("Base de datos poblada con ventas de ejemplo");
    process.exit(0);
  } catch (error) {
    console.error("Error al poblar la base de datos con ventas:", error);
    process.exit(1);
  }
};

poblarVentas();
