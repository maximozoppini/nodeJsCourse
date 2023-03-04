const { MongoDbContainer } = require("../../containers/mongoDbContainer");
const orderModel = require("../../models/order.model");

class orderMongoDAO extends MongoDbContainer {
  constructor(url) {
    super(url, orderModel);
  }

  async save(order) {
    return await super.save(new orderModel(order));
  }

  static getInstance(url) {
    if (!this.instance) {
      this.instance = new orderMongoDAO(url);
    }
    return this.instance;
  }
}

module.exports = { orderMongoDAO };
