const mongoose = require("mongoose");

const ponenteSchema = new mongoose.Schema(
  {
    nombre:       { type: String, required: true },
    especialidad: { type: String, required: true },
    biografia:    { type: String },
    correo:       { type: String, required: true, unique: true },
    telefono:     { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Ponente", ponenteSchema);