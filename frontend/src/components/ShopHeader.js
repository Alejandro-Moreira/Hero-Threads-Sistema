import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import RegisterModal from './RegisterModal';
import apiService from '../services/apiService';

function ShopHeader({ onSearchChange, cartCount, user, onLogout, onLogin, loginError, onRegister }) {
    const [showLogin, setShowLogin] = useState(false);
    const [showRegister, setShowRegister] = useState(false);
    const [loginEmail, setLoginEmail] = useState('');
    const [loginPassword, setLoginPassword] = useState('');
    const navigate = useNavigate();

    const handleLoginSubmit = (e) => {
        e.preventDefault();
        onLogin(loginEmail, loginPassword);
        setShowLogin(false);
    };

    const handleRegister = async (formData) => {
        try {
            await apiService.register(formData);
            alert('Usuario registrado exitosamente. Se ha enviado un email de confirmación a tu correo.');
        } catch (error) {
            console.error('Registration error:', error);
            throw error;
        }
    };

    return (
        <header className="w-full bg-white shadow-sm fixed top-0 left-0 z-50">
            <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                <Link to="/" className="text-2xl font-bold text-gray-900">Hero Threads</Link>
                <nav className="hidden md:flex space-x-6">
                    <Link to="/" className="text-gray-600 hover:text-gray-900 transition-colors">Inicio</Link>
                    {user && user.role === 'admin' ? (
                        <>
                            <Link to="/dashboard" className="text-gray-600 hover:text-gray-900 transition-colors">Dashboard</Link>
                            <Link to="/reports" className="text-gray-600 hover:text-gray-900 transition-colors">Reportes</Link>
                        </>
                    ) : (
                        <Link to="/products" className="text-gray-600 hover:text-gray-900 transition-colors">Camisetas</Link>
                    )}
                    {(!user || user.role !== 'admin') && (
                        <Link to="/about" className="text-gray-600 hover:text-gray-900 transition-colors">Nosotros</Link>
                    )}
                    {user && user.role === 'admin' && (
                        <Link to="/admin" className="text-gray-600 hover:text-gray-900 transition-colors">Admin</Link>
                    )}
                </nav>
                <div className="flex items-center space-x-4">
                    {!user ? (
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setShowLogin(true)}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
                            >
                                Iniciar Sesión
                            </button>
                            <button
                                onClick={() => setShowRegister(true)}
                                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg font-semibold hover:bg-gray-300 transition"
                            >
                                Registrarse
                            </button>
                        </div>
                    ) : (
                        <>
                            <span className="text-gray-700 font-medium">{user.nombre || user.email} ({user.role === 'admin' ? 'Administrador' : 'Cliente'})</span>
                            <button
                                onClick={onLogout}
                                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg font-semibold hover:bg-gray-300 transition"
                            >
                                Cerrar Sesión
                            </button>
                        </>
                    )}
                    {(!user || user.role !== 'admin') && (
                        <Link to="/cart" className="relative p-2 rounded-full hover:bg-gray-100 transition-colors">
                            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 0a2 2 0 100 4 2 2 0 000-4z"></path>
                            </svg>
                            <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 bg-red-600 rounded-full">{cartCount}</span>
                        </Link>
                    )}
                    <button className="md:hidden p-2 rounded-full hover:bg-gray-100 transition-colors">
                        <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
                        </svg>
                    </button>
                </div>
            </div>
            
            {/* Login Modal */}
            {showLogin && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-sm relative">
                        <button onClick={() => setShowLogin(false)} className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-2xl">&times;</button>
                        <h2 className="text-2xl font-bold mb-6 text-center">Iniciar Sesión</h2>
                        <form className="space-y-4" onSubmit={handleLoginSubmit}>
                            <input type="email" placeholder="Correo electrónico" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 transition" value={loginEmail} onChange={e => setLoginEmail(e.target.value)} required />
                            <input type="password" placeholder="Contraseña" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 transition" value={loginPassword} onChange={e => setLoginPassword(e.target.value)} required />
                            {loginError && <div className="text-red-600 text-sm text-center">{loginError}</div>}
                            <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 font-semibold transition">Entrar</button>
                            <div className="text-xs text-gray-500 mt-2 text-center">
                                <div><b>Admin:</b> admin@admin.com / admin123</div>
                                <div><b>Cliente:</b> cliente@cliente.com / cliente123</div>
                            </div>
                            <div className="text-xs text-blue-600 mt-2 text-center border-t pt-2">
                                <p><strong>Nota:</strong> Los usuarios nuevos deben verificar su email antes de iniciar sesión.</p>
                            </div>
                        </form>
                    </div>
                </div>
            )}
            
            {/* Register Modal */}
            <RegisterModal
                isOpen={showRegister}
                onClose={() => setShowRegister(false)}
                onRegister={handleRegister}
            />
        </header>
    );
}

export default ShopHeader; 