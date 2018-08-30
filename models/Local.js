let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let localSchema = new Schema({
  longitude: {type: Number},
  latitude: {type: Number}
});

module.exports = (mongoose.model("Local", localSchema));