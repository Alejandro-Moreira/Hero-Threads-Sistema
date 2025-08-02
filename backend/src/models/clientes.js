import mongoose from "mongoose";

const clienteSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  nombre: { type: String, required: true, trim: true },
  celular: { type: Number, trim: true },
  email: { type: String, required: true, unique: true, trim: true },
  password: { type: String, trim: true },
  role: {
    type: String,
    enum: ['admin', 'client'],
    default: 'client'
  },
  direccion: { type: String, trim: true },
  ciudad: { type: String, trim: true },
  emailVerified: { type: Boolean, default: false },
  emailVerificationToken: { type: String },
  emailVerificationExpires: { type: Date },
  passwordResetToken: { type: String },
  passwordResetExpires: { type: Date },
  status: { type: String, default: 'active', enum: ['active', 'inactive'] },
  lastActivity: { type: Date, default: Date.now },
  createdAt: { type: Date, default: Date.now },
  googleId: { type: String, sparse: true }
}, {
  timestamps: true
});

export default mongoose.model('Cliente', clienteSchema);
