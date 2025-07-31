import express from 'express';
import { getProductos, crearProducto, actualizarProducto, eliminarProducto } from '../controllers/productos_controllers.js';

const routerProductos = express.Router();

routerProductos.use(express.json());

// GET - Obtener todos los productos
routerProductos.get('/', getProductos);

// POST - Crear un nuevo producto
routerProductos.post('/', crearProducto);

// PUT - Actualizar un producto
routerProductos.put('/:id', actualizarProducto);

// DELETE - Eliminar un producto
routerProductos.delete('/:id', eliminarProducto);

routerProductos.use((req, res) => res.status(404).end())

export default routerProductos; 