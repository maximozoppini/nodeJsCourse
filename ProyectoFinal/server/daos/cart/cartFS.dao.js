const { FileSystemContainer } = require("../../containers/FileSystemContainer");
const productFactory = require("../product/product.dao.factory");

class CartFileSystemDAO extends FileSystemContainer {
  constructor(fileName) {
    super(fileName + ".txt");
    this.productFileSystemDAO = productFactory(process.env.DAOTYPE);
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
    let cart = await super.getById(cartId);
    if (!cart) {
      return null;
    }
    cart.productos = [
      ...cart.productos.filter((prod) => prod.id !== productId),
    ];
    return await super.update(cartId, cart);
  }
}

module.exports = { CartFileSystemDAO };
