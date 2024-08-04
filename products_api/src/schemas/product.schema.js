const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  salePrice: {
    type: Number,
    required: true,
  },
  purchasePrice: {
    type: Number,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  productType: {
    type: String,
    enum: ['Dispositivos periféricos', 'Repuesto de laptops y computadoras', 'Repuesto de impresoras'],
    required: true,
  }
});

module.exports = { productSchema };
