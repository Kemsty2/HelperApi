let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let statutSchema = new Schema({
    statut: String
});

module.exports = (mongoose.model("Statut", statutSchema));