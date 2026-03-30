const Sesion = require("../models/Sesion");

/** Crear sesión */
const crearSesion = async (req, res) => {
  try {
    const nuevaSesion = new Sesion(req.body);
    const sesionGuardada = await nuevaSesion.save();
    res.status(201).json({ mensaje: "Sesión creada correctamente", sesion: sesionGuardada });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al crear sesión", error: error.message });
  }
};

/** Obtener todas las sesiones */
const obtenerSesiones = async (req, res) => {
  try {
    const sesiones = await Sesion.find()
      .populate("evento", "nombreEvento fechaEvento ubicacionEvento")
      .populate("ponente", "nombre especialidad");
    res.json(sesiones);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al obtener sesiones", error: error.message });
  }
};

/** Obtener una sesión por ID */
const obtenerSesionPorId = async (req, res) => {
  try {
    const sesion = await Sesion.findById(req.params.id)
      .populate("evento", "nombreEvento fechaEvento ubicacionEvento")
      .populate("ponente", "nombre especialidad");
    if (!sesion) {
      return res.status(404).json({ mensaje: "Sesión no encontrada" });
    }
    res.json(sesion);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al obtener sesión", error: error.message });
  }
};

/** Actualizar sesión */
const actualizarSesion = async (req, res) => {
  try {
    const sesionActualizada = await Sesion.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!sesionActualizada) {
      return res.status(404).json({ mensaje: "Sesión no encontrada" });
    }
    res.json({ mensaje: "Sesión actualizada correctamente", sesion: sesionActualizada });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al actualizar sesión", error: error.message });
  }
};

/** Eliminar sesión */
const eliminarSesion = async (req, res) => {
  try {
    const sesion = await Sesion.findByIdAndDelete(req.params.id);
    if (!sesion) {
      return res.status(404).json({ mensaje: "Sesión no encontrada" });
    }
    res.json({ mensaje: "Sesión eliminada correctamente" });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al eliminar sesión", error: error.message });
  }
};

module.exports = {
  crearSesion,
  obtenerSesiones,
  obtenerSesionPorId,
  actualizarSesion,
  eliminarSesion,
};