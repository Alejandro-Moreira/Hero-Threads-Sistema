import Producto from '../models/productos.js';

// GET - Obtener todos los productos
const getProductos = async (req, res) => {
  try {
    const productos = await Producto.find();
    res.status(200).json(productos);
  } catch (error) {
    console.log('Error al obtener productos:', error);
    res.status(500).json({ message: 'Error al obtener productos' });
  }
};

// POST - Crear un nuevo producto
const crearProducto = async (req, res) => {
  try {
    const { name, description, price, image } = req.body;
    
    if (!name || !price || !image) {
      return res.status(400).json({ message: 'Todos los campos son obligatorios' });
    }

    // Verificar si ya existe un producto con el mismo nombre
    const productoExistente = await Producto.findOne({ name: name.trim() });
    if (productoExistente) {
      return res.status(400).json({ 
        message: 'Ya existe un producto con este nombre. Por favor, elige un nombre único.' 
      });
    }

    const nuevoProducto = new Producto({
      name: name.trim(),
      description: description || '',
      price: parseFloat(price),
      image
    });

    const productoGuardado = await nuevoProducto.save();
    res.status(201).json(productoGuardado);
  } catch (error) {
    console.log('Error al crear producto:', error);
    if (error.code === 11000) {
      return res.status(400).json({ 
        message: 'Ya existe un producto con este nombre. Por favor, elige un nombre único.' 
      });
    }
    res.status(500).json({ message: 'Error al crear producto' });
  }
};

// PUT - Actualizar un producto
const actualizarProducto = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, image } = req.body;

    if (!name || !price || !image) {
      return res.status(400).json({ message: 'Todos los campos son obligatorios' });
    }

    // Verificar si ya existe otro producto con el mismo nombre (excluyendo el producto actual)
    const productoExistente = await Producto.findOne({ 
      name: name.trim(), 
      _id: { $ne: id } 
    });
    if (productoExistente) {
      return res.status(400).json({ 
        message: 'Ya existe otro producto con este nombre. Por favor, elige un nombre único.' 
      });
    }

    const productoActualizado = await Producto.findByIdAndUpdate(
      id,
      {
        name: name.trim(),
        description: description || '',
        price: parseFloat(price),
        image
      },
      { new: true }
    );

    if (!productoActualizado) {
      return res.status(404).json({ message: 'No se encontró el producto para actualizar' });
    }

    res.status(200).json(productoActualizado);
  } catch (error) {
    console.log('Error al actualizar producto:', error);
    if (error.code === 11000) {
      return res.status(400).json({ 
        message: 'Ya existe otro producto con este nombre. Por favor, elige un nombre único.' 
      });
    }
    res.status(500).json({ message: 'Error al actualizar producto' });
  }
};

// DELETE - Eliminar un producto
const eliminarProducto = async (req, res) => {
  try {
    const { id } = req.params;
    const productoEliminado = await Producto.findByIdAndDelete(id);

    if (!productoEliminado) {
      return res.status(404).json({ message: 'No se encontró el producto para eliminar' });
    }

    res.status(200).json({ message: 'Producto eliminado correctamente' });
  } catch (error) {
    console.log('Error al eliminar producto:', error);
    res.status(500).json({ message: 'Error al eliminar producto' });
  }
};

export { getProductos, crearProducto, actualizarProducto, eliminarProducto }; 