import { z } from 'zod';

const pizzaSchema = z.object({
  size: z.string({
    required_error: 'O tamanho da pizza é obrigatório.',
  }),
  flavor: z.string({
    required_error: 'O sabor da pizza é obrigatório.',
  }),
  customizations: z
    .array(z.string(), {
      required_error: 'Personalizações inválidas',
    })
    .refine(
      (customizations) => new Set(customizations).size === customizations.length,
      { message: 'Personalizações duplicadas não são permitidas.' },
    )
    .optional(),
});

const orderSchema = z.object({
  pizzas: z.array(pizzaSchema, {
    required_error: 'Informe pelo menos uma pizza no pedido.',
  }).min(1),
});

export { pizzaSchema, orderSchema };