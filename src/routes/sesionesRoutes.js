const express = require("express");
const router = express.Router();
const verificarToken = require("../middlewares/authMiddleware");
const verificarRol = require("../middlewares/rolMiddleware");
const {
  crearSesion,
  obtenerSesiones,
  obtenerSesionPorId,
  actualizarSesion,
  eliminarSesion,
} = require("../controllers/sesionesController");

/** Crear sesión */
router.post("/crear", verificarToken, verificarRol("administrador", "organizador"), crearSesion);

/** Listar todas las sesiones */
router.get("/listar", obtenerSesiones);

/** Obtener sesión por ID */
router.get("/:id", obtenerSesionPorId);

/** Actualizar sesión */
router.put("/:id", verificarToken, verificarRol("administrador", "organizador"), actualizarSesion);

/** Eliminar sesión */
router.delete("/:id", verificarToken, verificarRol("administrador"), eliminarSesion);

module.exports = router;