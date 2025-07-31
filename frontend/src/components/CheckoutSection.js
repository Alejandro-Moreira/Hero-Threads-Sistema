import React, { useState } from 'react';
import { validateCheckoutForm, validateCardNumber, validateCardExpiry, validateCVV, validateName } from '../utils/validation';

function CheckoutSection({ paymentMethod, setPaymentMethod, onProcessPayment, cartItems, user }) {
    const [receiptFile, setReceiptFile] = useState(null);
    const [cardInfo, setCardInfo] = useState({
        cardNumber: '',
        cardName: '',
        expiry: '',
        cvv: ''
    });
    const [validationErrors, setValidationErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file && file.type.startsWith('image/')) {
            setReceiptFile(file);
        } else {
            alert('Por favor selecciona un archivo de imagen válido');
        }
    };

    const handleCardInfoChange = (e) => {
        const { name, value } = e.target;
        let formattedValue = value;

        // Format card number with spaces
        if (name === 'cardNumber') {
            const cleaned = value.replace(/\s/g, '');
            const groups = cleaned.match(/.{1,4}/g);
            formattedValue = groups ? groups.join(' ') : cleaned;
        }

        // Format expiry date
        if (name === 'expiry') {
            const cleaned = value.replace(/\D/g, '');
            if (cleaned.length >= 2) {
                formattedValue = cleaned.slice(0, 2) + '/' + cleaned.slice(2, 4);
            } else {
                formattedValue = cleaned;
            }
        }

        // Limit CVV to 4 digits
        if (name === 'cvv') {
            formattedValue = value.replace(/\D/g, '').slice(0, 4);
        }

        setCardInfo(prev => ({
            ...prev,
            [name]: formattedValue
        }));

        // Real-time validation
        validateField(name, formattedValue);
    };

    const validateField = (fieldName, value) => {
        const errors = { ...validationErrors };
        
        switch (fieldName) {
            case 'cardNumber':
                if (value && !validateCardNumber(value)) {
                    errors.cardNumber = 'Número de tarjeta inválido (16 dígitos requeridos)';
                } else {
                    delete errors.cardNumber;
                }
                break;
            case 'cardName':
                if (value && !validateName(value)) {
                    errors.cardName = 'Nombre inválido (2-50 caracteres)';
                } else {
                    delete errors.cardName;
                }
                break;
            case 'expiry':
                if (value && !validateCardExpiry(value)) {
                    errors.expiry = 'Fecha de vencimiento inválida (MM/AA)';
                } else {
                    delete errors.expiry;
                }
                break;
            case 'cvv':
                if (value && !validateCVV(value)) {
                    errors.cvv = 'CVV inválido (3-4 dígitos)';
                } else {
                    delete errors.cvv;
                }
                break;
            default:
                break;
        }
        
        setValidationErrors(errors);
    };

    const handleProcessPayment = async () => {
        if (!user) {
            alert('Debes iniciar sesión para completar la compra');
            return;
        }

        if (isSubmitting) return;

        setIsSubmitting(true);
        setValidationErrors({});

        // Use validation utility
        const validation = validateCheckoutForm(paymentMethod, cardInfo, receiptFile, cartItems);
        
        if (!validation.isValid) {
            setValidationErrors(validation.errors);
            setIsSubmitting(false);
            return;
        }

        try {
            await onProcessPayment(paymentMethod, receiptFile);
        } catch (error) {
            console.error('Payment error:', error);
            alert('Error al procesar el pago. Por favor, intenta de nuevo.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <section className="container mx-auto px-4 py-12">
            <h2 className="text-4xl font-bold text-center text-gray-900 mb-10">Método de Pago</h2>
            
            {/* Order Summary */}
            <div className="bg-white rounded-xl shadow-lg p-6 mb-8 max-w-md mx-auto">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Resumen del Pedido</h3>
                <div className="space-y-2 mb-4">
                    {cartItems.map((item, index) => (
                        <div key={index} className="flex justify-between">
                            <span>{item.name} x{item.quantity}</span>
                            <span>${(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                    ))}
                </div>
                <div className="border-t pt-2">
                    <div className="flex justify-between font-bold text-lg">
                        <span>Total:</span>
                        <span>${total.toFixed(2)}</span>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-8 max-w-md mx-auto">
                <div className="mb-6">
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                        Selecciona tu método de pago:
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                        <button
                            onClick={() => setPaymentMethod('card')}
                            className={`py-3 rounded-lg font-semibold transition-colors ${paymentMethod === 'card' ? 'bg-black text-white' : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                                }`}
                        >
                            Tarjeta
                        </button>
                        <button
                            onClick={() => setPaymentMethod('transfer')}
                            className={`py-3 rounded-lg font-semibold transition-colors ${paymentMethod === 'transfer' ? 'bg-black text-white' : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                                }`}
                        >
                            Transferencia
                        </button>
                        <button
                            onClick={() => setPaymentMethod('cash')}
                            className={`py-3 rounded-lg font-semibold transition-colors ${paymentMethod === 'cash' ? 'bg-black text-white' : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                                }`}
                        >
                            Efectivo
                        </button>
                    </div>
                </div>

                {paymentMethod === 'card' && (
                    <div>
                        <h3 className="text-xl font-bold text-gray-900 mb-4">Información de la Tarjeta de Crédito</h3>
                        
                        <div className="mb-4">
                            <input
                                type="text"
                                name="cardNumber"
                                value={cardInfo.cardNumber}
                                onChange={handleCardInfoChange}
                                placeholder="Número de Tarjeta (16 dígitos)"
                                maxLength="19"
                                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black transition ${
                                    validationErrors.cardNumber ? 'border-red-500 focus:ring-red-500' : 'border-gray-300'
                                }`}
                            />
                            {validationErrors.cardNumber && (
                                <p className="text-red-500 text-sm mt-1">{validationErrors.cardNumber}</p>
                            )}
                        </div>

                        <div className="mb-4">
                            <input
                                type="text"
                                name="cardName"
                                value={cardInfo.cardName}
                                onChange={handleCardInfoChange}
                                placeholder="Nombre en la Tarjeta"
                                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black transition ${
                                    validationErrors.cardName ? 'border-red-500 focus:ring-red-500' : 'border-gray-300'
                                }`}
                            />
                            {validationErrors.cardName && (
                                <p className="text-red-500 text-sm mt-1">{validationErrors.cardName}</p>
                            )}
                        </div>

                        <div className="flex space-x-4 mb-6">
                            <div className="flex-1">
                                <input
                                    type="text"
                                    name="expiry"
                                    value={cardInfo.expiry}
                                    onChange={handleCardInfoChange}
                                    placeholder="MM/AA"
                                    maxLength="5"
                                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black transition ${
                                        validationErrors.expiry ? 'border-red-500 focus:ring-red-500' : 'border-gray-300'
                                    }`}
                                />
                                {validationErrors.expiry && (
                                    <p className="text-red-500 text-sm mt-1">{validationErrors.expiry}</p>
                                )}
                            </div>
                            <div className="flex-1">
                                <input
                                    type="text"
                                    name="cvv"
                                    value={cardInfo.cvv}
                                    onChange={handleCardInfoChange}
                                    placeholder="CVV"
                                    maxLength="4"
                                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black transition ${
                                        validationErrors.cvv ? 'border-red-500 focus:ring-red-500' : 'border-gray-300'
                                    }`}
                                />
                                {validationErrors.cvv && (
                                    <p className="text-red-500 text-sm mt-1">{validationErrors.cvv}</p>
                                )}
                            </div>
                        </div>

                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                            <p className="text-blue-800 text-sm">
                                <strong>Información de Seguridad:</strong> Tus datos de tarjeta están protegidos y no se almacenan en nuestros servidores.
                            </p>
                        </div>
                    </div>
                )}

                {paymentMethod === 'transfer' && (
                    <div>
                        <h3 className="text-xl font-bold text-gray-900 mb-4">Detalles para Transferencia Bancaria</h3>
                        <p className="text-gray-700 mb-2">Por favor, realiza la transferencia a los siguientes datos:</p>
                        <div className="bg-gray-50 p-4 rounded-lg mb-4">
                            <p className="text-gray-900 font-semibold">Banco: Banco Héroe</p>
                            <p className="text-gray-900 font-semibold">Número de Cuenta: 1234567890</p>
                            <p className="text-gray-900 font-semibold">CLAVE Interbancaria: 012345678901234567</p>
                        </div>
                        <p className="text-gray-700 text-sm mb-4">Una vez realizada la transferencia, por favor sube el comprobante:</p>
                        
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2">
                                Comprobante de Pago *
                            </label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black transition"
                            />
                            {receiptFile && (
                                <p className="text-green-600 text-sm mt-2">
                                    ✓ Archivo seleccionado: {receiptFile.name}
                                </p>
                            )}
                        </div>
                    </div>
                )}

                {paymentMethod === 'cash' && (
                    <div>
                        <h3 className="text-xl font-bold text-gray-900 mb-4">Pago en Efectivo</h3>
                        <p className="text-gray-700 mb-4">
                            El pago se realizará al momento de la entrega. 
                            Por favor asegúrate de tener el monto exacto: <span className="font-bold">${total.toFixed(2)}</span>
                        </p>
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                            <p className="text-yellow-800 text-sm">
                                <strong>Nota:</strong> El pedido se procesará una vez confirmado el pago en efectivo.
                            </p>
                        </div>
                    </div>
                )}

                <button
                    onClick={handleProcessPayment}
                    disabled={isSubmitting || Object.keys(validationErrors).length > 0}
                    className={`w-full mt-8 py-3 rounded-lg transition-colors font-semibold ${
                        isSubmitting || Object.keys(validationErrors).length > 0
                            ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                            : 'bg-blue-600 text-white hover:bg-blue-700'
                    }`}
                >
                    {isSubmitting ? (
                        <div className="flex items-center justify-center">
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                            Procesando Pago...
                        </div>
                    ) : (
                        'Confirmar Pago'
                    )}
                </button>

                {Object.keys(validationErrors).length > 0 && (
                    <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-red-800 text-sm font-medium">Por favor corrige los errores antes de continuar:</p>
                        <ul className="text-red-700 text-sm mt-1 list-disc list-inside">
                            {Object.values(validationErrors).map((error, index) => (
                                <li key={index}>{error}</li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </section>
    );
}

export default CheckoutSection; 