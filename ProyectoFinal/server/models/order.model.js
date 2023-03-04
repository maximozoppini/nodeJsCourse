const { Schema, model } = require("mongoose");
const { CounterModel } = require("./counter.model");

const orderSchema = new Schema({
  productos: [
    {
      nombre: { type: String, require: true },
      descripcion: { type: String, require: true },
      precio: { type: Number, require: true },
      codigo: { type: String, require: true },
      url: { type: String },
      cantidad: Number,
    },
  ],
  numeroOrden: { type: Number },
  total: { type: Number, require: true },
  user: { type: Schema.Types.ObjectId, ref: "usuarios" },
  timeStamp: { type: Date, default: Date.now },
  estado: { type: String, default: "generada" },
});

orderSchema.pre("save", async function () {
  if (!this.isNew) return;

  this.numeroOrden = await CounterModel.increment("ordenes");
});

const orderModel = model("order", orderSchema);

module.exports = orderModel;
