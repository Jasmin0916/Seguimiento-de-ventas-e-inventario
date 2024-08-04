const axios = require("axios");

module.exports = {
    getProductById: async function(productId, token) {
        try {
            const response = await axios.get(`http://localhost:8080/products/${productId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            return response.data;
        } catch (error) {
            if (error.response && error.response.status === 404) {
                return null;
            } else {
                console.error(`Error fetching product by ID ${productId}:`, error);
                throw new Error('Error al obtener el producto');
            }
        }
    },

    updateProductQuantity: async function(productId, newQuantity, token) {
        try {
            const response = await axios.put(`http://localhost:8080/products/${productId}`, { quantity: newQuantity }, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            return response.data;
        } catch (error) {
            console.error(`Error updating product quantity for ID ${productId}:`, error);
            throw new Error('Error al actualizar la cantidad del producto');
        }
    }
};
