import Order from '../models/Order';
import Pizza from '../models/Pizza';
import Size from '../models/Size';
import Flavor from '../models/Flavor';
import Customization from '../models/Customization';

interface PizzaData {
  size: string;
  flavor: string;
  customizations?: string[];
}

class OrderService {
  static async calculatePizzaDetails(pizzaData: PizzaData) {
    const { size, flavor, customizations = [] } = pizzaData;

    const foundSize = await Size.findOne({ name: size });
    if (!foundSize) {
      throw new Error(`Tamanho não encontrado: ${size}`);
    }

    const foundFlavor = await Flavor.findOne({ name: flavor });
    if (!foundFlavor) {
      throw new Error(`Sabor não encontrado: ${flavor}`);
    }

    const foundCustomizations = await Promise.all(
      customizations.map(async (customizationName: string) => {
        const foundCustomization = await Customization.findOne({ name: customizationName });
        if (!foundCustomization) {
          throw new Error(`Personalização não encontrada: ${customizationName}`);
        }
        return foundCustomization.toObject();
      })
    );

    let pizzaPrice = foundSize.price;
    let pizzaPreparationTime = foundSize.preparationTime + foundFlavor.additionalTime;

    foundCustomizations.forEach(customization => {
      pizzaPrice += customization.price;
      pizzaPreparationTime += customization.additionalTime;
    });

    return { price: pizzaPrice, preparationTime: pizzaPreparationTime, foundSize, foundFlavor, foundCustomizations };
  }

  static async createOrder(pizzas: PizzaData[]) {
    const createdPizzas = await Promise.all(
      pizzas.map(async (pizzaData: PizzaData) => {
        const { price, preparationTime, foundFlavor, foundSize, foundCustomizations } =
          await this.calculatePizzaDetails(pizzaData);

        return Pizza.create({
          size: foundSize.toObject(),
          flavor: foundFlavor.toObject(),
          customizations: foundCustomizations,
          price,
          preparationTime,
        });
      })
    );

    const totalValue = createdPizzas.reduce((sum, pizza) => sum + pizza.price, 0);
    const totalPreparationTime = createdPizzas.reduce((sum, pizza) => sum + pizza.preparationTime, 0);

    const order = new Order({
      totalValue,
      totalPreparationTime,
      pizzas: createdPizzas.map(pizza => pizza._id),
    });

    await order.save();
    return order.populate('pizzas');
  }

  static async getOrderDetails(orderId: string) {
    const order = await Order.findById(orderId).populate('pizzas');
    if (!order) {
      throw new Error('Pedido não encontrado.');
    }

    return order;
  }
}

export default OrderService;
