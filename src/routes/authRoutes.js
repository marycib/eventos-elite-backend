const express = require("express");
const router = express.Router();
const { register, login, me } = require("../auth/authController");
const verificarToken = require("../middlewares/authMiddleware");

router.post("/register", register);
router.post("/login", login);
router.get("/me", verificarToken, me);

module.exports = router;
