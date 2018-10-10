import mongoose from "mongoose";
import bcrypt from "bcrypt-nodejs";
import mongoose_deep_populate from "mongoose-deep-populate";

const Schema = mongoose.Schema;
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

const deepPopulate = mongoose_deep_populate(mongoose);
userSchema.plugin(deepPopulate, options);

module.exports = mongoose.model('User', userSchema);
