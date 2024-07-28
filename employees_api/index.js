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
    methods: ["POST"]
}));

app.get('/', (req, res) => {
    res.send("I am alive EmployeesAPI");
});

app.get('/employees', async (req, res) => {
    try {
        const employees = await employeesModel.find({});
        res.json(employees);
    } catch (error) {
        res.status(500).send(error);
    }
});

// Ruta para registrar un nuevo empleado
app.post('/employees', async (req, res) => {
    try {
        console.log("above", req.body);
        const { lastName, middleName, firstNames, dni, phone, address, email } = req.body;
        console.log("below", req.body);
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
        return res.status(201).json(data);
    } catch (error) {
        res.status(400).send(error);
        console.log(error);
    }
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
