const { employeesModel } = require("../models/employee.model");
const jwt = require("jsonwebtoken");

class EmployeeAuthService {
    async login(email, password) {
        try {
            const employee = await employeesModel.findOne({ email });
            if (!employee || !(await employee.comparePassword(password))) {
                throw new Error('Credenciales inválidas');
            }

            // Generar un token JWT
            const token = jwt.sign({ id: employee._id, role: employee.role }, 'secret_key'/*, { expiresIn: '1h' }*/);
            return token;
        } catch (error) {
            throw new Error('Error al iniciar sesión: ' + error.message);
        }
    }
}

module.exports = new EmployeeAuthService();
