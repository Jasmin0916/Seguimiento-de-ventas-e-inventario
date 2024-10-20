const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const port = process.env.PORT || 8082;

const ClientRouter = require('./src/routers/client.router');

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

app.use(ClientRouter) 

app.listen(port, () => {
    console.log(`Servidor corriendo en ${port}`);
});
