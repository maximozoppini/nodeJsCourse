const { MongoDbContainer } = require("../../containers/mongoDbContainer");
const productCategoryModel = require("../../models/product.category.model");

class productCategoryMongoDAO extends MongoDbContainer {
  constructor(url) {
    super(url, productCategoryModel);
  }

  async save(productCategory) {
    let newProductCategory = await super.save(
      new productCategoryModel(productCategory)
    );
    return newProductCategory;
  }

  static getInstance(url) {
    if (!this.instance) {
      this.instance = new productCategoryMongoDAO(url);
    }
    return this.instance;
  }
}

module.exports = { productCategoryMongoDAO };
