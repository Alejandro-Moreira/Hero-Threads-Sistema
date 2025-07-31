import mongoose from "mongoose";

const ventaSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  customer: {
    id: { type: String, required: true },
    name: { type: String, required: true },
    email: { type: String, required: true }
  },
  items: [{
    productId: { type: String, required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true },
    total: { type: Number, required: true }
  }],
  total: { type: Number, required: true },
  paymentMethod: { 
    type: String, 
    required: true, 
    enum: ['card', 'transfer', 'cash'] 
  },
  receiptFile: { type: String, required: false },
  status: { 
    type: String, 
    default: 'completed', 
    enum: ['pending', 'completed', 'cancelled'] 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

export default mongoose.model('Venta', ventaSchema); 