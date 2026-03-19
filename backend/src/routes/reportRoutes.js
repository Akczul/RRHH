import express from 'express';
import {
  getMonthlyAttendanceReport,
  getHeadcountReport,
  getEmployeeSummary
} from '../controllers/reportController.js';
import { protect, authorize } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Todas las rutas de reportes requieren autenticación + rol de admin
router.use(protect);
router.use(authorize(['admin']));

// Reporte de asistencia mensual
router.get('/attendance/monthly', getMonthlyAttendanceReport);

// Reporte de cantidad de empleados por departamento
router.get('/headcount', getHeadcountReport);

// Resumen individual del empleado
router.get('/employee/:employeeId/summary', getEmployeeSummary);

export default router;
