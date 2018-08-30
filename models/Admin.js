let mongoose = require('mongoose');
let Schema = mongoose.Schema;
let bcrypt = require("bcrypt-nodejs");

let adminSchema = new Schema({
  name: {type: String, required: true},
  password: {type: String, required: true},
  token: {type: String}
});

adminSchema.methods.encryptPassword = function (password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(5), null);
};

//méthode permettant de vérifier que le mot de passe est valide
adminSchema.methods.validPassword = function (password) {
  return bcrypt.compareSync(password, this.password);
};

module.exports = (mongoose.model("Admin", adminSchema));