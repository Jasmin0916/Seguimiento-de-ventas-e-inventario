const mongoose = require('mongoose');
const { employeeSchema } = require('./schemas');

const employeeModel = mongoose.model('Employee', employeeSchema);

module.exports = { employeeModel };
