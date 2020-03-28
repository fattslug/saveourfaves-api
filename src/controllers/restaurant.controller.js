const Restaurant = require('../schema/restaurant.schema');
const chalk = require('chalk');
const moment = require('moment');

exports.addRestaurant = addRestaurant;
exports.getRestaurants = getRestaurants;
exports.getRestaurantByID = getRestaurantByID;
exports.updateRestaurantByID = updateRestaurantByID;
exports.deleteRestaurantByID = deleteRestaurantByID;

/**
 * Adds a new restaurant to the database
 * @param {object} req Request object
 * @param {object} res Response object
 * @returns {object} HTTP response
 */
function addRestaurant(req, res) {
  console.log(chalk.blue('/restaurants/'));
  console.log(chalk.black.bgBlue('Adding Restaurant...'));

  const restaurant = new Restaurant(req.body.restaurant);
  console.log(restaurant);

  try {
    restaurant.save();
    res.status(200).send({
      success: true,
      body: restaurant
    });
  } catch (e) {
    console.log(chalk.red(e));
    res.status(500).send({
      success: false,
      message: 'Failed to save restaurant'
    })
  }
}

/**
 * Gets all restaurants from database
 * @param {object} req Request object
 * @param {object} res Response object
 * @returns {object} HTTP response
 */
function getRestaurants(req, res) {
  console.log('GET', chalk.blue('/restaurants/'));
  console.log(chalk.black.bgBlue('Getting Restaurants...'));

  const { f, t, pm } = req.query;
  const query = {
    Deleted: {
      $ne: true
    }
  };

  query.DateAdded = {
    $lte: new Date(moment(parseInt(t) || new Date()).endOf('day').format()),
    $gte: new Date(f ? moment(parseInt(f)).startOf('day').format() : moment().subtract(1000, 'days').startOf('day').format())
  }

  if (pm) {
    query.PaymentMethods = {
      $elemMatch: {
        $or: []
      }
    };
    pm.split(',').forEach((typeIndex, i) => {
      query.PaymentMethods.$elemMatch.$or.push({ PaymentType: paymentMethodsMap[typeIndex] });
    });
  }

  console.log(query);

  try {
    Restaurant.aggregate([
      { $match: query }
    ]).exec(async (err, restaurants) => {
      if (err) { throw(err); }
      await Restaurant.populate(restaurants, {path: "PaymentMethods.Type"});
      res.status(200).send({
        success: true,
        body: {
          totalAmount: restaurants.reduce((acc, curr) => {
            if (curr.AmountPaid) {
              return acc + curr.AmountPaid;
            } else {
              let totalPaid = 0;
              curr.PaymentMethods.forEach((paymentMethod) => {
                totalPaid += paymentMethod.AmountPaid;
              });
              return acc + totalPaid;
            }
          }, 0),
          restaurants: restaurants.sort((a, b) => {
            return new Date(b.DateAdded) - new Date(a.DateAdded);
          })
        }
      })
    })
  } catch (e) {
    console.log(chalk.red(e));
    res.status(500).send({
      success: false,
      message: 'Failed to get all restaurants'
    })
  }
}

/**
 * Get specific restaurant in database
 * @param {object} req Request object
 * @param {object} res Response object
 * @returns {object} HTTP response
 */
function getRestaurantByID(req, res) {
  const restaurantID = req.params.restaurantID;
  console.log('GET', chalk.blue('/restaurants/'), restaurantID);
  console.log(chalk.black.bgBlue(`Getting Restaurant ID: ${restaurantID}...`));

  try {
    Restaurant.findById(restaurantID).exec((err, restaurant) => {
      if (err) { throw(err); }
      if (restaurant.Deleted) {
        throw(true);
      }
      res.status(200).send({
        success: true,
        body: {
          restaurant: restaurant
        }
      });
    })
  } catch (e) {
    console.log(chalk.red(e));
    res.status(500).send({
      success: false,
      message: 'Failed to get restaurant'
    })
  }
}

/**
 * Update specific restaurant in database
 * @param {object} req Request object
 * @param {object} res Response object
 * @returns {object} HTTP response
 */
function updateRestaurantByID(req, res) {
  const restaurantID = req.params.restaurantID;
  const updates = req.body.restaurant;
  console.log('UPDATE', chalk.blue('/restaurants/'), restaurantID);
  console.log(chalk.black.bgBlue('Updating Restaurant...'));

  try {
    Restaurant.findByIdAndUpdate(restaurantID, {
      ClientName: updates.ClientName,
      ServicesRendered: updates.ServicesRendered,
      DateAdded: updates.DateAdded,
      PaymentMethods: updates.PaymentMethods
    }, { new: true }).exec((err, newRestaurant) => {
      if (err) { throw(err); }
      res.status(200).send({
        success: true,
        body: {
          restaurant: newRestaurant
        }
      })
    })
  } catch (e) {
    console.log(chalk.red(e));
    res.status(500).send({
      success: false,
      message: 'Failed to update restaurant'
    })
  }
}

/**
 * Delete restaurant in database
 * @param {object} req Request object
 * @param {object} res Response object
 * @returns {object} HTTP response
 */
function deleteRestaurantByID(req, res) {
  const restaurantID = req.params.restaurantID;
  console.log('DELETE', chalk.blue('/restaurants/'), restaurantID);
  console.log(chalk.black.bgBlue('Deleting Restaurant...'));

  try {
    Restaurant.findByIdAndUpdate(restaurantID, {
      Deleted: true
    }, { new: true }).exec((err, newRestaurant) => {
      if (err) { throw(err); }
      res.status(200).send({
        success: true,
        body: {
          restaurant: newRestaurant
        }
      })
    })
  } catch (e) {
    console.log(chalk.red(e));
    res.status(500).send({
      success: false,
      message: 'Failed to update restaurant'
    })
  }
}