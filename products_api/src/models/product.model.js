const mongoose = require('mongoose');
const { productSchema } = require('../schemas/product.schema');

const productModel = mongoose.model('Product', productSchema);

module.exports = { productModel };
 