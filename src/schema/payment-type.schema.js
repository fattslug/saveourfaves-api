'use strict';

const mongoose = require('mongoose');

let paymentTypeSchema = new mongoose.Schema({
  Label: String,
  DateAdded: Date,
  Deleted: Boolean
}, {
  collection: 'payment_types'
});

module.exports = mongoose.model('PaymentType', paymentTypeSchema);