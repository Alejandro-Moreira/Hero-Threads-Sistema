import React from 'react';
import { useNavigate } from 'react-router-dom';

function ShopHeroSection() {
    const navigate = useNavigate();

    const handleExploreClick = () => {
        navigate('/products');
    };

    return (
        <section className="relative w-full h-screen bg-gradient-to-br from-gray-900 to-gray-700 flex items-center justify-center text-center overflow-hidden">
            <div className="absolute inset-0 z-0">
                <img
                    src="https://4tsix0yujj.ufs.sh/f/2vMRHqOYUHc0qoCyfZvUMgOfLW4S62w7etx01aYAN8bRycsz"
                    alt="Superhéroes"
                    className="w-full h-full object-cover opacity-30"
                />
            </div>
            <div className="relative z-10 p-6 max-w-3xl mx-auto bg-black bg-opacity-50 rounded-xl shadow-2xl backdrop-blur-sm">
                <h2 className="text-5xl md:text-7xl font-extrabold text-white mb-6 leading-tight">
                    Viste a tu Héroe Interior
                </h2>
                <p className="text-xl md:text-2xl text-gray-200 mb-8">
                    Descubre nuestra colección exclusiva de camisetas sublimadas con tus superhéroes favoritos.
                </p>
                <button
                    onClick={handleExploreClick}
                    className="px-8 py-4 bg-red-600 text-white text-lg font-semibold rounded-full shadow-lg hover:bg-red-700 transition-all duration-300 transform hover:scale-105"
                >
                    Explorar Colección
                </button>
            </div>
        </section>
    );
}

export default ShopHeroSection; 