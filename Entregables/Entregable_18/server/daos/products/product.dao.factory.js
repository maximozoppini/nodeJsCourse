const { ProductMongoDAO } = require("./productMongo.dao");

const productFactory = (type = "MONGO") => {
  if (type === "MONGO") {
    return ProductMongoDAO.getInstance(process.env.MONGODBURL);
  }
};

module.exports = productFactory;
