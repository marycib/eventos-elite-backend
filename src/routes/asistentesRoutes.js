const express = require("express");
const router = express.Router();
const verificarToken = require("../middlewares/authMiddleware");
const verificarRol = require("../middlewares/rolMiddleware");
const {
  registrarAsistente,
  obtenerAsistentes,
  obtenerAsistentePorId,
  actualizarAsistente,
  eliminarAsistente,
} = require("../controllers/asistentesController");

/** Registrar asistente a evento */
router.post("/registrar", verificarToken, registrarAsistente);

/** Obtener todos los asistentes */
router.get("/", verificarToken, verificarRol("administrador", "organizador"), obtenerAsistentes);

/** Obtener asistente por ID */
router.get("/:id", verificarToken, obtenerAsistentePorId);

/** Actualizar asistente */
router.put("/:id", verificarToken, verificarRol("administrador", "organizador"), actualizarAsistente);

/** Eliminar asistencia */
router.delete("/:id", verificarToken, verificarRol("administrador"), eliminarAsistente);

module.exports = router;