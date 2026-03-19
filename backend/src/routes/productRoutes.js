import express from 'express';
import {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct
} from '../controllers/productController.js';
import { protect } from '../middlewares/authMiddleware.js';
import { authorize } from '../middlewares/roleMiddleware.js';

const router = express.Router();

// GET: Listar productos (requiere autenticación)
router.get('/', protect, getProducts);

// GET por ID: Obtener producto específico (requiere autenticación)
router.get('/:id', protect, getProductById);

// POST: Crear producto (requiere ser admin)
router.post('/', protect, authorize('admin'), createProduct);

// PUT: Actualizar producto (requiere ser admin)
router.put('/:id', protect, authorize('admin'), updateProduct);

// DELETE: Eliminar producto (requiere ser admin)
router.delete('/:id', protect, authorize('admin'), deleteProduct);

export default router;