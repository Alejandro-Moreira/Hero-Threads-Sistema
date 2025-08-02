import React from 'react';

function ShopProductCard({ product, onAddToCart }) {
    return (
<div className="bg-white rounded-xl shadow-lg overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-2xl border border-gray-200 hover:border-gray-400 hover:border-2 transition-colors">            <div className="relative w-full h-64 overflow-hidden">
                <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover object-center transition-transform duration-300 hover:scale-110"
                />
                <div className="absolute top-3 right-3 bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                    Nuevo
                </div>
            </div>
            <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{product.name}</h3>
                <p className="text-gray-600 text-sm mb-4">{product.description}</p>
                <div className="flex justify-between items-center">
                    <span className="text-2xl font-bold text-gray-900">${product.price.toFixed(2)}</span>
                    <button
                        onClick={() => onAddToCart(product)}
                        className="px-5 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors duration-300"
                    >
                        Agregar
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ShopProductCard; 