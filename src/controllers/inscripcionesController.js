const Inscripcion = require("../models/Inscripcion");
const Evento = require("../models/Evento");

/**
 * Inscribir usuario autenticado a un evento
 * POST /api/inscripciones/inscribir
 * Requiere token (el usuario se toma de req.usuario.id)
 */
exports.inscribirUsuario = async (req, res) => {
  try {
    const usuarioId = req.usuario.id;
    const { evento: eventoId, notas } = req.body;

    // 1. Verificar que el evento existe
    const evento = await Evento.findById(eventoId);
    if (!evento) {
      return res.status(404).json({ mensaje: "Evento no encontrado" });
    }

    // 2. Verificar que el evento esté activo
    if (evento.estadoEvento !== "activo") {
      return res.status(400).json({
        mensaje: `No es posible inscribirse: el evento está ${evento.estadoEvento}`,
      });
    }

    // 3. Verificar que no exista ya una inscripción ACTIVA del usuario para este evento
    // 
    const inscripcionExistente = await Inscripcion.findOne({
      usuario: usuarioId,
      evento: eventoId,
      estadoInscripcion: { $ne: "cancelada" },
    });

    if (inscripcionExistente) {
      return res.status(400).json({
        mensaje: "Ya estás inscrito en este evento",
        inscripcion: inscripcionExistente,
      });
    }

    // 4. Verificar cupo disponible
    const totalInscritos = await Inscripcion.countDocuments({
      evento: eventoId,
      estadoInscripcion: { $ne: "cancelada" },
    });

    if (totalInscritos >= evento.capacidadMaxima) {
      return res.status(400).json({
        mensaje: "El evento no tiene cupo disponible",
        capacidadMaxima: evento.capacidadMaxima,
        totalInscritos,
      });
    }

    // 5. Crear la inscripción
    
    const nuevaInscripcion = new Inscripcion({
      usuario: usuarioId,
      evento: eventoId,
      notas: notas || "",
    });

    const inscripcionGuardada = await nuevaInscripcion.save();

    await inscripcionGuardada.populate([
      { path: "usuario", select: "nombreUsuario correoElectronico" },
      { path: "evento", select: "nombreEvento fechaEvento ubicacionEvento" },
    ]);

    res.status(201).json({
      mensaje: "Inscripción realizada correctamente",
      inscripcion: inscripcionGuardada,
      cupoRestante: evento.capacidadMaxima - totalInscritos - 1,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ mensaje: "Ya estás inscrito en este evento" });
    }
    res.status(500).json({ mensaje: "Error al inscribirse", error: error.message });
  }
};

/**
 * Cancelar inscripción propia
 * PATCH /api/inscripciones/:id/cancelar
 */
exports.cancelarInscripcion = async (req, res) => {
  try {
    const inscripcion = await Inscripcion.findById(req.params.id);
    if (!inscripcion) {
      return res.status(404).json({ mensaje: "Inscripción no encontrada" });
    }

    // Solo el propio usuario o un admin puede cancelar
    if (
      inscripcion.usuario.toString() !== req.usuario.id &&
      req.usuario.rol !== "administrador"
    ) {
      return res.status(403).json({
        mensaje: "No tienes permiso para cancelar esta inscripción",
      });
    }

    if (inscripcion.estadoInscripcion === "cancelada") {
      return res.status(400).json({ mensaje: "La inscripción ya está cancelada" });
    }

    inscripcion.estadoInscripcion = "cancelada";
    await inscripcion.save();

    res.json({ mensaje: "Inscripción cancelada correctamente", inscripcion });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al cancelar inscripción", error: error.message });
  }
};

/**
 * Confirmar inscripción (organizador / administrador)
 * PATCH /api/inscripciones/:id/confirmar
 */
