import mongoose from "mongoose";
import User from "./User";

let Schema = mongoose.Schema;
let professionnelSchema = new Schema({
  email: {type: String},
  siteWeb: String,
  statut: {type: String},
  image: {type: String},
  isActive: {type: Boolean},
  domaine: {type: Schema.Types.ObjectId, ref: 'Domaine'},
  locaux: [{type: Schema.Types.ObjectId, ref: 'Local'}]
});



const Professionnel = User.discriminator('Professionnel', professionnelSchema,);

module.exports= (mongoose.model("Professionnel"));