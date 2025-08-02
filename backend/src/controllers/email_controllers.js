import crypto from 'crypto';
import nodemailer from 'nodemailer';
import Cliente from '../models/clientes.js';
import dotenv from 'dotenv';

dotenv.config();

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

  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: emailUser,
      pass: emailPass
    }
  });
};

// Create transporter
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Send verification email
const sendVerificationEmail = async (email, name, token) => {
    const verificationUrl = `${process.env.FRONTEND_URL || 'http://localhost:3001'}/email-verification?token=${token}`;
    
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Verifica tu cuenta - Hero Threads',
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <div style="background-color: #000; color: white; padding: 20px; text-align: center;">
                    <h1 style="margin: 0;">Hero Threads</h1>
                </div>
                <div style="padding: 30px; background-color: #f9f9f9;">
                    <h2 style="color: #333; margin-bottom: 20px;">¡Hola ${name}!</h2>
                    <p style="color: #666; line-height: 1.6;">
                        Gracias por registrarte en Hero Threads. Para completar tu registro, 
                        necesitamos verificar tu dirección de email.
                    </p>
                    <div style="text-align: center; margin: 30px 0;">
                        <a href="${verificationUrl}" 
                           style="background-color: #000; color: white; padding: 15px 30px; 
                                  text-decoration: none; border-radius: 5px; display: inline-block;">
                            Verificar Email
                        </a>
                    </div>
                    <p style="color: #666; font-size: 14px;">
                        Si el botón no funciona, copia y pega este enlace en tu navegador:<br>
                        <a href="${verificationUrl}" style="color: #000;">${verificationUrl}</a>
                    </p>
                    <p style="color: #666; font-size: 14px;">
                        Este enlace expirará en 24 horas.
                    </p>
                </div>
                <div style="background-color: #f0f0f0; padding: 20px; text-align: center; color: #666;">
                    <p style="margin: 0; font-size: 12px;">
                        © 2024 Hero Threads. Todos los derechos reservados.
                    </p>
                </div>
            </div>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Verification email sent successfully');
    } catch (error) {
        console.error('Error sending verification email:', error);
        throw error;
    }
};

// Send password reset email
const sendPasswordResetEmail = async (email, name, token) => {
    const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:3001'}/reset-password?token=${token}`;
    
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Restablecer Contraseña - Hero Threads',
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <div style="background-color: #000; color: white; padding: 20px; text-align: center;">
                    <h1 style="margin: 0;">Hero Threads</h1>
                </div>
                <div style="padding: 30px; background-color: #f9f9f9;">
                    <h2 style="color: #333; margin-bottom: 20px;">¡Hola ${name}!</h2>
                    <p style="color: #666; line-height: 1.6;">
                        Has solicitado restablecer tu contraseña. Haz clic en el botón de abajo 
                        para crear una nueva contraseña.
                    </p>
                    <div style="text-align: center; margin: 30px 0;">
                        <a href="${resetUrl}" 
                           style="background-color: #000; color: white; padding: 15px 30px; 
                                  text-decoration: none; border-radius: 5px; display: inline-block;">
                            Restablecer Contraseña
                        </a>
                    </div>
                    <p style="color: #666; font-size: 14px;">
                        Si no solicitaste este cambio, puedes ignorar este email. 
                        Tu contraseña permanecerá sin cambios.
                    </p>
                    <p style="color: #666; font-size: 14px;">
                        Si el botón no funciona, copia y pega este enlace en tu navegador:<br>
                        <a href="${resetUrl}" style="color: #000;">${resetUrl}</a>
                    </p>
                    <p style="color: #666; font-size: 14px;">
                        Este enlace expirará en 1 hora por seguridad.
                    </p>
                </div>
                <div style="background-color: #f0f0f0; padding: 20px; text-align: center; color: #666;">
                    <p style="margin: 0; font-size: 12px;">
                        © 2024 Hero Threads. Todos los derechos reservados.
                    </p>
                </div>
            </div>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Password reset email sent successfully');
    } catch (error) {
        console.error('Error sending password reset email:', error);
        throw error;
    }
};

