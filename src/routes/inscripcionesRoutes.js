const express = require("express");
const router = express.Router();
const verificarToken = require("../middlewares/authMiddleware");
const verificarRol = require("../middlewares/rolMiddleware");
const { validarInscripcion, validarId } = require("../middlewares/validadores");
const {
  inscribirUsuario,
  cancelarInscripcion,
  confirmarInscripcion,
  emitirCertificado,
  misInscripciones,
  obtenerInscripciones,
  obtenerInscripcionPorId,
  eliminarInscripcion,
} = require("../controllers/inscripcionesController");

router.post("/inscribir", verificarToken, validarInscripcion, inscribirUsuario);
router.get("/mis-inscripciones", verificarToken, misInscripciones);
router.get("/", verificarToken, verificarRol("administrador", "organizador"), obtenerInscripciones);
router.get("/:id", verificarToken, validarId, obtenerInscripcionPorId);
router.patch("/:id/cancelar", verificarToken, validarId, cancelarInscripcion);
router.patch("/:id/confirmar", verificarToken, verificarRol("administrador", "organizador"), validarId, confirmarInscripcion);
router.patch("/:id/certificado", verificarToken, verificarRol("administrador", "organizador"), validarId, emitirCertificado);
router.delete("/:id", verificarToken, verificarRol("administrador"), validarId, eliminarInscripcion);

module.exports = router;