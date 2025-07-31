// Sales Service for handling purchase transactions
import apiService from './apiService';

class SalesService {
  // Create a new sale/order
  async createSale(saleData) {
    try {
      // First try to use the sales API if available
      return await apiService.createSale(saleData);
    } catch (error) {
      console.log('Sales API not available, creating local transaction record');
      // If sales API is not available, we'll store locally for now
      return this.createLocalSale(saleData);
    }
  }

  // Create a local sale record (fallback)
  createLocalSale(saleData) {
    const sale = {
      id: Date.now().toString(),
      ...saleData,
      createdAt: new Date().toISOString(),
      status: 'completed'
    };

    // Store in localStorage as fallback
    const existingSales = JSON.parse(localStorage.getItem('hero-threads-sales') || '[]');
    existingSales.push(sale);
    localStorage.setItem('hero-threads-sales', JSON.stringify(existingSales));

    return sale;
  }

  // Get all sales
  async getSales() {
    try {
      return await apiService.getSales();
    } catch (error) {
      console.log('Sales API not available, getting local sales');
      return this.getLocalSales();
    }
  }

  // Get local sales (fallback)
  getLocalSales() {
    return JSON.parse(localStorage.getItem('hero-threads-sales') || '[]');
  }

  // Process a complete purchase
  async processPurchase(cartItems, user, paymentMethod, receiptFile = null) {
    const saleData = {
      customer: {
        id: user.id || user._id,
        name: user.nombre || user.email,
        email: user.email
      },
      items: cartItems.map(item => ({
        productId: item._id || item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        total: item.price * item.quantity
      })),
      total: cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0),
      paymentMethod,
      receiptFile: receiptFile?.name || null,
      status: 'completed',
      createdAt: new Date().toISOString()
    };

    try {
      const sale = await this.createSale(saleData);
      console.log('Sale processed successfully:', sale);
      return sale;
    } catch (error) {
      console.error('Error processing sale:', error);
      throw error;
    }
  }

  // Get sales statistics
  async getSalesStats() {
    try {
      const sales = await this.getSales();
      
      const stats = {
        totalSales: sales.length,
        totalRevenue: sales.reduce((sum, sale) => sum + sale.total, 0),
        averageOrderValue: sales.length > 0 ? sales.reduce((sum, sale) => sum + sale.total, 0) / sales.length : 0,
        paymentMethods: this.getPaymentMethodStats(sales),
        recentSales: sales.slice(-5) // Last 5 sales
      };

      return stats;
    } catch (error) {
      console.error('Error getting sales stats:', error);
      return {
        totalSales: 0,
        totalRevenue: 0,
        averageOrderValue: 0,
        paymentMethods: {},
        recentSales: []
      };
    }
  }

  // Get payment method statistics
  getPaymentMethodStats(sales) {
    const stats = {};
    sales.forEach(sale => {
      const method = sale.paymentMethod || 'unknown';
      stats[method] = (stats[method] || 0) + 1;
    });
    return stats;
  }
}

const salesService = new SalesService();
export default salesService; 