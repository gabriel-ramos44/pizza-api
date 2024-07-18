import { Schema, model, Document } from 'mongoose';
import { ISize } from './Size';
import { IFlavor } from './Flavor';

export interface IPizza extends Document {
  size: ISize;
  flavor: IFlavor;
  preparationTime: number;
  price: number;
  customizations:{
    name: string;
    price: number;
    additionalTime: number;
  }[];
}

const pizzaSchema = new Schema({
  size: { type: Schema.Types.Mixed, required: true },
  flavor: { type: Schema.Types.Mixed, required: true },
  preparationTime: { type: Number, required: true },
  price: { type: Number, required: true },
  customizations: [{
    name: { type: String, required: true },
    price: { type: Number, default: 0 },
    additionalTime: { type: Number, default: 0 },
  }],
});

export default model<IPizza>('Pizza', pizzaSchema);