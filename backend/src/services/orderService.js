import Order from '../models/Order.js';

// Function to update order state
const updateOrderStatus = async (id, status) => {
    const order = await Order.findByIdAndUpdate(id, status, { new: 'cancelled' });
    if (!order) {
        throw new Error(`Order with ID ${id} not found`);
    }
    return order;
};

export default updateOrderStatus;