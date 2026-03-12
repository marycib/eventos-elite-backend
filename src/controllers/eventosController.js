const Evento = require("../models/Evento");
const Asistente = require("../models/Asistente");

/**
 * Crear evento
 */
const crearEvento = async (req, res) => {
  try {
    const nuevoEvento = new Evento(req.body);
    await nuevoEvento.save();
    res.status(201).json(nuevoEvento);
  } catch (error) {
    res.status(500).json({ mensaje: error.message });
  }
};

/**
 * Listar todos los eventos
 */
const obtenerEventos = async (req, res) => {
  try {
    const eventos = await Evento.find();
    res.json(eventos);
  } catch (error) {
    res.status(500).json({ mensaje: error.message });
  }
};

/**
 * Obtener un evento por ID
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
        const totalAsistentes = await Asistente.countDocuments({ evento: evento._id });
        const cupoDisponible = evento.capacidadMaxima - totalAsistentes;
        return { ...evento.toObject(), totalAsistentes, cupoDisponible };
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
 * Consulta especial: asistentes de un evento con resumen de cupo
 * GET /api/eventos/:id/asistentes
 */
const obtenerAsistentesPorEvento = async (req, res) => {
  try {
    const evento = await Evento.findById(req.params.id);
    if (!evento) {
      return res.status(404).json({ mensaje: "Evento no encontrado" });
    }
    const asistentes = await Asistente.find({ evento: req.params.id });
    const totalInscritos = asistentes.length;
    const cupoDisponible = evento.capacidadMaxima - totalInscritos;

    res.json({
      evento: evento.nombreEvento,
      capacidadMaxima: evento.capacidadMaxima,
      totalInscritos,
      cupoDisponible,
      asistentes,
    });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al obtener asistentes del evento", error: error.message });
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
  obtenerAsistentesPorEvento,
};