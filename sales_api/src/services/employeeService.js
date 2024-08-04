const axios = require('axios');

const getEmployeeById = async (employeeId, token) => {
    try {
        const response = await axios.get(`http://localhost:8081/employees/${employeeId}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error(`Error fetching employee: ${error}`);
        throw error;
    }
};

module.exports = { getEmployeeById };
