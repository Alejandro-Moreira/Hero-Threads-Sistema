export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Password validation
export const validatePassword = (password) => {
  return password.length >= 6;
};

// Name validation
export const validateName = (name) => {
  const trimmedName = name.trim();
  return trimmedName.length >= 2 && trimmedName.length <= 50;
};

export const validatePhone = (phone) => {
  if (!phone) return true; 
  const phoneRegex = /^\d+$/;
  return phoneRegex.test(phone);
};

export const validateCardNumber = (cardNumber) => {
  const cleaned = cardNumber.replace(/\s/g, '');
  return cleaned.length === 16 && /^\d+$/.test(cleaned);
};

export const validateCardExpiry = (expiry) => {
  const expiryRegex = /^(0[1-9]|1[0-2])\/([0-9]{2})$/;
  if (!expiryRegex.test(expiry)) return false;
  
  const [month, year] = expiry.split('/');
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear() % 100;
  const currentMonth = currentDate.getMonth() + 1;
  
  const expYear = parseInt(year);
  const expMonth = parseInt(month);
  
  if (expYear < currentYear) return false;
  if (expYear === currentYear && expMonth < currentMonth) return false;
  
  return true;
};

export const validateCVV = (cvv) => {
  return /^\d{3,4}$/.test(cvv);
};

export const validateRegistrationForm = (formData) => {
  const errors = {};

  if (!validateName(formData.nombre)) {
    errors.nombre = 'El nombre debe tener entre 2 y 50 caracteres';
  }

  if (!validateEmail(formData.email)) {
    errors.email = 'El email no es válido';
  }

  if (!validatePassword(formData.password)) {
    errors.password = 'La contraseña debe tener al menos 6 caracteres';
  }

  if (formData.password !== formData.confirmPassword) {
    errors.confirmPassword = 'Las contraseñas no coinciden';
  }

  if (formData.celular && !validatePhone(formData.celular)) {
    errors.celular = 'El celular debe contener solo números';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

export const validateLoginForm = (email, password) => {
  const errors = {};

  if (!email.trim()) {
    errors.email = 'El email es requerido';
  } else if (!validateEmail(email)) {
    errors.email = 'El email no es válido';
  }

  if (!password) {
    errors.password = 'La contraseña es requerida';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

export const validateCheckoutForm = (paymentMethod, cardInfo, receiptFile, cartItems) => {
  const errors = {};

  if (cartItems.length === 0) {
    errors.cart = 'Tu carrito está vacío';
  }

  if (paymentMethod === 'transfer' && !receiptFile) {
    errors.receipt = 'Por favor sube el comprobante de transferencia bancaria';
  }

  if (paymentMethod === 'card') {
    if (!validateCardNumber(cardInfo.cardNumber)) {
      errors.cardNumber = 'Por favor ingresa un número de tarjeta válido';
    }

    if (!validateName(cardInfo.cardName)) {
      errors.cardName = 'Por favor ingresa el nombre en la tarjeta';
    }

    if (!validateCardExpiry(cardInfo.expiry)) {
      errors.expiry = 'Por favor ingresa una fecha de vencimiento válida';
    }

    if (!validateCVV(cardInfo.cvv)) {
      errors.cvv = 'Por favor ingresa un CVV válido';
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

export const validateProduct = (product) => {
  const errors = {};

  if (!product.name || product.name.trim().length < 2) {
    errors.name = 'El nombre del producto debe tener al menos 2 caracteres';
  }

  if (!product.description || product.description.trim().length < 10) {
    errors.description = 'La descripción debe tener al menos 10 caracteres';
  }

  if (!product.price || product.price <= 0) {
    errors.price = 'El precio debe ser mayor a 0';
  }

  if (!product.image) {
    errors.image = 'La imagen es requerida';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}; 