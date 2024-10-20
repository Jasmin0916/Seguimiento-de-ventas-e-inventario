const express = require('express');
const cors = require('cors');
const authRouter = require('./src/router/auth.router');
const mongoose = require("mongoose");
require('dotenv').config();
const app = express();
const port = process.env.PORT || 8080;

// Conectar a MongoDB
const uri = process.env.MONGO_URI;

mongoose.connect(uri).then(() => {
    console.log('Connected to MongoDB Atlas');
}).catch((err) => {
    console.error('Error connecting to MongoDB Atlas', err);
    process.exit(1);
});


app.use(express.json()); 
app.use(cors({
    origin: "*",
    methods: ["POST"]
}));

// Usa el app de auth.js en el prefijo /api
app.use('/api', authRouter);

app.listen(port, () => {
    console.log(`Servidor de login corriendo en ${port}`);
});
