import mongoose from "mongoose";

let Schema = mongoose.Schema;

let domaineSchema = new Schema({
  domaine: String,
  description: String,
  image: String,
  count: {type: Number, default: 0},
  color: Number
});

module.exports = (mongoose.model("Domaine", domaineSchema));