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

    // Validar el formato del JSON
    if (!customerName || !Array.isArray(productData) || productData.length === 0) {
        return res.status(400).json({ message: "El formato de los datos es incorrecto." });
    }

    // Crear un mapa para contar las cantidades por ID
    const productQuantityMap = {};
    for (const item of productData) {
        if (!item.id || !item.quantity || isNaN(item.quantity)) {
            return res.status(400).json({ message: "Cada producto debe tener un id y una cantidad válida." });
        }

        // Sumar las cantidades para IDs duplicados
        const productId = item.id;
        const quantity = parseInt(item.quantity); // Convertir a número

        if (productQuantityMap[productId]) {
            productQuantityMap[productId] += quantity; // Sumar cantidad
        } else {
            productQuantityMap[productId] = quantity; // Inicializar cantidad
        }
    }

    try {
        // Extraer solo los IDs únicos de los productos
        const productIds = Object.keys(productQuantityMap);

        // Buscar los productos en la base de datos
        const products = await Product.find({ _id: { $in: productIds } });

        if (products.length !== productIds.length) {
            return res.status(404).json({ message: "Uno o más productos no existen." });
        }

        // Crear la lista de productos con cantidades sumadas
        const orderProducts = products.map((product) => ({
            product: product._id,
            name: product.name,
            price: product.price,
            quantity: productQuantityMap[product._id.toString()], // Usar la cantidad total sumada
        }));

        // Calcular el precio total de la orden
        const total = orderProducts.reduce((sum, item) => sum + item.price * item.quantity, 0);

        // Crear la nueva orden
        const order = new Order({
            products: orderProducts,
            customerName,
            total,
            status: "pending", // Estado inicial
            createdAt: new Date(),
        });

        // Guardar la orden en la base de datos
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

    try {
        // Extraer solo los IDs de los productos
        const productIds = productData.map((item) => item.id);

        // Buscar los productos en la base de datos
        const products = await Product.find({ _id: { $in: productIds } });

        if (products.length !== productData.length) {
            return res.status(404).json({ message: "Uno o más productos no existen." });
        }

        // Crear un mapa para relacionar ID con cantidad
        const productQuantityMap = productData.reduce((map, item) => {
            map[item.id] = item.quantity;
            return map;
        }, {});

        // Crear la lista de productos con cantidades
        const orderProducts = products.map((product) => ({
            product: product._id,
            name: product.name,
            price: product.price,
            quantity: productQuantityMap[product._id.toString()],
        }));

        // Calcular el precio total de la orden
        const total = orderProducts.reduce((sum, item) => {
            const product = products.find((p) => p._id.toString() === item.product.toString());
            return sum + product.price * item.quantity;
        }, 0);

        // Actualizar la orden
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
