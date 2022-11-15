const { Schema, model } = require("mongoose");

const authorSchema = new Schema({
  email: { type: String },
  nombre: { type: String },
  apellido: { type: String },
  edad: { type: Number },
  alias: { type: String },
  avatar: { type: String },
});
const authorModel = model("author", authorSchema);

const messageSchema = new Schema({
  author: { type: authorSchema },
  text: { type: String },
  timeStamp: { type: Date, default: Date.now },
});

const messageModel = model("mensajes", messageSchema);

module.exports = messageModel;
