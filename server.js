require("dotenv").config();

const express = require("express");
const cors = require("cors");

const conectarBaseDatos = require("./src/config/db");

const usuariosRoutes = require("./src/routes/usuariosRoutes");

const eventosRoutes = require("./src/routes/eventosRoutes");

const ponentesRoutes = require("./src/routes/ponentesRoutes");

const sesionesRoutes = require("./src/routes/sesionesRoutes");

const asistentesRoutes = require("./src/routes/asistentesRoutes");

const authRoutes = require("./src/routes/authRoutes");


const app = express();

/**
 * Conectar a MongoDB
 */
conectarBaseDatos();

/**
 * Middlewares
 */
app.use(cors());
app.use(express.json());

/**
 * Rutas de la API
 */
app.use("/api/usuarios", usuariosRoutes);
app.use("/api/eventos", eventosRoutes);
app.use("/api/sesiones", sesionesRoutes);
app.use("/api/ponentes", ponentesRoutes);
app.use("/api/asistentes", asistentesRoutes);
app.use("/api/auth", authRoutes);

/**
 * Puerto del servidor
 */
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {

    console.log(`Servidor ejecutándose en puerto ${PORT}`);

});