const Evento = require("../models/Evento");
const Inscripcion = require("../models/Inscripcion");

/**
 * Crear evento
 * POST /api/eventos/crear

 */
const crearEvento = async (req, res) => {
  try {
    const {
      nombreEvento,
      descripcionEvento,
      fechaEvento,
      ubicacionEvento,
      capacidadMaxima,
    } = req.body;

    const nuevoEvento = new Evento({
      nombreEvento,
      descripcionEvento,
      fechaEvento,
      ubicacionEvento,
      capacidadMaxima,
      // El estado siempre empieza en "activo" (definido en el Schema como default)
    });

    await nuevoEvento.save();
    res.status(201).json(nuevoEvento);
  } catch (error) {
    res.status(500).json({ mensaje: error.message });
  }
};

/**
 * Listar todos los eventos
 * GET /api/eventos/listar
 * Devuelve un array plano (el frontend debe esperar esto)
 */
const obtenerEventos = async (req, res) => {
  try {
    const eventos = await Evento.find().sort({ fechaCreacion: -1 });
    res.json(eventos);
  } catch (error) {
    res.status(500).json({ mensaje: error.message });
  }
};

/**
 * Obtener un evento por ID
 * GET /api/eventos/:id
 */
const obtenerEventoPorId = async (req, res) => {
  try {
    const evento = await Evento.findById(req.params.id);
    if (!evento) {
      return res.status(404).json({ mensaje: "Evento no encontrado" });
    }
    res.json(evento);
  } catch (error) {
    res.status(500).json({ mensaje: error.message });
  }
};

/**
 * Actualizar evento
 * PUT /api/eventos/:id
 */
const actualizarEvento = async (req, res) => {
  try {
    const eventoActualizado = await Evento.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!eventoActualizado) {
      return res.status(404).json({ mensaje: "Evento no encontrado" });
    }

    res.json({ mensaje: "Evento actualizado correctamente", evento: eventoActualizado });
  } catch (error) {
    res.status(500).json({ mensaje: error.message });
  }
};

/**
 * Eliminar evento
 * DELETE /api/eventos/:id
 */
const eliminarEvento = async (req, res) => {
  try {
    const evento = await Evento.findByIdAndDelete(req.params.id);
    if (!evento) {
      return res.status(404).json({ mensaje: "Evento no encontrado" });
    }
    res.json({ mensaje: "Evento eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ mensaje: error.message });
  }
};

// ─────────────────────────────────────────────
//  ACCIONES DEL NEGOCIO
// ─────────────────────────────────────────────

/**
 * Cancelar evento
 * PATCH /api/eventos/:id/cancelar
 */
const cancelarEvento = async (req, res) => {
  try {
    const evento = await Evento.findById(req.params.id);
    if (!evento) {
      return res.status(404).json({ mensaje: "Evento no encontrado" });
    }

    if (evento.estadoEvento === "cancelado") {
      return res.status(400).json({ mensaje: "El evento ya está cancelado" });
    }

    if (evento.estadoEvento === "finalizado") {
      return res.status(400).json({ mensaje: "No se puede cancelar un evento finalizado" });
    }

    evento.estadoEvento = "cancelado";
    await evento.save();

    res.json({ mensaje: "Evento cancelado correctamente", evento });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al cancelar evento", error: error.message });
  }
};

/**
 * Finalizar evento
 * PATCH /api/eventos/:id/finalizar
 */
const finalizarEvento = async (req, res) => {
  try {
    const evento = await Evento.findById(req.params.id);
    if (!evento) {
      return res.status(404).json({ mensaje: "Evento no encontrado" });
    }

    if (evento.estadoEvento === "finalizado") {
      return res.status(400).json({ mensaje: "El evento ya está finalizado" });
    }

    if (evento.estadoEvento === "cancelado") {
      return res.status(400).json({ mensaje: "No se puede finalizar un evento cancelado" });
    }

    evento.estadoEvento = "finalizado";
    await evento.save();

    res.json({ mensaje: "Evento finalizado correctamente", evento });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al finalizar evento", error: error.message });
  }
};

/**
 * Consulta especial: eventos activos con cupo disponible
 * GET /api/eventos/disponibles
 */
const obtenerEventosDisponibles = async (req, res) => {
  try {
    const eventosActivos = await Evento.find({ estadoEvento: "activo" });

    const eventosConCupo = await Promise.all(
      eventosActivos.map(async (evento) => {
        const totalInscritos = await Inscripcion.countDocuments({
          evento: evento._id,
          estadoInscripcion: { $ne: "cancelada" },
        });

        const cupoDisponible = evento.capacidadMaxima - totalInscritos;
        return { ...evento.toObject(), totalInscritos, cupoDisponible };
      })
    );

    const disponibles = eventosConCupo.filter((e) => e.cupoDisponible > 0);

    res.json({
      mensaje: `Se encontraron ${disponibles.length} evento(s) con cupo disponible`,
      eventos: disponibles,
    });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al obtener eventos disponibles", error: error.message });
  }
};

/**
 * Inscritos de un evento con resumen de cupo
 * GET /api/eventos/:id/inscritos
 */
const obtenerInscritosPorEvento = async (req, res) => {
  try {
    const evento = await Evento.findById(req.params.id);
    if (!evento) {
      return res.status(404).json({ mensaje: "Evento no encontrado" });
    }

    const inscripciones = await Inscripcion.find({
      evento: req.params.id,
      estadoInscripcion: { $ne: "cancelada" },
    }).populate({
      path: "usuario",
      select: "nombreUsuario correoElectronico rol",
    });

    const totalInscritos = inscripciones.length;
    const cupoDisponible = evento.capacidadMaxima - totalInscritos;

    res.json({
      evento: evento.nombreEvento,
      capacidadMaxima: evento.capacidadMaxima,
      totalInscritos,
      cupoDisponible,
      inscritos: inscripciones,
    });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al obtener inscritos del evento", error: error.message });
  }
};

module.exports = {
  crearEvento,
  obtenerEventos,
  obtenerEventoPorId,
  actualizarEvento,
  eliminarEvento,
  cancelarEvento,
  finalizarEvento,
  obtenerEventosDisponibles,
  obtenerInscritosPorEvento,
};