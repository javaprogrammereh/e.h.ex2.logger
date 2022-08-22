const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const timestamps = require("mongoose-timestamp");
const mongoosePaginate = require("mongoose-paginate-v2");
const aggregatePaginate = require("mongoose-aggregate-paginate-v2");
//
const LogSchema = new Schema({
  data: { type: String, required: true },
  sectionId: { type: Schema.Types.ObjectId, ref: "Section" },
  logcode: { type: String, required: true, index: { unique: true } },
  ip: { type: String, required: true },
  isPermanent: { type: Boolean, default: false },
});
LogSchema.index({ data: "text" });
LogSchema.index({ isPermanent: 1 });
LogSchema.plugin(timestamps);
LogSchema.plugin(aggregatePaginate);
LogSchema.plugin(mongoosePaginate);
//
module.exports = mongoose.model("Log", LogSchema);
