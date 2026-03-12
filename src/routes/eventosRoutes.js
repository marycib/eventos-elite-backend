const express = require("express");
const router = express.Router();
const verificarToken = require("../middlewares/authMiddleware");
const verificarRol = require("../middlewares/rolMiddleware");
const {
  crearEvento,
  obtenerEventos,
  obtenerEventoPorId,
  actualizarEvento,
  eliminarEvento,
  cancelarEvento,
  finalizarEvento,
  obtenerEventosDisponibles,
  obtenerAsistentesPorEvento,
} = require("../controllers/eventosController");

// ── CRUD ────────────────────────────────────────────────
/** Crear evento (solo administrador) */
router.post("/crear", verificarToken, verificarRol("administrador"), crearEvento);

/** Listar todos los eventos */
router.get("/listar", obtenerEventos);

/** Consulta especial: eventos activos con cupo disponible */
router.get("/disponibles", obtenerEventosDisponibles);

/** Obtener un evento por ID */
router.get("/:id", obtenerEventoPorId);

/** Actualizar evento */
router.put("/:id", verificarToken, verificarRol("administrador"), actualizarEvento);

/** Eliminar evento */
router.delete("/:id", verificarToken, verificarRol("administrador"), eliminarEvento);

// ── ACCIONES DEL NEGOCIO ────────────────────────────────
/** Cancelar evento */
router.patch("/:id/cancelar", verificarToken, verificarRol("administrador", "organizador"), cancelarEvento);

/** Finalizar evento */
router.patch("/:id/finalizar", verificarToken, verificarRol("administrador", "organizador"), finalizarEvento);

/** Consulta especial: asistentes de un evento con resumen de cupo */
router.get("/:id/asistentes", verificarToken, verificarRol("administrador", "organizador"), obtenerAsistentesPorEvento);

module.exports = router;