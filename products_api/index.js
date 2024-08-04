const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const ProductRoute = require('./src/routers/product.router');
const port = process.env.PORT || 8080;

// Conectar a MongoDB
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
    methods: ["GET", "POST", "PUT", "DELETE"]
}));

app.use(ProductRoute)

app.listen(port, () => {
    console.log(`Servidor corriendo en ${port}`);
});
