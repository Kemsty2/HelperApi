let mongoose = require('mongoose');
let Schema = mongoose.Schema;
const User = require('./User');

let professionnelSchema = new Schema({
  email: {type: String, required: true, unique: true, dropDups: true},
  siteWeb: String,
  statut: {type: String},
  image: {type: String},
  isActive: {type: boolean},
  domaine: {type: Schema.Types.ObjectId, ref: 'Domaine'},
  locaux: [{type: Schema.Types.ObjectId, ref: 'Local'}]
});

const Professionnel = User.discriminator('Client', professionnelSchema,);

module.exports= (mongoose.model("Professionnel"));