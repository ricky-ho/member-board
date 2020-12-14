const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  first_name: { type: String, required: true, minlength: 1, maxlength: 50 },
  last_name: { type: String, required: true, minlength: 1, maxlength: 50 },
  username: {
    type: String,
    required: true,
  },
  password: { type: String, required: true },
  salt: { type: String },
  membership_status: {
    type: String,
    enum: ["Regular", "Premium"],
    default: "Regular",
  },
});

module.exports = mongoose.model("User", userSchema);
