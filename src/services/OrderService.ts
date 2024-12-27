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

interface PizzaDetails {
  price: number;
  preparationTime: number;
  size: object;
  flavor: object;
  customizations: object[];
}

class OrderService {
  static async findSize(sizeName: string) {
    const size = await Size.findOne({ name: sizeName });
    if (!size) {
      throw new Error(`Tamanho não encontrado: ${sizeName}`);
    }
    return size;
  }

  static async findFlavor(flavorName: string) {
    const flavor = await Flavor.findOne({ name: flavorName });
    if (!flavor) {
      throw new Error(`Sabor não encontrado: ${flavorName}`);
    }
    return flavor;
  }

  static async findCustomizations(customizationNames: string[]) {
    const customizations = await Promise.all(
      customizationNames.map(async (name) => {
        const customization = await Customization.findOne({ name });
        if (!customization) {
          throw new Error(`Personalização não encontrada: ${name}`);
        }
        return customization;
      })
    );
    return customizations;
  }

  static calculatePriceAndTime(
    size: any,
    flavor: any,
    customizations: any[]
  ): { price: number; preparationTime: number } {
    let price = size.price;
    let preparationTime = size.preparationTime + flavor.additionalTime;

    customizations.forEach((customization) => {
      price += customization.price;
      preparationTime += customization.additionalTime;
    });

    return { price, preparationTime };
  }

  static async calculatePizzaDetails(pizzaData: PizzaData): Promise<PizzaDetails> {
    const { size, flavor, customizations = [] } = pizzaData;

    const foundSize = await this.findSize(size);
    const foundFlavor = await this.findFlavor(flavor);
    const foundCustomizations = await this.findCustomizations(customizations);

    const { price, preparationTime } = this.calculatePriceAndTime(
      foundSize,
      foundFlavor,
      foundCustomizations
    );

    return {
      price,
      preparationTime,
      size: foundSize.toObject(),
      flavor: foundFlavor.toObject(),
      customizations: foundCustomizations.map((c) => c.toObject()),
    };
  }

  static async createOrder(pizzas: PizzaData[]) {
    const createdPizzas = await Promise.all(
      pizzas.map(async (pizzaData) => {
        const pizzaDetails = await this.calculatePizzaDetails(pizzaData);
        return Pizza.create(pizzaDetails);
      })
    );

    const totalValue = createdPizzas.reduce((sum, pizza) => sum + pizza.price, 0);
    const totalPreparationTime = createdPizzas.reduce(
      (sum, pizza) => sum + pizza.preparationTime,
      0
    );

    const order = await Order.create({
      totalValue,
      totalPreparationTime,
      pizzas: createdPizzas.map((pizza) => pizza._id),
    });

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
