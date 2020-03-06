const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const url =
  // 'mongodb://alandouglas96:Luninance758@ds133328.mlab.com:33328/heroku_w18xw386';
  'mongodb://localhost/headlines'
  // 'mongodb+srv://admin:admin@headlines-sa1tk.gcp.mongodb.net/test?retryWrites=true&w=majority'

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.connection.once('open', () =>
  console.log(`Connected to mongo at ${url}`)
);

module.exports = mongoose;
