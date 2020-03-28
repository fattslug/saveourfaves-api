'use strict';

const express = require('express');
const router = new express.Router();
const passport = require('passport');

const paymentType = require('../controllers/payment-type.controller');

// NEW ENTRY
router.post(
  '/',
  passport.authenticate('bearer', { session: true }),
  paymentType.add
);
// GET ALL ENTRIES
router.get(
  '/',
  passport.authenticate('bearer', { session: true }),
  paymentType.get
);
// UPDATE ENTRY BY ID
router.put(
  '/:paymentTypeID',
  passport.authenticate('bearer', { session: true }),
  paymentType.update
);
// DELETE ENTRY BY ID
router.delete(
  '/:paymentTypeID',
  passport.authenticate('bearer', { session: true }),
  paymentType.delete
);

module.exports = router;