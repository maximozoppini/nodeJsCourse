const express = require("express");
const productController = require("../controllers/product.controller");
const routerProduct = express.Router();
const passport = require("passport");

routerProduct.get("/", productController.getAll);
routerProduct.get("/id/:id", productController.getById);
routerProduct.get("/categoria/:categoria", productController.getByCategory);

routerProduct.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  productController.save
);

routerProduct.put(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  productController.update
);

routerProduct.delete(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  productController.deleteById
);

routerProduct.delete(
  "/",
  passport.authenticate("jwt", { session: false }),
  productController.deleteAll
);

module.exports = { routerProduct };
