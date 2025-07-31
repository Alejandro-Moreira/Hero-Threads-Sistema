import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ShopHeader from './components/ShopHeader';
import ShopHeroSection from './components/ShopHeroSection';
import ShopProductGrid from './components/ShopProductGrid';
import AboutSection from './components/AboutSection';
import CartSection from './components/CartSection';
import CheckoutSection from './components/CheckoutSection';
import PaymentSuccess from './components/PaymentSuccess';
import EmailVerification from './components/EmailVerification';
import Alert from './components/Alert';
import ProductosDashboard from './components/ProductosDashboard';
import ReportsSection from './components/ReportsSection';
import AdminProductManager from './components/AdminProductManager';
import PublicRoute from './routes/PublicRoute';
import PrivateRoute from './routes/PrivateRoute';
import AuthRoute from './routes/AuthRoute';
import { defaultProducts } from './data/products';
import apiService from './services/apiService';
import salesService from './services/salesService';
import sessionService from './services/sessionService';

function App() {
  const [cartItems, setCartItems] = useState([]);
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [user, setUser] = useState(null);
  const [loginError, setLoginError] = useState('');
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);
  const [showPaymentSuccess, setShowPaymentSuccess] = useState(false);
  const [orderDetails, setOrderDetails] = useState(null);

  // Calculate cart count
  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  // API Functions
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await apiService.getProducts();
      setProducts(data);
      setFilteredProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
      // Fallback to default products if API fails
      setProducts(defaultProducts);
      setFilteredProducts(defaultProducts);
    } finally {
      setLoading(false);
    }
  };

  const createProduct = async (productData) => {
    try {
      const newProduct = await apiService.createProduct(productData);
      setProducts(prev => [...prev, newProduct]);
      return newProduct;
    } catch (error) {
      console.error('Error creating product:', error);
      throw error;
    }
  };

  const updateProduct = async (id, productData) => {
    try {
      const updatedProduct = await apiService.updateProduct(id, productData);
      setProducts(prev => prev.map(p => p._id === id ? updatedProduct : p));
      return updatedProduct;
    } catch (error) {
      console.error('Error updating product:', error);
      throw error;
    }
  };

  const deleteProduct = async (id) => {
    try {
      await apiService.deleteProduct(id);
      setProducts(prev => prev.filter(p => p._id !== id));
      return true;
    } catch (error) {
      console.error('Error deleting product:', error);
      throw error;
    }
  };

  // Load products on component mount
  useEffect(() => {
    fetchProducts();
  }, []);

  // Initialize session management when user logs in
  useEffect(() => {
    if (user) {
      sessionService.init((message) => {
        setUser(null);
        showAlert(message, 'warning');
      });
      
      // Update activity periodically
      const activityInterval = setInterval(() => {
        if (user && user.id) {
          sessionService.updateActivity(user.id);
        }
      }, 60000); // Update every minute
      
      return () => clearInterval(activityInterval);
    } else {
      sessionService.clear();
    }
  }, [user]);

  useEffect(() => {
    const lowercasedSearchTerm = searchTerm.toLowerCase();
    const currentFilteredProducts = products.filter(product =>
      product.name.toLowerCase().includes(lowercasedSearchTerm)
    );
    setFilteredProducts(currentFilteredProducts);
  }, [searchTerm, products]);

  const handleSearchChange = (term) => {
    setSearchTerm(term);
  };

  const handleAddToCart = (product) => {
    setCartItems((prevItems) => {
      const productId = product._id || product.id;
      const existingItem = prevItems.find((item) => (item._id || item.id) === productId);
      if (existingItem) {
        return prevItems.map((item) =>
          (item._id || item.id) === productId ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevItems, { ...product, quantity: 1 }];
    });
    showAlert(`${product.name} agregado al carrito!`, 'success');
  };

  const handleRemoveFromCart = (id) => {
    setCartItems((prevItems) => prevItems.filter((item) => (item._id || item.id) !== id));
  };

  const handleUpdateCartQuantity = (id, newQuantity) => {
    setCartItems((prevItems) =>
      prevItems
        .map((item) =>
          (item._id || item.id) === id ? { ...item, quantity: newQuantity } : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  const handleUpdateProduct = async (id, updatedFields) => {
    try {
      await updateProduct(id, updatedFields);
      showAlert('Producto actualizado exitosamente!', 'success');
    } catch (error) {
      showAlert(error.message || 'Error al actualizar el producto. Intenta de nuevo.', 'error');
    }
  };

  const handleAddProduct = async (newProduct) => {
    try {
      await createProduct(newProduct);
      showAlert('Producto agregado exitosamente!', 'success');
    } catch (error) {
      showAlert(error.message || 'Error al agregar el producto. Intenta de nuevo.', 'error');
    }
  };

  const handleDeleteProduct = async (id) => {
    try {
      await deleteProduct(id);
      showAlert('Producto eliminado exitosamente!', 'success');
    } catch (error) {
      showAlert('Error al eliminar el producto. Intenta de nuevo.', 'error');
    }
  };

  const handleProcessPayment = async (method, receiptFile) => {
    try {
      // Process the sale and save to database
      const sale = await salesService.processPurchase(cartItems, user, method, receiptFile);
      
      // Prepare order details for success page
      const orderDetails = {
        items: cartItems,
        total: cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0),
        paymentMethod: method,
        receiptFile: receiptFile?.name,
        saleId: sale.id || sale._id
      };
      
      // Send order confirmation email
      if (user) {
        await apiService.sendOrderConfirmation(user.email, user.nombre || user.email, orderDetails);
      }
      
      // Set order details and show success page
      setOrderDetails(orderDetails);
      setShowPaymentSuccess(true);
      setCartItems([]);
      
      // Navigate to success page
      window.location.href = '/payment-success';
    } catch (error) {
      console.error('Error processing payment:', error);
      showAlert('Error al procesar el pago. Por favor, intenta de nuevo.', 'error');
    }
  };

  // Alert helper function
  const showAlert = (message, type = 'success') => {
    setAlert({ message, type });
  };

  const closeAlert = () => {
    setAlert(null);
  };

  // Auth Logic
  const handleLogin = async (email, password) => {
    try {
      const data = await apiService.login(email, password);
      
      if (data.success) {
        setUser(data.user);
        setLoginError('');
        showAlert('Inicio de sesión exitoso!', 'success');
      } else {
        setLoginError(data.message || 'Credenciales incorrectas.');
        showAlert(data.message || 'Credenciales incorrectas.', 'error');
      }
    } catch (error) {
      console.error('Error during login:', error);
      let errorMessage = 'Error de conexión. Intenta de nuevo.';
      
      // Handle specific error cases
      if (error.response && error.response.data) {
        const { message } = error.response.data;
        if (message.includes('inactiva')) {
          errorMessage = 'Tu cuenta está inactiva. Contacta al administrador.';
        } else if (message.includes('verifica tu email')) {
          errorMessage = 'Debes verificar tu email antes de iniciar sesión. Revisa tu bandeja de entrada.';
        } else if (message.includes('no encontrado')) {
          errorMessage = 'Email no registrado. Verifica tu email o regístrate.';
        } else if (message.includes('Contraseña incorrecta')) {
          errorMessage = 'Contraseña incorrecta. Intenta de nuevo.';
        } else {
          errorMessage = message || errorMessage;
        }
      }
      
      setLoginError(errorMessage);
      showAlert(errorMessage, 'error');
    }
  };

  const handleLogout = () => {
    setUser(null);
    showAlert('Sesión cerrada exitosamente', 'success');
  };

  const handleRegister = async (formData) => {
    try {
      const data = await apiService.register(formData);
      
      // Email is now handled automatically in the backend
      const message = data.emailSent 
        ? 'Usuario registrado exitosamente. Se ha enviado un email de confirmación a tu correo.'
        : 'Usuario registrado exitosamente. Revisa la consola del servidor para el enlace de verificación.';
      
      showAlert(message, 'success');
    } catch (error) {
      console.error('Registration error:', error);
      let errorMessage = 'Error al registrar usuario. Intenta de nuevo.';
      
      // Handle specific error cases
      if (error.response && error.response.data) {
        const { error: apiError } = error.response.data;
        if (apiError && apiError.includes('Ya existe un usuario con ese email')) {
          errorMessage = 'Ya existe un usuario con ese email. Intenta con otro email o inicia sesión.';
        } else if (apiError && apiError.includes('Formato de email inválido')) {
          errorMessage = 'Formato de email inválido. Verifica tu email.';
        } else if (apiError && apiError.includes('contraseña debe tener')) {
          errorMessage = 'La contraseña debe tener al menos 6 caracteres.';
        } else if (apiError && apiError.includes('nombre debe tener')) {
          errorMessage = 'El nombre debe tener entre 2 y 50 caracteres.';
        } else if (apiError && apiError.includes('campos son requeridos')) {
          errorMessage = 'Todos los campos son requeridos: nombre, email, password.';
        } else if (apiError) {
          errorMessage = apiError;
        }
      }
      
      showAlert(errorMessage, 'error');
      throw error;
    }
  };

  const handleContinueShopping = () => {
    setShowPaymentSuccess(false);
    setOrderDetails(null);
    window.location.href = '/products';
  };

  return (
    <Router>
      <div className="min-h-screen bg-gray-50 font-sans antialiased">
        <ShopHeader
          onSearchChange={handleSearchChange}
          cartCount={cartCount}
          user={user}
          onLogout={handleLogout}
          onLogin={handleLogin}
          loginError={loginError}
          onRegister={handleRegister}
        />
        
        {/* Alert Component */}
        {alert && (
          <Alert
            message={alert.message}
            type={alert.type}
            onClose={closeAlert}
          />
        )}

        <main className="pt-16">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={
              <PublicRoute user={user}>
                <ShopHeroSection />
              </PublicRoute>
            } />
            <Route 
              path="/products" 
              element={
                <PublicRoute user={user}>
                  {loading ? (
                    <div className="container mx-auto px-4 py-12 text-center">
                      <div className="text-2xl text-gray-600">Cargando productos...</div>
                    </div>
                  ) : (
                    <ShopProductGrid products={filteredProducts} onAddToCart={handleAddToCart} />
                  )}
                </PublicRoute>
              } 
            />
            <Route path="/about" element={
              <PublicRoute user={user}>
                <AboutSection />
              </PublicRoute>
            } />
            
            {/* Email Verification Route */}
            <Route path="/verify-email" element={<EmailVerification />} />
            
            {/* Payment Success Route */}
            <Route path="/payment-success" element={
              showPaymentSuccess && orderDetails ? (
                <PaymentSuccess 
                  orderDetails={orderDetails}
                  onContinueShopping={handleContinueShopping}
                />
              ) : (
                <Navigate to="/" replace />
              )
            } />
            
            {/* Cart Route - Public access, login required only for checkout */}
            <Route 
              path="/cart" 
              element={
                <PublicRoute user={user}>
                  <CartSection 
                    cartItems={cartItems}
                    onRemoveFromCart={handleRemoveFromCart}
                    onUpdateCartQuantity={handleUpdateCartQuantity}
                    onClearCart={handleClearCart}
                    user={user}
                  />
                </PublicRoute>
              } 
            />
            <Route 
              path="/checkout" 
              element={
                <PrivateRoute user={user} requiredRole="client">
                  <CheckoutSection 
                    paymentMethod={paymentMethod}
                    setPaymentMethod={setPaymentMethod}
                    onProcessPayment={handleProcessPayment}
                    cartItems={cartItems}
                    user={user}
                  />
                </PrivateRoute>
              } 
            />
            
            {/* Admin Routes - Require Admin Role */}
            <Route 
              path="/dashboard" 
              element={
                <PrivateRoute user={user} requiredRole="admin">
                  <ProductosDashboard />
                </PrivateRoute>
              } 
            />
            <Route 
              path="/reports" 
              element={
                <PrivateRoute user={user} requiredRole="admin">
                  <ReportsSection />
                </PrivateRoute>
              } 
            />
            <Route 
              path="/admin" 
              element={
                <PrivateRoute user={user} requiredRole="admin">
                  <AdminProductManager
                    products={products}
                    onUpdateProduct={handleUpdateProduct}
                    onAddProduct={handleAddProduct}
                    onDeleteProduct={handleDeleteProduct}
                  />
                </PrivateRoute>
              } 
            />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App; 