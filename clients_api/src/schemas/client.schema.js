const mongoose = require('mongoose');

const clientSchema = new mongoose.Schema({
  dni: {
    type: String,
    required: true,
    unique: true
  },
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
  phone: {
    type: String,
  }
});

module.exports = { clientSchema };
