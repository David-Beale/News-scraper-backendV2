const mongoose = require('mongoose');
require('dotenv').config();

const url =
  'mongodb://localhost/headlines'
// process.env.DB_URL

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.connection.once('open', () =>
  console.log(`Connected to mongo at ${url}`)
);

module.exports = mongoose;
