import Order from '../models/Order.js';
import Product from '../models/Product.js';


// function to get all orders
const getOrders = async (req, res) => {
    try {
        const orders = await Order.find();
        res.json(orders);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};
// function to get order by id
const getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        res.json(order);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

// Function to create a new order by adding a list of products from the products collection
const createOrder = async (req, res) => {
    const { products: productData, customerName } = req.body;

    // Validate JSON format    
    if (!customerName || !Array.isArray(productData) || productData.length === 0) {
        return res.status(400).json({ message: "El formato de los datos es incorrecto." });
    }

    // Create a map to count quantities by ID    
    const productQuantityMap = {};
    for (const item of productData) {
        if (!item.id || !item.quantity || Number.isNaN(item.quantity)) {
            return res.status(400).json({ message: "Cada producto debe tener un id y una cantidad válida." });
        }

        // Sum quantities for duplicate IDs        
        const productId = item.id;
        const quantity = parseInt(item.quantity); // Convert to number

        if (productQuantityMap[productId]) {
            productQuantityMap[productId] += quantity; // Add quantity
            
        } else {
            productQuantityMap[productId] = quantity; // Initialize quantity            
        }
    }

    try {
        // Extract only unique product IDs        
        const productIds = Object.keys(productQuantityMap);

        // Find products in the database        
        const products = await Product.find({ _id: { $in: productIds } });

        if (products.length !== productIds.length) {
            return res.status(404).json({ message: "Uno o más productos no existen." });
        }

        // Create the list of products with summed quantities        
        const orderProducts = products.map((product) => ({
            product: product._id,
            name: product.name,
            price: product.price,
            quantity: productQuantityMap[product._id.toString()],  // Use the total summed quantity                     
        }));

        // Calculate the total price of the order        
        const total = orderProducts.reduce((sum, item) => sum + item.price * item.quantity, 0);

        // Create new order        
        const order = new Order({
            products: orderProducts,
            customerName,
            total,
            status: "pending", // Initial Status
            createdAt: new Date(),
        });

        // Save the order in the database        
        const newOrder = await order.save();

        // Perform update on status to cancelled after 30 minutes if bill is not paid
        setTimeout(async () => {
            const orderToUpdate = await Order.findById(newOrder._id);
            if (orderToUpdate.status === "pending") {
                orderToUpdate.status = "completed";
                await orderToUpdate.save();
            }
        }, 180000);

        res.status(201).json(newOrder);
    } catch (error) {
        console.error(error);
        res.status(400).json({ message: error.message });
    }
}

// function to update an order, changing products or customer name or quantities
const updateOrder = async (req, res) => {
    const { products: productData, customerName } = req.body;
    // `products` es un array de objetos con { id, quantity }

    // Validate productData type
    if (!Array.isArray(productData) || productData.some(item => typeof item.id !== 'string' || typeof item.quantity !== 'number')) {
        return res.status(400).json({ message: "Invalid product data format." });
    }

    try {
        // Extract only product IDs        
        const productIds = productData.map((item) => item.id);

        // Find products in the database        
        const products = await Product.find({ _id: { $in: productIds } });

        if (products.length !== productData.length) {
            return res.status(404).json({ message: "Uno o más productos no existen." });
        }

        // Create a map to relate ID with quantity        
        const productQuantityMap = productData.reduce((map, item) => {
            map[item.id] = item.quantity;
            return map;
        }, {});

        // Create the list of products with quantities        
        const orderProducts = products.map((product) => ({
            product: product._id,
            name: product.name,
            price: product.price,
            quantity: productQuantityMap[product._id.toString()],
        }));

        // Calculate the total price of the order        
        const total = orderProducts.reduce((sum, item) => {
            const product = products.find((p) => p._id.toString() === item.product.toString());
            return sum + product.price * item.quantity;
        }, 0);

        // Update the order        
        const order = await Order.findByIdAndUpdate(
            req.params.id,
            {
                products: orderProducts,
                customerName,
                total,
                updatedAt: new Date(),
            },
            { new: true }
        );

        res.json(order);
    } catch (error) {
        console.error(error);
        res.status(400).json({ message: error.message });
    }
};

// function to delete an order
const deleteOrder = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (order) {
            await order.deleteOne();
            res.json({ message: "Order removed" });
        } else {
            res.status(404).json({ message: "Order not found" });
        }
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
