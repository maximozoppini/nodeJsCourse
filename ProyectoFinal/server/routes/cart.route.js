const express = require("express");
const routerCart = express.Router();
const passport = require("passport");
const cartController = require("../controllers/cart.controller");

routerCart.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  cartController.getUserCart
);

routerCart.get(
  "/:id/productos",
  passport.authenticate("jwt", { session: false }),
  cartController.getCartProduct
);

routerCart.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  cartController.saveCart
);

routerCart.delete(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  cartController.deleteCart
);

routerCart.post(
  "/productos",
  passport.authenticate("jwt", { session: false }),
  cartController.addUserCartProduct
);

routerCart.post(
  "/:id/productos",
  passport.authenticate("jwt", { session: false }),
  cartController.addCartProduct
);

routerCart.post(
  "/buy",
  passport.authenticate("jwt", { session: false }),
  cartController.buyUserCart
);

routerCart.delete(
  "/:id/productos/:id_prod",
  passport.authenticate("jwt", { session: false }),
  cartController.deleteCartProduct
);

module.exports = { routerCart };
