const { Schema, model } = require("mongoose");

const orderSchema = new Schema({
  productos: [
    {
      nombre: { type: String, require: true },
      precio: { type: Number, require: true },
      codigo: { type: String, require: true },
      url: { type: String, require: true },
      cantidad: Number,
    },
  ],
  total: { type: Number, require: true },
  user: { type: Schema.Types.ObjectId, ref: "usuarios" },
  timeStamp: { type: Date, default: Date.now },
});

const orderModel = model("order", orderSchema);

module.exports = orderModel;
