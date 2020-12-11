const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  first_name: { type: String, required: true, maxlength: 50, minlength: 1 },
  last_name: { type: String, required: true, maxlength: 50, minlength: 1 },
  username: { type: String, required: true, maxlength: 15, minlength: 5 },
  password: { type: String, required: true },
  salt: { type: String },
  membership_status: { type: String, enum: ["Regular", "Premium"] },
});

module.exports = mongoose.model("user", userSchema);
