import Cliente from '../models/clientes.js'
import mongoose from 'mongoose'
import bcrypt from 'bcrypt'
import crypto from 'crypto'
import nodemailer from 'nodemailer'

const mostrarClientes = async (req, res) => {
    try {
      const Clientes = await Cliente.find();
      if(!Clientes || Clientes.length === 0){
        res.status(200).json({message : "No existen registros de clientes"})
      }else{
        res.status(200).json(Clientes);
      }
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener los clientes' });
      console.log(error);
    }
}

const buscarCliente = async (req, res) => {
    const ClienteID = req.params.id
    try {
      const Clientes = await Cliente.findById(ClienteID);
      if (!Clientes) {
        res.status(404).json({ message: 'No existe ese cliente' });
      } else {
        res.status(200).json(Clientes);
      }
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener los clientes' });
      console.log(error);
    }
}

const registrarCliente = async (req, res) => {
    const { nombre, cedula, edad, email, celular, direccion, ciudad } = req.body;
    try {
        const exisCliente = await Cliente.findOne({cedula})
        const exisCorreo = await Cliente.findOne({email})
        if (exisCliente || exisCorreo){
          if (exisCliente && exisCorreo) return res.status(200).json({message : 'Ya existe un cliente con ese correo y cédula'})
          else if (exisCorreo) return res.status(200).json({message : 'Ya existe un cliente con ese correo'})
          else if (exisCliente) return res.status(200).json({message : 'Ya existe un cliente con esa cédula'})
        }else{
          const nuevoCliente = new Cliente({
              _id: new mongoose.Types.ObjectId(), 
              nombre, 
              cedula, 
              edad, 
              email, 
              celular, 
              direccion, 
              ciudad
          });
          await nuevoCliente.save();
          res.status(200).json({ message: 'Cliente registrado correctamente' , Cliente : nuevoCliente});
        }
    } catch (err) {
        res.status(500).json({ error: 'Error al registrar el cliente' });
        console.log(err);
    }
}

// Generate verification token
const generateVerificationToken = () => {
  return crypto.randomBytes(32).toString('hex');
};

// Create email transporter
const createTransporter = () => {
  const emailUser = process.env.EMAIL_USER;
  const emailPass = process.env.EMAIL_PASS;

  if (!emailUser || !emailPass) {
    console.log('Email credentials not configured. Using fallback mode.');
    return null;
  }

  return nodemailer.createTransport({  // <- aquí debe ser createTransport
    service: 'gmail',
    auth: {
      user: emailUser,
      pass: emailPass
    }
  });
};

// Send verification email
const sendVerificationEmail = async (email, name, verificationToken) => {
  const verificationLink = `http://localhost:3000/verify-email?token=${verificationToken}`;
  
  const transporter = createTransporter();
  
  if (transporter) {
    try {
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Verificación de Email - Hero Threads',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #333;">¡Bienvenido a Hero Threads!</h2>
            <p>Hola ${name},</p>
            <p>Gracias por registrarte en Hero Threads. Para completar tu registro, por favor verifica tu dirección de email haciendo clic en el siguiente enlace:</p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${verificationLink}" style="background-color: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">Verificar Email</a>
            </div>
            <p>Si el botón no funciona, puedes copiar y pegar este enlace en tu navegador:</p>
            <p style="word-break: break-all; color: #666;">${verificationLink}</p>
            <p>Este enlace expirará en 24 horas.</p>
            <p>Si no solicitaste este registro, puedes ignorar este email.</p>
            <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
            <p style="color: #666; font-size: 12px;">Este es un email automático, por favor no respondas a este mensaje.</p>
          </div>
        `
      };

      await transporter.sendMail(mailOptions);
      console.log('Verification email sent successfully to:', email);
      return true;
    } catch (emailError) {
      console.error('Error sending email:', emailError);
      console.log('Verification link (fallback):', verificationLink);
      return false;
    }
  } else {
    console.log('Email not configured. Verification link:', verificationLink);
    return false;
  }
};

const registrarClientePublico = async (req, res) => {
    const { nombre, email, password } = req.body;
    
    try {
        console.log('Registration attempt for:', email);
        
        // Validate required fields
        if (!nombre || !email || !password) {
            return res.status(400).json({ 
                error: 'Todos los campos son requeridos: nombre, email, password' 
            });
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ 
                error: 'Formato de email inválido' 
            });
        }

        // Validate password strength (minimum 6 characters)
        if (password.length < 6) {
            return res.status(400).json({ 
                error: 'La contraseña debe tener al menos 6 caracteres' 
            });
        }

        // Validate name (not empty and reasonable length)
        if (nombre.trim().length < 2 || nombre.trim().length > 50) {
            return res.status(400).json({ 
                error: 'El nombre debe tener entre 2 y 50 caracteres' 
            });
        }

        // Check if email already exists
        const exisCliente = await Cliente.findOne({ email: email.toLowerCase().trim() });
        if (exisCliente) {
            return res.status(400).json({ 
                error: 'Ya existe un usuario con ese email' 
            });
        }

        // Generate verification token
        const verificationToken = generateVerificationToken();
        const verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

        // Hash the password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Create new client
        const nuevoCliente = new Cliente({
            _id: new mongoose.Types.ObjectId(),
            nombre: nombre.trim(),
            email: email.toLowerCase().trim(),
            password: await bcrypt.hash(password, 10),
            role: 'client', 
            emailVerified: false, 
            emailVerificationToken: verificationToken,
            emailVerificationExpires: verificationExpires,
            status: 'active',
            lastActivity: new Date()
        });

        await nuevoCliente.save();
        console.log('User saved to database:', nuevoCliente._id);
        
        // Send verification email
        const emailSent = await sendVerificationEmail(email, nombre, verificationToken);
        
        res.status(201).json({ 
            message: emailSent ? 'Usuario registrado exitosamente. Se ha enviado un email de confirmación.' : 'Usuario registrado exitosamente. Revisa la consola del servidor para el enlace de verificación.',
            user: {
                id: nuevoCliente._id,
                nombre: nuevoCliente.nombre,
                email: nuevoCliente.email,
                role: nuevoCliente.role
            },
            emailSent: emailSent
        });
        
      } catch (err) {
        if (err.code === 11000 && err.keyPattern && err.keyPattern.email) {
            // Error de duplicado de email
            return res.status(400).json({ error: 'Ya existe un usuario con ese email' });
        }
    
        console.error('Registration error:', err);
        res.status(500).json({ error: 'Error al registrar el usuario' });
    }    
}

const actualizarCliente = async (req, res) => {
    const ClienteID = req.params.id; 
    try {
        const ClienteActualizado = await Cliente.findByIdAndUpdate(ClienteID, req.body, { new: true });
        if (!ClienteActualizado) {
            return res.status(404).json({ error: 'No se encontró el cliente para actualizar' });
        }
        res.status(200).json({ message: 'Cliente actualizado', Cliente: ClienteActualizado });
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar el cliente' });
        console.log(error);
    }
}

const borrarCliente = async (req, res) => {
    const ClienteID = req.params.id;
    try {
      const ClienteEliminado = await Cliente.findByIdAndDelete(ClienteID);
      if (!ClienteEliminado) {
        return res.status(404).json({ error: 'No se encontró el cliente para eliminar' });
      }
      res.status(200).json({ message: 'Cliente eliminado' });
    } catch (error) {
      res.status(500).json({ error: 'Error al eliminar el cliente' });
      console.log(error);
    }
}

export {
    mostrarClientes,
    buscarCliente,
    registrarCliente,
    registrarClientePublico,
    actualizarCliente,
    borrarCliente
}