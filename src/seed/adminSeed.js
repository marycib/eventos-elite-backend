/**
 * Seed — crea el usuario administrador inicial si no existe
 * Uso: node src/seed/adminSeed.js
 */
require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const Usuario = require("../models/Usuario");
const conectarBaseDatos = require("../config/db");

const seed = async () => {
  await conectarBaseDatos();

  const correo = process.env.ADMIN_EMAIL || "admin@eventoselit.com";
  const contrasena = process.env.ADMIN_PASSWORD || "Admin123!";

  const existe = await Usuario.findOne({ correoElectronico: correo });
  if (existe) {
    console.log(`✓ Administrador ya existe: ${correo}`);
    await mongoose.disconnect();
    return;
  }

  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(contrasena, salt);

  await Usuario.create({
    nombreUsuario: "Administrador",
    correoElectronico: correo,
    contrasena: hash,
    rol: "administrador",
  });

  console.log("✓ Usuario administrador creado:");
  console.log(`   Correo:     ${correo}`);
  console.log(`   Contraseña: ${contrasena}`);
  console.log("   ⚠ Cambia la contraseña después del primer login.");

  await mongoose.disconnect();
};

seed().catch((err) => {
  console.error("Error en seed:", err);
  process.exit(1);
});