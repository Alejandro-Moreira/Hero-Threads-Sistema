import mongoose from "mongoose";

const clienteSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  nombre: { type: String, require: true, trim : true  },
  celular: { type: Number, require: false, trim : true  },
  email: { type: String, require: true, unique: true, trim : true  },
  password: { type: String, require: false, trim : true  },
  role: { type: String, require: false, default: 'client', enum: ['admin', 'client'] },
  direccion: { type : String, require : false, trim : true  },
  ciudad : { type : String, require : false, trim : true },
  emailVerified: { type: Boolean, default: false },
  emailVerificationToken: { type: String },
  emailVerificationExpires: { type: Date },
  status: { type: String, default: 'active', enum: ['active', 'inactive'] },
  lastActivity: { type: Date, default: Date.now }
});

export default mongoose.model('Cliente', clienteSchema);