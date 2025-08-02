import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaInstagram, FaFacebookF } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';

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
                                <a
                                    href="#"
                                    aria-label="Instagram"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-pink-500 hover:text-pink-700 text-2xl"
                                >
                                    <FaInstagram className="w-6 h-6" />
                                </a>
                                <a
                                    href="#"
                                    aria-label="Facebook"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-700 hover:text-blue-900 text-2xl"
                                >
                                    <FaFacebookF className="w-6 h-6" />
                                </a>
                                <a
                                    href="#"
                                    aria-label="X (Twitter)"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-400 hover:text-blue-600 text-2xl"
                                >
                                    <FaXTwitter className="w-6 h-6" />
                                </a>
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