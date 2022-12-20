const { MongoDbContainer } = require("../../containers/mongoDbContainer");
const productModel = require("../../models/product.model");

class ProductMongoDAO extends MongoDbContainer {
  constructor(url, model) {
    super(url, model);
  }

  async save(prod) {
    let newProd = await super.save(
      new productModel({
        title: prod.title,
        price: prod.price,
        thumbnail: prod.thumbnail,
      })
    );
    return newProd;
  }
}

module.exports = { ProductMongoDAO };
