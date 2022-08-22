const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const timestamps = require("mongoose-timestamp");
const mongoosePaginate = require("mongoose-paginate-v2");
const aggregatePaginate = require("mongoose-aggregate-paginate-v2");
//
const LogDescriptionSchema = new Schema({
  description: { type: String, required: true },
  status: { type: String, required: true },
  logcode: { type: String, required: true },
});

LogDescriptionSchema.index({ status: "text", description: "text",logcode:"text" });
LogDescriptionSchema.plugin(timestamps);
LogDescriptionSchema.plugin(aggregatePaginate);
LogDescriptionSchema.plugin(mongoosePaginate);

module.exports = mongoose.model("LogDescription", LogDescriptionSchema);
