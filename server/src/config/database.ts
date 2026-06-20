import mongoose from 'mongoose';

export const connectDB = async () => {
  try {
    const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/nexogestion';
    await mongoose.connect(uri);
    console.log('✅ Base de datos conectada');
  } catch (error) {
    console.error('❌ Error conectando a BD:', error);
    process.exit(1);
  }
};
