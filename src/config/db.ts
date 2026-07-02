import mongoose from 'mongoose';
import { env } from './env';

const MONGODB_OPTIONS: mongoose.ConnectOptions = {
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
  maxPoolSize: 10,
};

let connectionEventsRegistered = false;

const registerConnectionEvents = (): void => {
  if (connectionEventsRegistered) {
    return;
  }

  connectionEventsRegistered = true;

  mongoose.connection.on('disconnected', () => {
    console.warn('MongoDB disconnected');
  });

  mongoose.connection.on('error', (error: Error) => {
    console.error('MongoDB runtime error:', error);
  });
};

export const connectDB = async (): Promise<void> => {
  registerConnectionEvents();

  try {
    await mongoose.connect(env.MONGODB_URI, MONGODB_OPTIONS);
    console.log(
      `MongoDB Atlas connected [${mongoose.connection.name}] on ${mongoose.connection.host}`
    );
  } catch (error) {
    console.error('MongoDB connection failed:', error);
    process.exit(1);
  }
};

export const disconnectDB = async (): Promise<void> => {
  await mongoose.connection.close();
  console.log('MongoDB connection closed');
};
