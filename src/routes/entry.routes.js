'use strict';

const express = require('express');
const router = new express.Router();
const passport = require('passport');
const chalk = require('chalk');

const ENTRY = require('../controllers/entry.controller');

// NEW ENTRY
router.post(
  '/',
  passport.authenticate('bearer', { session: true }),
  ENTRY.addEntry
);
// GET ALL ENTRIES
router.get(
  '/',
  passport.authenticate('bearer', { session: true }),
  ENTRY.getEntries
);
// GET ENTRY BY ID
router.get(
  '/:entryID',
  passport.authenticate('bearer', { session: true }),
  ENTRY.getEntryByID
);
// UPDATE ENTRY BY ID
router.put(
  '/:entryID',
  passport.authenticate('bearer', { session: true }),
  ENTRY.updateEntryByID
);
// DELETE ENTRY BY ID
router.delete(
  '/:entryID',
  passport.authenticate('bearer', { session: true }),
  ENTRY.deleteEntryByID
);

module.exports = router;