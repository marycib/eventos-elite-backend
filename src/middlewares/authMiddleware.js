const jwt = require("jsonwebtoken");

/**
 * Verificar token
 */
const verificarToken = (req, res, next) => {
  const token = req.headers["authorization"];

  if (!token) {
    return res.status(403).json({
      mensaje: "Token requerido",
    });
  }

  try {
    const tokenLimpio = token.split(" ")[1];

    const decoded = jwt.verify(tokenLimpio, process.env.JWT_SECRET);

    req.usuario = decoded;

    next();
  } catch (error) {
    return res.status(401).json({
      mensaje: "Token inválido",
    });
  }
};

module.exports = verificarToken;
