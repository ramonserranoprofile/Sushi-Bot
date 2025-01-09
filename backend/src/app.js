// Import the required modules
import express from 'express';
import cookieParser from 'cookie-parser';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import menuRoutes from './routes/menuRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import faqRoutes from './routes/faqRoutes.js';
import cors from 'cors';

 
// Load the environment variables from the .env file
dotenv.config();


// Create an instance of the Express application
const app = express();

app.use(cors());

// Disable X-Powered-By header
// disable cors
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});
//app.disable('x-powered-by');
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
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB connected successfully');
    } catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1);
    }
};

connectDB();

export default app;