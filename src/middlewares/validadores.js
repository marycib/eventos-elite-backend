const { body, param, validationResult } = require("express-validator");

const validar = (req, res, next) => {
  const errores = validationResult(req);
  if (!errores.isEmpty()) {
    return res.status(400).json({
      mensaje: "Datos inválidos",
      errores: errores.array().map((e) => ({ campo: e.path, mensaje: e.msg })),
    });
  }
  next();
};

// ─── AUTH ───────────────────────────────────────────────
const validarRegistro = [
  body("nombreUsuario").trim().notEmpty().withMessage("El nombre de usuario es obligatorio").isLength({ min: 3 }).withMessage("Mínimo 3 caracteres"),
  body("correoElectronico").trim().notEmpty().withMessage("El correo es obligatorio").isEmail().withMessage("Correo electrónico inválido").normalizeEmail(),
  body("contrasena").notEmpty().withMessage("La contraseña es obligatoria").isLength({ min: 6 }).withMessage("Mínimo 6 caracteres"),
  body("rol").optional().isIn(["administrador", "organizador", "asistente", "ponente"]).withMessage("Rol inválido"),
  validar,
];

const validarLogin = [
  body("correoElectronico").trim().notEmpty().withMessage("El correo es obligatorio").isEmail().withMessage("Correo electrónico inválido").normalizeEmail(),
  body("contrasena").notEmpty().withMessage("La contraseña es obligatoria"),
  validar,
];

// ─── USUARIOS ───────────────────────────────────────────
const validarUsuario = [
  body("nombreUsuario").trim().notEmpty().withMessage("El nombre de usuario es obligatorio").isLength({ min: 3 }).withMessage("Mínimo 3 caracteres"),
  body("correoElectronico").trim().notEmpty().withMessage("El correo es obligatorio").isEmail().withMessage("Correo electrónico inválido").normalizeEmail(),
  body("contrasena").notEmpty().withMessage("La contraseña es obligatoria").isLength({ min: 6 }).withMessage("Mínimo 6 caracteres"),
  body("rol").notEmpty().withMessage("El rol es obligatorio").isIn(["administrador", "organizador", "asistente", "ponente"]).withMessage("Rol inválido"),
  validar,
];

const validarActualizarUsuario = [
  body("nombreUsuario").optional().trim().isLength({ min: 3 }).withMessage("Mínimo 3 caracteres"),
  body("correoElectronico").optional().trim().isEmail().withMessage("Correo electrónico inválido").normalizeEmail(),
  body("contrasena").optional().isLength({ min: 6 }).withMessage("Mínimo 6 caracteres"),
  body("rol").optional().isIn(["administrador", "organizador", "asistente", "ponente"]).withMessage("Rol inválido"),
  validar,
];

// ─── EVENTOS ────────────────────────────────────────────
const validarEvento = [
  body("nombreEvento").trim().notEmpty().withMessage("El nombre del evento es obligatorio"),
  body("descripcionEvento").trim().notEmpty().withMessage("La descripción es obligatoria"),
  body("fechaEvento").notEmpty().withMessage("La fecha del evento es obligatoria").isISO8601().withMessage("Fecha inválida (usa formato ISO 8601)").toDate(),
  body("ubicacionEvento").trim().notEmpty().withMessage("La ubicación es obligatoria"),
  body("capacidadMaxima").notEmpty().withMessage("La capacidad máxima es obligatoria").isInt({ min: 1 }).withMessage("La capacidad debe ser un entero mayor a 0"),
  body("estadoEvento").optional().isIn(["activo", "cancelado", "finalizado"]).withMessage("Estado de evento inválido"),
  validar,
];

const validarActualizarEvento = [
  body("nombreEvento").optional().trim().notEmpty().withMessage("El nombre no puede estar vacío"),
  body("descripcionEvento").optional().trim().notEmpty().withMessage("La descripción no puede estar vacía"),
  body("fechaEvento").optional().isISO8601().withMessage("Fecha inválida").toDate(),
  body("ubicacionEvento").optional().trim().notEmpty().withMessage("La ubicación no puede estar vacía"),
  body("capacidadMaxima").optional().isInt({ min: 1 }).withMessage("La capacidad debe ser mayor a 0"),
  body("estadoEvento").optional().isIn(["activo", "cancelado", "finalizado"]).withMessage("Estado inválido"),
  validar,
];

