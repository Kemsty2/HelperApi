import mongoose from "mongoose";
import mongoose_deep_populate from "mongoose-deep-populate";

let Schema = mongoose.Schema;

let discussionSchema = new Schema({
  lastMod: {type: Number, required: true},
  exp: {type: Schema.Types.ObjectId, ref: 'User', required: true},
  dest: {type: Schema.Types.ObjectId, ref: 'Professionnel', required: true}
});

const deepPopulate = mongoose_deep_populate(mongoose);
discussionSchema.plugin(deepPopulate);

module.exports = (mongoose.model("Discussion", discussionSchema));