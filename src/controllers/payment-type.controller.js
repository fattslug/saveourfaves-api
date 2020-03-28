const PaymentType = require('../schema/payment-type.schema');
const chalk = require('chalk');
const moment = require('moment');

exports.add = addPaymentType;
exports.get = getPaymentTypes;
exports.update = updatePaymentType;
exports.delete = deletePaymentType;

/**
 * Adds a new entry to the database
 * @param {object} req Request object
 * @param {object} res Response object
 * @returns {object} HTTP response
 */
function addPaymentType(req, res) {
  console.log(chalk.blue('/payment_types/'));
  console.log(chalk.black.bgBlue('Adding Payment Type...'));

  const paymentType = new PaymentType(req.body.payment_type);
  paymentType.DateAdded = moment().format();
  console.log(paymentType);

  try {
    paymentType.save();
    res.status(200).send({
      success: true,
      body: paymentType
    });
  } catch (e) {
    console.log(chalk.red(e));
    res.status(500).send({
      success: false,
      message: 'Failed to save payment type'
    })
  }
}

/**
 * Gets all entries from database
 * @param {object} req Request object
 * @param {object} res Response object
 * @returns {object} HTTP response
 */
function getPaymentTypes(req, res) {
  console.log('GET', chalk.blue('/payment_types/'));
  console.log(chalk.black.bgBlue('Getting All Payment Types...'));

  const query = {
    Deleted: {
      $ne: true
    }
  };

  try {
    PaymentType.aggregate([
      { $match: query }
    ]).exec((err, payment_types) => {
      if (err) { throw (err); }
      res.status(200).send({
        success: true,
        body: {
          payment_types
        }
      })
    })
  } catch (e) {
    console.log(chalk.red(e));
    res.status(500).send({
      success: false,
      message: 'Failed to get all payment types'
    })
  }
}

/**
 * Update specific entry in database
 * @param {object} req Request object
 * @param {object} res Response object
 * @returns {object} HTTP response
 */
function updatePaymentType(req, res) {
  const { paymentTypeID } = req.params;
  const updates = req.body.payment_type;
  console.log('UPDATE', chalk.blue('/payment_types/'), paymentTypeID);
  console.log(chalk.black.bgBlue('Updating Payment Type...'));

  try {
    PaymentType.findByIdAndUpdate(paymentTypeID, {
      Label: updates.Label
    }, { new: true }).exec((err, payment_type) => {
      if (err) { throw (err); }
      res.status(200).send({
        success: true,
        body: {
          payment_type
        }
      })
    })
  } catch (e) {
    console.log(chalk.red(e));
    res.status(500).send({
      success: false,
      message: 'Failed to update payment type'
    })
  }
}

/**
 * Delete entry in database
 * @param {object} req Request object
 * @param {object} res Response object
 * @returns {object} HTTP response
 */
function deletePaymentType(req, res) {
  const { paymentTypeID } = req.params;
  console.log('DELETE', chalk.blue('/entries/'), paymentTypeID);
  console.log(chalk.black.bgBlue('Deleting Entry...'));

  try {
    PaymentType.findByIdAndUpdate(paymentTypeID, {
      Deleted: true
    }, { new: true }).exec((err, payment_type) => {
      if (err) { throw (err); }
      res.status(200).send({
        success: true,
        body: {
          payment_type
        }
      })
    })
  } catch (e) {
    console.log(chalk.red(e));
    res.status(500).send({
      success: false,
      message: 'Failed to update payment type'
    })
  }
}