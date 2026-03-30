const Ponente = require("../models/Ponente");

/** Crear ponente */
exports.crearPonente = async (req, res) => {
  try {
    const nuevoPonente = new Ponente(req.body);
    const ponenteGuardado = await nuevoPonente.save();
    res.status(201).json({ mensaje: "Ponente creado correctamente", ponente: ponenteGuardado });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ mensaje: "Ya existe un ponente con ese correo" });
    }
    res.status(500).json({ mensaje: "Error al crear ponente", error: error.message });
  }
};

/** Obtener todos los ponentes */
exports.obtenerPonentes = async (req, res) => {
  try {
    const ponentes = await Ponente.find();
    res.json(ponentes);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al obtener ponentes", error: error.message });
  }
};

/** Obtener un ponente por ID */
exports.obtenerPonentePorId = async (req, res) => {
  try {
    const ponente = await Ponente.findById(req.params.id);
    if (!ponente) {
      return res.status(404).json({ mensaje: "Ponente no encontrado" });
    }
    res.json(ponente);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al obtener ponente", error: error.message });
  }
};

/** Actualizar ponente */
exports.actualizarPonente = async (req, res) => {
  try {
    const ponenteActualizado = await Ponente.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!ponenteActualizado) {
      return res.status(404).json({ mensaje: "Ponente no encontrado" });
    }
    res.json({ mensaje: "Ponente actualizado correctamente", ponente: ponenteActualizado });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al actualizar ponente", error: error.message });
  }
};

/** Eliminar ponente */
exports.eliminarPonente = async (req, res) => {
  try {
    const ponente = await Ponente.findByIdAndDelete(req.params.id);
    if (!ponente) {
      return res.status(404).json({ mensaje: "Ponente no encontrado" });
    }
    res.json({ mensaje: "Ponente eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al eliminar ponente", error: error.message });
  }
};