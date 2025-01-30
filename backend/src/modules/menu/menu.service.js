import Product from './menu.model.js';

// Add new product to the menu
export const addProductService = async (productData) => {
    const newProduct = new Product(productData);
    return await newProduct.save();
};

// Get all menu items
export const getMenuService = async () => {
    return await Product.find();
};

// Update product in the menu
export const updateProductService = async (id, updatedData) => {
    return await Product.findByIdAndUpdate(id, updatedData, { new: true });
};

// Delete product from the menu
export const deleteProductService = async (id) => {
    return await Product.findByIdAndDelete(id);
};

// Get menu item by ID
export const getMenuProductByIdService = async (id) => {
    return await Product.findById(id);
};

// Get menu items by name
export const getMenuProductByNameService = async (name) => {
    return await Product.find({ name: { $regex: name, $options: 'i' } });
};

// Get menu items by category
export const getMenuProductByCategoryService = async (category) => {
    return await Product.find({ category: { $regex: category, $options: 'i' } });
};
