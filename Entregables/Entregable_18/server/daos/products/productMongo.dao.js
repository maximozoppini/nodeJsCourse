const { MongoDbContainer } = require("../../containers/mongoDbContainer");
const productModel = require("../../models/product.model");

class ProductMongoDAO extends MongoDbContainer {
  constructor(url) {
    super(url, productModel);
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

  static getInstance(url) {
    if (!this.instance) {
      this.instance = new ProductMongoDAO(url);
    }
    return this.instance;
  }
}

module.exports = { ProductMongoDAO };
