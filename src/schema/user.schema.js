'use strict';

const mongoose = require('mongoose');

let userSchema = new mongoose.Schema({
  UserID: Number,
  Email: String,
  Name: String,
  Token: String
}, {
  collection: 'users'
});

module.exports = mongoose.model('User', userSchema);