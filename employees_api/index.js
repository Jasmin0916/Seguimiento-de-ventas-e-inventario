const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { employeesModel } = require('./models');
const port = 8081;

const uri = "mongodb+srv://nodeJS:NodeJS4321@cluster0.wr9ipqk.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

mongoose.connect(uri).then(() => {
    console.log('Connected to MongoDB Atlas');
}).catch((err) => {
    console.error('Error connecting to MongoDB Atlas', err);
    process.exit(1); // Termina el proceso si no se puede conectar a MongoDB
});

const app = express();

app.use(express.json());
app.use(cors({
    origin: "*",
    methods: ["POST", "GET"]
}));

app.get('/', (req, res) => {
    res.send("I am alive EmployeesAPI");
});

// Listar todos los empleados
app.get('/employees', async (req, res) => {
    try {
        const employees = await employeesModel.find({});
        res.json(employees);
    } catch (error) {
        console.error('Error fetching employees:', error);
        res.status(500).json({ error: 'Error al obtener los empleados' });
    }
});

// Ruta para registrar un nuevo empleado
app.post('/employees', async (req, res) => {
    try {
        const { lastName, middleName, firstNames, dni, phone, address, email } = req.body;
        const newEmployee = new employeesModel({
            lastName,
            middleName,
            firstNames,
            dni,
            phone,
            address,
            email
        });

        const data = await newEmployee.save();
        res.status(201).json(data);
    } catch (error) {
        console.error('Error creating employee:', error);
        res.status(400).json({ error: 'Error al registrar el empleado' });
    }
});

app.listen(port, () => {
    console.log(`Servidor corriendo en ${port}`);
});
