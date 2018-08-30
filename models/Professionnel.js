let mongoose = require('mongoose');
let Schema = mongoose.Schema;
const User = require('./User');

let professionnelSchema = new Schema({
  email: {type: String, unique: true, dropDups: true},
  siteWeb: String,
  statut: {type: String},
  image: {type: String},
  isActive: {type: Boolean},
  domaine: {type: Schema.Types.ObjectId, ref: 'Domaine'},
  locaux: [{type: Schema.Types.ObjectId, ref: 'Local'}]
});

const Professionnel = User.discriminator('Professionnel', professionnelSchema,);

module.exports= (mongoose.model("Professionnel"));