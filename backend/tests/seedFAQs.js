import mongoose from 'mongoose';
import Faq from '../src/models/FaqModel.js'; // Ajusta la ruta a tu modelo FAQ
import { readFile } from 'fs/promises';
import dotenv from 'dotenv';

dotenv.config();

const filePath = './database/faq-data.json'; // Ruta del archivo JSON

const loadFAQs = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("Conectado a MongoDB.");

        const faqs = JSON.parse(await readFile(filePath, 'utf-8'));

        await Faq.deleteMany(); // Limpia la colección antes de insertar
        console.log("Colección FAQ vaciada.");

        await Faq.insertMany(faqs);
        console.log("FAQs cargadas exitosamente.");
    } catch (error) {
        console.error("Error al cargar las FAQs:", error);
    } finally {
        await mongoose.disconnect();
        console.log("Conexión con MongoDB cerrada.");
    }
};

loadFAQs();

// Ejecutar la función para cargar las FAQs en MongoDB
// node tests/seedFAQs.js