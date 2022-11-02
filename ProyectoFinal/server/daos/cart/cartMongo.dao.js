const { MongoDbContainer } = require("../../containers/mongoDbContainer");
const cartModel = require("../../models/cart.model");

class CartMongoDAO extends MongoDbContainer {
  constructor(url, model) {
    super(url, model);
  }

  async getProducts(id) {
    return await super.getById(id)?.productos;
  }

  async save() {
    const cart = await super.save(new cartModel());
    return cart;
  }

  async saveProduct(cartId, product) {
    let cart = await super.getById(cartId);
    if (cart === null) {
      return null;
    }

    let existingProd = cart.productos.find((x) => x.producto == product.id);
    if (existingProd) {
      let filter = { "productos._id": existingProd._id };
      let update = {
        $set: {
          "productos.$.cantidad": existingProd.cantidad + product.cantidad,
        },
      };
      let options = { new: true };
      return await super.findOneAndUpdate(filter, update, options);
    } else {
      cart.productos.push({ producto: product.id, cantidad: product.cantidad });
      return await super.update(cartId, cart);
    }
  }

  async deleteProduct(cartId, productId) {
    let cart = await super.getById(cartId);
    if (cart === null) {
      return null;
    }
    let existingProd = cart.productos.find((x) => x.producto == productId);
    if (existingProd === null) {
      return null;
    }
    return await super.update(cartId, {
      $pull: {
        productos: { _id: existingProd._id },
      },
    });
  }
}

module.exports = { CartMongoDAO };
