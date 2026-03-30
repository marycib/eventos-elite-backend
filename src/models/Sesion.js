const mongoose = require("mongoose");

const sesionSchema = new mongoose.Schema({
  tituloSesion:      { type: String, required: true },
  descripcionSesion: { type: String, required: true },
  horaInicio:        { type: String, required: true },
  horaFin:           { type: String, required: true },
  evento: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Evento",
    required: true,
  },
  ponente: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Ponente",
    required: true,
  },
  fechaCreacion: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Sesion", sesionSchema);