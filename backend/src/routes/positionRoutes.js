import express from 'express';
import {
  getPositions,
  getPositionById,
  createPosition,
  updatePosition,
  deletePosition
} from '../controllers/positionController.js';
import { protect } from '../middlewares/authMiddleware.js';
import { authorize } from '../middlewares/roleMiddleware.js';

const router = express.Router();

/**
 * @swagger
 * /api/cargos:
 *   get:
 *     summary: Obtener lista de cargos
 *     description: Obtiene todos los cargos del sistema con sus departamentos asociados
 *     tags: [Cargos]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Lista de cargos obtenida correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 count:
 *                   type: integer
 *                   example: 8
 *                 positions:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Position'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.get('/', protect, getPositions);

/**
 * @swagger
 * /api/cargos/{id}:
 *   get:
 *     summary: Obtener cargo por ID
 *     description: Obtiene los datos de un cargo específico
 *     tags: [Cargos]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del cargo
 *     responses:
 *       200:
 *         description: Cargo encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 position:
 *                   $ref: '#/components/schemas/Position'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.get('/:id', protect, getPositionById);

/**
 * @swagger
 * /api/cargos:
 *   post:
 *     summary: Crear nuevo cargo
 *     description: Crea un nuevo cargo en el sistema (requiere rol admin)
 *     tags: [Cargos]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreatePositionRequest'
 *     responses:
 *       201:
 *         description: Cargo creado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Cargo creado correctamente"
 *                 position:
 *                   $ref: '#/components/schemas/Position'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.post('/', protect, authorize('admin'), createPosition);

/**
 * @swagger
 * /api/cargos/{id}:
 *   put:
 *     summary: Actualizar cargo
 *     description: Actualiza los datos de un cargo (requiere rol admin)
 *     tags: [Cargos]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del cargo
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreatePositionRequest'
 *     responses:
 *       200:
 *         description: Cargo actualizado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Cargo actualizado correctamente"
 *                 position:
 *                   $ref: '#/components/schemas/Position'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.put('/:id', protect, authorize('admin'), updatePosition);

/**
 * @swagger
 * /api/cargos/{id}:
 *   delete:
 *     summary: Eliminar cargo
 *     description: Elimina un cargo del sistema (requiere rol admin)
 *     tags: [Cargos]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del cargo
 *     responses:
 *       200:
 *         description: Cargo eliminado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.delete('/:id', protect, authorize('admin'), deletePosition);

export default router;
