import mongoose from 'mongoose';
import Product from '../src/models/Product.js'; // Ajusta la ruta al modelo
import { readFile } from 'fs/promises';
import path from 'path';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const filePath = './database/example-data.json'; // Path to JSON file

const loadInitialData = async () => {
    try {
        if (!process.env.MONGO_URI) {
            throw new Error('MONGO_URI no está definida en el entorno.');
        }

        // Read and parse JSON file        
        const sanitizedFilePath = path.resolve(filePath);
        const sampleProducts = JSON.parse(await readFile(sanitizedFilePath, 'utf-8'));

        // Connect to MongoDB
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log(`[${new Date().toISOString()}] Conexión con MongoDB exitosa.`);

        // Delete existing data in the collection        
        await Product.deleteMany();
        console.log(`[${new Date().toISOString()}] Datos existentes eliminados.`);

        // Add incremental IDs to each product        
        const productsWithIds = sampleProducts.map((product, index) => ({
            ...product,
            id: index + 1, // Asigna IDs secuenciales a partir de 1
        }));

        // Insert products with custom IDs        
        await Product.insertMany(productsWithIds);
        console.log(`[${new Date().toISOString()}] Datos cargados exitosamente.`);

    } catch (error) {
        console.error(`[${new Date().toISOString()}] Error al cargar datos:`, error);
        process.exit(1); // Exit with error
    } finally {
        await mongoose.disconnect();
        console.log(`[${new Date().toISOString()}] Conexión con MongoDB cerrada.`);
        process.exit(0); // Exit successfully
    }
};

// run script
loadInitialData();

// It runs with:  node tests/seed.js