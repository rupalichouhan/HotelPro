const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let memoryServer = null;

const connectToMongo = async () => {
  const defaultUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/hotel';

  try {
    // Attempt standard connection to MongoDB with 10s timeout
    console.log(`[Database] Connecting to MongoDB at: ${defaultUri}...`);
    await mongoose.connect(defaultUri, {
      serverSelectionTimeoutMS: 10000,
    });
    console.log('[Database] Successfully connected to MongoDB at:', defaultUri);
  } catch (err) {
    console.warn(`[Database] Could not connect to primary MongoDB (${err.message}).`);
    console.log('[Database] Starting embedded in-memory MongoDB server for seamless instant execution...');
    try {
      memoryServer = await MongoMemoryServer.create({
        instance: {
          dbName: 'hotel',
        },
      });
      const memoryUri = memoryServer.getUri();
      await mongoose.connect(memoryUri);
      console.log(`[Database] Embedded MongoDB running and connected at: ${memoryUri}`);
    } catch (memErr) {
      console.error('[Database] Failed to start embedded MongoDB:', memErr.message);
      throw memErr;
    }
  }
};

module.exports = connectToMongo;
