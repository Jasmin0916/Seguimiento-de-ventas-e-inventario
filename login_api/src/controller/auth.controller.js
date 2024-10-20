const {employeesModel} = require("../models/employee.model");
const jwt = require("jsonwebtoken");

const login = async (req, res) => {
    try {
        const {email, password} = req.body;
        const employee = await employeesModel.findOne({email});

        if (!employee || !(await employee.comparePassword(password))) {
            return res.status(401).json({error: 'Credenciales inválidas'});
        }

        // Generar un token JWT
        const token = jwt.sign(
            {id: employee._id, role: employee.role}, 
            process.env.JWT_SECRET
        );

        res.json({token});
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({error: 'Error al iniciar sesión'});
    }
};

module.exports = {login}; 