const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const employeeSchema = new mongoose.Schema({
    lastName: {
        type: String,
        required: true,
    },
    firstName: {
        type: String,
        required: true,
    },
    dni: {
        type: String,
        required: true,
        unique: true,
    },
    phone: {
        type: String,
    },
    address: {
        type: String,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['employee', 'admin'],
        default: 'employee'
    },
});

// Encriptar la contraseña antes de guardar el empleado
employeeSchema.pre('save', async function (next) {
    if (this.isModified('password') || this.isNew) {
        this.password = await bcrypt.hash(this.password, 10);
    }
    next();
});

// Método para comparar contraseñas
employeeSchema.methods.comparePassword = function (candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};

module.exports = {employeeSchema};