import mongoose from 'mongoose';

// Función para conectar a MongoDB
const connectDB = async () => {
  try {
    const mongoUri = process.env.NODE_ENV === 'test'
      ? (process.env.MONGO_URI_TEST || process.env.MONGO_URI)
      : process.env.MONGO_URI;

    if (typeof mongoUri !== 'string' || mongoUri.trim() === '') {
      throw new Error(
        'MONGO_URI no está definida. Crea backend/.env basado en backend/.env.example y configura MONGO_URI (y MONGO_URI_TEST para pruebas).'
      );
    }

    const conn = await mongoose.connect(mongoUri);
    console.log(`✓ MongoDB conectado: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`✗ Error conectando a MongoDB: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
