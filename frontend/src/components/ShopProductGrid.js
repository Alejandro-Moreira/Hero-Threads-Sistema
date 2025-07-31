import React from 'react';
import ShopProductCard from './ShopProductCard';

function ShopProductGrid({ products, onAddToCart }) {
    return (
        <section className="container mx-auto px-4 py-12">
            <h2 className="text-4xl font-bold text-center text-gray-900 mb-10">Nuestra Colección</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {products.map(product => (
                    <ShopProductCard key={product._id || product.id} product={product} onAddToCart={onAddToCart} />
                ))}
            </div>
        </section>
    );
}

export default ShopProductGrid; 