import React from 'react';
import { useNavigate } from 'react-router-dom';

function CartSection({ cartItems, onRemoveFromCart, onUpdateCartQuantity, onClearCart, user }) {
    const navigate = useNavigate();

    const handleCheckout = () => {
        if (cartItems.length === 0) {
            alert('Tu carrito está vacío. Agrega productos antes de proceder al pago.');
            return;
        }
        
        if (!user) {
            alert('Debes iniciar sesión para completar la compra. Por favor, inicia sesión o regístrate.');
            return;
        }
        
        navigate('/checkout');
    };

    return (
        <section className="container mx-auto px-4 py-12">
            <h2 className="text-4xl font-bold text-center text-gray-900 mb-10">Tu Carrito</h2>
            {cartItems.length === 0 ? (
                <p className="text-center text-gray-600 text-xl">
                    Tu carrito está vacío, ¡Es hora de llenarlo de{' '}
                    <span
                        className="text-blue-600 font-semibold underline cursor-pointer hover:text-blue-800"
                        onClick={() => navigate('/products')}
                    >
                        héroes
                    </span>!
                </p>
            ) : (
                <div className="bg-white rounded-xl shadow-lg p-8 max-w-3xl mx-auto">
                    {cartItems.map((item) => (
                        <div key={item._id || item.id} className="flex items-center justify-between py-4 border-b border-gray-200 last:border-b-0">
                            <div className="flex items-center space-x-4">
                                <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded-lg" />
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900">{item.name}</h3>
                                    <div className="flex items-center space-x-2 mt-2">
                                        <button
                                            onClick={() => onUpdateCartQuantity(item._id || item.id, item.quantity - 1)}
                                            className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300 font-bold"
                                            disabled={item.quantity <= 1}
                                        >-</button>
                                        <span className="px-2">{item.quantity}</span>
                                        <button
                                            onClick={() => onUpdateCartQuantity(item._id || item.id, item.quantity + 1)}
                                            className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300 font-bold"
                                        >+</button>
                                        <button
                                            onClick={() => onRemoveFromCart(item._id || item.id)}
                                            className="ml-4 px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-xs"
                                        >Eliminar</button>
                                    </div>
                                </div>
                            </div>
                            <span className="text-xl font-bold text-gray-900">${(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                    ))}
                    <div className="flex justify-between items-center pt-6 mt-6 border-t border-gray-200">
                        <span className="text-2xl font-bold text-gray-900">Total:</span>
                        <span className="text-2xl font-bold text-red-600">
                            ${cartItems.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2)}
                        </span>
                    </div>
                    <div className="flex flex-col md:flex-row md:justify-between gap-4 mt-8">
                        <button
                            onClick={onClearCart}
                            className="w-full md:w-auto bg-gray-200 text-gray-800 py-3 rounded-lg hover:bg-gray-300 transition-colors font-semibold"
                        >
                            Vaciar Carrito
                        </button>
                        <button
                            onClick={handleCheckout}
                            className="w-full md:w-auto bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
                        >
                            Realizar el Pago
                        </button>
                    </div>
                </div>
            )}
        </section>
    );
}

export default CartSection; 