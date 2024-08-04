const mongoose = require('mongoose');
const { saleSchema } = require('../schemas/sale.schema');

const saleModel = mongoose.model('Sale', saleSchema);

module.exports = { saleModel };
