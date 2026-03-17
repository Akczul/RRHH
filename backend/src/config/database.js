import mongoose from 'mongoose';

// Función para conectar a MongoDB
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`✓ MongoDB conectado: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`✗ Error conectando a MongoDB: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
