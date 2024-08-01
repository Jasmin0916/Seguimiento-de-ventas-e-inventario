const axios = require("axios");

module.exports = {
    getClientByDni: async function(dni) {
        try {
            const response = await axios.get(`http://localhost:8082/clients/${dni}`);
            return response.data;
        } catch (error) {
            if (error.response && error.response.status === 404) {
                // Cliente no encontrado
                return null;
            } else {
                console.error(`Error fetching client by DNI ${dni}:`, error);
                throw new Error('Error al obtener el cliente');
            }
        }
    },

    createClient: async function(clientData) {
        try {
            const response = await axios.post("http://localhost:8082/clients", clientData);
            return response.data;
        } catch (error) {
            console.error('Error creating client:', error);
            throw new Error('Error al registrar el cliente');
        }
    }
};
