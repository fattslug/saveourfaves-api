const PaymentType = require('../../src/schema/payment-type.schema');
const Entry = require('../../src/schema/entry.schema');
const seedData = require('../seed-data/payment_types.json');

seedData.payment_types.map((data) => data.DateAdded = new Date());

const run = async () => {
  try {
    const paymentTypes = await PaymentType.insertMany(seedData.payment_types);
    console.log(`Successfully inserted ${paymentTypes.length} payment types`);

    return new Promise((resolve) => {
      paymentTypes.forEach(async (type, index) => {
        const result = await Entry.updateMany({
          "PaymentMethods.PaymentType": type.Label
        }, {
          $set: { "PaymentMethods.$.Type": type._id }
        }).exec();
        console.log(result);
        if (index === paymentTypes.length - 1) {
          resolve(true);
        }
      });
    });

  } catch (e) {
    throw new Error(e);
  }
}

exports.run = run;