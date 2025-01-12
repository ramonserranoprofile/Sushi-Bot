import { describe, it, beforeAll, afterAll, expect } from 'vitest';
import mongoose from 'mongoose';
import Order from '../src/models/Order.js';  // Tu modelo Order
import { setupTestDB, cleanupTestDB } from './testSetupMongo.js';  // Funciones de configuración y limpieza

describe('Order Model', () => {
    beforeAll(async () => {
        // Configurar y conectar a la base de datos en memoria antes de las pruebas
        await setupTestDB();
    });

    afterAll(async () => {
        // Limpiar la base de datos y cerrar la conexión después de las pruebas
        await cleanupTestDB();
    });

    it('should create an order with products', async () => {
        const orderData = {
            customerName: 'John Doe',
            products: [
                {
                    product: new mongoose.Types.ObjectId(),  // Generar un ObjectId válido
                    name: 'Product 1',
                    price: 100,
                    quantity: 2,
                },
            ],
            total: 200,
            status: 'pending',
        };

        // Crear la orden en la base de datos
        const order = new Order(orderData);
        await order.save();

        // Verificar que la orden se haya creado correctamente
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
            // Faltando customerName
        };

        try {
            const order = new Order(invalidOrderData);
            await order.save();
        } catch (error) {
            expect(error).toBeTruthy();
        }
    });
});
