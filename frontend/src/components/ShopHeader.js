import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import apiService from '../services/apiService';

function ShopHeader({ onSearchChange, cartCount, user, onLogout, onLogin, loginError, onRegister }) {
    const navigate = useNavigate();

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
                            <Link
                                to="/login"
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
                            >
                                Iniciar Sesión
                            </Link>
                            <Link
                                to="/register"
                                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg font-semibold hover:bg-gray-300 transition"
                            >
                                Registrarse
                            </Link>
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
            
            {/* Mobile Search */}
            <div className="md:hidden px-4 pb-4">
                <input
                    type="text"
                    placeholder="Buscar productos..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                    onChange={(e) => onSearchChange(e.target.value)}
                />
            </div>
        </header>
    );
}

export default ShopHeader; 