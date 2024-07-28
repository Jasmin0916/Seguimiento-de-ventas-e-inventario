const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
  lastName: {
    type: String,
    required: true,
  },
  middleName: {
    type: String,
    required: true,
  },
  firstNames: {
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
    required: true,
  },
  address: {
    type: String,
  },
  email: {
    type: String,
  }
});

module.exports = { employeeSchema };
