import User from '../models/User.js';
import jwt from 'jsonwebtoken';

// Función para generar JWT
const generateToken = (id) => {
  // El token expira en 7 días
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '7d'
  });
};

// REGISTER: Crear un nuevo usuario
export const register = async (req, res) => {
  try {
    // Extraer datos del cuerpo de la petición
    const { name, email, password } = req.body;

    // Validar que todos los campos estén presentes
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Por favor completa todos los campos'
      });
    }

    // Verificar si el usuario ya existe
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: 'El email ya está registrado'
      });
    }

    // Crear nuevo usuario
    const user = await User.create({
      name,
      email,
      password
    });

    // Generar token
    const token = generateToken(user._id);

    // Enviar token en una cookie HTTP-only
    // HTTP-only significa que NO se puede acceder desde JavaScript, solo HTTP
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Solo HTTPS en producción
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 días en milisegundos
    });

    // Responder al cliente
    res.status(201).json({
      success: true,
      message: 'Usuario registrado correctamente',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error en el registro',
      error: error.message
    });
  }
};

// LOGIN: Autenticar usuario existente
export const login = async (req, res) => {
  try {
    // Extraer email y contraseña
    const { email, password } = req.body;

    // Validar que tenga ambos datos
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Por favor ingresa email y contraseña'
      });
    }

    // Buscar usuario por email
    // Notar que usamos select('+password') porque la contraseña no se incluye por defecto
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Credenciales inválidas'
      });
    }

    // Comparar contraseñas
    const isPasswordValid = await user.matchPassword(password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Credenciales inválidas'
      });
    }

    // Generar token
    const token = generateToken(user._id);

    // Enviar token en cookie HTTP-only
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    // Responder
    res.json({
      success: true,
      message: 'Sesión iniciada correctamente',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error en el login',
      error: error.message
    });
  }
};

// LOGOUT: Cerrar sesión
export const logout = (req, res) => {
  // Limpiar la cookie del token
  res.clearCookie('token');

  res.json({
    success: true,
    message: 'Sesión cerrada correctamente'
  });
};

// GET PROFILE: Obtener datos del usuario autenticado
export const getProfile = async (req, res) => {
  try {
    // El middleware de autenticación ya validó el token y puso el ID en req.user
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }

    res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener perfil',
      error: error.message
    });
  }
};
