const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const options = {
  timestamp: { createdAt: "created_at", updatedAt: "updated_at" },
};

const messageSchema = new Schema(
  {
    author_id: { type: Schema.Types.ObjectId },
    author_username: { type: String },
    title: { type: String, required: true, maxlength: 50 },
    body: { type: String, required: true, maxlength: 1000 },
  },
  options
);

module.exports = mongoose.model("Message", messageSchema);
