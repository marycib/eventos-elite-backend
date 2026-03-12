const express = require("express");
const router = express.Router();
const { register, login, me } = require("../auth/authController");
const verificarToken = require("../middlewares/authMiddleware");

/**
 * Registro público
 * POST /api/auth/register
 */
router.post("/register", register);

/**
 * Login
 * POST /api/auth/login
 */
router.post("/login", login);

/**
 * Quién está logueado (requiere token)
 * GET /api/auth/me
 */
router.get("/me", verificarToken, me);

module.exports = router;