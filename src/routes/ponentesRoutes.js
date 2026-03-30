// =============================================
// ponentesRoutes.js
// =============================================
const express = require("express");
const router = express.Router();
const verificarToken = require("../middlewares/authMiddleware");
const verificarRol = require("../middlewares/rolMiddleware");
const { validarPonente, validarActualizarPonente, validarId } = require("../middlewares/validadores");
const { crearPonente, obtenerPonentes, obtenerPonentePorId, actualizarPonente, eliminarPonente } = require("../controllers/ponentesController");

router.post("/crear", verificarToken, verificarRol("administrador", "organizador"), validarPonente, crearPonente);
router.get("/", obtenerPonentes);
router.get("/:id", validarId, obtenerPonentePorId);
router.put("/:id", verificarToken, verificarRol("administrador", "organizador"), validarId, validarActualizarPonente, actualizarPonente);
router.delete("/:id", verificarToken, verificarRol("administrador"), validarId, eliminarPonente);

module.exports = router;