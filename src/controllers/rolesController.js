const Rol = require("../models/Rol");

/** Crear rol */
exports.crearRol = async (req, res) => {
  try {
    const nuevoRol = new Rol(req.body);
    const rolGuardado = await nuevoRol.save();
    res.status(201).json({ mensaje: "Rol creado correctamente", rol: rolGuardado });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ mensaje: "Ya existe un rol con ese nombre" });
    }
    res.status(500).json({ mensaje: "Error al crear rol", error: error.message });
  }
};

/** Obtener todos los roles */
exports.obtenerRoles = async (req, res) => {
  try {
    const roles = await Rol.find();
    res.json(roles);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al obtener roles", error: error.message });
  }
};

/** Obtener rol por ID */
exports.obtenerRolPorId = async (req, res) => {
  try {
    const rol = await Rol.findById(req.params.id);
    if (!rol) {
      return res.status(404).json({ mensaje: "Rol no encontrado" });
    }
    res.json(rol);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al obtener rol", error: error.message });
  }
};

/** Actualizar rol */
exports.actualizarRol = async (req, res) => {
  try {
    const rolActualizado = await Rol.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!rolActualizado) {
      return res.status(404).json({ mensaje: "Rol no encontrado" });
    }
    res.json({ mensaje: "Rol actualizado correctamente", rol: rolActualizado });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al actualizar rol", error: error.message });
  }
};

/** Eliminar rol */
exports.eliminarRol = async (req, res) => {
  try {
    const rol = await Rol.findByIdAndDelete(req.params.id);
    if (!rol) {
      return res.status(404).json({ mensaje: "Rol no encontrado" });
    }
    res.json({ mensaje: "Rol eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al eliminar rol", error: error.message });
  }
};