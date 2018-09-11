import mongoose from "mongoose";

let Schema = mongoose.Schema;

let domaineSchema = new Schema({
  domaine: String,
  description: String,
  image: String,
  count: Number,
  color: Number
});

module.exports = (mongoose.model("Domaine", domaineSchema));