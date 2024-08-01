const mongoose = require('mongoose');
const { saleSchema } = require('./schemas');

const saleModel = mongoose.model('Sale', saleSchema);

module.exports = { saleModel };
