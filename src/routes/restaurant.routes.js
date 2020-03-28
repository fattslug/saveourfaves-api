'use strict';

const express = require('express');
const router = new express.Router();
const chalk = require('chalk');

const RESTAURANT = require('../controllers/restaurant.controller');

// NEW ENTRY
router.post(
  '/',
  RESTAURANT.addRestaurant
);
// GET ALL ENTRIES
router.get(
  '/',
  RESTAURANT.getRestaurants
);
// GET ENTRY BY ID
router.get(
  '/:restaurantID',
  RESTAURANT.getRestaurantByID
);
// UPDATE ENTRY BY ID
router.put(
  '/:restaurantID',
  RESTAURANT.updateRestaurantByID
);
// DELETE ENTRY BY ID
router.delete(
  '/:restaurantID',
  RESTAURANT.deleteRestaurantByID
);

module.exports = router;