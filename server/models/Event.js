const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema({
  name: { type: String, required: true },
  subtitle: { type: String, required: true },
  image: { type: String, required: true }, // Ruta o URL de la imagen principal
  head: { type: String, required: true },  // Ruta o URL de la imagen cabezal
  eventType: { type: String, required: true },
  category: { type: String, required: true },
  promoter: { type: String, required: true },
  paymentMethods: { 
    type: [String], // Lista de métodos seleccionados
    required: true 
  },
});

module.exports = mongoose.model('Event', EventSchema);
