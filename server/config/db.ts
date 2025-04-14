import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const connectDB = async () => {
  try {
    if (!process.env.MONGODB_URL) {
      throw new Error('MONGODB_URI is not defined in .env file');
    }

    const conn = await mongoose.connect(process.env.MONGODB_URL, {
      serverSelectionTimeoutMS: 5000,
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error: unknown) {
    console.error('Database connection error:');
    
    if (error instanceof Error) {
      console.error(error.message);
    } else {
      console.error('Unknown error occurred');
    }
    
    process.exit(1);
  }
};

export default connectDB;