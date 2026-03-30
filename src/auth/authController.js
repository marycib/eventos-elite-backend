const Usuario = require("../models/Usuario");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

/**
 * REGISTER
 * POST /api/auth/register
 */
exports.register = async (req, res) => {
  try {
    const { nombreUsuario, correoElectronico, contrasena, rol } = req.body;

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
      rol: rol || "asistente",
    });

    const usuarioGuardado = await nuevoUsuario.save();

    const token = jwt.sign(
      { id: usuarioGuardado._id, rol: usuarioGuardado.rol },
      process.env.JWT_SECRET,
      { expiresIn: "8h" }
    );

    res.status(201).json({
      mensaje: "Usuario registrado correctamente",
      token,
      usuario: {
        id: usuarioGuardado._id,
        nombreUsuario: usuarioGuardado.nombreUsuario,
        correoElectronico: usuarioGuardado.correoElectronico,
        rol: usuarioGuardado.rol,
      },
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ mensaje: "El correo ya está registrado" });
    }
    res.status(500).json({ mensaje: "Error al registrar usuario", error: error.message });
  }
};

/**
 * LOGIN
 * POST /api/auth/login
 */
exports.login = async (req, res) => {
  try {
    const { correoElectronico, contrasena } = req.body;

    const usuario = await Usuario.findOne({ correoElectronico });
    if (!usuario) {
      return res.status(404).json({ mensaje: "Usuario no encontrado" });
    }

    const passwordValida = await bcrypt.compare(contrasena, usuario.contrasena);
    if (!passwordValida) {
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

/**
 * ME — quién está logueado
 * GET /api/auth/me
 */
exports.me = async (req, res) => {
  try {
    const usuario = await Usuario.findById(req.usuario.id).select("-contrasena");
    if (!usuario) {
      return res.status(404).json({ mensaje: "Usuario no encontrado" });
    }
    res.json({ usuario });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al obtener usuario autenticado", error: error.message });
  }
};