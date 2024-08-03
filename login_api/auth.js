const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { employeeModel } = require('../employees_api/models');
const app = express();
app.use(express.json());

// Ruta para iniciar sesión
app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log('Email:', email);
        const employee = await employeeModel.findOne({ email });
        console.log('Employee:', employee);

        if (!employee || !(await employee.comparePassword(password))) {
            return res.status(401).json({ error: 'Credenciales inválidas' });
        }

        // Generar un token JWT
        const token = jwt.sign({ id: employee._id, role: employee.role }, 'secret_key', { expiresIn: '1h' });

        res.json({ token });
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ error: 'Error al iniciar sesión' });
    }
});

module.exports = app;
