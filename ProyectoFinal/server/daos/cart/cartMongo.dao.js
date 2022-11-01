const { MongoDbContainer } = require("../../containers/mongoDbContainer");
const cartModel = require("../../models/cart.model");
var util = require("util");

class CartMongoDAO extends MongoDbContainer {
  constructor(url, model) {
    super(url, model);
  }

  async getProducts(id) {
    // return await super.getById(id)?.productos;
    let result = await super.getById(id);
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

    console.log("carrito antes", util.inspect(cart, true, null));
    let existingProd = cart.productos.find((x) => x.producto == product.id);
    console.log("producto encontrado", existingProd);
    if (existingProd) {
      cart.productos.map((prod) => {
        if (prod.producto == product.id) {
          console.log("el producto q se encontro", prod);
          let nuevoProd = {
            producto: prod.producto,
            cantidad: Number(prod.cantidad) + product.cantidad,
          };
          console.log("nuevo producto", nuevoProd);
          return nuevoProd;
        } else {
          return prod;
        }
      });
    } else {
      cart.productos.push({ producto: product.id, cantidad: product.cantidad });
    }
    console.log("carrito despues", util.inspect(cart, true, null));

    return await super.update(cartId, cart);
  }

  async deleteProduct(cartId, productId) {
    return await super.update(cartId, cart);
  }
}

module.exports = { CartMongoDAO };
