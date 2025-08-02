import bcrypt from 'bcrypt';
import crypto from 'crypto';
import fetch from 'node-fetch';
import Cliente from '../models/clientes.js';
import { sendVerificationEmail, sendPasswordResetEmail } from './email_controllers.js';

// Register new user
const registerUser = async (req, res) => {
    try {
        const { nombre, email, password } = req.body;

        // Validate required fields
        if (!nombre || !email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Todos los campos son requeridos'
            });
        }

        // Check if user already exists
        const existingUser = await Cliente.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'El email ya está registrado'
            });
        }

        // Hash password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Generate verification token
        const verificationToken = crypto.randomBytes(32).toString('hex');
        const verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

        // Create new user (only clients can register)
        const newUser = new Cliente({
            nombre,
            email: email.toLowerCase(),
            password: hashedPassword,
            role: 'client', // Only clients can register
            emailVerified: false,
            emailVerificationToken: verificationToken,
            emailVerificationExpires: verificationExpires,
            status: 'active',
            lastActivity: new Date(),
            createdAt: new Date()
        });

        await newUser.save();

        // Send verification email
        try {
            await sendVerificationEmail(email, nombre, verificationToken);
        } catch (emailError) {
            console.error('Error sending verification email:', emailError);
            // Don't fail registration if email fails
        }

        res.status(201).json({
            success: true,
            message: 'Usuario registrado exitosamente. Se ha enviado un email de confirmación.',
            user: {
                id: newUser._id,
                nombre: newUser.nombre,
                email: newUser.email,
                role: newUser.role
            }
        });

    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({
            success: false,
            message: 'Error al registrar el usuario'
        });
    }
};

// Forgot password
const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                success: false,
                message: 'El email es requerido'
            });
        }

        // Find user by email
        const user = await Cliente.findOne({ email: email.toLowerCase() });
        if (!user) {
            // Don't reveal if user exists or not for security
            return res.status(200).json({
                success: true,
                message: 'Si el email existe en nuestra base de datos, recibirás un enlace para restablecer tu contraseña.'
            });
        }

        // Generate reset token
        const resetToken = crypto.randomBytes(32).toString('hex');
        const resetExpires = new Date(Date.now() + 1 * 60 * 60 * 1000); // 1 hour

        // Save reset token to user
        user.passwordResetToken = resetToken;
        user.passwordResetExpires = resetExpires;
        await user.save();

        // Send password reset email
        try {
            await sendPasswordResetEmail(email, user.nombre, resetToken);
        } catch (emailError) {
            console.error('Error sending password reset email:', emailError);
            return res.status(500).json({
                success: false,
                message: 'Error al enviar el email de restablecimiento'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Se ha enviado un email con las instrucciones para restablecer tu contraseña.'
        });

    } catch (error) {
        console.error('Error in forgot password:', error);
        res.status(500).json({
            success: false,
            message: 'Error al procesar la solicitud'
        });
    }
};

// Validate reset token
const validateResetToken = async (req, res) => {
    try {
        const { token } = req.params;

        if (!token) {
            return res.status(400).json({
                success: false,
                message: 'Token requerido'
            });
        }

        // Find user by reset token
        const user = await Cliente.findOne({
            passwordResetToken: token,
            passwordResetExpires: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({
                success: false,
                message: 'El token de restablecimiento es inválido o ha expirado'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Token válido'
        });

    } catch (error) {
        console.error('Error validating reset token:', error);
        res.status(500).json({
            success: false,
            message: 'Error al validar el token'
        });
    }
};

// Reset password
const resetPassword = async (req, res) => {
    try {
        const { token, password } = req.body;

        if (!token || !password) {
            return res.status(400).json({
                success: false,
                message: 'Token y nueva contraseña son requeridos'
            });
        }

        // Find user by reset token
        const user = await Cliente.findOne({
            passwordResetToken: token,
            passwordResetExpires: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({
                success: false,
                message: 'El token de restablecimiento es inválido o ha expirado'
            });
        }

        // Hash new password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Update user password and clear reset token
        user.password = hashedPassword;
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;
        user.lastActivity = new Date();
        await user.save();

        res.status(200).json({
            success: true,
            message: 'Contraseña actualizada exitosamente'
        });

    } catch (error) {
        console.error('Error resetting password:', error);
        res.status(500).json({
            success: false,
            message: 'Error al restablecer la contraseña'
        });
    }
};

// Get Google OAuth URL
const getGoogleAuthUrl = async (req, res) => {
    try {
        const googleClientId = process.env.GOOGLE_CLIENT_ID;
        const redirectUri = process.env.GOOGLE_REDIRECT_URI || 'http://localhost:3000/api/auth/google/callback';
        
        const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
            `client_id=${googleClientId}&` +
            `redirect_uri=${encodeURIComponent(redirectUri)}&` +
            `response_type=code&` +
            `scope=openid%20email%20profile&` +
            `access_type=offline&` +
            `prompt=consent`;

        res.status(200).json({
            success: true,
            authUrl: authUrl
        });
    } catch (error) {
        console.error('Error generating Google auth URL:', error);
        res.status(500).json({
            success: false,
            message: 'Error al generar URL de autenticación'
        });
    }
};

// Handle Google OAuth callback
const handleGoogleCallback = async (req, res) => {
    try {
        const { code } = req.body;

        if (!code) {
            return res.status(400).json({
                success: false,
                message: 'Código de autorización requerido'
            });
        }

        // Exchange code for tokens
        const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                client_id: process.env.GOOGLE_CLIENT_ID,
                client_secret: process.env.GOOGLE_CLIENT_SECRET,
                code: code,
                grant_type: 'authorization_code',
                redirect_uri: process.env.GOOGLE_REDIRECT_URI || 'http://localhost:3000/api/auth/google/callback'
            })
        });

        const tokenData = await tokenResponse.json();

        if (!tokenResponse.ok) {
            console.error('Google token error:', tokenData);
            return res.status(400).json({
                success: false,
                message: 'Error al obtener tokens de Google'
            });
        }

        // Get user info from Google
        const userInfoResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
            headers: {
                'Authorization': `Bearer ${tokenData.access_token}`
            }
        });

        const userInfo = await userInfoResponse.json();

        if (!userInfoResponse.ok) {
            return res.status(400).json({
                success: false,
                message: 'Error al obtener información del usuario'
            });
        }

        // Check if user already exists
        let user = await Cliente.findOne({ email: userInfo.email });

        if (!user) {
            // Create new user from Google data (only as client)
            user = new Cliente({
                nombre: userInfo.name,
                email: userInfo.email.toLowerCase(),
                role: 'client', // Only clients can register via Google
                emailVerified: true, // Google users are pre-verified
                status: 'active',
                lastActivity: new Date(),
                createdAt: new Date(),
                googleId: userInfo.id
            });

            await user.save();
        } else {
            // Update existing user's Google info
            user.googleId = userInfo.id;
            user.emailVerified = true;
            user.lastActivity = new Date();
            await user.save();
        }

        res.status(200).json({
            success: true,
            message: 'Autenticación con Google exitosa',
            user: {
                id: user._id,
                nombre: user.nombre,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        console.error('Error handling Google callback:', error);
        res.status(500).json({
            success: false,
            message: 'Error en la autenticación con Google'
        });
    }
};

export {
    registerUser,
    forgotPassword,
    validateResetToken,
    resetPassword,
    getGoogleAuthUrl,
    handleGoogleCallback
}; 