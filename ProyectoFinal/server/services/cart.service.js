const cartFactory = require("../daos/cart/cart.dao.factory");
const { BaseService } = require("./base.service");

class CartService extends BaseService {
  constructor() {
    super(cartFactory(process.env.DAOTYPE));
    this.dao = cartFactory(process.env.DAOTYPE);
  }

  async getProducts(id) {
    return await super.getById(id)?.productos;
  }

  async saveProduct(userId, cartId, product) {
    console.log(super.dao);
    return await this.dao.saveProduct(userId, cartId, product);
  }

  async deleteProduct(cartId, productId) {
    return await this.dao.deleteProduct(cartId, productId);
  }

  async buyCart(userId) {
    return await this.dao.buyCart(userId);
  }
}

module.exports = { CartService };
