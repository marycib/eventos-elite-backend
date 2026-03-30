const jwt = require("jsonwebtoken");

/**
 * Verificar token JWT
 * ✅ CORREGIDO: validación robusta del header Authorization
 *   - Antes: token.split(" ")[1] podía devolver undefined si el header
 *     no tenía formato "Bearer <token>", causando errores silenciosos.
 *   - Ahora: se verifica que el header exista Y tenga el prefijo "Bearer "
 *     antes de intentar extraer el token.
 */
const verificarToken = (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers["authorization"];

  if (!authHeader) {
    return res.status(403).json({ mensaje: "Token requerido" });
  }

  if (!authHeader.startsWith("Bearer ")) {
    return res.status(403).json({ mensaje: "Formato de token inválido. Use: Bearer <token>" });
  }

  try {
    const tokenLimpio = authHeader.split(" ")[1];
    const decoded = jwt.verify(tokenLimpio, process.env.JWT_SECRET);
    req.usuario = decoded;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ mensaje: "Token expirado" });
    }
    return res.status(401).json({ mensaje: "Token inválido" });
  }
};

module.exports = verificarToken;