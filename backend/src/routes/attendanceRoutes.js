import express from 'express';
import {
  checkIn,
  checkOut,
  getByEmployee,
  getByDate
} from '../controllers/attendanceController.js';
import { protect } from '../middlewares/authMiddleware.js';
import { authorize } from '../middlewares/roleMiddleware.js';

const router = express.Router();

// Endpoints para empleado autenticado
router.post('/checkin', protect, authorize('employee', 'admin'), checkIn);
router.put('/checkout', protect, authorize('employee', 'admin'), checkOut);

// Endpoints administrativos
router.get('/date/:date', protect, authorize('admin'), getByDate);
router.get('/:employeeId', protect, authorize('admin'), getByEmployee);

export default router;
