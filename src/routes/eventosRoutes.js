const express = require("express");
const router = express.Router();
const verificarToken = require("../middlewares/authMiddleware");
const verificarRol = require("../middlewares/rolMiddleware");
const {
  validarEvento,
  validarActualizarEvento,
  validarId,
} = require("../middlewares/validadores");
const {
  crearEvento,
  obtenerEventos,
  obtenerEventoPorId,
  actualizarEvento,
  eliminarEvento,
  cancelarEvento,
  finalizarEvento,
  obtenerEventosDisponibles,
  obtenerInscritosPorEvento,
} = require("../controllers/eventosController");

// ── CRUD ────────────────────────────────────────────────

// POST /api/eventos/crear
// ✅ CORREGIDO: antes solo permitía "administrador".
//   Ahora también permite "organizador" para que el Panel Organizador funcione.
router.post(
  "/crear",
  verificarToken,
  verificarRol("administrador", "organizador"),
  validarEvento,
  crearEvento
);

// GET /api/eventos/listar — público
router.get("/listar", obtenerEventos);

// GET /api/eventos/disponibles — público
router.get("/disponibles", obtenerEventosDisponibles);

// GET /api/eventos/:id — público
router.get("/:id", validarId, obtenerEventoPorId);

// PUT /api/eventos/:id — admin u organizador
router.put(
  "/:id",
  verificarToken,
  verificarRol("administrador", "organizador"),
  validarId,
  validarActualizarEvento,
  actualizarEvento
);

// DELETE /api/eventos/:id — solo admin
router.delete(
  "/:id",
  verificarToken,
  verificarRol("administrador"),
  validarId,
  eliminarEvento
);

// ── Acciones del negocio ─────────────────────────────────

// PATCH /api/eventos/:id/cancelar
router.patch(
  "/:id/cancelar",
  verificarToken,
  verificarRol("administrador", "organizador"),
  validarId,
  cancelarEvento
);

// PATCH /api/eventos/:id/finalizar
router.patch(
  "/:id/finalizar",
  verificarToken,
  verificarRol("administrador", "organizador"),
  validarId,
  finalizarEvento
);

// ── Inscritos por evento ─────────────────────────────────

// GET /api/eventos/:id/inscritos
router.get(
  "/:id/inscritos",
  verificarToken,
  verificarRol("administrador", "organizador"),
  validarId,
  obtenerInscritosPorEvento
);

module.exports = router;