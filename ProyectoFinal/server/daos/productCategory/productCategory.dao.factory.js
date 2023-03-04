const { productCategoryMongoDAO } = require("./productCategoryMongo.dao");

const productCategoryFactory = (type = "MONGO") => {
  if (type === "MONGO") {
    return productCategoryMongoDAO.getInstance(process.env.MONGODBURL);
  }
};

module.exports = productCategoryFactory;
