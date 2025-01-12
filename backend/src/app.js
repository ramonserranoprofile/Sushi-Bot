// Import the required modules
import express from 'express';
import cookieParser from 'cookie-parser';
import connectDB from '../database/mongoDB.js';
import dotenv from 'dotenv';
import menuRoutes from './routes/menuRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import faqRoutes from './routes/faqRoutes.js';
import cors from 'cors';
import helmet from 'helmet';
//import csurf from 'csurf';


// Load the environment variables from the .env file
dotenv.config();


// Create an instance of the Express application

const app = express();

// Configuración de CORS
const corsOptions = {
    origin: process.env.SERVER_HOST,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));

// Use Helmet to protect against well-known vulnerabilities
app.use(helmet());

// CSRF protection
//app.use(csurf({ cookie: true }));

// Disable X-Powered-By header
app.disable('x-powered-by');

// disable cors
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

// middleware Configuration 
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
// Define a route for the root URL
app.get('/', (req, res) => {
    // Send a simple message as the response
    res.send('Hello World');
});

// Routes
app.use('/menu', menuRoutes);
app.use('/order', orderRoutes);
app.use('/faq', faqRoutes);

// MongoDB Connection
connectDB();

// Middleware para manejar recursos no encontrados (404)
app.use((req, res, next) => {
    res.status(404).json({ message: "Recurso no encontrado" });
});

// Middleware global para manejar errores 400 y 500
app.use((err, req, res, next) => {
    console.error(err.stack);
    if (err.status === 400) {
        return res.status(400).json({ message: err.message || "Solicitud incorrecta" });
    }
    res.status(500).json({ message: "Error interno del servidor" });
});

export default app;