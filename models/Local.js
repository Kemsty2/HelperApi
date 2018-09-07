const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const findOrCreate = require("mongoose-findorcreate");

const localSchema = new Schema({
  longitude: {type: Number},
  latitude: {type: Number}
});

localSchema.plugin(findOrCreate);

module.exports = (mongoose.model("Local", localSchema));
