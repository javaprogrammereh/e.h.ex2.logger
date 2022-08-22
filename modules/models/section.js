const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const timestamps = require("mongoose-timestamp");
const mongoosePaginate = require("mongoose-paginate-v2");
const aggregatePaginate = require("mongoose-aggregate-paginate-v2");
//
const SectionSchema = new Schema({
  name: { type: String, required: true },
  projectId: { type: Schema.Types.ObjectId, ref: "Project" },
  token: { type: String },
});
SectionSchema.index({ name: "text" });
SectionSchema.plugin(timestamps);
SectionSchema.plugin(aggregatePaginate);
SectionSchema.plugin(mongoosePaginate);

module.exports = mongoose.model("Section", SectionSchema);
