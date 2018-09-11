import mongoose from "mongoose";
import findOrCreate from "mongoose-find-or-create";

const Schema = mongoose.Schema;
const localSchema = new Schema({
  longitude: {type: Number},
  latitude: {type: Number}
});

localSchema.plugin(findOrCreate);

module.exports = (mongoose.model("Local", localSchema));
