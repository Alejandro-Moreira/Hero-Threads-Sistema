import mongoose from 'mongoose';

const loginSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

// Verificar la contraseña al momento de hacer login
loginSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

const Registro = mongoose.model('Registro', loginSchema);

export default Registro; 