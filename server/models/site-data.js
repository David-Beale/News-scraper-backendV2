const mongoose = require('mongoose');
const { Schema } = mongoose;

const siteDataSchema = new Schema({
  website: { type: String, allowNull: false },
  name: { type: String, allowNull: false},
  selector: { type: String, allowNull: true},
  titlePath: {type: [], allowNull: true },
  titleRoot: {type: String, allowNull: true },
  summaryPath: {type: [], allowNull: true },
  linkPath: {type: [], allowNull: true },
  imagePath: {type: [], allowNull: true },
  country: { type: String, allowNull: false},
});

module.exports = mongoose.model('siteData', siteDataSchema);