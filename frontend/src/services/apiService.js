const API_BASE_URL = 'http://127.0.0.1:3000/api';

class ApiService {
  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || data.message || `HTTP ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error(`API Error (${endpoint}):`, error);
      throw error;
    }
  }

  async login(email, password) {
    return this.request('/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async register(userData) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async forgotPassword(email) {
    return this.request('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  }

  async validateResetToken(token) {
    return this.request(`/auth/validate-reset-token/${token}`);
  }

  async resetPassword(token, password) {
    return this.request('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ token, password }),
    });
  }

  async getGoogleAuthUrl() {
    return this.request('/auth/google/url');
  }

  async handleGoogleCallback(code) {
    return this.request('/auth/google/callback', {
      method: 'POST',
      body: JSON.stringify({ code }),
    });
  }

  async getProducts() {
    return this.request('/productos');
  }

  async createProduct(productData) {
    return this.request('/productos', {
      method: 'POST',
      body: JSON.stringify(productData),
    });
  }

  async updateProduct(id, productData) {
    return this.request(`/productos/${id}`, {
      method: 'PUT',
      body: JSON.stringify(productData),
    });
  }

  async deleteProduct(id) {
    return this.request(`/productos/${id}`, {
      method: 'DELETE',
    });
  }

  // Customer APIs
  async getCustomers() {
    return this.request('/clientes/listar');
  }

  async getCustomer(id) {
    return this.request(`/clientes/obtener/${id}`);
  }

  async getCustomerPurchases(customerId) {
    return this.request(`/clientes/${customerId}/purchases`);
  }

  async updateCustomer(id, customerData) {
    return this.request(`/clientes/actualizar/${id}`, {
      method: 'PUT',
      body: JSON.stringify(customerData),
    });
  }

  async deleteCustomer(id) {
    return this.request(`/clientes/eliminar/${id}`, {
      method: 'DELETE',
    });
  }

  // Reports APIs
  async getReports() {
    return this.request('/reportes');
  }

  async createReport(reportData) {
    return this.request('/reportes', {
      method: 'POST',
      body: JSON.stringify(reportData),
    });
  }

  // Email APIs
  async sendConfirmationEmail(email, name, type) {
    return this.request('/email/send-confirmation', {
      method: 'POST',
      body: JSON.stringify({ email, name, type }),
    });
  }

  async sendOrderConfirmation(email, name, orderDetails) {
    return this.request('/email/send-order-confirmation', {
      method: 'POST',
      body: JSON.stringify({ email, name, orderDetails }),
    });
  }

  async verifyEmail(token) {
    return this.request(`/email/verify/${token}`);
  }

  // Session APIs
  async updateActivity(userId) {
    return this.request('/session/update-activity', {
      method: 'POST',
      body: JSON.stringify({ userId }),
    });
  }

  async getSessionInfo(userId) {
    return this.request(`/session/info/${userId}`);
  }

  // Sales APIs (if available)
  async getSales() {
    return this.request('/ventas');
  }

  async createSale(saleData) {
    return this.request('/ventas', {
      method: 'POST',
      body: JSON.stringify(saleData),
    });
  }

  async healthCheck() {
    try {
      const response = await fetch(`${API_BASE_URL}/health`);
      return response.ok;
    } catch (error) {
      return false;
    }
  }
}

const apiService = new ApiService();
export default apiService; 