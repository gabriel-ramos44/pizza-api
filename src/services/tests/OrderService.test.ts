import Customization from "../../models/Customization";
import Flavor from "../../models/Flavor";
import Order from "../../models/Order";
import Pizza from "../../models/Pizza";
import Size from "../../models/Size";
import OrderService from "../OrderService";

jest.mock('../../models/Order');
jest.mock('../../models/Pizza');
jest.mock('../../models/Size');
jest.mock('../../models/Flavor');
jest.mock('../../models/Customization');

describe('OrderService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('calculatePizzaDetails', () => {

    it('should calculate details of pizza without customizations', async () => {
      // Dados de teste
      const pizzaData = {
        size: 'pequena',
        flavor: 'portuguesa',
      };
      const foundSize = { name: 'pequena', price: 15, preparationTime: 8, toObject: jest.fn() };
      const foundFlavor = { name: 'portuguesa', additionalTime: 1, toObject: jest.fn() };

      // Mocks
      (Size.findOne as jest.Mock).mockResolvedValue(foundSize);
      (Flavor.findOne as jest.Mock).mockResolvedValue(foundFlavor);

      // Execução
      const result = await OrderService.calculatePizzaDetails(pizzaData);

      // Asserções
      expect(result.price).toBe(15);
      expect(result.preparationTime).toBe(9);
      expect(result.foundSize).toEqual(foundSize);
      expect(result.foundFlavor).toEqual(foundFlavor);
      expect(result.foundCustomizations).toEqual([]);
    });

    it('should throw error if doesnt find size', async () => {
      // Dados de teste
      const pizzaData = {
        size: 'Tamanho inválido',
        flavor: 'calabresa',
      };

      // Mocks
      (Size.findOne as jest.Mock).mockResolvedValue(null);

      // Asserção
      await expect(OrderService.calculatePizzaDetails(pizzaData)).rejects.toThrowError('Tamanho não encontrado: Tamanho inválido');
    });

    it('should throw error if doesnt find flavor', async () => {
      // Dados de teste
      const pizzaData = {
        size: 'média',
        flavor: 'Sabor inválido',
      };

      // Mocks
      (Size.findOne as jest.Mock).mockResolvedValue({});
      (Flavor.findOne as jest.Mock).mockResolvedValue(null);

      // Asserção
      await expect(OrderService.calculatePizzaDetails(pizzaData)).rejects.toThrowError('Sabor não encontrado: Sabor inválido');
    });

    it('should throw error if doesnt find customization', async () => {
      // Dados de teste
      const pizzaData = {
        size: 'média',
        flavor: 'calabresa',
        customizations: ['Personalização inválida'],
      };

      // Mocks
      (Size.findOne as jest.Mock).mockResolvedValue({});
      (Flavor.findOne as jest.Mock).mockResolvedValue({});
      (Customization.findOne as jest.Mock).mockResolvedValue(null);

      // Asserção
      await expect(OrderService.calculatePizzaDetails(pizzaData)).rejects.toThrowError('Personalização não encontrada: Personalização inválida');
    });
  });

});