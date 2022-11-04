const { FirebaseContainer } = require("../../containers/firebaseContainer");

class CartFirebaseDAO extends FirebaseContainer {
  constructor(collection) {
    super(collection);
  }

  async getProducts(id) {
    return await super.getById(id)?.productos;
  }

  async save() {
    const timeStamp = Date.now();
    let newCart = await super.save({
      productos: [],
      timeStamp,
    });
    return newCart;
  }

  async saveProduct(cartId, product) {
    let cart = await super.getById(cartId);
    if (cart === null) {
      return null;
    }
    let found = false;
    cart.productos.forEach((prod) => {
      if (prod.id === product.id) {
        prod.cantidad = prod.cantidad + product.cantidad;
        found = true;
      }
    });
    if (!found) {
      cart.productos.push({ id: product.id, cantidad: product.cantidad });
    }
    return await (
      await super.update(cartId)
    ).update({
      productos: cart.productos,
    });
  }

  async deleteProduct(cartId, productId) {
    let cart = await super.getById(cartId);
    if (cart === null) {
      return null;
    }
    cart.productos = [
      ...cart.productos.filter((prod) => prod.id !== productId),
    ];
    return await (
      await super.update(cartId)
    ).update({
      productos: cart.productos,
    });
  }
}

module.exports = { CartFirebaseDAO };
