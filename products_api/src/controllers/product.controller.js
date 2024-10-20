const productService = require("../services/productService");

const getProduct = async (req, res) => {
    try {
        const products = await productService.getAllProducts();
        res.json(products);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const createProduct = async (req, res) => {
    try {
        const productData = req.body;
        const newProduct = await productService.createProduct(productData);
        res.status(201).json(newProduct);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const getProductById = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await productService.getProductById(id);
        res.json(product);
    } catch (error) {
        res.status(error.message === 'Producto no encontrado' ? 404 : 500).json({ error: error.message });
    }
};

const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const productData = req.body;
        const updatedProduct = await productService.updateProduct(id, productData);
        res.json(updatedProduct);
    } catch (error) {
        res.status(error.message === 'Producto no encontrado' ? 404 : 400).json({ error: error.message });
    }
};

const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await productService.deleteProduct(id);
        res.status(200).json(result);
    } catch (error) {
        res.status(error.message === 'Producto no encontrado' ? 404 : 500).json({ error: error.message });
    }
};

module.exports = { getProduct, createProduct, getProductById, updateProduct, deleteProduct };