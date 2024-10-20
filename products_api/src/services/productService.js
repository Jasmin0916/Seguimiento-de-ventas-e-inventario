const { productModel } = require("../models/product.model");

class ProductService {
    async getAllProducts() {
        try {
            return await productModel.find({});
        } catch (error) {
            console.error("Error fetching products:", error);
            throw new Error("Error al obtener los productos");
        }
    }

    async createProduct(productData) {
        try {
            const newProduct = new productModel(productData);
            return await newProduct.save();
        } catch (error) {
            console.error("Error creating product:", error);
            throw new Error("Error al registrar el producto");
        }
    }

    async getProductById(id) {
        try {
            const product = await productModel.findById(id);
            if (!product) {
                throw new Error("Producto no encontrado");
            }
            return product;
        } catch (error) {
            console.error("Error fetching product:", error);
            throw error;
        }
    }

    async updateProduct(id, productData) {
        try {
            const product = await productModel.findById(id);
            if (!product) {
                throw new Error("Producto no encontrado");
            }

            Object.assign(product, productData);
            return await product.save();
        } catch (error) {
            console.error("Error updating product:", error);
            throw new Error("Error al actualizar el producto");
        }
    }

    async deleteProduct(id) {
        try {
            const product = await productModel.findById(id);
            if (!product) {
                throw new Error("Producto no encontrado");
            }

            await productModel.findByIdAndDelete(id);
            return { message: "Producto eliminado correctamente" };
        } catch (error) {
            console.error("Error deleting product:", error);
            throw new Error("Error al eliminar el producto");
        }
    }
    
    async reduceProductQuantity(productId, quantity) {
        try {
            const product = await productModel.findById(productId);
            if (!product) {
                throw new Error("Producto no encontrado");
            }

            // Verificar si hay suficiente cantidad disponible
            if (product.quantity < quantity) {
                throw new Error("Cantidad insuficiente en inventario");
            }

            product.quantity -= quantity;
            return await product.save();
        } catch (error) {
            console.error("Error reducing product quantity:", error);
            throw error;
        }
    }
}

module.exports = new ProductService();
