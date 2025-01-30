import Order from './order.model.js'
import Product from  '../menu/menu.model.js'


// Service to get all orders
const getAllOrders = async () => {
    try {
        return await Order.find();
    } catch (error) {
        throw new Error(error.message);
    }
};

// Service to get order by id
const getOrderById = async (id) => {
    try {
        return await Order.findById(id);
    } catch (error) {
        throw new Error(error.message);
    }
};

// Service to create a new order
const createNewOrder = async (productData, customerName) => {
    if (!customerName || !Array.isArray(productData) || productData.length === 0) {
        throw new Error("El formato de los datos es incorrecto.");
    }

    const productQuantityMap = {};
    for (const item of productData) {
        if (!item.id || !item.quantity || Number.isNaN(item.quantity)) {
            throw new Error("Cada producto debe tener un id y una cantidad válida.");
        }

        const productId = item.id;
        const quantity = parseInt(item.quantity);
        productQuantityMap[productId] = (productQuantityMap[productId] || 0) + quantity;
    }

    const productIds = Object.keys(productQuantityMap);
    const products = await Product.find({ _id: { $in: productIds } });

    if (products.length !== productIds.length) {
        throw new Error("Uno o más productos no existen.");
    }

    const orderProducts = products.map((product) => ({
        product: product._id,
        name: product.name,
        price: product.price,
        quantity: productQuantityMap[product._id.toString()],
    }));

    const total = orderProducts.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const order = new Order({
        products: orderProducts,
        customerName,
        total,
        status: "pending",
        createdAt: new Date(),
    });

    const newOrder = await order.save();

    setTimeout(async () => {
        const orderToUpdate = await Order.findById(newOrder._id);
        if (orderToUpdate.status === "pending") {
            orderToUpdate.status = "completed";
            await orderToUpdate.save();
        }
    }, 180000);

    return newOrder;
};

// Service to update an order
const updateExistingOrder = async (id, productData, customerName) => {
    if (!Array.isArray(productData) || productData.some(item => typeof item.id !== 'string' || typeof item.quantity !== 'number')) {
        throw new Error("Invalid product data format.");
    }

    const productIds = productData.map((item) => item.id);
    const products = await Product.find({ _id: { $in: productIds } });

    if (products.length !== productData.length) {
        throw new Error("Uno o más productos no existen.");
    }

    const productQuantityMap = productData.reduce((map, item) => {
        map[item.id] = item.quantity;
        return map;
    }, {});

    const orderProducts = products.map((product) => ({
        product: product._id,
        name: product.name,
        price: product.price,
        quantity: productQuantityMap[product._id.toString()],
    }));

    const total = orderProducts.reduce((sum, item) => {
        const product = products.find((p) => p._id.toString() === item.product.toString());
        return sum + product.price * item.quantity;
    }, 0);

    return await Order.findByIdAndUpdate(
        id,
        {
            products: orderProducts,
            customerName,
            total,
            updatedAt: new Date(),
        },
        { new: true }
    );
};

// Service to delete an order
const deleteOrderById = async (id) => {
    try {
        const order = await Order.findById(id);
        if (order) {
            await order.deleteOne();
            return { message: "Order removed" };
        } else {
            throw new Error("Order not found");
        }
    } catch (error) {
        throw new Error(error.message);
    }
};

export const orderService = {
    getAllOrders,
    getOrderById,
    createNewOrder,
    updateExistingOrder,
    deleteOrderById
};
