//L'ensemble des modules que j'utilise, mongoose pour l'orm, bcrypt pour le hachage du mot de passe
let mongoose = require('mongoose');
let Schema = mongoose.Schema;
let bcrypt = require('bcrypt-nodejs');

let clientSchema = new Schema({
    email: {type: String, required: true, unique: true, dropDups: true},
    numero: {type: String, required: true},
    password: {type: String, required: true},
    lastLat: {type: Number},
    lastLong: {type: Number},
    professionnels: [{type: Schema.Types.ObjectId, ref: 'Professionnel'}],
    token : {type: String}
});

//méthode permettant de hacher le mot de passe
clientSchema.methods.encryptPassword = function (password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(5), null);
};

//méthode permettant de vérifier que le mot de passe est valide
clientSchema.methods.validPassword = function (password) {
    return bcrypt.compareSync(password, this.password);
};

module.exports = (mongoose.model("Client", clientSchema));