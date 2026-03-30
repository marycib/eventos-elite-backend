const express = require("express");
const router = express.Router();
const verificarToken = require("../middlewares/authMiddleware");
const verificarRol = require("../middlewares/rolMiddleware");
const {
  validarUsuario,
  validarActualizarUsuario,
  validarLogin,
  validarId,
} = require("../middlewares/validadores");
const {
  crearUsuario,
  obtenerUsuarios,
  obtenerUsuarioPorId,
  actualizarUsuario,
  eliminarUsuario,
  loginUsuario,
} = require("../controllers/usuariosController");

// POST /api/usuarios/login — público (sin autenticación)
router.post("/login", validarLogin, loginUsuario);

// POST /api/usuarios/crear
// ✅ CORREGIDO: antes no tenía verificarToken ni verificarRol,
//   cualquier visitante anónimo podía crear un usuario administrador.
//   Ahora solo administradores autenticados pueden crear usuarios.
router.post(
  "/crear",
  verificarToken,
  verificarRol("administrador"),
  validarUsuario,
  crearUsuario
);

// GET /api/usuarios/listar — solo admin
router.get("/listar", verificarToken, verificarRol("administrador"), obtenerUsuarios);

// GET /api/usuarios/:id — autenticado
router.get("/:id", verificarToken, validarId, obtenerUsuarioPorId);

// PUT /api/usuarios/:id — solo admin
router.put(
  "/:id",
  verificarToken,
  verificarRol("administrador"),
  validarId,
  validarActualizarUsuario,
  actualizarUsuario
);

// DELETE /api/usuarios/:id — solo admin
router.delete(
  "/:id",
  verificarToken,
  verificarRol("administrador"),
  validarId,
  eliminarUsuario
);

module.exports = router;