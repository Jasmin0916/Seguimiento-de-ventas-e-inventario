const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { employeeModel } = require('./models');
const { authenticateToken, verifyRole } = require('../login_api/authMiddleware'); // Importa los middlewares
const port = 8081;

// Conectar a MongoDB
const uri = "mongodb+srv://nodeJS:NodeJS4321@cluster0.wr9ipqk.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

mongoose.connect(uri).then(() => {
    console.log('Connected to MongoDB Atlas');
}).catch((err) => {
    console.error('Error connecting to MongoDB Atlas', err);
    process.exit(1);
});

const app = express();
app.use(express.json());
app.use(cors({
    origin: "*",
    methods: ["POST", "GET", "PUT", "DELETE"]
}));

app.get('/', (req, res) => {
    res.send("I am alive EmployeesAPI");
});

// Listar todos los empleados
app.get('/employees', /*authenticateToken, verifyRole('admin'),*/ async (req, res) => {
    try {
        const employees = await employeeModel.find({});
        res.json(employees);
    } catch (error) {
        console.error('Error fetching employees:', error);
        res.status(500).json({ error: 'Error al obtener los empleados' });
    }
});

// Registrar un nuevo empleado (solo admin puede hacerlo)
app.post('/employees', /*authenticateToken, verifyRole('admin'),*/ async (req, res) => {
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
});

// Actualizar un empleado (solo admin puede hacerlo)
app.put('/employees/:id', /*authenticateToken, verifyRole('admin'),*/ async (req, res) => {
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
});

// Eliminar un empleado (solo admin puede hacerlo)
app.delete('/employees/:id', authenticateToken, verifyRole('admin'), async (req, res) => {
    try {
        const { id } = req.params;

        const employee = await employeeModel.findById(id);
        if (!employee) {
            return res.status(404).json({ error: 'Empleado no encontrado' });
        }

        await employeeModel.findByIdAndDelete(id);
        res.status(204).send();
    } catch (error) {
        console.error('Error deleting employee:', error);
        res.status(500).json({ error: 'Error al eliminar el empleado' });
    }
});

app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});
