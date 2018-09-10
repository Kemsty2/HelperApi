let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let discussionSchema = new Schema({
  lastMod: {type: Number, required: true},
  exp: {type: Schema.Types.ObjectId, ref: 'User', required: true},
  dest: {type: Schema.Types.ObjectId, ref: 'Professionnel', required: true}
});

module.exports = (mongoose.model("Discussion", discussionSchema));