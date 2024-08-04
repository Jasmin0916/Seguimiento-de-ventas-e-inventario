const axios = require("axios");

module.exports = {
    getClientByDni: async function(dni, token) {
        try {
            const response = await axios.get(`http://localhost:8082/clients/${dni}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            return response.data;
        } catch (error) {
            if (error.response && error.response.status === 404) {
                return null;
            } else {
                console.error(`Error fetching client by DNI ${dni}:`, error);
                throw new Error('Error al obtener el cliente');
            }
        }
    }
};
