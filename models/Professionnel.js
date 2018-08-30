let mongoose = require('mongoose');
let Schema = mongoose.Schema;
let bcrypt = require("bcrypt-nodejs");

let professionnelSchema = new Schema({
    nom: String,
    numero: String,
    email: {type: String, required: true, unique: true, dropDups: true},
    siteWeb: String,
    lastLat: Number,
    lastLong: Number,
    password: String,
    statut: {type: Schema.Types.ObjectId, ref: 'Statut'},
    domaine: {type: Schema.Types.ObjectId, ref: 'Domaine'},
    villes: [{type:Schema.Types.ObjectId, ref:'Ville'}],
    clients: [{type:Schema.Types.ObjectId, ref:'Client'}],
    token : {type: String}
});

//méthode permettant de hacher le mot de passe
professionnelSchema.methods.encryptPassword = function (password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(5), null);
};

//méthode permettant de vérifier que le mot de passe est valide
professionnelSchema.methods.validPassword = function (password) {
    return bcrypt.compareSync(password, this.password);
};

module.exports= (mongoose.model("Professionnel", professionnelSchema));