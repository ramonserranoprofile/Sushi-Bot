import express from 'express';
import { orderController } from '../controllers/orderController.js';

const orderRouter = express.Router();

orderRouter.get('/', orderController.getOrders);
orderRouter.get('/:id', orderController.getOrderById);
orderRouter.post('/', orderController.createOrder);
orderRouter.put('/:id', orderController.updateOrder);
orderRouter.delete('/:id', orderController.deleteOrder);
export default orderRouter;
