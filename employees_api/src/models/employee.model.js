const mongoose = require('mongoose');
const {employeeSchema} = require('../schemas/employee.schema');

const employeeModel = mongoose.model('Employee', employeeSchema);

module.exports = {employeeModel};
 