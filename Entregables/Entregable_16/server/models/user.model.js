const { Schema, model } = require("mongoose");

const userSchema = new Schema({
  username: { type: String, require: true, unique: true },
  password: { type: String, require: true },
});

const userModel = model("usuarios", userSchema);
module.exports = userModel;
