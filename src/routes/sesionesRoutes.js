const express = require("express");
const router = express.Router();
const verificarToken = require("../middlewares/authMiddleware");
const verificarRol = require("../middlewares/rolMiddleware");
const { validarSesion, validarActualizarSesion, validarId } = require("../middlewares/validadores");
const { crearSesion, obtenerSesiones, obtenerSesionPorId, actualizarSesion, eliminarSesion } = require("../controllers/sesionesController");

router.post("/crear", verificarToken, verificarRol("administrador", "organizador"), validarSesion, crearSesion);
router.get("/listar", obtenerSesiones);
router.get("/:id", validarId, obtenerSesionPorId);
router.put("/:id", verificarToken, verificarRol("administrador", "organizador"), validarId, validarActualizarSesion, actualizarSesion);
router.delete("/:id", verificarToken, verificarRol("administrador"), validarId, eliminarSesion);

module.exports = router;