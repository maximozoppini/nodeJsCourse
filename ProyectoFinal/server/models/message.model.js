const { Schema, model } = require("mongoose");

const messageSchema = new Schema({
  email: { type: String, require: true },
  tipo: { type: String, require: true },
  cuerpo: { type: String, require: true },
  timeStamp: { type: Date, default: Date.now },
});

const messageModel = model("mensaje", messageSchema);
module.exports = messageModel;
