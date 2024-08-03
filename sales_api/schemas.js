const mongoose = require('mongoose');

const saleSchema = new mongoose.Schema({
  receiptId: {
    type: String,
    required: true,
    unique: true
  },
  products: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
      },
      quantity: {
        type: Number,
        required: true
      },
      name: {
        type: String,
        required: true
      },
      salePrice: {
        type: Number,
        required: true
      },
      subtotal: {
        type: Number,
        required: true
      }
    }
  ],
  clientDni: {
    type: String,
    required: true
  },
  total: {
    type: Number,
    required: true
  },
  date: {
    type: Date,
    default: Date.now,
    required: true
  },
  employee: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Employee'
    },
    name: String
  }
});

module.exports = { saleSchema };
