const { CartFirebaseDAO } = require("./cartFirebase.dao");
const { CartFileSystemDAO } = require("./cartFS.dao");
const { CartMongoDAO } = require("./cartMongo.dao");

const cartFactory = (type = "FS") => {
  if (type === "FS") {
    return new CartFileSystemDAO("carrito");
  }
  if (type === "MONGO") {
    return CartMongoDAO.getInstance(process.env.MONGODBURL);
  }
  if (type === "FIREBASE") {
    return new CartFirebaseDAO("carritos");
  }
};

module.exports = cartFactory;
