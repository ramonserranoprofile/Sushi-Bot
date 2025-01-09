// sushi_bot_backend/services/orderService.js

import Order from '../models/Order.js';

// Función para actualizar el estado de un pedido
const updateOrderStatus = async (id, status) => {
    const order = await Order.findByIdAndUpdate(id, status, { new: 'cancelled' });
    if (!order) {
        throw new Error(`Order with ID ${id} not found`);
    }
    return order;
};

export default updateOrderStatus;