const { productModel } = require("../models/product.model");

// Listar todos los productos
const getProduct = async (req, res) => {
    try {
        const products = await productModel.find({});
        res.json(products);
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ error: 'Error al obtener los productos' });
    }
};
// Registrar un nuevo producto
const createProduct = async (req, res) => {
    try {
        const { name, salePrice, purchasePrice, quantity, productType } = req.body;

        const newProduct = new productModel({
            name,
            salePrice,
            purchasePrice,
            quantity,
            productType
        });

        const data = await newProduct.save();
        res.status(201).json(data);
    } catch (error) {
        console.error('Error creating product:', error);
        res.status(400).json({ error: 'Error al registrar el producto' });
    }
};
// Obtener un producto por ID
const getProductById = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await productModel.findById(id);
        if (!product) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }
        res.json(product);
    } catch (error) {
        console.error('Error fetching product:', error);
        res.status(500).json({ error: 'Error al obtener el producto' });
    }
};
// Actualizar la cantidad de un producto
const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, salePrice, purchasePrice, quantity, productType } = req.body;

        const product = await productModel.findById(id);
        if (!product) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }

        product.name = name || product.name;
        product.salePrice = salePrice || product.salePrice;
        product.purchasePrice = purchasePrice || product.purchasePrice;
        product.quantity = quantity || product.quantity;
        product.productType = productType || product.productType;

        const updatedProduct = await product.save();
        res.json(updatedProduct);
    } catch (error) {
        console.error('Error updating product:', error);
        res.status(400).json({ error: 'Error al actualizar el producto' });
    }
};
// Eliminar un producto
const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        // Encontrar el producto por ID
        const product = await productModel.findById(id);
        if (!product) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }
        // Eliminar el producto
        await productModel.findByIdAndDelete(id);
        res.status(200).json({ message: 'Producto eliminado correctamente' });
    } catch (error) {
        console.error('Error deleting product:', error);
        res.status(500).json({ error: 'Error al eliminar el producto' });
    }
};

module.exports = { getProduct, createProduct, getProductById, updateProduct, deleteProduct };