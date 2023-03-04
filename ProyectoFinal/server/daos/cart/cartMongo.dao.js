const { MongoDbContainer } = require("../../containers/mongoDbContainer");
const cartModel = require("../../models/cart.model");

class CartMongoDAO extends MongoDbContainer {
  constructor(url) {
    super(url, cartModel);
  }

  async getById(id) {
    try {
      let result = await this.model.findById(id).populate({
        path: "productos",
        populate: {
          path: "producto",
          select: "nombre descripcion precio url",
          populate: { path: "categoria", select: "nombre descripcion" },
        },
      });
      return result ?? null;
    } catch (error) {
      throw new Error(error);
    }
  }

  async getDocument(filter) {
    try {
      let result = await this.model.findOne(filter).populate({
        path: "productos",
        populate: {
          path: "producto",
          select: "nombre descripcion precio url",
          populate: { path: "categoria", select: "nombre descripcion" },
        },
      });
      return result ?? null;
    } catch (error) {
      throw new Error(error);
    }
  }
  async save(userId) {
    const cart = await super.save(new cartModel({ user: userId }));
    return cart;
  }

  static getInstance(url) {
    if (!this.instance) {
      this.instance = new CartMongoDAO(url);
    }
    return this.instance;
  }
}

module.exports = { CartMongoDAO };
