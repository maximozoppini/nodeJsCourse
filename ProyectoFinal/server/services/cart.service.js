const cartFactory = require("../daos/cart/cart.dao.factory");
const orderFactory = require("../daos/orders/order.dao.factory");
const productFactory = require("../daos/product/product.dao.factory");
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
    this.productDao = productFactory(process.env.DAOTYPE);
  }

  async save(userId) {
    //check if User has already a cart created.
    const userCart = await this.dao.getDocument({ user: userId });
    if (!userCart) {
      return await this.dao.save(userId);
    }
    return userCart;
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
      return { success: false, message: "carrito no encontrado" };
    }
    if (cart.productos.length == 0) {
      return { success: false, message: "carrito vacio" };
    }

    let order = {
      user: userId,
      productos: [],
      total: 0,
    };

    let outOfStock;
    for (let index = 0; index < cart.productos.length; index++) {
      const product = cart.productos[index];
      let dbProduct = await this.productDao.getById(product.producto._id);

      if (product.cantidad > dbProduct.stock) {
        outOfStock = dbProduct;
        break;
      }

      order.productos.push({
        nombre: product.producto.nombre,
        descripcion: product.producto.descripcion,
        precio: product.producto.precio,
        codigo: product.producto.codigo,
        url: product.producto.url,
        cantidad: product.cantidad,
      });
      order.total += product.cantidad * product.producto.precio;

      await this.productDao.updateStock(
        product.producto._id,
        dbProduct.stock - product.cantidad
      );
    }

    if (outOfStock) {
      return {
        success: false,
        message: `no hay stock suficiente del producto: ${outOfStock.nombre}`,
      };
    }

    //create order
    const orderResult = await this.orderDao.save(order);
    //delete existing cart
    await super.deleteById(cart.id);

    //send emails
    sendPurchaseMsgToAdmin(user);
    sendPurchaseMsgToUser(user);

    return {
      success: true,
      message: `Se genero la orden num: ${orderResult.numeroOrden} por un total de: $${orderResult.total}.`,
    };
  }
}

module.exports = { CartService };
