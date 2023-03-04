const { Schema, model } = require("mongoose");

const productCategorySchema = new Schema({
  nombre: { type: String, require: true },
  descripcion: { type: String, require: true },
});

const productCategoryModel = model("productCategory", productCategorySchema);

module.exports = productCategoryModel;
