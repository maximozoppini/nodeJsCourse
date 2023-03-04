const express = require("express");
const routerCart = express.Router();
const cartController = require("../controllers/cart.controller");

routerCart.get("/", cartController.getUserCart);

routerCart.get("/:id/productos", cartController.getCartProduct);

routerCart.post("/", cartController.saveCart);

routerCart.delete("/:id", cartController.deleteCart);

routerCart.post("/productos", cartController.addUserCartProduct);

routerCart.post("/:id/productos", cartController.addCartProduct);

routerCart.post("/buy", cartController.buyUserCart);

routerCart.delete("/:id/productos/:id_prod", cartController.deleteCartProduct);

module.exports = { routerCart };
