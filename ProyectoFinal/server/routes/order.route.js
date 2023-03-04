const express = require("express");
const routerOrder = express.Router();
const passport = require("passport");
const orderController = require("../controllers/order.controller");

routerOrder.get("/", orderController.getUserOrders);

routerOrder.get("/:id", orderController.getUserOrder);

module.exports = { routerOrder };
