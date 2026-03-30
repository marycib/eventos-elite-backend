/**
 * Middleware de manejo de errores global
 * Registrar DESPUÉS de todas las rutas en server.js: app.use(errorHandler)
 */
const errorHandler = (err, req, res, next) => {
  console.error(`[ERROR] ${req.method} ${req.path} →`, err.message);

  if (err.name === "ValidationError") {
    const errores = Object.values(err.errors).map((e) => e.message);
    return res.status(400).json({ mensaje: "Error de validación", errores });
  }

  if (err.name === "CastError" && err.kind === "ObjectId") {
    return res.status(400).json({
      mensaje: "ID inválido",
      detalle: `El valor '${err.value}' no es un ID válido`,
    });
  }

  if (err.code === 11000) {
    const campo = Object.keys(err.keyValue || {})[0] || "campo";
    return res.status(409).json({
      mensaje: "Registro duplicado",
      detalle: `Ya existe un registro con ese valor en '${campo}'`,
    });
  }

  if (err.name === "JsonWebTokenError") {
    return res.status(401).json({ mensaje: "Token inválido" });
  }

  if (err.name === "TokenExpiredError") {
    return res.status(401).json({ mensaje: "Token expirado" });
  }

  const statusCode = err.statusCode || err.status || 500;
  res.status(statusCode).json({
    mensaje: err.message || "Error interno del servidor",
    ...(process.env.NODE_ENV !== "production" && { stack: err.stack }),
  });
};

module.exports = errorHandler;