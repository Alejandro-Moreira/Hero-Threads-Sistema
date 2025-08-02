import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import ShopHeader from "./components/ShopHeader";
import ShopHeroSection from "./components/ShopHeroSection";
import ShopProductGrid from "./components/ShopProductGrid";
import AboutSection from "./components/AboutSection";
import CartSection from "./components/CartSection";
import CheckoutSection from "./components/CheckoutSection";
import PaymentSuccess from "./components/PaymentSuccess";
import EmailVerification from "./components/EmailVerification";
import RegisterForm from "./components/RegisterForm";
import LoginForm from "./components/LoginForm";
import ForgotPassword from "./components/ForgotPassword";
import ResetPassword from "./components/ResetPassword";
import GoogleCallback from "./components/GoogleCallback";
import Alert from "./components/Alert";
import ProductosDashboard from "./components/ProductosDashboard";
import ReportsSection from "./components/ReportsSection";
import AdminProductManager from "./components/AdminProductManager";
import CustomersSection from "./components/CustomersSection";
import { defaultProducts } from "./data/products";
import apiService from "./services/apiService";
import salesService from "./services/salesService";

function App() {
  const [user, setUser] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);
  const [showPaymentSuccess, setShowPaymentSuccess] = useState(false);
  const [orderDetails, setOrderDetails] = useState(null);
  const [loginError, setLoginError] = useState("");

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const isAdmin = user?.role === "admin";

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await apiService.getProducts();
      setProducts(data);
      setFilteredProducts(data);
    } catch (error) {
      console.error("Error fetching products:", error);
      setProducts(defaultProducts);
      setFilteredProducts(defaultProducts);
    } finally {
      setLoading(false);
    }
  };

  const createProduct = async (productData) => {
    try {
      const newProduct = await apiService.createProduct(productData);
      setProducts((prev) => [...prev, newProduct]);
      return newProduct;
    } catch (error) {
      console.error("Error creating product:", error);
      throw error;
    }
  };

  const updateProduct = async (id, productData) => {
    try {
      const updatedProduct = await apiService.updateProduct(id, productData);
      setProducts((prev) =>
        prev.map((p) => (p._id === id ? updatedProduct : p))
      );
      return updatedProduct;
    } catch (error) {
      console.error("Error updating product:", error);
      throw error;
    }
  };

  const deleteProduct = async (id) => {
    try {
      await apiService.deleteProduct(id);
      setProducts((prev) => prev.filter((p) => p._id !== id));
      return true;
    } catch (error) {
      console.error("Error deleting product:", error);
      throw error;
    }
  };

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    const lowercasedSearchTerm = searchTerm.toLowerCase();
    const currentFilteredProducts = products.filter((product) =>
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
      const existingItem = prevItems.find(
        (item) => (item._id || item.id) === productId
      );
      if (existingItem) {
        return prevItems.map((item) =>
          (item._id || item.id) === productId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevItems, { ...product, quantity: 1 }];
    });
    showAlert(`${product.name} agregado al carrito!`, "success");
  };

  const handleRemoveFromCart = (id) => {
    setCartItems((prevItems) =>
      prevItems.filter((item) => (item._id || item.id) !== id)
    );
  };

  const handleUpdateCartQuantity = (id, newQuantity) => {
    setCartItems((prevItems) =>
      prevItems
        .map((item) =>
          (item._id || item.id) === id
            ? { ...item, quantity: newQuantity }
            : item
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
      showAlert("Producto actualizado exitosamente!", "success");
    } catch (error) {
      showAlert(
        error.message || "Error al actualizar el producto. Intenta de nuevo.",
        "error"
      );
    }
  };

  const handleAddProduct = async (newProduct) => {
    try {
      await createProduct(newProduct);
      showAlert("Producto agregado exitosamente!", "success");
    } catch (error) {
      showAlert(
        error.message || "Error al agregar el producto. Intenta de nuevo.",
        "error"
      );
    }
  };

  const handleDeleteProduct = async (id) => {
    try {
      await deleteProduct(id);
      showAlert("Producto eliminado exitosamente!", "success");
    } catch (error) {
      showAlert("Error al eliminar el producto. Intenta de nuevo.", "error");
    }
  };

  const handleProcessPayment = async (method, receiptFile) => {
    try {
      const sale = await salesService.processPurchase(
        cartItems,
        user,
        method,
        receiptFile
      );

      const orderDetails = {
        items: cartItems,
        total: cartItems.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0
        ),
        paymentMethod: method,
        receiptFile: receiptFile?.name,
        saleId: sale.id || sale._id,
      };

      if (user) {
        await apiService.sendOrderConfirmation(
          user.email,
          user.nombre || user.email,
          orderDetails
        );
      }

      setOrderDetails(orderDetails);
      setShowPaymentSuccess(true);
      setCartItems([]);

      window.location.href = "/payment-success";
    } catch (error) {
      console.error("Error processing payment:", error);
      showAlert(
        "Error al procesar el pago. Por favor, intenta de nuevo.",
        "error"
      );
    }
  };

  const showAlert = (message, type = "success") => {
    setAlert({ message, type });
  };

  const closeAlert = () => {
    setAlert(null);
  };

  const handleLogin = async (email, password) => {
    try {
      setLoginError("");
      const response = await apiService.login(email, password);
      if (response.success) {
        const loggedUser = response.user;
        setUser(loggedUser);
        localStorage.setItem("user", JSON.stringify(loggedUser));
        showAlert("Sesión iniciada exitosamente", "success");

        if (loggedUser.role === "admin") {
          window.location.href = "/dashboard";
        } else {
          window.location.href = "/products";
        }
      }
    } catch (error) {
      setLoginError(error.message || "Error al iniciar sesión");
      showAlert("Error al iniciar sesión. Verifica tus credenciales.", "error");
    }
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("user");
    showAlert("Sesión cerrada exitosamente", "success");
  };

  const handleRegister = async (userData) => {
    try {
      await apiService.register(userData);
      showAlert(
        "Usuario registrado exitosamente. Se ha enviado un email de confirmación.",
        "success"
      );
    } catch (error) {
      showAlert(error.message || "Error al registrar el usuario.", "error");
    }
  };

  const handleContinueShopping = () => {
    setShowPaymentSuccess(false);
    setOrderDetails(null);
    window.location.href = "/products";
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
            <Route path="/" element={<ShopHeroSection />} />
            <Route
              path="/products"
              element={
                loading ? (
                  <div className="container mx-auto px-4 py-12 text-center">
                    <div className="text-2xl text-gray-600">
                      Cargando productos...
                    </div>
                  </div>
                ) : (
                  <ShopProductGrid
                    products={filteredProducts}
                    onAddToCart={handleAddToCart}
                  />
                )
              }
            />
            <Route path="/about" element={<AboutSection />} />
            <Route path="/email-verification" element={<EmailVerification />} />
            <Route path="/register" element={<RegisterForm />} />
            <Route path="/login" element={<LoginForm />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/auth/google/callback" element={<GoogleCallback />} />

            {/* Payment Success Route */}
            <Route
              path="/payment-success"
              element={
                showPaymentSuccess && orderDetails ? (
                  <PaymentSuccess
                    orderDetails={orderDetails}
                    onContinueShopping={handleContinueShopping}
                  />
                ) : (
                  <Navigate to="/" replace />
                )
              }
            />

            {/* Cart Route - Public access, login required only for checkout */}
            <Route
              path="/cart"
              element={
                <CartSection
                  cartItems={cartItems}
                  onRemoveFromCart={handleRemoveFromCart}
                  onUpdateCartQuantity={handleUpdateCartQuantity}
                  onClearCart={handleClearCart}
                  user={user}
                />
              }
            />
            <Route
              path="/checkout"
              element={
                user ? (
                  <CheckoutSection
                    paymentMethod={paymentMethod}
                    setPaymentMethod={setPaymentMethod}
                    onProcessPayment={handleProcessPayment}
                    cartItems={cartItems}
                    user={user}
                  />
                ) : (
                  <Navigate to="/" replace />
                )
              }
            />

            {/* Admin Routes - Require Admin Role */}
            <Route
              path="/dashboard"
              element={
                user && isAdmin ? (
                  <ProductosDashboard />
                ) : (
                  <Navigate to="/" replace />
                )
              }
            />
            <Route
              path="/reports"
              element={
                user && isAdmin ? (
                  <ReportsSection />
                ) : (
                  <Navigate to="/" replace />
                )
              }
            />
            <Route
              path="/admin"
              element={
                user && isAdmin ? (
                  <AdminProductManager
                    products={products}
                    onUpdateProduct={handleUpdateProduct}
                    onAddProduct={handleAddProduct}
                    onDeleteProduct={handleDeleteProduct}
                  />
                ) : (
                  <Navigate to="/" replace />
                )
              }
            />
            <Route
              path="/customers"
              element={
                user && isAdmin ? (
                  <CustomersSection />
                ) : (
                  <Navigate to="/" replace />
                )
              }
            />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
