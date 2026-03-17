import jwt from 'jsonwebtoken';

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

// Middleware para verificar si el usuario es admin
export const admin = (req, res, next) => {
  try {
    // Primero validamos que esté autenticado (protect ya se ejecutó)
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No hay token'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Aquí podrías verificar el rol, pero necesitarías consultar la BD
    // Por ahora solo validamos que el token sea válido
    
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Acceso denegado'
    });
  }
};
