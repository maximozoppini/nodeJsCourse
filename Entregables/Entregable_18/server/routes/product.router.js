const express = require("express");
const loggedMiddelware = require("./middelwares/logged.middelware");
const productController = require("../controllers/product.controller");
const routerProduct = express.Router();

routerProduct.get("/", productController.getAll);

routerProduct.get("/:id", productController.getById);

routerProduct.post("/", loggedMiddelware.isLoggedIn, productController.save);

routerProduct.put(
  "/:id",
  loggedMiddelware.isLoggedIn,
  productController.update
);

routerProduct.delete(
  "/:id",
  loggedMiddelware.isLoggedIn,
  productController.deleteById
);

routerProduct.delete(
  "/",
  loggedMiddelware.isLoggedIn,
  productController.deleteAll
);

module.exports = { routerProduct };
