import app from './app';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT || 3000;

(async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || "");
    console.log('Connected to MongoDB');

    app.listen(PORT, () => {
      console.log(`Server running. PORT: ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error);
  }
})();