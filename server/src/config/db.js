import mongoose from 'mongoose';
import { env } from './env.js';
import { logger } from '../utils/logger.js';

import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
process.env.MONGOMS_DOWNLOAD_DIR = path.resolve(__dirname, '../../node_modules/.cache/mongodb-binaries');

let mongod = null;

export const connectDB = async () => {
  // If already connected, return
  if (mongoose.connection.readyState >= 1) {
    return mongoose.connection;
  }

  // If in-memory explicitly requested or in test mode
  if (process.env.USE_IN_MEMORY_DB === 'true' || env.NODE_ENV === 'test') {
    return connectMemoryDB();
  }

  try {
    logger.info(`Attempting to connect to MongoDB at ${env.MONGODB_URI}...`);
    await mongoose.connect(env.MONGODB_URI, {
      serverSelectionTimeoutMS: 3000,
      connectTimeoutMS: 3000
    });
    logger.info(`MongoDB connected successfully to ${env.MONGODB_URI}`);
    return mongoose.connection;
  } catch (err) {
    logger.warn(`Could not connect to external MongoDB: ${err.message}. Initializing embedded MongoMemoryServer for development...`);
    return connectMemoryDB();
  }
};

const connectMemoryDB = async () => {
  try {
    const { MongoMemoryServer } = await import('mongodb-memory-server');
    mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();
    await mongoose.connect(uri);
    logger.info(`Connected to embedded MongoDB instance at ${uri}`);
    return mongoose.connection;
  } catch (err) {
    logger.error('Failed to initialize embedded MongoMemoryServer:', err);
    throw err;
  }
};

export const disconnectDB = async () => {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }
  if (mongod) {
    await mongod.stop();
    mongod = null;
  }
};
