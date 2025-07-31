import Registro from '../models/login.js';
import Cliente from '../models/clientes.js';
import bcrypt from 'bcrypt';

let verificado = false;

const inicioLogin = async (req, res) => {
  registroLogin()
  const { email, password } = req.body;
  
  try {
    // First check hardcoded demo credentials
    if (email === 'admin@admin.com' && password === 'admin123') {
      res.status(200).json({ 
        success: true, 
        user: { 
          email: email, 
          role: 'admin',
          nombre: 'Administrador'
        },
        message: 'Administrador autenticado correctamente'
      });
      return;
    }

    // Check database for registered users
    const cliente = await Cliente.findOne({ email });
    if (!cliente) {
      return res.status(401).json({ 
        success: false, 
        message: 'Usuario no encontrado' 
      });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, cliente.password);
    if (!isPasswordValid) {
      return res.status(401).json({ 
        success: false, 
        message: 'Contraseña incorrecta' 
      });
    }

    // Check user status
    if (cliente.status === 'inactive') {
      return res.status(401).json({ 
        success: false, 
        message: 'Tu cuenta está inactiva. Contacta al administrador para más información.' 
      });
    }

    // Check email verification for non-admin users
    if (cliente.role !== 'admin' && !cliente.emailVerified) {
      return res.status(401).json({ 
        success: false, 
        message: 'Por favor verifica tu email antes de iniciar sesión. Revisa tu bandeja de entrada.' 
      });
    }

    // Update last activity
    cliente.lastActivity = new Date();
    await cliente.save();

    // Return user data
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
    res.status(500).json({ 
      success: false, 
      message: 'Error al autenticar el usuario' 
    });
    console.log(error);
  }
};

const registroLogin = async (req, res) => {
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
  if(verificado){
    next();
  }else{
    res.redirect('http://localhost:3000/api/login');
  }
}

export { inicioLogin, registroLogin, verificadoAutentication };