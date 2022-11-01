const cartModel = require("../../models/cart.model");
const { CartFileSystemDAO } = require("./cartFS.dao");
const { CartMongoDAO } = require("./cartMongo.dao");

const cartFactory = (type = "FS") => {
  if (type === "FS") {
    return new CartFileSystemDAO("carrito");
  }
  if (type === "MONGO") {
    return new CartMongoDAO(process.env.MONGODBURL, cartModel);
  }
};

module.exports = cartFactory;
