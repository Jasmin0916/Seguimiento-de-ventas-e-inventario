const { employeeModel } = require("../models/employee.model");

const bcrypt = require('bcrypt');

const getEmployee = async (req, res) => {
    try {
        const employees = await employeeModel.find({});
        res.json(employees);
    } catch (error) {
        console.error('Error fetching employees:', error);
        res.status(500).json({ error: 'Error al obtener los empleados' });
    }
};

const createEmployee = async (req, res) => {
    try {
        const { lastName, firstName, dni, phone, address, email, password, role } = req.body;

        if (role && !['employee', 'admin'].includes(role)) {
            return res.status(400).json({ error: 'Rol no válido' });
        }

        const newEmployee = new employeeModel({
            lastName,
            firstName,
            dni,
            phone,
            address,
            email,
            password,
            role: role || 'employee' // Default role if not provided
        });

        const data = await newEmployee.save();
        res.status(201).json(data);
    } catch (error) {
        console.error('Error creating employee:', error);
        res.status(400).json({ error: 'Error al registrar el empleado' });
    }
}; 

const getEmployeeById = async (req, res) => {
    try {
        const { id } = req.params;
        const employee = await employeeModel.findById(id);
        if (!employee) {
            return res.status(404).json({ error: 'Empleado no encontrado' });
        }
        res.json(employee);
    } catch (error) {
        console.error('Error fetching employee:', error);
        res.status(500).json({ error: 'Error al obtener el empleado' });
    }
}
const uptateEmployee = async (req, res) => {
    try {
        const { id } = req.params;
        const { lastName, firstName, phone, address, email, role } = req.body;

        const employee = await employeeModel.findById(id);
        if (!employee) {
            return res.status(404).json({ error: 'Empleado no encontrado' });
        }

        if (role && !['employee', 'admin'].includes(role)) {
            return res.status(400).json({ error: 'Rol no válido' });
        }

        employee.lastName = lastName || employee.lastName;
        employee.firstName = firstName || employee.firstName;
        employee.phone = phone || employee.phone;
        employee.address = address || employee.address;
        employee.email = email || employee.email;
        employee.role = role || employee.role;

        if (req.body.password) {
            employee.password = await bcrypt.hash(req.body.password, 10);
        }

        const updatedEmployee = await employee.save();
        res.json(updatedEmployee);
    } catch (error) {
        console.error('Error updating employee:', error);
        res.status(400).json({ error: 'Error al actualizar el empleado' });
    }
};

const deleteEmployee = async (req, res) => {
    try {
        const { id } = req.params;

        const employee = await employeeModel.findById(id);
        if (!employee) {
            return res.status(404).json({ error: 'Empleado no encontrado' });
        }

        await employeeModel.findByIdAndDelete(id);
        res.status(200).json({ message: 'Empleado eliminado correctamente' });
    } catch (error) {
        console.error('Error deleting employee:', error);
        res.status(500).json({ error: 'Error al eliminar el empleado' });
    }
};

module.exports = { getEmployee, createEmployee, getEmployeeById, uptateEmployee, deleteEmployee };