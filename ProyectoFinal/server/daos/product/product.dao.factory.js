const productModel = require("../../models/product.model");
const { ProductFileSystemDAO } = require("./productFS.dao");
const { ProductMongoDAO } = require("./productMongo.dao");

const productFactory = (type = "FS") => {
  if (type === "FS") {
    return new ProductFileSystemDAO("productos");
  }
  if (type === "MONGO") {
    return new ProductMongoDAO(process.env.MONGODBURL, productModel);
  }
};

module.exports = productFactory;