exports.confirmarInscripcion = async (req, res) => {
  try {
    const inscripcion = await Inscripcion.findById(req.params.id);
    if (!inscripcion) {
      return res.status(404).json({ mensaje: "Inscripción no encontrada" });
    }

    if (inscripcion.estadoInscripcion === "confirmada") {
      return res.status(400).json({ mensaje: "La inscripción ya está confirmada" });
    }

    if (inscripcion.estadoInscripcion === "cancelada") {
      return res.status(400).json({ mensaje: "No se puede confirmar una inscripción cancelada" });
    }

    inscripcion.estadoInscripcion = "confirmada";
    await inscripcion.save();

    res.json({ mensaje: "Inscripción confirmada", inscripcion });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al confirmar inscripción", error: error.message });
  }
};

/**
 * Emitir certificado de participación
 * PATCH /api/inscripciones/:id/certificado
 * Solo administrador u organizador
 */
exports.emitirCertificado = async (req, res) => {
  try {
    const inscripcion = await Inscripcion.findById(req.params.id).populate([
      { path: "usuario", select: "nombreUsuario correoElectronico" },
      { path: "evento", select: "nombreEvento fechaEvento" },
    ]);

    if (!inscripcion) {
      return res.status(404).json({ mensaje: "Inscripción no encontrada" });
    }

    if (inscripcion.estadoInscripcion !== "confirmada") {
      return res.status(400).json({
        mensaje: "Solo se puede emitir certificado para inscripciones confirmadas",
      });
    }

    inscripcion.certificadoEmitido = true;
    await inscripcion.save();

    res.json({
      mensaje: "Certificado emitido correctamente",
      certificado: {
        participante: inscripcion.usuario.nombreUsuario,
        evento: inscripcion.evento.nombreEvento,
        fecha: inscripcion.evento.fechaEvento,
        emitidoEl: new Date(),
      },
    });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al emitir certificado", error: error.message });
  }
};

/**
 * Obtener mis inscripciones (usuario autenticado)
 * GET /api/inscripciones/mis-inscripciones
 */
exports.misInscripciones = async (req, res) => {
  try {
    const inscripciones = await Inscripcion.find({
      usuario: req.usuario.id,
    }).populate({
      path: "evento",
      select: "nombreEvento descripcionEvento fechaEvento ubicacionEvento estadoEvento capacidadMaxima",
    });

    res.json({ total: inscripciones.length, inscripciones });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al obtener tus inscripciones", error: error.message });
  }
};

/**
 * Obtener todas las inscripciones (administrador / organizador)
 * GET /api/inscripciones/
 */
exports.obtenerInscripciones = async (req, res) => {
  try {
    const inscripciones = await Inscripcion.find()
      .populate({ path: "usuario", select: "nombreUsuario correoElectronico rol" })
      .populate({ path: "evento", select: "nombreEvento fechaEvento estadoEvento" })
      .sort({ fechaInscripcion: -1 });

    res.json({ total: inscripciones.length, inscripciones });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al obtener inscripciones", error: error.message });
  }
};

/**
 * Obtener inscripción por ID
 * GET /api/inscripciones/:id
 */
exports.obtenerInscripcionPorId = async (req, res) => {
  try {
    const inscripcion = await Inscripcion.findById(req.params.id)
      .populate({ path: "usuario", select: "nombreUsuario correoElectronico" })
      .populate({ path: "evento", select: "nombreEvento fechaEvento ubicacionEvento estadoEvento" });

    if (!inscripcion) {
      return res.status(404).json({ mensaje: "Inscripción no encontrada" });
    }

    res.json(inscripcion);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al obtener inscripción", error: error.message });
  }
};

/**
 * Eliminar inscripción (solo administrador)
 * DELETE /api/inscripciones/:id
 */
exports.eliminarInscripcion = async (req, res) => {
  try {
    const inscripcion = await Inscripcion.findByIdAndDelete(req.params.id);
    if (!inscripcion) {
      return res.status(404).json({ mensaje: "Inscripción no encontrada" });
    }
    res.json({ mensaje: "Inscripción eliminada correctamente" });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al eliminar inscripción", error: error.message });
  }
};