require("dotenv").config();
const express = require("express");
const cors = require("cors");
const conectarBaseDatos = require("./src/config/db");
const errorHandler = require("./src/middlewares/errorHandler");

const authRoutes          = require("./src/routes/authRoutes");
const usuariosRoutes      = require("./src/routes/usuariosRoutes");
const eventosRoutes       = require("./src/routes/eventosRoutes");
const ponentesRoutes      = require("./src/routes/ponentesRoutes");
const sesionesRoutes      = require("./src/routes/sesionesRoutes");
const inscripcionesRoutes = require("./src/routes/inscripcionesRoutes");
const rolesRoutes         = require("./src/routes/rolesRoutes");

const app = express();

conectarBaseDatos();

// ✅ CORREGIDO: el default de CORS_ORIGINS ahora incluye el puerto 5173 de Vite
// además del 3000, para que el frontend funcione sin configuración extra en .env
const origenesPermitidos = (
  process.env.CORS_ORIGINS || "http://localhost:5173,http://localhost:3000"
)
  .split(",")
  .map((o) => o.trim());

app.use(
  cors({
    origin: (origin, callback) => {
      // Permitir peticiones sin origin (Postman, curl, etc.)
      if (!origin) return callback(null, true);
      if (origenesPermitidos.includes(origin)) return callback(null, true);
      callback(new Error(`Origen no permitido por CORS: ${origin}`));
    },
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));

// Rutas
app.use("/api/auth",          authRoutes);
app.use("/api/usuarios",      usuariosRoutes);
app.use("/api/eventos",       eventosRoutes);
app.use("/api/ponentes",      ponentesRoutes);
app.use("/api/sesiones",      sesionesRoutes);
app.use("/api/inscripciones", inscripcionesRoutes);
app.use("/api/roles",         rolesRoutes);

// Health check
app.get("/api/health", (req, res) => {
  res.json({ estado: "ok", timestamp: new Date().toISOString() });
});

// 404
app.use((req, res) => {
  res.status(404).json({ mensaje: `Ruta no encontrada: ${req.method} ${req.path}` });
});

// Error handler global (debe ir al final)
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✓ Servidor corriendo en http://localhost:${PORT}`);
  console.log(`  Entorno: ${process.env.NODE_ENV || "development"}`);
  console.log(`  CORS permitido para: ${origenesPermitidos.join(", ")}`);
});