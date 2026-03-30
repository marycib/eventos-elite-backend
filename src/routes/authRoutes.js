const express = require("express");
const router = express.Router();
const { register, login, me } = require("../auth/authController");
const verificarToken = require("../middlewares/authMiddleware");
const { validarRegistro, validarLogin } = require("../middlewares/validadores");

/** POST /api/auth/register */
router.post("/register", validarRegistro, register);

/** POST /api/auth/login */
router.post("/login", validarLogin, login);

/** GET /api/auth/me */
router.get("/me", verificarToken, me);

module.exports = router;