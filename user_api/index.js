const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { userModel } = require('./models');
const port = 8082;

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
    res.send("I am alive Producto");
});

// Listar todos los productos
app.get('/user', async (req, res) => {
    try {
        const users = await userModel.find({});
        res.json(users);
    } catch (error) {
        res.status(500).send(error);
    }
});

// Registrar un nuevo producto
app.post('/user', async (req, res) => {
    try {
        const { name, salePrice, purchasePrice, quantity, productType } = req.body;

        const newUser = new userModel({
            name,
            salePrice,
            purchasePrice,
            quantity,
            productType
        });

        const data = await newUser.save();
        res.status(201).send(data);
    } catch (error) {
        res.status(400).send(error);
    }
});

app.listen(port, () => {
    console.log(`Servidor corriendo en ${port}`);
});
