import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

// Configuration for using MongoMemoryServer in tests
let mongoServer;

export const setupTestDB = async () => {
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();

    // Connect to in-memory database    
    await mongoose.connect(mongoUri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
};

export const cleanupTestDB = async () => {
    await mongoose.connection.dropDatabase();  // Clean DataBase
    await mongoose.connection.close();        // Close connection
    await mongoServer.stop();                 // Stop Mongo Memory Server
};
