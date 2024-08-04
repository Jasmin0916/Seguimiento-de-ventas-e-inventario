const express = require('express');
const cors = require('cors');
const authRouter = require('./src/router/auth.router');
const mongoose = require("mongoose");
const app = express();
const port = 8084;


// Conectar a MongoDB
const uri = "mongodb+srv://nodeJS:NodeJS4321@cluster0.wr9ipqk.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

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
