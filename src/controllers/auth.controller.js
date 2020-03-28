const User = require('../schema/user.schema');
const whitelist = require('../../config/whitelist');
const chalk = require('chalk');

exports.validateUser = validateUser; // Used for LOGIN
exports.validateToken = validateToken; // Used for each REQUEST

/**
 * Check if user if authorized for the application
 * @param {object} req Request object
 * @param {object} res Response object
 * @returns {void}
 */
async function validateUser(req, res) {
  const email = req.user.Email;
  if (whitelist.indexOf(email) < 0) {
    return res.redirect(`${process.env.APP_URL}/login`);
  }

  // Redirect the user
  req.session.user = req.user;
  const token = req.user.Token;
  const userID = req.user.UserID;
  res.redirect(`${process.env.APP_URL}?token=${token}&user=${userID}`);
  
  // Check for user existence in database
  userExists(req.user.UserID).then((userInDB) => {
    if (!userInDB) { addUser(req.user); }
    else { updateUser(req.user); }
  });
  
  return;
}

/**
 * Validates that a specific token belongs to the UserID provided
 * @param {object} req
 * @param {object} res
 */
function validateToken(req, res) {
  User.findOne({
    Token: req.user.Token,
    UserID: req.body.UserID
  }, (err, result) => {
    if (!result) {
      return res.send({
        success: false,
        message: 'Invalid user session'
      });
    }

    return res.send({
      success: true
    });
  });
}

/**
 * Checks if user exists in database
 * @param {number} userID ID of user to search for
 * @returns {boolean} Does the user exist?
 */
async function userExists(userID) {
  return new Promise((resolve) => {
    User.findOne({ UserID: userID }).exec((err, result) => {
      resolve(result);
    });
  });
}

/**
 * Adds user to database
 * @param {object} user Email of user to add
 * @returns {HttpResponse}
 */
function addUser(user) {
  const newUser = new User(user);
  newUser.save();
}

/**
 * Update user token in database
 * @param {object} user Email of user to add
 * @returns {HttpResponse}
 */
function updateUser(user) {
  User.findOneAndUpdate({ UserID: user.UserID }, {
    $set: { Token: user.Token }
  }, { returnNewDocument: true }, (err, doc, result) => {
  });
}

// Send token to server
// Server validates token with session