const express = require('express');
const cors = require('cors');
const authApp = require('./auth');
const app = express();
const port = 8084;

app.use(express.json());
app.use(cors({
    origin: "*",
    methods: ["POST", "GET"]
}));

// Usa el app de auth.js en el prefijo /api
app.use('/api', authApp);

// Middleware de manejo de errores
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Algo salió mal en el servidor' });
});

app.listen(port, () => {
    console.log(`Servidor de login corriendo en http://localhost:${port}`);
});
