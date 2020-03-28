const mongoose = require('mongoose');
const chalk = require('chalk');
const path = require('path');

require('dotenv').config({ path: path.join(__dirname, 'production.env') });
// require('dotenv').config({ path: '../.env' });
const currentMigration = require('./migrations/add-payments-collection');

mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true }, async (err) => {
  if (err) {
    console.log(chalk.black.bgRed('Error connecting to database: '), err);
    return process.exit(22);
  } else {
    console.log(chalk.green('Successfully connected to MongoDB'));

    // Migration runs here...
    try {
      const result = await currentMigration.run();
      console.log('Success:', result);
    } catch (e) {
      console.log('Error:', e);
    }

    console.log('Finished!');
    return process.exit(0);
  }
});