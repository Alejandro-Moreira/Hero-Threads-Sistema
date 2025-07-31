import React, { useState, useEffect } from 'react';

function ProductosDashboard() {
    const [productos, setProductos] = useState([]);

    useEffect(() => {
        fetch("http://localhost:3000/api/productos")
            .then((res) => res.json())
            .then((data) => setProductos(data))
            .catch((error) => console.error("Error al obtener productos:", error));
    }, []);

    return (
        <div className="p-8">
            <h2 className="text-3xl font-bold mb-6 text-center text-white">Dashboard de Productos</h2>
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white rounded-xl shadow-xl overflow-hidden">
                    <thead className="bg-gray-800 text-white">
                        <tr>
                            <th className="py-3 px-4 text-left">Nombre</th>
                            <th className="py-3 px-4 text-left">Precio</th>
                            <th className="py-3 px-4 text-left">Descripción</th>
                        </tr>
                    </thead>
                    <tbody>
                        {productos.map((producto) => (
                            <tr key={producto._id} className="border-b border-gray-200 hover:bg-gray-100">
                                <td className="py-2 px-4">{producto.name}</td>
                                <td className="py-2 px-4">${producto.price}</td>
                                <td className="py-2 px-4">{producto.description}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default ProductosDashboard; 