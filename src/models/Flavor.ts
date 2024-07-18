import { Schema, model, Document } from 'mongoose';

export interface IFlavor extends Document {
  name: string;
  additionalTime: number;
}

const flavorSchema = new Schema({
  name: { type: String, required: true, unique: true },
  additionalTime: { type: Number, default: 0 },
});

export default model<IFlavor>('Flavor', flavorSchema);