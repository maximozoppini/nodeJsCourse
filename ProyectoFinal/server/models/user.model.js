const { Schema, model } = require("mongoose");

const userSchema = new Schema({
  username: { type: String, require: true, unique: true },
  password: { type: String, require: true },
  name: { type: String },
  address: { type: String },
  age: { type: String },
  phone: { type: String },
  avatar: { type: String },
});

const userModel = model("usuarios", userSchema);
module.exports = userModel;
