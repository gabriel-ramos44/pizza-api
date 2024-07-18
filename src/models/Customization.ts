import { Schema, model, Document } from 'mongoose';

export interface ICustomization extends Document {
  name: string;
  price: number;
  additionalTime: number;
}

const customizationSchema = new Schema({
  name: { type: String, required: true, unique: true },
  price: { type: Number, default: 0 },
  additionalTime: { type: Number, default: 0 },
});

export default model<ICustomization>('Customization', customizationSchema);