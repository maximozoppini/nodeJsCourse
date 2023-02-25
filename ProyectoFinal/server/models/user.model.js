const { Schema, model } = require("mongoose");

const userSchema = new Schema({
  username: { type: String, require: true, unique: true },
  password: { type: String },
  name: { type: String },
  address: { type: String },
  age: { type: String },
  phone: { type: String },
  avatar: { type: String },
  social_id: { type: String },
  provider: { type: String },
});

const userModel = model("usuarios", userSchema);
module.exports = userModel;
