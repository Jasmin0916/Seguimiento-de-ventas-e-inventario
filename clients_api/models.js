const mongoose = require('mongoose');
const { clientSchema } = require('./schemas');

const clientModel = mongoose.model('Client', clientSchema);

module.exports = { clientModel };
