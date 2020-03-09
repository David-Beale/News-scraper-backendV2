const mongoose = require('mongoose');
const { Schema } = mongoose;

const headlineSchema = new Schema({
  hash: { type: String, allowNull: false },
  day: { type: Number, allowNull: false },
  month: { type: Number, allowNull: false },
  year: { type: Number, allowNull: false },
  time: { type: String, allowNull: false },
  newspaper: { type: String, allowNull: false },
  headline: { type: String, allowNull: false },
  locale: { type: String, allowNull: false },
  website: { type: String, allowNull: false },
  image: { type: String }
});

module.exports = mongoose.model('headlines', headlineSchema);