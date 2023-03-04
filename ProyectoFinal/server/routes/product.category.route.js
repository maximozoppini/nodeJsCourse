const express = require("express");
const productCategoryController = require("../controllers/productCategory.controller");
const routerProductCategory = express.Router();
const passport = require("passport");

routerProductCategory.get("/", productCategoryController.getAll);
routerProductCategory.get("/:id", productCategoryController.getById);

routerProductCategory.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  productCategoryController.save
);

routerProductCategory.put(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  productCategoryController.update
);

routerProductCategory.delete(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  productCategoryController.deleteById
);

routerProductCategory.delete(
  "/",
  passport.authenticate("jwt", { session: false }),
  productCategoryController.deleteAll
);

module.exports = { routerProductCategory };
