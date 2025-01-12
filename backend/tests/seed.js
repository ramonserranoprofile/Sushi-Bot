import mongoose from 'mongoose';
import Product from '../src/models/Product.js'; // Ajusta la ruta al modelo
import { readFile } from 'fs/promises';
import path from 'path';
import dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config();

const filePath = './database/example-data.json'; // Ruta del archivo JSON

const loadInitialData = async () => {
    try {
        if (!process.env.MONGO_URI) {
            throw new Error('MONGO_URI no está definida en el entorno.');
        }

        // Leer y parsear el archivo JSON
        const sanitizedFilePath = path.resolve(filePath);
        const sampleProducts = JSON.parse(await readFile(sanitizedFilePath, 'utf-8'));

        // Conectar a MongoDB
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log(`[${new Date().toISOString()}] Conexión con MongoDB exitosa.`);

        // Eliminar datos existentes en la colección
        await Product.deleteMany();
        console.log(`[${new Date().toISOString()}] Datos existentes eliminados.`);

        // Agregar IDs incrementales a cada producto
        const productsWithIds = sampleProducts.map((product, index) => ({
            ...product,
            id: index + 1, // Asigna IDs secuenciales a partir de 1
        }));

        // Insertar los productos con IDs personalizados
        await Product.insertMany(productsWithIds);
        console.log(`[${new Date().toISOString()}] Datos cargados exitosamente.`);

    } catch (error) {
        console.error(`[${new Date().toISOString()}] Error al cargar datos:`, error);
        process.exit(1); // Salir con error
    } finally {
        await mongoose.disconnect();
        console.log(`[${new Date().toISOString()}] Conexión con MongoDB cerrada.`);
        process.exit(0); // Salir exitosamente
    }
};

// run script
loadInitialData();

// It runs with:  node tests/seed.js