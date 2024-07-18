import { Schema, model, Document } from 'mongoose';
import { IPizza } from './Pizza';

export interface IOrder extends Document {
  totalValue: number;
  totalPreparationTime: number;
  pizzas: IPizza[];
}

const orderSchema = new Schema({
  totalValue: {
    type: Number,
    required: true,
  },
  totalPreparationTime: {
    type: Number,
    required: true,
  },
  pizzas: [{
    type: Schema.Types.ObjectId,
    ref: 'Pizza',
  }],
});

export default model<IOrder>('Order', orderSchema);