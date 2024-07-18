import { Request, Response } from 'express';
import Order from '../models/Order';
import Pizza from '../models/Pizza';
import Size from '../models/Size';
import Flavor from '../models/Flavor';
import Customization from '../models/Customization';

class OrderController {
  async createOrder(req: Request, res: Response) {
    try {
      const { pizzas } = req.body;

      // validation  pizzas quant
      if (!Array.isArray(pizzas) || pizzas.length === 0) {
        return res.status(400).json({ error: 'Informe pelo menos uma pizza no pedido.' });
      }

      const createdPizzas = await Promise.all(
        pizzas.map(async (pizzaData: any) => {
          const { size, flavor, customizations = [] } = pizzaData;

          const foundSize = await Size.findOne({ name: size });
          if (!foundSize) {
            throw new Error(`Tamanho não encontrado: ${size}`);
          }

          const foundFlavor = await Flavor.findOne({ name: flavor });
          if (!foundFlavor) {
            throw new Error(`Sabor não encontrado: ${flavor}`);
          }

          // validation pizza personalization
          const foundCustomizations = await Promise.all(
            customizations.map(async (customizationName: string) => {
              const foundCustomization = await Customization.findOne({ name: customizationName });
              if (!foundCustomization) {
                throw new Error(`Personalização não encontrada: ${customizationName}`);
              }
              return foundCustomization.toObject();
            })
          );

          // calculate pizza price and prep time
          let pizzaPrice = foundSize.price;
          let pizzaPreparationTime = foundSize.preparationTime + foundFlavor.additionalTime;

          foundCustomizations.forEach(customization => {
            pizzaPrice += customization.price;
            pizzaPreparationTime += customization.additionalTime;
          });

          // create pizza on db
          return Pizza.create({
            size: foundSize.toObject(),
            flavor: foundFlavor.toObject(),
            customizations: foundCustomizations,
            price: pizzaPrice,
            preparationTime: pizzaPreparationTime,
          });
        })
      );

      // calculate order value and prep time
      const totalValue = createdPizzas.reduce((sum, pizza) => sum + pizza.price, 0);
      const totalPreparationTime = Math.max(
        ...createdPizzas.map(pizza => pizza.preparationTime)
      );

      // create order
      const order = new Order({
        totalValue,
        totalPreparationTime,
        pizzas: createdPizzas.map(pizza => pizza._id),
      });

      await order.save();
      res.status(201).json(order);
    } catch (error) {
      console.error(error);
      res.status(400).json({ error: error.message || 'Erro ao criar o pedido.' });
    }
  }
}

export default new OrderController();