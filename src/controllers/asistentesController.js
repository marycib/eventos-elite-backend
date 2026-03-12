const Asistente = require("../models/Asistente");
const Evento = require("../models/Evento");

/**
 * Registrar asistente a evento
 * Valida que el evento esté activo y tenga cupo disponible
 * POST /api/asistentes/registrar
 */
exports.registrarAsistente = async (req, res) => {
  try {
    const { evento: eventoId } = req.body;

    // 1. Verificar que el evento existe
    const evento = await Evento.findById(eventoId);
    if (!evento) {
      return res.status(404).json({ mensaje: "Evento no encontrado" });
    }

    // 2. Verificar que el evento esté activo
    if (evento.estadoEvento !== "activo") {
      return res.status(400).json({
        mensaje: `No se puede registrar al evento porque está ${evento.estadoEvento}`,
      });
    }

    // 3. Verificar cupo disponible
    const totalInscritos = await Asistente.countDocuments({ evento: eventoId });
    if (totalInscritos >= evento.capacidadMaxima) {
      return res.status(400).json({
        mensaje: "El evento no tiene cupo disponible",
        capacidadMaxima: evento.capacidadMaxima,
        totalInscritos,
      });
    }

    // 4. Registrar asistente
    const nuevoAsistente = new Asistente(req.body);
    const asistenteGuardado = await nuevoAsistente.save();

    res.status(201).json({
      mensaje: "Asistente registrado correctamente",
      asistente: asistenteGuardado,
      cupoRestante: evento.capacidadMaxima - totalInscritos - 1,
    });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al registrar asistente", error: error.message });
  }
};

/**
 * Obtener todos los asistentes
 */
exports.obtenerAsistentes = async (req, res) => {
  try {
    const asistentes = await Asistente.find().populate({
      path: "evento",
      select: "nombreEvento fechaEvento ubicacionEvento capacidadMaxima estadoEvento",
    });
    res.json(asistentes);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al obtener asistentes", error: error.message });
  }
};

/**
 * Obtener un asistente por ID
 */
exports.obtenerAsistentePorId = async (req, res) => {
  try {
    const asistente = await Asistente.findById(req.params.id).populate({
      path: "evento",
      select: "nombreEvento fechaEvento ubicacionEvento",
    });
    if (!asistente) {
      return res.status(404).json({ mensaje: "Asistente no encontrado" });
    }
    res.json(asistente);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al obtener asistente", error: error.message });
  }
};

/**
 * Actualizar asistente
 */
exports.actualizarAsistente = async (req, res) => {
  try {
    const asistenteActualizado = await Asistente.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!asistenteActualizado) {
      return res.status(404).json({ mensaje: "Asistente no encontrado" });
    }
    res.json({ mensaje: "Asistente actualizado correctamente", asistente: asistenteActualizado });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al actualizar asistente", error: error.message });
  }
};

/**
 * Eliminar asistencia
 */
exports.eliminarAsistente = async (req, res) => {
  try {
    const asistente = await Asistente.findByIdAndDelete(req.params.id);
    if (!asistente) {
      return res.status(404).json({ mensaje: "Asistente no encontrado" });
    }
    res.json({ mensaje: "Asistencia eliminada" });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al eliminar asistencia", error: error.message });
  }
};