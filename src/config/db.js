const mongoose = require("mongoose");

const conectarBaseDatos = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Base de datos conectada correctamente");
  } catch (error) {
    console.error("Error al conectar con MongoDB:", error);
    process.exit(1);
  }
};

module.exports = conectarBaseDatos;