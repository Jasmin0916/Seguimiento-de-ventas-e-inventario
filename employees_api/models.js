const mongoose = require('mongoose');
const { employeeSchema } = require('./schemas');

const employeesModel = mongoose.model('Employee', employeeSchema);

module.exports = { employeesModel };