// ─── PONENTES ───────────────────────────────────────────
const validarPonente = [
  body("nombre").trim().notEmpty().withMessage("El nombre del ponente es obligatorio"),
  body("especialidad").trim().notEmpty().withMessage("La especialidad es obligatoria"),
  body("correo").trim().notEmpty().withMessage("El correo es obligatorio").isEmail().withMessage("Correo electrónico inválido").normalizeEmail(),
  body("telefono").optional().trim(),
  body("biografia").optional().trim(),
  validar,
];

const validarActualizarPonente = [
  body("nombre").optional().trim().notEmpty().withMessage("El nombre no puede estar vacío"),
  body("especialidad").optional().trim().notEmpty().withMessage("La especialidad no puede estar vacía"),
  body("correo").optional().trim().isEmail().withMessage("Correo inválido").normalizeEmail(),
  validar,
];

// ─── SESIONES ───────────────────────────────────────────
const validarSesion = [
  body("tituloSesion").trim().notEmpty().withMessage("El título de la sesión es obligatorio"),
  body("descripcionSesion").trim().notEmpty().withMessage("La descripción es obligatoria"),
  body("horaInicio").notEmpty().withMessage("La hora de inicio es obligatoria").matches(/^([0-1]\d|2[0-3]):[0-5]\d$/).withMessage("Formato de hora inválido (HH:MM)"),
  body("horaFin").notEmpty().withMessage("La hora de fin es obligatoria").matches(/^([0-1]\d|2[0-3]):[0-5]\d$/).withMessage("Formato de hora inválido (HH:MM)"),
  body("evento").notEmpty().withMessage("El evento es obligatorio").isMongoId().withMessage("ID de evento inválido"),
  body("ponente").notEmpty().withMessage("El ponente es obligatorio").isMongoId().withMessage("ID de ponente inválido"),
  validar,
];

const validarActualizarSesion = [
  body("tituloSesion").optional().trim().notEmpty().withMessage("El título no puede estar vacío"),
  body("descripcionSesion").optional().trim().notEmpty().withMessage("La descripción no puede estar vacía"),
  body("horaInicio").optional().matches(/^([0-1]\d|2[0-3]):[0-5]\d$/).withMessage("Formato HH:MM requerido"),
  body("horaFin").optional().matches(/^([0-1]\d|2[0-3]):[0-5]\d$/).withMessage("Formato HH:MM requerido"),
  body("evento").optional().isMongoId().withMessage("ID de evento inválido"),
  body("ponente").optional().isMongoId().withMessage("ID de ponente inválido"),
  validar,
];

// ─── INSCRIPCIONES ──────────────────────────────────────
const validarInscripcion = [
  body("evento").notEmpty().withMessage("El ID del evento es obligatorio").isMongoId().withMessage("ID de evento inválido"),
  body("notas").optional().trim(),
  validar,
];

// ─── ROLES ──────────────────────────────────────────────
const validarRol = [
  body("nombreRol").trim().notEmpty().withMessage("El nombre del rol es obligatorio").isLength({ min: 2 }).withMessage("Mínimo 2 caracteres"),
  body("descripcion").optional().trim(),
  body("permisos").optional().isArray().withMessage("Los permisos deben ser un arreglo"),
  validar,
];

// ─── PARAM: validar :id ──────────────────────────────────
const validarId = [
  param("id").isMongoId().withMessage("El ID proporcionado no es válido"),
  validar,
];

module.exports = {
  validar,
  validarRegistro,
  validarLogin,
  validarUsuario,
  validarActualizarUsuario,
  validarEvento,
  validarActualizarEvento,
  validarPonente,
  validarActualizarPonente,
  validarSesion,
  validarActualizarSesion,
  validarInscripcion,
  validarRol,
  validarId,
};