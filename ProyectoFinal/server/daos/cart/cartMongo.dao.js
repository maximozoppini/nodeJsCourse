const { MongoDbContainer } = require("../../containers/mongoDbContainer");

class CartMongoDAO extends MongoDbContainer {
  constructor(url, model) {
    super(url, model);
  }

  async getProducts(id) {
    return await super.getById(id).productos;
  }

  async save() {
    const cart = await super.save({
      timeStamp: Date.now(),
      productos: [],
    });
    return cart;
  }

  async saveProduct(cartId, product) {
    let cart = await super.getById(cartId);
    if (!cart) {
      return null;
    }

    const newProduct = await this.productFileSystemDAO.getById(product.id);
    if (!newProduct) {
      return null;
    }

    cart.productos.push({
      ...newProduct,
      cantidad: product.cantidad,
    });

    return await super.update(cartId, cart);
  }

  async deleteProduct(cartId, productId) {
    console.log("id", cartId);
    let cart = await super.getById(cartId);
    if (!cart) {
      return null;
    }
    console.log("antes, ", cart);
    cart.productos = [
      ...cart.productos.filter((prod) => prod.id !== productId),
    ];
    console.log("desp", cart);

    return await super.update(cartId, cart);
  }
}

module.exports = { CartMongoDAO };
