import mongoose from "mongoose";
import mongoose_deep_populate from "mongoose-deep-populate";


let Schema = mongoose.Schema;

let demandeSchema = new Schema({
  delai: Number,
  quartier: String,
  description: String,
  ville:{type: String},
  client: {type:Schema.Types.ObjectId, ref: 'User'},
  domaine: {type:Schema.Types.ObjectId, ref: 'Domaine'},
  professionnel: {type:Schema.Types.ObjectId, ref: 'Professionnel'},
  dateAttrib: {type: Number},
});

const deepPopulate = mongoose_deep_populate(mongoose);
demandeSchema.plugin(deepPopulate);

module.exports = (mongoose.model("Demande", demandeSchema));