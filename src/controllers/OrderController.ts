import { Request, Response } from 'express';
import { z } from 'zod';
import OrderService from '../services/OrderService';
import { orderSchema } from '../validation/pizza';

class OrderController {
  async createOrder(req: Request, res: Response) {
    try {
      const { pizzas } = await orderSchema.parseAsync(req.body);
      const order = await OrderService.createOrder(pizzas);

      return res.status(201).json(order);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.issues.map(issue => issue.message) });
      }
      console.error('Erro ao criar pedido:', error);
      return res.status(500).json({ error: 'Erro interno ao criar o pedido.' });
    }
  }

  async getOrderDetails(req: Request, res: Response) {
    try {
      const { orderId } = req.params;
      const order = await OrderService.getOrderDetails(orderId);

      return res.status(200).json(order);
    } catch (error) {
      console.error('Erro ao obter detalhes do pedido:', error);
      return res.status(500).json({ error: 'Erro interno ao obter os detalhes do pedido.' });
    }
  }
}

export default new OrderController();
