import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import apiService from '../services/apiService';

function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [validationError, setValidationError] = useState('');

    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
        if (validationError) {
            setValidationError('');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        // Validate email
        if (!email.trim()) {
            setValidationError('El email es requerido');
            return;
        }

        if (!validateEmail(email)) {
            setValidationError('Por favor ingresa un email válido');
            return;
        }

        setLoading(true);
        try {
            const response = await apiService.forgotPassword(email.trim().toLowerCase());
            
            if (response.success) {
                setSuccess('Se ha enviado un email con las instrucciones para restablecer tu contraseña. Por favor revisa tu bandeja de entrada.');
            }
        } catch (error) {
            setError(error.message || 'Error al enviar el email de restablecimiento');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left Side - Image */}
                <div className="hidden lg:flex items-center justify-center">
                    <div className="relative w-full h-96 rounded-2xl overflow-hidden shadow-2xl">
                        <div className="absolute inset-0 bg-gradient-to-br from-black to-gray-800 opacity-90"></div>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="text-center text-white z-10">
                                <div className="mx-auto h-24 w-24 bg-white bg-opacity-20 rounded-full flex items-center justify-center mb-6 backdrop-blur-sm">
                                    <svg className="h-12 w-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"></path>
                                    </svg>
                                </div>
                                <h2 className="text-4xl font-bold mb-4">¿Olvidaste tu contraseña?</h2>
                                <p className="text-lg text-gray-200 mb-8">
                                    No te preocupes, te ayudaremos a recuperar tu cuenta
                                </p>
                                <div className="flex items-center justify-center space-x-4 text-sm text-gray-300">
                                    <div className="flex items-center">
                                        <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                                        </svg>
                                        Proceso seguro
                                    </div>
                                    <div className="flex items-center">
                                        <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                                        </svg>
                                        Envío rápido
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* Background pattern */}
                        <div className="absolute inset-0 opacity-10">
                            <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                                <defs>
                                    <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                                        <path d="M 10 0 L 0 0 0 10" fill="none" stroke="currentColor" strokeWidth="0.5"/>
                                    </pattern>
                                </defs>
                                <rect width="100" height="100" fill="url(#grid)"/>
                            </svg>
                        </div>
                    </div>
                </div>

                {/* Right Side - Form */}
                <div className="flex items-center justify-center">
                    <div className="w-full max-w-md space-y-8">
                        <div className="text-center lg:text-left">
                            <div className="mx-auto lg:mx-0 h-12 w-12 bg-black rounded-full flex items-center justify-center mb-4">
                                <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"></path>
                                </svg>
                            </div>
                            <h2 className="text-3xl font-extrabold text-gray-900">
                                Restablecer Contraseña
                            </h2>
                            <p className="mt-2 text-sm text-gray-600">
                                Ingresa tu email y te enviaremos las instrucciones
                            </p>
                        </div>

                        <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-200">
                            {/* Error/Success Messages */}
                            {error && (
                                <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                                    <p className="text-red-600 text-sm">{error}</p>
                                </div>
                            )}

                            {success && (
                                <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                                    <p className="text-green-600 text-sm">{success}</p>
                                </div>
                            )}

                            {/* Form */}
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                        Correo Electrónico
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={email}
                                        onChange={handleEmailChange}
                                        className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent ${
                                            validationError ? 'border-red-300' : 'border-gray-300'
                                        }`}
                                        placeholder="tu@email.com"
                                        required
                                    />
                                    {validationError && (
                                        <p className="mt-1 text-sm text-red-600">{validationError}</p>
                                    )}
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-black text-white py-3 px-4 rounded-lg hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {loading ? 'Enviando...' : 'Enviar Instrucciones'}
                                </button>
                            </form>

                            <div className="mt-6 text-center">
                                <p className="text-sm text-gray-600">
                                    ¿Recordaste tu contraseña?{' '}
                                    <Link to="/login" className="font-medium text-black hover:underline">
                                        Iniciar Sesión
                                    </Link>
                                </p>
                            </div>

                            <div className="mt-4 text-center">
                                <p className="text-xs text-gray-500">
                                    ¿No tienes una cuenta?{' '}
                                    <Link to="/register" className="font-medium text-black hover:underline">
                                        Regístrate aquí
                                    </Link>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ForgotPassword; 