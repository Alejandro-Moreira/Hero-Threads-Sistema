import mongoose from 'mongoose';

const productoSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    unique: true
  },
  description: {
    type: String,
    default: ''
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  image: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

const Producto = mongoose.model('Producto', productoSchema);

export default Producto; 