import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import apiService from '../services/apiService';

function EmailVerification() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [status, setStatus] = useState('verifying'); // 'verifying', 'success', 'error'
    const [message, setMessage] = useState('');

    useEffect(() => {
        const verifyEmail = async () => {
            const token = searchParams.get('token');
            
            if (!token) {
                setStatus('error');
                setMessage('Token de verificación no encontrado.');
                return;
            }

            try {
                const response = await apiService.verifyEmail(token);
                if (response.success) {
                    setStatus('success');
                    setMessage(response.message);
                } else {
                    setStatus('error');
                    setMessage(response.message);
                }
            } catch (error) {
                setStatus('error');
                setMessage('Error al verificar el email. Por favor, intenta de nuevo.');
            }
        };

        verifyEmail();
    }, [searchParams]);

    const handleContinue = () => {
        navigate('/');
    };

    const handleLogin = () => {
        navigate('/');
    };

    const handleResendEmail = () => {
        // This could be implemented to resend verification email
        alert('Función de reenvío de email no disponible en este momento. Por favor contacta con soporte.');
    };

    if (status === 'verifying') {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-md w-full space-y-8">
                    <div className="bg-white rounded-xl shadow-lg p-8 text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">
                            Verificando Email
                        </h2>
                        <p className="text-gray-600">
                            Por favor espera mientras verificamos tu dirección de email...
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div className="bg-white rounded-xl shadow-lg p-8 text-center">
                    {status === 'success' ? (
                        <>
                            {/* Success Icon */}
                            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-6">
                                <svg className="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                </svg>
                            </div>
                            <h2 className="text-3xl font-bold text-gray-900 mb-4">
                                ¡Email Verificado!
                            </h2>
                        </>
                    ) : (
                        <>
                            {/* Error Icon */}
                            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-6">
                                <svg className="h-8 w-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                                </svg>
                            </div>
                            <h2 className="text-3xl font-bold text-gray-900 mb-4">
                                Error de Verificación
                            </h2>
                        </>
                    )}

                    <p className="text-gray-600 mb-6">
                        {message}
                    </p>

                    <div className="space-y-3">
                        {status === 'success' ? (
                            <button
                                onClick={handleLogin}
                                className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors font-semibold"
                            >
                                Ir al Login
                            </button>
                        ) : (
                            <>
                                <button
                                    onClick={handleContinue}
                                    className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
                                >
                                    Volver al Inicio
                                </button>
                                <button
                                    onClick={handleResendEmail}
                                    className="w-full bg-gray-600 text-white py-3 px-4 rounded-lg hover:bg-gray-700 transition-colors font-semibold"
                                >
                                    Reenviar Email
                                </button>
                            </>
                        )}
                    </div>

                    {status === 'error' && (
                        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                            <p className="text-red-800 text-sm font-medium mb-2">Posibles causas del error:</p>
                            <ul className="text-red-700 text-sm list-disc list-inside space-y-1">
                                <li>El enlace de verificación ha expirado (24 horas)</li>
                                <li>El enlace ya fue utilizado</li>
                                <li>El enlace es inválido o corrupto</li>
                            </ul>
                            <p className="text-red-600 text-sm mt-3">
                                Si el problema persiste, contacta con soporte técnico.
                            </p>
                        </div>
                    )}

                    {status === 'success' && (
                        <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                            <p className="text-green-800 text-sm">
                                <strong>¡Felicidades!</strong> Tu cuenta ha sido verificada exitosamente. 
                                Ya puedes iniciar sesión y disfrutar de todos nuestros servicios.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default EmailVerification; 