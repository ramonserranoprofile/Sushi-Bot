import { describe, it, beforeAll, afterAll, expect } from 'vitest';
import mongoose from 'mongoose';
import Order from '../src/models/Order.js';  // Tu modelo Order
import { setupTestDB, cleanupTestDB } from './testSetupMongo.js';  // Setup and cleanup functions

describe('Order Model', () => {
    beforeAll(async () => {
        // Set up and connect to the in-memory database before tests        
        await setupTestDB();
    });

    afterAll(async () => {
        // Clean up the database and close the connection after tests        
        await cleanupTestDB();
    });

    it('should create an order with products', async () => {
        const orderData = {
            customerName: 'John Doe',
            products: [
                {
                    product: new mongoose.Types.ObjectId(),  // Generate a valid ObjectId
                    name: 'Product 1',
                    price: 100,
                    quantity: 2,
                },
            ],
            total: 200,
            status: 'pending',
        };

        // Create order in database
        const order = new Order(orderData);
        await order.save();

        // Verify order is created successfully
        const savedOrder = await Order.findById(order._id).exec();
        expect(savedOrder).not.toBeNull();
        expect(savedOrder.customerName).toBe('John Doe');
        expect(savedOrder.products.length).toBe(1);
        expect(savedOrder.products[0].name).toBe('Product 1');
        expect(savedOrder.total).toBe(200);
        expect(savedOrder.status).toBe('pending');
    });

    it('should fail to create an order with missing required fields', async () => {
        const invalidOrderData = {
            products: [
                {
                    product: new mongoose.Types.ObjectId(),
                    name: 'Product 2',
                    price: 50,
                    quantity: 1,
                },
            ],
            total: 50,
            // Failing customerName here
        };

        try {
            const order = new Order(invalidOrderData);
            await order.save();
        } catch (error) {
            expect(error).toBeTruthy();
        }
    });
});
