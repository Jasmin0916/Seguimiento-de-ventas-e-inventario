const mongoose = require('mongoose');

const saleSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product', 
    required: true
  },
  quantity: {
    type: Number,
    required: true
  },
  clientDni: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now,
    required: true
  }
});

module.exports = { saleSchema };
