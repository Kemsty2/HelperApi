let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let demandeSchema = new Schema({
  delai: Number,
  quartier: String,
  description: String,
  ville:{type: String},
  client: {type:Schema.Types.ObjectId, ref: 'User'},
  domaine: {type:Schema.Types.ObjectId, ref: 'Domaine'},
  professionnel: {type:Schema.Types.ObjectId, ref: 'Professionnel'},
  dateAttrib: {type: Number}
});

module.exports = (mongoose.model("Demande", demandeSchema));