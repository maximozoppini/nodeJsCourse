const cartFactory = require("../daos/cart/cart.dao.factory");
const { BaseService } = require("./base.service");

class CartService extends BaseService {
  constructor() {
    super(cartFactory(process.env.DAOTYPE));
  }

  async getProducts(id) {
    return await super.getById(id)?.productos;
  }

  async saveProduct(userId, cartId, product) {
    return await super.dao.saveProduct(userId, cartId, product);
  }

  async deleteProduct(cartId, productId) {
    return await super.dao.deleteProduct(cartId, productId);
  }

  async buyCart(userId) {
    return await super.dao.buyCart(userId);
  }
}

module.exports = { CartService };
