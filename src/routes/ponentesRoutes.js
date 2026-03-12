const express = require("express");
const router = express.Router();
const verificarToken = require("../middlewares/authMiddleware");
const verificarRol = require("../middlewares/rolMiddleware");
const {
  crearPonente,
  obtenerPonentes,
  obtenerPonentePorId,
  actualizarPonente,
  eliminarPonente,
} = require("../controllers/ponentesController");

/** Crear ponente (solo administrador u organizador) */
router.post("/crear", verificarToken, verificarRol("administrador", "organizador"), crearPonente);

/** Obtener todos los ponentes */
router.get("/", obtenerPonentes);

/** Obtener ponente por ID */
router.get("/:id", obtenerPonentePorId);

/** Actualizar ponente */
router.put("/:id", verificarToken, verificarRol("administrador", "organizador"), actualizarPonente);

/** Eliminar ponente */
router.delete("/:id", verificarToken, verificarRol("administrador"), eliminarPonente);

module.exports = router;