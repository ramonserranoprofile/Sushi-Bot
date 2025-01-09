import Product from '../models/Product.js';

// Add new product to the menu
const addProduct = async (req, res) => {
    const { name, price, description } = req.body;

    try {
        const newProduct = new Product({ name, price, description });
        await newProduct.save();
        res.status(201).json({ message: 'Producto created successfully', product: newProduct });
    } catch (error) {
        res.status(500).json({ message: 'Error to create product, try again later', error });
    }
};

// function to get all menu items
const getMenu = async (req, res) => {
    try {
        const menu = await Product.find();
        res.json(menu);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

// update Product in the menu
const updateProduct = async (req, res) => {
    const { id } = req.params;
    const { name, price, description } = req.body;

    try {
        const updatedProduct = await Product.findByIdAndUpdate(id, { name, price, description }, { new: true });
        res.status(200).json({ message: 'Product updated successfully', product: updatedProduct });
    } catch (error) {
        res.status(500).json({ message: 'Error to update product, please try again later', error });
    }
};

// delete Product from the menu
const deleteProduct = async (req, res) => {
    const { id } = req.params;

    try {
        await Product.findByIdAndDelete(id);
        res.status(200).json({ message: 'Product deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error to delete product, please try again later', error });
    }
};

// function to get menu item by id
const getMenuProductById = async (req, res) => {
    try {
        const menu = await Product.findById(req.params.id);
        res.json(menu);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

// function to get menu item by name and any word in the name
const getMenuProductByName = async (req, res) => {
    try {
        const menu = await Product.find({ name: { $regex: req.params.name, $options: 'i' } });
        res.json(menu);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

// function to get menu item by category with autocompletion feature
const getMenuByCategory = async (req, res) => {
    try {
        const menu2 = await Product.find({ category: { $regex: req.params.category, $options: 'i' } });
        res.json(menu2);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

export const menuController = {
    getMenu,
    addProduct,
    updateProduct,
    deleteProduct,
    getMenuProductById,
    getMenuProductByName,
    getMenuByCategory
};