'use strict';

const express = require('express');
const router = new express.Router();
const passport = require('passport');
require('../../config/passport');

const chalk = require('chalk');

const AUTH = require('../controllers/auth.controller');

router.get('/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);
router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: '/', session: true }),
  AUTH.validateUser
);
router.post('/validate', passport.authenticate('bearer', { session: true }), AUTH.validateToken);

module.exports = router;