import React from 'react';
import { useNavigate } from 'react-router-dom';

function AboutSection() {
    const navigate = useNavigate();

    const handleExploreClick = () => {
        navigate('/products');
    };

    return (
        <section className="w-full bg-gradient-to-br from-gray-50 to-gray-200 py-16">
            <div className="container mx-auto px-4">
                <div className="bg-white rounded-2xl shadow-xl p-8 md:p-16 flex flex-col md:flex-row gap-12 items-center md:items-start">
                    {/* About Us Text */}
                    <div className="flex-1 text-center md:text-left">
                        <h2 className="text-4xl font-extrabold text-gray-900 mb-6">Sobre Nosotros</h2>
                        <div className="space-y-5 text-gray-700 text-lg leading-relaxed">
                            <p>
                                En <button onClick={handleExploreClick} className="font-semibold underline hover:text-gray-900 transition-colors cursor-pointer">Hero Threads</button>, compartimos tu pasión por los superhéroes. Nos inspiran sus historias, su fuerza y su valentía, y lo reflejamos en cada una de nuestras camisetas sublimadas de alta calidad, diseñadas para brindarte estilo, comodidad y personalidad.
                            </p>
                            <p>
                                Cada prenda es más que una camiseta: es una forma de llevar contigo a tus personajes favoritos, de mostrar lo que representas y de sentirte parte de algo más grande.
                            </p>
                            <p>
                                Aquí, los fans no solo visten a sus héroes... <span className="font-semibold text-red-600">se convierten en ellos</span>.
                            </p>
                            <p>
                                Únete a <button onClick={handleExploreClick} className="font-semibold underline hover:text-gray-900 transition-colors cursor-pointer">Hero Threads</button> y forma parte de una comunidad donde la pasión por los superhéroes se vive con orgullo.
                                <br />
                                <span className="block mt-4 font-bold text-gray-800">¡Porque todos llevamos un héroe dentro!</span>
                            </p>
                        </div>
                        <div className="mt-8 flex flex-col items-center md:items-start gap-4">
                            <button
                                onClick={handleExploreClick}
                                className="px-8 py-4 bg-blue-600 text-white text-lg font-semibold rounded-full shadow-lg hover:bg-blue-700 transition-all duration-300 transform hover:scale-105"
                            >
                                Explorar Colección
                            </button>
                            <div className="flex items-center gap-4 mt-2">
                                <span className="text-gray-600 font-medium">Síguenos:</span>
                                <a href="#" aria-label="Instagram" className="text-pink-500 hover:text-pink-700 text-2xl"><svg fill="currentColor" viewBox="0 0 24 24" className="w-6 h-6"><path d="M7.75 2h8.5A5.75 5.75 0 0 1 22 7.75v8.5A5.75 5.75 0 0 1 16.25 22h-8.5A5.75 5.75 0 0 1 2 16.25v-8.5A5.75 5.75 0 0 1 7.75 2zm0 1.5A4.25 4.25 0 0 0 3.5 7.75v8.5A4.25 4.25 0 0 0 7.75 20.5h8.5a4.25 4.25 0 0 0 4.25-4.25v-8.5A4.25 4.25 0 0 0 16.25 3.5zm4.25 2.25a5.25 5.25 0 1 1-5.25 5.25 5.25 5.25 0 0 1 5.25-5.25zm0 1.5a3.75 3.75 0 1 0 3.75 3.75A3.75 3.75 0 0 0 12 5.25zm6.25 1.25a1 1 0 1 1-1 1 1 1 0 0 1 1-1z" /></svg></a>
                                <a href="#" aria-label="Facebook" className="text-blue-700 hover:text-blue-900 text-2xl"><svg fill="currentColor" viewBox="0 0 24 24" className="w-6 h-6"><path d="M22.675 0h-21.35C.595 0 0 .592 0 1.326v21.348C0 23.408.595 24 1.325 24h11.495v-9.294H9.692v-3.622h3.128V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.797.143v3.24l-1.918.001c-1.504 0-1.797.715-1.797 1.763v2.313h3.587l-.467 3.622h-3.12V24h6.116C23.406 24 24 23.408 24 22.674V1.326C24 .592 23.406 0 22.675 0" /></svg></a>
                                <a href="#" aria-label="Twitter" className="text-blue-400 hover:text-blue-600 text-2xl"><svg fill="currentColor" viewBox="0 0 24 24" className="w-6 h-6"><path d="M24 4.557a9.83 9.83 0 0 1-2.828.775 4.932 4.932 0 0 0 2.165-2.724c-.951.564-2.005.974-3.127 1.195a4.916 4.916 0 0 0-8.38 4.482C7.691 8.095 4.066 6.13 1.64 3.161c-.542.929-.856 2.01-.857 3.17 0 2.188 1.115 4.117 2.823 5.247a4.904 4.904 0 0 1-2.229-.616c-.054 2.281 1.581 4.415 3.949 4.89a4.936 4.936 0 0 1-2.224.084c.627 1.956 2.444 3.377 4.6 3.417A9.867 9.867 0 0 1 0 21.543a13.94 13.94 0 0 0 7.548 2.209c9.058 0 14.009-7.513 14.009-14.009 0-.213-.005-.425-.014-.636A10.012 10.012 0 0 0 24 4.557z" /></svg></a>
                            </div>
                        </div>
                    </div>
                    {/* Contact Form */}
                    <div className="flex-1 w-full max-w-md mx-auto">
                        <div className="bg-gray-50 rounded-xl shadow p-6 md:p-8">
                            <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center md:text-left">Contáctanos</h3>
                            <p className="text-gray-700 mb-4 text-center md:text-left">¿Tienes alguna duda o sugerencia? ¡Nos encantaría escucharte!</p>
                            <form className="space-y-4">
                                <input
                                    type="text"
                                    placeholder="Tu Nombre"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black transition"
                                />
                                <input
                                    type="email"
                                    placeholder="Tu Correo Electrónico"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black transition"
                                />
                                <textarea
                                    placeholder="Tu Mensaje"
                                    rows="5"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black transition resize-none"
                                ></textarea>
                                <button
                                    type="submit"
                                    className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
                                >
                                    Enviar Mensaje
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default AboutSection; 