const mongoose = require('mongoose');
const {employeeSchema} = require('../schemas/employee.schema');

const employeesModel = mongoose.model('Employee', employeeSchema);

module.exports = {employeesModel};
 