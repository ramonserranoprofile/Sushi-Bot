import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

// Configuración para usar MongoMemoryServer en las pruebas
let mongoServer;

export const setupTestDB = async () => {
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();

    // Conectar a la base de datos en memoria
    await mongoose.connect(mongoUri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
};

export const cleanupTestDB = async () => {
    await mongoose.connection.dropDatabase();  // Limpiar la base de datos
    await mongoose.connection.close();        // Cerrar la conexión
    await mongoServer.stop();                 // Detener Mongo Memory Server
};
