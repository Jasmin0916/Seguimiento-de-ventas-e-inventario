const axios = require("axios");

module.exports = {
    getProductById: async function(productId) {
        try {
            const response = await axios.get(`http://localhost:8080/products/${productId}`);
            return response.data;
        } catch (error) {
            if (error.response && error.response.status === 404) {
                // Producto no encontrado
                return null;
            } else {
                console.error(`Error fetching product by ID ${productId}:`, error);
                throw new Error('Error al obtener el producto');
            }
        }
    },

    updateProductQuantity: async function(productId, newQuantity) {
        try {
            const response = await axios.put(`http://localhost:8080/products/${productId}`, { quantity: newQuantity });
            return response.data;
        } catch (error) {
            console.error(`Error updating product quantity for ID ${productId}:`, error);
            throw new Error('Error al actualizar la cantidad del producto');
        }
    }
};
