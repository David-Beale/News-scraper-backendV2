const mongoose = require('mongoose');
const { Schema } = mongoose;
ObjectId = Schema.ObjectId;

const headlineSchema = new Schema({
  hash: { type: String, allowNull: false },
  day: { type: Number, allowNull: false},
  month: { type: Number, allowNull: false},
  year: { type: Number, allowNull: false},
  time: { type: String, allowNull: false},
  newspaper: { type: String, allowNull: false},
  headline: { type: String, allowNull: false},
  summary: { type: String, allowNull: true},
  link: { type: String, allowNull: true},
  image: { type: String, allowNull: true},
  locale: { type: String, allowNull: false},
  scraperID: {type: String, allowNull: true},
});

module.exports = mongoose.model('headlines', headlineSchema);