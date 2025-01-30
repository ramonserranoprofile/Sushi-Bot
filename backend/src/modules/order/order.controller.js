import { orderService } from './order.service.js';

// Controller to get all orders
const getOrders = async (req, res) => {
    try {
        const orders = await orderService.getAllOrders();
        res.json(orders);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

// Controller to get order by id
const getOrderById = async (req, res) => {
    try {
        const order = await orderService.getOrderById(req.params.id);
        res.json(order);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

// Controller to create a new order
const createOrder = async (req, res) => {
    const { products, customerName } = req.body;

    try {
        const newOrder = await orderService.createNewOrder(products, customerName);
        res.status(201).json(newOrder);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Controller to update an existing order
const updateOrder = async (req, res) => {
    const { products, customerName } = req.body;

    try {
        const updatedOrder = await orderService.updateExistingOrder(req.params.id, products, customerName);
        res.json(updatedOrder);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Controller to delete an order
const deleteOrder = async (req, res) => {
    try {
        const response = await orderService.deleteOrderById(req.params.id);
        res.json(response);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

export const orderController = {
    getOrders,
    getOrderById,
    createOrder,
    updateOrder,
    deleteOrder
};
