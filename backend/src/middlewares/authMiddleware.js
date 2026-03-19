import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Este middleware protege las rutas privadas
// Lo usamos en cualquier ruta que necesite que el usuario esté autenticado
export const protect = (req, res, next) => {
  try {
    // Obtener el token de la cookie
    const token = req.cookies.token;

    // Validar que exista el token
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No hay token, acceso denegado'
      });
    }

    // Verificar y decodificar el token
    // Si el token es válido, obtenemos los datos del usuario
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Guardar el ID del usuario en req.user para que lo usen otros middlewares o controladores
    req.user = decoded;

    // Permitir que continue a la siguiente función
    next();
  } catch (error) {
    // El token no es válido, expiró, o algo salió mal
    res.status(401).json({
      success: false,
      message: 'Token inválido o expirado'
    });
  }
};

// Middleware para verificar si el usuario tiene un rol específico
export const authorize = (allowedRoles = []) => {
  return async (req, res, next) => {
    try {
      // Verificar que protect ya se ejecutó y el usuario está en req
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'No hay sesión activa'
        });
      }

      // Obtener el usuario de la base de datos para verificar su rol actual
      const user = await User.findById(req.user.id);

      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'Usuario no encontrado'
        });
      }

      // Verificar si el rol del usuario está en la lista de roles permitidos
      if (!allowedRoles.includes(user.role)) {
        return res.status(403).json({
          success: false,
          message: 'No tienes permiso para acceder a este recurso'
        });
      }

      // Guardar el usuario en req para que lo usen los controladores
      req.user.role = user.role;
      next();
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error al verificar permisos',
        error: error.message
      });
    }
  };
};

// Alias para admin (para comodidad)
export const admin = protect;
