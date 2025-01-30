import {
    addProductService,
    getMenuService,
    updateProductService,
    deleteProductService,
    getMenuProductByIdService,
    getMenuProductByNameService,
    getMenuProductByCategoryService,
} from './menu.service.js';

// Add new product to the menu
export const addProduct = async (req, res) => {
    const { name, price, category } = req.body;

    try {
        const newProduct = await addProductService({ name, price, category });
        res.status(201).json({ message: 'Product created successfully', product: newProduct });
    } catch (error) {
        res.status(500).json({ message: 'Error to create product, try again later', error });
    }
};

// Get all menu items
export const getMenu = async (req, res) => {
    try {
        const menu = await getMenuService();
        res.json(menu);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

// Update product in the menu
export const updateProduct = async (req, res) => {
    const { id } = req.params;
    const { name, price, category } = req.body;

    try {
        const updatedProduct = await updateProductService(id, { name, price, category });
        res.status(200).json({ message: 'Product updated successfully', product: updatedProduct });
    } catch (error) {
        res.status(500).json({ message: 'Error to update product, please try again later', error });
    }
};

// Delete product from the menu
export const deleteProduct = async (req, res) => {
    const { id } = req.params;

    try {
        await deleteProductService(id);
        res.status(200).json({ message: 'Product deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error to delete product, please try again later', error });
    }
};

// Get menu item by ID
export const getMenuProductById = async (req, res) => {
    try {
        const menu = await getMenuProductByIdService(req.params.id);
        res.json(menu);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

// Get menu items by name
export const getMenuProductByName = async (req, res) => {
    try {
        const menu = await getMenuProductByNameService(req.params.name);
        res.json(menu);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

// Get menu items by category
export const getMenuProductByCategory = async (req, res) => {
    try {
        const menu = await getMenuProductByCategoryService(req.params.category);
        res.json(menu);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};
export const menuController = {
    addProduct,
    getMenu,
    updateProduct,
    deleteProduct,
    getMenuProductById,
    getMenuProductByName,
    getMenuProductByCategory,
}