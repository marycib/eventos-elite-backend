const mongoose = require("mongoose");

const eventoSchema = new mongoose.Schema({
  nombreEvento:      { type: String, required: true },
  descripcionEvento: { type: String, required: true },
  fechaEvento:       { type: Date,   required: true },
  ubicacionEvento:   { type: String, required: true },
  capacidadMaxima:   { type: Number, required: true },
  estadoEvento: {
    type: String,
    enum: ["activo", "cancelado", "finalizado"],
    default: "activo",
  },
  fechaCreacion: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Evento", eventoSchema);