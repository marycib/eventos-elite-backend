const express = require("express");
const router = express.Router();
const verificarToken = require("../middlewares/authMiddleware");
const verificarRol = require("../middlewares/rolMiddleware");
const {
  crearUsuario,
  obtenerUsuarios,
  obtenerUsuarioPorId,
  actualizarUsuario,
  eliminarUsuario,
  loginUsuario,
} = require("../controllers/usuariosController");

/** Crear usuario */
router.post("/crear", crearUsuario);

/** Login */
router.post("/login", loginUsuario);

/** Listar todos los usuarios (solo administrador) */
router.get("/listar", verificarToken, verificarRol("administrador"), obtenerUsuarios);

/** Obtener usuario por ID */
router.get("/:id", verificarToken, obtenerUsuarioPorId);

/** Actualizar usuario (solo administrador) */
router.put("/:id", verificarToken, verificarRol("administrador"), actualizarUsuario);

/** Eliminar usuario (solo administrador) */
router.delete("/:id", verificarToken, verificarRol("administrador"), eliminarUsuario);

module.exports = router;