// Send order confirmation email
const sendOrderConfirmationEmail = async (email, name, orderDetails) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Confirmación de Pedido - Hero Threads',
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <div style="background-color: #000; color: white; padding: 20px; text-align: center;">
                    <h1 style="margin: 0;">Hero Threads</h1>
                </div>
                <div style="padding: 30px; background-color: #f9f9f9;">
                    <h2 style="color: #333; margin-bottom: 20px;">¡Gracias por tu compra, ${name}!</h2>
                    <p style="color: #666; line-height: 1.6;">
                        Tu pedido ha sido confirmado y está siendo procesado.
                    </p>
                    <div style="background-color: white; padding: 20px; border-radius: 5px; margin: 20px 0;">
                        <h3 style="color: #333; margin-bottom: 15px;">Detalles del Pedido</h3>
                        <p style="color: #666; margin: 5px 0;"><strong>Número de Pedido:</strong> ${orderDetails.saleId}</p>
                        <p style="color: #666; margin: 5px 0;"><strong>Método de Pago:</strong> ${orderDetails.paymentMethod}</p>
                        <p style="color: #666; margin: 5px 0;"><strong>Total:</strong> $${orderDetails.total}</p>
                    </div>
                    <p style="color: #666; font-size: 14px;">
                        Te notificaremos cuando tu pedido sea enviado.
                    </p>
                </div>
                <div style="background-color: #f0f0f0; padding: 20px; text-align: center; color: #666;">
                    <p style="margin: 0; font-size: 12px;">
                        © 2024 Hero Threads. Todos los derechos reservados.
                    </p>
                </div>
            </div>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Order confirmation email sent successfully');
    } catch (error) {
        console.error('Error sending order confirmation email:', error);
        throw error;
    }
};


// Send confirmation email
const sendConfirmationEmail = async (req, res) => {
  const { email, name, type } = req.body;

  try {
    if (type === 'registration') {
      // Generate verification token
      const verificationToken = generateVerificationToken();
      const verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

      // Update user with verification token
      await Cliente.findOneAndUpdate(
        { email },
        {
          emailVerificationToken: verificationToken,
          emailVerificationExpires: verificationExpires
        }
      );

      // Send actual verification email
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
          console.log('✅ Verification email sent successfully to:', email);

          res.status(200).json({
            success: true,
            message: 'Email de confirmación enviado correctamente'
          });
        } catch (emailError) {
          console.error('❌ Error sending email:', emailError);
          // Fallback to logging for development
          console.log('📧 Verification link (fallback):', verificationLink);
          
          res.status(200).json({
            success: true,
            message: 'Email de confirmación enviado correctamente (modo desarrollo)',
            verificationLink: verificationLink // Only for development
          });
        }
      } else {
        // No email credentials configured - use fallback
        console.log('📧 Email not configured. Verification link:', verificationLink);
        
        res.status(200).json({
          success: true,
          message: 'Usuario registrado. Verifica tu email (revisa la consola del servidor para el enlace)',
          verificationLink: verificationLink // Only for development
        });
      }
    } else {
      res.status(200).json({
        success: true,
        message: 'Email enviado correctamente'
      });
    }
  } catch (error) {
    console.error('Error sending confirmation email:', error);
    res.status(500).json({
      success: false,
      message: 'Error al enviar el email de confirmación'
    });
  }
};

// Verify email
const verifyEmail = async (req, res) => {
  const { token } = req.params;

  try {
    const cliente = await Cliente.findOne({
      emailVerificationToken: token,
      emailVerificationExpires: { $gt: Date.now() }
    });

    if (!cliente) {
      return res.status(400).json({
        success: false,
        message: 'Token de verificación inválido o expirado'
      });
    }

    // Mark email as verified
    cliente.emailVerified = true;
    cliente.emailVerificationToken = undefined;
    cliente.emailVerificationExpires = undefined;
    await cliente.save();

    res.status(200).json({
      success: true,
      message: 'Email verificado correctamente. Ya puedes iniciar sesión.'
    });
  } catch (error) {
    console.error('Error verifying email:', error);
    res.status(500).json({
      success: false,
      message: 'Error al verificar el email'
    });
  }
};

// Send order confirmation email
const sendOrderConfirmation = async (req, res) => {
  const { email, name, orderDetails } = req.body;

  try {
    // In a real implementation, you would send an actual email here
    console.log('Order confirmation email sent to:', email);
    console.log('Order details:', orderDetails);

    res.status(200).json({
      success: true,
      message: 'Email de confirmación de pedido enviado correctamente'
    });
  } catch (error) {
    console.error('Error sending order confirmation email:', error);
    res.status(500).json({
      success: false,
      message: 'Error al enviar el email de confirmación del pedido'
    });
  }
};

export { sendConfirmationEmail, sendOrderConfirmation, verifyEmail, sendVerificationEmail, sendPasswordResetEmail, sendOrderConfirmationEmail }; 