const { Schema, model } = require("mongoose");

const cartSchema = new Schema({
  productos: [
    {
      producto: { type: Schema.Types.ObjectId, ref: "producto" },
      cantidad: Number,
    },
  ],
  user: { type: Schema.Types.ObjectId, ref: "usuarios" },
  timeStamp: { type: Date, default: Date.now },
});

const cartModel = model("carrito", cartSchema);

module.exports = cartModel;
