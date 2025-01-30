// Import the required modules
import express from 'express';
import cookieParser from 'cookie-parser';
import connectDB from './shared/database/mongoDB.js';
import dotenv from 'dotenv';
import faqRoutes  from './modules/faq/faq.routes.js';
import menuRoutes from './modules/menu/menu.routes.js';
import orderRoutes from './modules/order/order.routes.js';
import cors from 'cors';
import csurf from '@dr.pogodin/csurf';
import helmet from 'helmet';


// Load the environment variables from the .env file
dotenv.config();


// Create an instance of the Express application

const app = express();

// const csrfProtection = csurf({ cookie: true });
// app.use(csrfProtection)
 // aplicar estrategia de proteccion con cross site request forgery
// app.use((req, res, next) => {
//     res.locals.csrfToken = req.csrfToken();
//     next();
// });
// app.use((req, res, next) => {
//     res.setHeader('X-Frame-Options', 'SAMEORIGIN');
//     next();
// });
// app.use((req, res, next) => {
//     res.setHeader('X-Content-Type-Options', 'nosniff');
//     next();
// });
// app.use((req, res, next) => {
//     res.setHeader('X-XSS-Protection', '1; mode=block');
//     next();
// });
// app.use((req, res, next) => {
//     res.setHeader('Content-Security-Policy', "default-src 'self'; script-src 'self' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self'; font-src 'self'; connect-src 'self'; frame-src 'self'; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'; upgrade-insecure-requests");
//     next();
// });
// app.use((req, res, next) => {
//     res.setHeader('Referrer-Policy', 'no-referrer');
//     next();
// });
// app.use((req, res, next) => {
//     res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
//     next();
// });


// Config CORS
const corsOptions = {
    origin: process.env.SERVER_HOST,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));

// Use Helmet to protect against well-known vulnerabilities
app.use(helmet());
app.use(
    helmet.contentSecurityPolicy({
        directives: {
            "script-src": ["'self'", "'unsafe-eval'"]
        }
    })
);
app.use(helmet.frameguard({ action: 'sameorigin' }));


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

// Manejo de errores de CSRF
app.use((err, req, res, next) => {
    if (err.code === 'EBADCSRFTOKEN') {
        return res.status(403).send('Token CSRF inválido.');
    }
    next(err);
});

// Routes
app.use('/menu', menuRoutes);
app.use('/order', orderRoutes);
app.use('/faq', faqRoutes);

// MongoDB Connection
connectDB();

// Middleware to handle not found resource (404)
app.use((req, res, next) => {
    res.status(404).json({ message: "Recurso no encontrado" });
});

// Middleware global to handle errors 400 y 500
app.use((err, req, res, next) => {
    console.error(err.stack);
    if (err.status === 400) {
        return res.status(400).json({ message: err.message || "Solicitud incorrecta" });
    }
    res.status(500).json({ message: "Error interno del servidor" });
});

export default app;