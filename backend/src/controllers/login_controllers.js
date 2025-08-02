import Registro from '../models/login.js';
import Cliente from '../models/clientes.js';
import bcrypt from 'bcrypt';

const inicioLogin = async (req, res) => {
  await registroLogin(); 
  const { email, password } = req.body;

  try {
    // Login para el admin hardcodeado
    if (email === 'admin@admin.com' && password === 'admin123') {
      return res.status(200).json({
        success: true,
        user: {
          email: email,
          role: 'admin',
          nombre: 'Administrador'
        },
        message: 'Administrador autenticado correctamente'
      });
    }

    // Buscar cliente en la base de datos
    const cliente = await Cliente.findOne({ email: email.toLowerCase().trim() });
    if (!cliente) {
      return res.status(401).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }

    const isPasswordValid = await bcrypt.compare(password, cliente.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Contraseña incorrecta'
      });
    }

    if (cliente.status === 'inactive') {
      return res.status(401).json({
        success: false,
        message: 'Tu cuenta está inactiva. Contacta al administrador.'
      });
    }

    if (cliente.role !== 'admin' && !cliente.emailVerified) {
      return res.status(401).json({
        success: false,
        message: 'Verifica tu email antes de iniciar sesión.'
      });
    }

    // Actualiza la última actividad
    cliente.lastActivity = new Date();
    await cliente.save();

    // Autenticación exitosa
    res.status(200).json({
      success: true,
      user: {
        id: cliente._id,
        email: cliente.email,
        role: cliente.role || 'cliente',
        nombre: cliente.nombre
      },
      message: 'Usuario autenticado correctamente'
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Error al autenticar el usuario'
    });
  }
};

// Crear el usuario admin si no existe
const registroLogin = async () => {
  const username = 'admin';
  const password = 'admin';

  try {
    const buscarUsername = await Registro.find({ username });
    if (buscarUsername.length === 0) {
      const user = new Registro({ username, password });
      await user.save();
    }
  } catch (error) {
    console.log('Error al crear el usuario inicial', error);
  }
};

const verificadoAutentication = (req, res, next) => {
  if (verificado) {
    next();
  } else {
    res.redirect('http://localhost:3000/api/login');
  }
};

export { inicioLogin, registroLogin, verificadoAutentication };