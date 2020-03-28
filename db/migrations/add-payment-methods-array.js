const mongoose = require('mongoose');
const chalk = require('chalk');
const path = require('path');

require('dotenv').config({ path: path.join(__dirname, 'production.env') });
// require('dotenv').config();

const Entry = require('../src/schema/entry.schema');

async function updateEntries(req, res) {
  console.log(chalk.black.bgBlue('Updating Entries...'));

  try {
    return new Promise((resolve, reject) => {
      Entry.updateMany({
        $or: [
          { "AmountPaid": { $gt: 0 } },
          { "PaymentType": { $exists: true } }
        ]
      }, [{
        $set: {
          "PaymentMethods": [{
            "AmountPaid": "$AmountPaid",
            "PaymentType": "$PaymentType"
          }]
        }
      }, {
        $unset: ["AmountPaid", "PaymentType", "Tip"]
      }]).exec((err, val) => {
        console.log('Error 1:', err);
        console.log('Result:', val);
        resolve(true);
      });
    });
  } catch (e) {
    console.log('Error 2: ', e);
  }
}

mongoose.connect(process.env.MONGO_URL, async (err) => {
  if (err) {
    console.log(chalk.black.bgRed('Error connecting to database: '), err);
    return process.exit(22);
  } else {
    console.log(chalk.green('Successfully connected to MongoDB'));
    await updateEntries();
    console.log('Finished!');
    return process.exit(0);
  }
});
