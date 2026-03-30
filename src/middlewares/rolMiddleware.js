/**
 * Middleware para verificar roles
 * Debe usarse DESPUÉS de verificarToken
 */
const verificarRol = (...rolesPermitidos) => {
  return (req, res, next) => {
    const usuario = req.usuario;

    if (!usuario) {
      return res.status(401).json({ mensaje: "Usuario no autenticado" });
    }

    if (!rolesPermitidos.includes(usuario.rol)) {
      return res.status(403).json({
        mensaje: "No tienes permisos para esta acción",
        rolRequerido: rolesPermitidos,
        rolActual: usuario.rol,
      });
    }

    next();
  };
};

module.exports = verificarRol;