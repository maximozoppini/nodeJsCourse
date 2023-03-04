const cartFactory = require("../daos/cart/cart.dao.factory");
const orderFactory = require("../daos/orders/order.dao.factory");
const userFactory = require("../daos/users/user.dao.factory");
const {
  sendPurchaseMsgToAdmin,
  sendPurchaseMsgToUser,
} = require("../lib/mail.controller");
const { BaseService } = require("./base.service");

class CartService extends BaseService {
  constructor() {
    super(cartFactory(process.env.DAOTYPE));
    this.dao = cartFactory(process.env.DAOTYPE);
    this.userDao = userFactory(process.env.DAOTYPE);
    this.orderDao = orderFactory(process.env.DAOTYPE);
  }

  async saveProduct(userId, cartId, product) {
    let cart = userId
      ? await super.getDocument({ user: userId }, null)
      : await super.getById(cartId, null);

    if (cart === null) {
      return null;
    }

    let existingProd = cart.productos.find((x) => x.producto._id == product.id);
    if (existingProd) {
      let filter = { "productos._id": existingProd._id };
      let update = {
        $set: {
          "productos.$.cantidad": existingProd.cantidad + product.cantidad,
        },
      };
      let options = { new: true };

      return await this.dao.findOneAndUpdate(filter, update, options);
    } else {
      cart.productos.push({ producto: product.id, cantidad: product.cantidad });
      return await super.update(cart.id, cart);
    }
  }

  async deleteProduct(cartId, productId) {
    let cart = await super.getById(cartId);
    if (cart === null) {
      return null;
    }
    let existingProd = cart.productos.find((x) => x.producto._id == productId);
    if (existingProd === null) {
      return null;
    }
    return await super.update(cartId, {
      $pull: {
        productos: { _id: existingProd._id },
      },
    });
  }

  async buyCart(userId) {
    let user = await this.userDao.getById(userId);
    let cart = await super.getDocument({ user: userId }, null);
    if (cart === null) {
      return null;
    }
    if (cart.productos.length == 0) {
      return "no hay productos en el carrito";
    }

    let order = {
      user: userId,
      productos: [],
      total: 0,
    };

    cart.productos.forEach((product) => {
      order.productos.push({
        nombre: product.producto.nombre,
        descripcion: product.producto.descripcion,
        precio: product.producto.precio,
        codigo: product.producto.codigo,
        url: product.producto.url,
        cantidad: product.cantidad,
      });
      order.total += product.cantidad * product.producto.precio;
    });

    const orderResult = this.orderDao.save(order);

    if ((await super.deleteById(cart.id)) == null) {
      return null;
    }

    sendPurchaseMsgToAdmin(user);
    sendPurchaseMsgToUser(user);
    return orderResult;
  }
}

module.exports = { CartService };
