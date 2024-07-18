import { Schema, model, Document } from 'mongoose';

export interface ISize extends Document {
  name: string;
  price: number;
  preparationTime: number;
}

const sizeSchema = new Schema({
  name: { type: String, required: true, unique: true },
  price: { type: Number, required: true },
  preparationTime: { type: Number, required: true },
});

export default model<ISize>('Size', sizeSchema);