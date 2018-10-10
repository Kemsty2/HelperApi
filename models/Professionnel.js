import mongoose from "mongoose";
import User from "./User";
import mongoose_deep_populate from "mongoose-deep-populate";

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

const deepPopulate = mongoose_deep_populate(mongoose);
professionnelSchema.plugin(deepPopulate);

module.exports= (mongoose.model("Professionnel"));