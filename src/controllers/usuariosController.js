const Usuario = require("../models/Usuario");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

/**
 * Crear un usuario
 */
const crearUsuario = async (req, res) => {
  try {
    const { nombreUsuario, correoElectronico, contrasena, rol } = req.body;

    // Verificar si el correo ya existe
    const usuarioExistente = await Usuario.findOne({ correoElectronico });
    if (usuarioExistente) {
      return res.status(400).json({ mensaje: "El correo ya está registrado" });
    }

    const salt = await bcrypt.genSalt(10);
    const contrasenaEncriptada = await bcrypt.hash(contrasena, salt);

    const nuevoUsuario = new Usuario({
      nombreUsuario,
      correoElectronico,
      contrasena: contrasenaEncriptada,
      rol,
    });

    const usuarioGuardado = await nuevoUsuario.save();

    res.status(201).json({
      mensaje: "Usuario creado correctamente",
      usuario: {
        _id: usuarioGuardado._id,
        nombreUsuario: usuarioGuardado.nombreUsuario,
        correoElectronico: usuarioGuardado.correoElectronico,
        rol: usuarioGuardado.rol,
        fechaRegistro: usuarioGuardado.fechaRegistro,
      },
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ mensaje: "El correo ya está registrado" });
    }
    res.status(500).json({ mensaje: "Error al crear usuario", error: error.message });
  }
};

/**
 * Obtener todos los usuarios
 */
const obtenerUsuarios = async (req, res) => {
  try {
    const usuarios = await Usuario.find().select("-contrasena");
    res.json(usuarios);
  } catch (error) {
    res.status(500).json({ mensaje: error.message });
  }
};

/**
 * Obtener un usuario por ID
 */
const obtenerUsuarioPorId = async (req, res) => {
  try {
    const usuario = await Usuario.findById(req.params.id).select("-contrasena");
    if (!usuario) {
      return res.status(404).json({ mensaje: "Usuario no encontrado" });
    }
    res.json(usuario);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al obtener usuario", error: error.message });
  }
};

/**
 * Actualizar usuario
 */
const actualizarUsuario = async (req, res) => {
  try {
    if (req.body.contrasena) {
      const salt = await bcrypt.genSalt(10);
      req.body.contrasena = await bcrypt.hash(req.body.contrasena, salt);
    }

    const usuarioActualizado = await Usuario.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).select("-contrasena");

    if (!usuarioActualizado) {
      return res.status(404).json({ mensaje: "Usuario no encontrado" });
    }

    res.json({ mensaje: "Usuario actualizado correctamente", usuario: usuarioActualizado });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al actualizar usuario", error: error.message });
  }
};

/**
 * Eliminar usuario
 */
const eliminarUsuario = async (req, res) => {
  try {
    const usuario = await Usuario.findByIdAndDelete(req.params.id);
    if (!usuario) {
      return res.status(404).json({ mensaje: "Usuario no encontrado" });
    }
    res.json({ mensaje: "Usuario eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al eliminar usuario", error: error.message });
  }
};

/**
 * Login de usuario

 */
const loginUsuario = async (req, res) => {
  try {
    const { correoElectronico, contrasena } = req.body;

    const usuario = await Usuario.findOne({ correoElectronico });
    if (!usuario) {
      return res.status(404).json({ mensaje: "Usuario no encontrado" });
    }

    const contrasenaValida = await bcrypt.compare(contrasena, usuario.contrasena);
    if (!contrasenaValida) {
      return res.status(401).json({ mensaje: "Contraseña incorrecta" });
    }

    const token = jwt.sign(
      { id: usuario._id, rol: usuario.rol },
      process.env.JWT_SECRET,
      { expiresIn: "8h" }
    );

    res.json({
      mensaje: "Login exitoso",
      token,
     
      usuario: {
        id: usuario._id,
        nombreUsuario: usuario.nombreUsuario,
        correoElectronico: usuario.correoElectronico,
        rol: usuario.rol,
      },
    });
  } catch (error) {
    res.status(500).json({ mensaje: "Error en login", error: error.message });
  }
};

module.exports = {
  crearUsuario,
  obtenerUsuarios,
  obtenerUsuarioPorId,
  actualizarUsuario,
  eliminarUsuario,
  loginUsuario,
};