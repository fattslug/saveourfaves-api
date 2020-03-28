'use strict';

const mongoose = require('mongoose');

let restaurantSchema = new mongoose.Schema({
  RestaurantName: String,
}, {
  collection: 'restaurants'
});

module.exports = mongoose.model('Restaurant', restaurantSchema);