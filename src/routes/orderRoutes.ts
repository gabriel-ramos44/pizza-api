import { Router } from 'express';
import OrderController from '../controllers/OrderController';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Orders
 *   description: Operações relacionadas a pedidos
 */

/**
 * @swagger
 * /orders:
 *   post:
 *     summary: Cria um novo pedido
 *     tags: [Orders]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               pizzas:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     size:
 *                       type: string
 *                     flavor:
 *                       type: string
 *                     customizations:
 *                       type: array
 *                       items:
 *                         type: string
 *     responses:
 *       201:
 *         description: Pedido criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                 totalValue:
 *                   type: number
 *                 totalPreparationTime:
 *                   type: number
 *                 pizzas:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       size:
 *                         type: string
 *                       flavor:
 *                         type: string
 *                       customizations:
 *                         type: array
 *                         items:
 *                           type: string
 *       400:
 *         description: Erro na validação dos dados
 *       500:
 *         description: Erro interno no servidor
 */
router.post('/', OrderController.createOrder);

/**
 * @swagger
 * /orders/{orderId}:
 *   get:
 *     summary: Obtem os detalhes de um pedido
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: orderId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID do pedido
 *     responses:
 *       200:
 *         description: Detalhes do pedido retornados com sucesso
 *       404:
 *         description: Pedido não encontrado
 *       500:
 *         description: Erro interno no servidor
 */
router.get('/:orderId', OrderController.getOrderDetails);

export default router;