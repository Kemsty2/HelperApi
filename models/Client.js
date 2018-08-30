//L'ensemble des modules que j'utilise, mongoose pour l'orm, bcrypt pour le hachage du mot de passe
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const User = require('./User');

const clientSchema = new Schema({});
const Client = User.discriminator('Client', clientSchema,);

module.exports = (mongoose.model("Client"));