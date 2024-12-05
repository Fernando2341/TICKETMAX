const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');  // Asegúrate de importar bcrypt

const promoterSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

// Método para comparar contraseñas
promoterSchema.methods.comparePassword = function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('Promoter', promoterSchema);
