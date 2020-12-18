const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { DateTime } = require("luxon");

const messageSchema = new Schema(
  {
    author_id: { type: Schema.Types.ObjectId },
    author_username: { type: String },
    title: { type: String, required: true },
    body: { type: String, required: true },
  },
  { timestamps: true }
);

messageSchema.virtual("created_date").get(function () {
  return DateTime.fromJSDate(this.createdAt).toLocaleString(
    DateTime.DATETIME_MED
  );
});

messageSchema.virtual("url").get(function () {
  return `/messages/${this._id}`;
});

module.exports = mongoose.model("Message", messageSchema);
