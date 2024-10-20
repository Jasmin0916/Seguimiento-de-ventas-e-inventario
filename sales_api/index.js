const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const SaleRouter = require('./src/routers/sale.router');
const port = process.env.PORT || 8083;

// Conectar a MongoDB
const uri = process.env.MONGO_URI;

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
    methods: ["GET", "POST", "PUT", "DELETE"]
}));

app.use(SaleRouter)

app.listen(port, () => {
    console.log(`Servidor corriendo en ${port}`);
});
