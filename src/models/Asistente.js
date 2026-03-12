const mongoose = require("mongoose");

const asistenteSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      required: true,
    },
    correo: {
      type: String,
      required: true,
    },
    telefono: {
      type: String,
    },

    evento: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Evento",
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Asistente", asistenteSchema);
