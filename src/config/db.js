import mongoose from 'mongoose';

export const connectDB = async () => {
  let uri = process.env.MONGODB_URL || 'mongodb://127.0.0.1:27017/safeaura';

  if (process.env.USE_MEMORY_DB === 'true') {
    try {
      const { MongoMemoryServer } = await import('mongodb-memory-server');
      const mongod = await MongoMemoryServer.create();
      uri = mongod.getUri();
      console.log('Using in-memory MongoDB');
    } catch (err) {
      console.warn('Memory DB unavailable, trying local MongoDB:', err.message);
    }
  }

  try {
    const conn = await mongoose.connect(uri);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    console.error('Start MongoDB: docker compose up -d  OR  set USE_MEMORY_DB=true');
    process.exit(1);
  }
};
