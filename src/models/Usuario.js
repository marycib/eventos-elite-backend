const mongoose = require("mongoose");

const usuarioSchema = new mongoose.Schema({
  nombreUsuario: {
    type: String,
    required: true,
  },
  correoElectronico: {
    type: String,
    required: true,
    unique: true,
  },
  contrasena: {
    type: String,
    required: true,
  },
  rol: {
    type: String,
    enum: ["administrador", "organizador", "asistente", "ponente"],
    default: "asistente",
  },
  fechaRegistro: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Usuario", usuarioSchema);