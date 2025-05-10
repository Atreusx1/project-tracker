import mongoose from 'mongoose';
import { logger } from './logger';

export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI!);
    logger.info('MongoDB connected successfully');
  } catch (error) {
    logger.error('MongoDB connection error:', error);
    throw error;
  }
};
