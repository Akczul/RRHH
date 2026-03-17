import express from 'express';
import {
  register,
  login,
  logout,
  getProfile
} from '../controllers/authController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Rutas públicas (sin protección)
router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);

// Rutas protegidas (requieren autenticación)
router.get('/profile', protect, getProfile);

export default router;
