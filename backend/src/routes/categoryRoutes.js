import express from 'express';
import {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory
} from '../controllers/categoryController.js';
import { protect } from '../middlewares/authMiddleware.js';
import { authorize } from '../middlewares/roleMiddleware.js';

const router = express.Router();

// GET: Listar categorías (requiere autenticación)
router.get('/', protect, getCategories);

// GET por ID: Obtener categoría específica (requiere autenticación)
router.get('/:id', protect, getCategoryById);

// POST: Crear categoría (requiere ser admin)
router.post('/', protect, authorize('admin'), createCategory);

// PUT: Actualizar categoría (requiere ser admin)
router.put('/:id', protect, authorize('admin'), updateCategory);

// DELETE: Eliminar categoría (requiere ser admin)
router.delete('/:id', protect, authorize('admin'), deleteCategory);

export default router;