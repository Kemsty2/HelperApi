const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcrypt-nodejs");
const findOrCreate = require("mongoose-find-or-create");

const userOptions = {
  discriminatorKey: "itemtype",
  collection: "Users"
};

const userSchema = new Schema({
  nom: {type: String, required: true, unique: true, dropDups: true},
  numero: {type: String, required: true},
  password: {type: String, required: true},
  lastLat: {type: Number},
  lastLong: {type: Number},
  token : {type: String},
},userOptions);

userSchema.methods.encryptPassword = function (password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(5), null);
};

//méthode permettant de vérifier que le mot de passe est valide
userSchema.methods.validPassword = function (password) {
  return bcrypt.compareSync(password, this.password);
};

userSchema.plugin(findOrCreate);

module.exports = mongoose.model('User', userSchema);
