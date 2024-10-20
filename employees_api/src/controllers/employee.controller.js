const employeeService = require("../services/employeeService");

const getEmployee = async (req, res) => {
    try {
        const employees = await employeeService.getAllEmployees();
        res.json(employees);
    } catch (error) {
        console.error('Error fetching employees:', error);
        res.status(500).json({ error: error.message });
    }
};

const createEmployee = async (req, res) => {
    try {
        const { lastName, firstName, dni, phone, address, email, password, role } = req.body;
        const newEmployee = await employeeService.createEmployee({ lastName, firstName, dni, phone, address, email, password, role });
        res.status(201).json(newEmployee);
    } catch (error) {
        console.error('Error creating employee:', error);
        res.status(400).json({ error: error.message });
    }
};

const getEmployeeById = async (req, res) => {
    try {
        const { id } = req.params;
        const employee = await employeeService.getEmployeeById(id);
        res.json(employee);
    } catch (error) {
        console.error('Error fetching employee:', error);
        res.status(404).json({ error: error.message });
    }
};

const updateEmployee = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedEmployee = await employeeService.updateEmployee(id, req.body);
        res.json(updatedEmployee);
    } catch (error) {
        console.error('Error updating employee:', error);
        res.status(400).json({ error: error.message });
    }
};

const deleteEmployee = async (req, res) => {
    try {
        const { id } = req.params;
        await employeeService.deleteEmployee(id);
        res.status(200).json({ message: 'Empleado eliminado correctamente' });
    } catch (error) {
        console.error('Error deleting employee:', error);
        res.status(404).json({ error: error.message });
    }
};

module.exports = { getEmployee, createEmployee, getEmployeeById, updateEmployee, deleteEmployee };
