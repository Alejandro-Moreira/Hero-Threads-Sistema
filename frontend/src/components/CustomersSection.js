import React, { useState, useEffect } from 'react';
import apiService from '../services/apiService';

function CustomersSection() {
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchCustomers();
    }, []);

    const fetchCustomers = async () => {
        try {
            setLoading(true);
            const data = await apiService.getCustomers();
            setCustomers(data);
        } catch (error) {
            console.error('Error fetching customers:', error);
            setError('Error al cargar los clientes');
        } finally {
            setLoading(false);
        }
    };

    const fetchCustomerPurchases = async (customerId) => {
        try {
            const purchases = await apiService.getCustomerPurchases(customerId);
            return purchases;
        } catch (error) {
            console.error('Error fetching customer purchases:', error);
            return [];
        }
    };

    const handleCustomerClick = async (customer) => {
        const purchases = await fetchCustomerPurchases(customer._id);
        setSelectedCustomer({ ...customer, purchases });
    };

    const filteredCustomers = customers.filter(customer =>
        customer.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto"></div>
                    <p className="mt-4 text-gray-600">Cargando clientes...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="text-center text-red-600">
                    <p>{error}</p>
                    <button 
                        onClick={fetchCustomers}
                        className="mt-4 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition"
                    >
                        Reintentar
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8 pt-24">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-4">Gestión de Clientes</h1>
                <p className="text-gray-600">Administra y visualiza el historial de compras de tus clientes</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Customers List */}
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-xl shadow-lg p-6">
                        <div className="mb-4">
                            <input
                                type="text"
                                placeholder="Buscar clientes..."
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        
                        <div className="space-y-2 max-h-96 overflow-y-auto">
                            {filteredCustomers.map((customer) => (
                                <div
                                    key={customer._id}
                                    onClick={() => handleCustomerClick(customer)}
                                    className={`p-4 rounded-lg cursor-pointer transition-colors ${
                                        selectedCustomer?._id === customer._id
                                            ? 'bg-black text-white'
                                            : 'bg-gray-50 hover:bg-gray-100'
                                    }`}
                                >
                                    <div className="font-semibold">{customer.nombre}</div>
                                    <div className="text-sm opacity-75">{customer.email}</div>
                                    <div className="text-xs mt-1">
                                        Cliente desde: {new Date(customer.createdAt || Date.now()).toLocaleDateString('es-ES')}
                                    </div>
                                </div>
                            ))}
                        </div>
                        
                        {filteredCustomers.length === 0 && (
                            <div className="text-center text-gray-500 py-8">
                                {searchTerm ? 'No se encontraron clientes' : 'No hay clientes registrados'}
                            </div>
                        )}
                    </div>
                </div>

                {/* Customer Details */}
                <div className="lg:col-span-2">
                    {selectedCustomer ? (
                        <div className="bg-white rounded-xl shadow-lg p-6">
                            <div className="mb-6">
                                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                                    {selectedCustomer.nombre}
                                </h2>
                                <div className="text-gray-600 space-y-1">
                                    <p><strong>Email:</strong> {selectedCustomer.email}</p>
                                    {selectedCustomer.celular && (
                                        <p><strong>Teléfono:</strong> {selectedCustomer.celular}</p>
                                    )}
                                    {selectedCustomer.direccion && (
                                        <p><strong>Dirección:</strong> {selectedCustomer.direccion}</p>
                                    )}
                                    {selectedCustomer.ciudad && (
                                        <p><strong>Ciudad:</strong> {selectedCustomer.ciudad}</p>
                                    )}
                                </div>
                            </div>

                            <div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                                    Historial de Compras
                                </h3>
                                
                                {selectedCustomer.purchases && selectedCustomer.purchases.length > 0 ? (
                                    <div className="space-y-4">
                                        {selectedCustomer.purchases.map((purchase) => (
                                            <div key={purchase._id} className="border border-gray-200 rounded-lg p-4">
                                                <div className="flex justify-between items-start mb-3">
                                                    <div>
                                                        <h4 className="font-semibold text-gray-900">
                                                            Compra #{purchase._id.slice(-6).toUpperCase()}
                                                        </h4>
                                                        <p className="text-sm text-gray-600">
                                                            {new Date(purchase.fecha).toLocaleDateString('es-ES', {
                                                                year: 'numeric',
                                                                month: 'long',
                                                                day: 'numeric',
                                                                hour: '2-digit',
                                                                minute: '2-digit'
                                                            })}
                                                        </p>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="font-bold text-lg text-gray-900">
                                                            ${purchase.total.toFixed(2)}
                                                        </p>
                                                        <p className="text-sm text-gray-600 capitalize">
                                                            {purchase.metodoPago}
                                                        </p>
                                                    </div>
                                                </div>
                                                
                                                <div className="space-y-2">
                                                    {purchase.productos.map((producto, index) => (
                                                        <div key={index} className="flex justify-between items-center text-sm">
                                                            <span>{producto.nombre}</span>
                                                            <span className="text-gray-600">
                                                                {producto.cantidad} x ${producto.precio.toFixed(2)}
                                                            </span>
                                                        </div>
                                                    ))}
                                                </div>
                                                
                                                {purchase.comprobante && (
                                                    <div className="mt-3 pt-3 border-t border-gray-200">
                                                        <p className="text-sm text-gray-600">
                                                            <strong>Comprobante:</strong> {purchase.comprobante}
                                                        </p>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center text-gray-500 py-8">
                                        <p>Este cliente aún no ha realizado compras</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="bg-white rounded-xl shadow-lg p-6 flex items-center justify-center h-64">
                            <div className="text-center text-gray-500">
                                <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                                </svg>
                                <p>Selecciona un cliente para ver sus detalles</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default CustomersSection; 