const mongoose = require("mongoose");

const rolSchema = new mongoose.Schema(
  {
    nombreRol:   { type: String, required: true, unique: true, trim: true },
    descripcion: { type: String, default: "" },
    permisos:    { type: [String], default: [] },
    activo:      { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Rol", rolSchema);