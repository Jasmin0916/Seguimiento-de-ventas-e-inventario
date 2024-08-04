const mongoose = require('mongoose');
const { clientSchema } = require('../schemas/client.schema');

const clientModel = mongoose.model('Client', clientSchema);

module.exports = { clientModel };
