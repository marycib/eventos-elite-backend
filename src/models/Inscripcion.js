const mongoose = require("mongoose");

/**
 * Modelo de Inscripción
 * ✅ NOTA IMPORTANTE sobre el índice único:
 *   El índice compuesto { usuario, evento } con unique:true impide crear
 *   una segunda inscripción aunque la primera esté cancelada.
 *   Para permitir reinscripción después de cancelación, el controller ya
 *   maneja la lógica filtrando por estadoInscripcion, pero si se necesita
 *   soporte completo de reinscripción a nivel de BD, se puede eliminar el
 *   índice único y dejar que el controller sea quien controle duplicados.
 *   Por ahora se mantiene el índice como protección de última línea.
 */
const inscripcionSchema = new mongoose.Schema(
  {
    usuario: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Usuario",
      required: true,
    },
    evento: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Evento",
      required: true,
    },
    estadoInscripcion: {
      type: String,
      enum: ["pendiente", "confirmada", "cancelada"],
      default: "confirmada",
    },
    fechaInscripcion: {
      type: Date,
      default: Date.now,
    },
    certificadoEmitido: {
      type: Boolean,
      default: false,
    },
    notas: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

// Índice compuesto — protección de duplicados a nivel de BD
inscripcionSchema.index({ usuario: 1, evento: 1 }, { unique: true });

module.exports = mongoose.model("Inscripcion", inscripcionSchema);