//L'ensemble des modules que j'utilise, mongoose pour l'orm, bcrypt pour le hachage du mot de passe
import mongoose from "mongoose";
import User from "./User";

const Schema = mongoose.Schema;
const clientSchema = new Schema({});
const Client = User.discriminator('Client', clientSchema,);

module.exports = (mongoose.model("Client"));

