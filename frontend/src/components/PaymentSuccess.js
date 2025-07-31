import React from 'react';
import { Link } from 'react-router-dom';

function PaymentSuccess({ orderDetails, onContinueShopping }) {
    const { items, total, paymentMethod, saleId } = orderDetails;

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div className="bg-white rounded-xl shadow-lg p-8 text-center">
                    {/* Success Icon */}
                    <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-6">
                        <svg className="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                        </svg>
                    </div>

                    {/* Success Message */}
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">
                        ¡Pago Exitoso!
                    </h2>
                    <p className="text-gray-600 mb-6">
                        Tu pedido ha sido procesado correctamente. Recibirás una confirmación por email.
                    </p>

                    {/* Order Details */}
                    <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
                        <h3 className="font-semibold text-gray-900 mb-3">Detalles del Pedido:</h3>
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-gray-600">Número de Pedido:</span>
                                <span className="font-medium">#{saleId}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Método de Pago:</span>
                                <span className="font-medium capitalize">
                                    {paymentMethod === 'card' ? 'Tarjeta de Crédito' : 
                                     paymentMethod === 'transfer' ? 'Transferencia Bancaria' : 
                                     paymentMethod === 'cash' ? 'Efectivo' : paymentMethod}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Total:</span>
                                <span className="font-bold text-lg">${total.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>

                    {/* Items Summary */}
                    <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
                        <h3 className="font-semibold text-gray-900 mb-3">Productos:</h3>
                        <div className="space-y-2 text-sm">
                            {items.map((item, index) => (
                                <div key={index} className="flex justify-between">
                                    <span className="text-gray-600">
                                        {item.name} x{item.quantity}
                                    </span>
                                    <span className="font-medium">
                                        ${(item.price * item.quantity).toFixed(2)}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="space-y-3">
                        <button
                            onClick={onContinueShopping}
                            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
                        >
                            Continuar Comprando
                        </button>
                        <Link
                            to="/"
                            className="block w-full bg-gray-200 text-gray-800 py-3 px-4 rounded-lg hover:bg-gray-300 transition-colors font-semibold text-center"
                        >
                            Volver al Inicio
                        </Link>
                    </div>

                    {/* Additional Info */}
                    <div className="mt-6 text-xs text-gray-500">
                        <p>Te hemos enviado un email con los detalles de tu pedido.</p>
                        <p className="mt-1">Si tienes alguna pregunta, no dudes en contactarnos.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PaymentSuccess; 