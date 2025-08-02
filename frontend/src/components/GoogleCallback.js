import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import apiService from '../services/apiService';

function GoogleCallback() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [status, setStatus] = useState('processing');
    const [message, setMessage] = useState('');

    useEffect(() => {
        const handleGoogleCallback = async () => {
            const code = searchParams.get('code');
            
            if (!code) {
                setStatus('error');
                setMessage('Código de autorización no encontrado.');
                return;
            }

            try {
                setStatus('processing');
                const response = await apiService.handleGoogleCallback(code);
                
                if (response.success) {
                    setStatus('success');
                    setMessage('Autenticación con Google exitosa. Redirigiendo...');
                    
                    // Store user data in localStorage or state management
                    localStorage.setItem('user', JSON.stringify(response.user));
                    
                    setTimeout(() => {
                        navigate('/');
                    }, 2000);
                } else {
                    setStatus('error');
                    setMessage(response.message || 'Error en la autenticación');
                }
            } catch (error) {
                setStatus('error');
                setMessage('Error al procesar la autenticación con Google');
                console.error('Google callback error:', error);
            }
        };

        handleGoogleCallback();
    }, [searchParams, navigate]);

    if (status === 'processing') {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-md w-full space-y-8">
                    <div className="bg-white rounded-xl shadow-lg p-8 text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">
                            Procesando Autenticación
                        </h2>
                        <p className="text-gray-600">
                            Por favor espera mientras procesamos tu autenticación con Google...
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
                            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-6">
                                <svg className="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                </svg>
                            </div>
                            <h2 className="text-3xl font-bold text-gray-900 mb-4">
                                ¡Autenticación Exitosa!
                            </h2>
                        </>
                    ) : (
                        <>
                            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-6">
                                <svg className="h-8 w-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                                </svg>
                            </div>
                            <h2 className="text-3xl font-bold text-gray-900 mb-4">
                                Error de Autenticación
                            </h2>
                        </>
                    )}

                    <p className="text-gray-600 mb-6">
                        {message}
                    </p>

                    <div className="space-y-3">
                        {status === 'success' ? (
                            <button
                                onClick={() => navigate('/')}
                                className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors font-semibold"
                            >
                                Ir al Inicio
                            </button>
                        ) : (
                            <>
                                <button
                                    onClick={() => navigate('/register')}
                                    className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
                                >
                                    Intentar de Nuevo
                                </button>
                                <button
                                    onClick={() => navigate('/')}
                                    className="w-full bg-gray-600 text-white py-3 px-4 rounded-lg hover:bg-gray-700 transition-colors font-semibold"
                                >
                                    Volver al Inicio
                                </button>
                            </>
                        )}
                    </div>

                    {status === 'error' && (
                        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                            <p className="text-red-800 text-sm font-medium mb-2">Posibles causas del error:</p>
                            <ul className="text-red-700 text-sm list-disc list-inside space-y-1">
                                <li>La sesión de Google ha expirado</li>
                                <li>Problemas de conectividad</li>
                                <li>Configuración incorrecta de OAuth</li>
                            </ul>
                            <p className="text-red-600 text-sm mt-3">
                                Si el problema persiste, intenta registrarte con email y contraseña.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default GoogleCallback; 