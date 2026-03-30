const express = require("express");
const router = express.Router();
const verificarToken = require("../middlewares/authMiddleware");
const verificarRol = require("../middlewares/rolMiddleware");
const { validarRol, validarId } = require("../middlewares/validadores");
const { crearRol, obtenerRoles, obtenerRolPorId, actualizarRol, eliminarRol } = require("../controllers/rolesController");

router.post("/crear", verificarToken, verificarRol("administrador"), validarRol, crearRol);
router.get("/", verificarToken, verificarRol("administrador"), obtenerRoles);
router.get("/:id", verificarToken, verificarRol("administrador"), validarId, obtenerRolPorId);
router.put("/:id", verificarToken, verificarRol("administrador"), validarId, validarRol, actualizarRol);
router.delete("/:id", verificarToken, verificarRol("administrador"), validarId, eliminarRol);

module.exports = router;