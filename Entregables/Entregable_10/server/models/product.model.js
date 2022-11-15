const { Schema, model } = require("mongoose");

const productSchema = new Schema({
  title: { type: String, require: true },
  price: { type: Number, require: true },
  thumbnail: { type: String, require: true },
});

const productModel = model("producto", productSchema);
module.exports = productModel;
