const { employeeModel } = require("../models/employee.model");
const bcrypt = require('bcrypt');

class EmployeeService {
    async getAllEmployees() {
        try {
            return await employeeModel.find({});
        } catch (error) {
            throw new Error('Error al obtener los empleados: ' + error.message);
        }
    }

    async createEmployee({ lastName, firstName, dni, phone, address, email, password, role }) {
        try {
            if (role && !['employee', 'admin'].includes(role)) {
                throw new Error('Rol no válido');
            }

            const newEmployee = new employeeModel({
                lastName,
                firstName,
                dni,
                phone,
                address,
                email,
                password: await bcrypt.hash(password, 10), // Hash password before saving
                role: role || 'employee' // Default role if not provided
            });

            return await newEmployee.save();
        } catch (error) {
            throw new Error('Error al registrar el empleado: ' + error.message);
        }
    }

    async getEmployeeById(id) {
        try {
            const employee = await employeeModel.findById(id);
            if (!employee) {
                throw new Error('Empleado no encontrado');
            }
            return employee;
        } catch (error) {
            throw new Error('Error al obtener el empleado: ' + error.message);
        }
    }

    async updateEmployee(id, updateData) {
        try {
            const employee = await employeeModel.findById(id);
            if (!employee) {
                throw new Error('Empleado no encontrado');
            }

            if (updateData.role && !['employee', 'admin'].includes(updateData.role)) {
                throw new Error('Rol no válido');
            }

            Object.assign(employee, updateData);

            if (updateData.password) {
                employee.password = await bcrypt.hash(updateData.password, 10);
            }

            return await employee.save();
        } catch (error) {
            throw new Error('Error al actualizar el empleado: ' + error.message);
        }
    }

    async deleteEmployee(id) {
        try {
            const employee = await employeeModel.findById(id);
            if (!employee) {
                throw new Error('Empleado no encontrado');
            }

            await employeeModel.findByIdAndDelete(id);
        } catch (error) {
            throw new Error('Error al eliminar el empleado: ' + error.message);
        }
    }
}

module.exports = new EmployeeService();
