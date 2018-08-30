let mongoose = require('mongoose');
let Schema = mongoose.Schema;


let villeSchema = new Schema({
    ville: String,
    professionnels: [{type:Schema.Types.ObjectId, ref:'Professionnel'}]
});

module.exports = (mongoose.model("Ville", villeSchema));