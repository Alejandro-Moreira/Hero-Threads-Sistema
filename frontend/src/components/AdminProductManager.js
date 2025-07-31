import React, { useState } from 'react';

function AdminProductManager({ products, onUpdateProduct, onAddProduct, onDeleteProduct }) {
    const [newProduct, setNewProduct] = useState({
        name: '',
        description: '',
        price: '',
        image: ''
    });
    const [editId, setEditId] = useState(null);
    const [editFields, setEditFields] = useState({});

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewProduct({ ...newProduct, [name]: value });
    };

    const handleAddProduct = () => {
        if (newProduct.name && newProduct.price && newProduct.image) {
            // Check if name already exists
            const existingProduct = products.find(p =>
                p.name.toLowerCase().trim() === newProduct.name.toLowerCase().trim()
            );
            if (existingProduct) {
                alert('Ya existe un producto con este nombre. Por favor, elige un nombre único.');
                return;
            }

            onAddProduct({
                ...newProduct,
                price: parseFloat(newProduct.price)
            });
            setNewProduct({ name: '', description: '', price: '', image: '' });
        } else {
            alert('Por favor, llena todos los campos obligatorios para agregar un producto.');
        }
    };

    const handleEditClick = (product) => {
        setEditId(product._id || product.id);
        setEditFields({
            ...product
        });
    };

    const handleEditFieldChange = (e) => {
        const { name, value } = e.target;
        setEditFields({ ...editFields, [name]: name === 'price' ? value.replace(/[^0-9.]/g, '') : value });
    };

    const handleSaveEdit = () => {
        if (!editFields.name || !editFields.price || !editFields.image) {
            alert('Por favor, llena todos los campos obligatorios.');
            return;
        }

        // Check if name already exists (excluding current product)
        const existingProduct = products.find(p =>
            p.name.toLowerCase().trim() === editFields.name.toLowerCase().trim() &&
            (p._id || p.id) !== editId
        );
        if (existingProduct) {
            alert('Ya existe otro producto con este nombre. Por favor, elige un nombre único.');
            return;
        }

        if (window.confirm('¿Estás seguro de guardar los cambios de este producto?')) {
            onUpdateProduct(editId, {
                ...editFields,
                price: parseFloat(editFields.price)
            });
            setEditId(null);
            setEditFields({});
        }
    };

    const handleCancelEdit = () => {
        setEditId(null);
        setEditFields({});
    };

    const handleDeleteProduct = (id) => {
        if (window.confirm('¿Estás seguro de que deseas eliminar este producto?')) {
            onDeleteProduct(id);
        }
    };

    return (
        <section className="container mx-auto px-4 py-12">
            <h2 className="text-4xl font-bold text-center text-gray-900 mb-10">Administrar Productos</h2>

            <div className="bg-white rounded-xl shadow-lg p-8 mb-10">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Agregar Nuevo Producto</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <input
                        type="text"
                        name="name"
                        placeholder="Nombre del Producto"
                        value={newProduct.name}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black transition"
                    />
                    <input
                        type="text"
                        name="description"
                        placeholder="Descripción"
                        value={newProduct.description}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black transition"
                    />
                    <input
                        type="number"
                        name="price"
                        placeholder="Precio"
                        value={newProduct.price}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black transition"
                    />
                    <input
                        type="text"
                        name="image"
                        placeholder="URL de la Imagen"
                        value={newProduct.image}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black transition"
                    />
                </div>
                <button
                    onClick={handleAddProduct}
                    className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800 transition-colors font-semibold"
                >
                    Agregar Producto
                </button>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Lista de Productos</h3>
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white">
                        <thead>
                            <tr className="border-b border-gray-200">
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Imagen</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Descripción</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Precio</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map((product) => (
                                <tr key={product._id || product.id} className="border-b border-gray-200 last:border-b-0">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {editId === (product._id || product.id) ? (
                                            <input
                                                type="text"
                                                name="image"
                                                value={editFields.image}
                                                onChange={handleEditFieldChange}
                                                className="w-24 px-2 py-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-black transition"
                                            />
                                        ) : (
                                            <img src={product.image} alt={product.name} className="w-16 h-16 object-cover rounded-lg" />
                                        )}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                        {editId === (product._id || product.id) ? (
                                            <input
                                                type="text"
                                                name="name"
                                                value={editFields.name}
                                                onChange={handleEditFieldChange}
                                                className="w-32 px-2 py-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-black transition"
                                            />
                                        ) : (
                                            product.name
                                        )}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                        {editId === (product._id || product.id) ? (
                                            <input
                                                type="text"
                                                name="description"
                                                value={editFields.description}
                                                onChange={handleEditFieldChange}
                                                className="w-48 px-2 py-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-black transition"
                                            />
                                        ) : (
                                            product.description
                                        )}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {editId === (product._id || product.id) ? (
                                            <input
                                                type="number"
                                                name="price"
                                                value={editFields.price}
                                                onChange={handleEditFieldChange}
                                                className="w-24 px-2 py-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-black transition"
                                            />
                                        ) : (
                                            product.price
                                        )}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        {editId === (product._id || product.id) ? (
                                            <>
                                                <button
                                                    onClick={handleSaveEdit}
                                                    className="text-green-600 hover:text-green-900 transition-colors mr-2"
                                                >
                                                    Guardar
                                                </button>
                                                <button
                                                    onClick={handleCancelEdit}
                                                    className="text-gray-600 hover:text-gray-900 transition-colors"
                                                >
                                                    Cancelar
                                                </button>
                                            </>
                                        ) : (
                                            <>
                                                <button
                                                    onClick={() => handleEditClick(product)}
                                                    className="text-blue-600 hover:text-blue-900 transition-colors mr-2"
                                                >
                                                    Editar
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteProduct(product._id || product.id)}
                                                    className="text-red-600 hover:text-red-900 transition-colors"
                                                >
                                                    Eliminar
                                                </button>
                                            </>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </section>
    );
}

export default AdminProductManager; 