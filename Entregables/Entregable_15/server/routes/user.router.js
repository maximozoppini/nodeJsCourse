const express = require("express");
const userController = require("../controllers/user.controller");
const loggedMiddelware = require("./middelwares/logged.middelware");
const routerSession = express.Router();

routerSession.get(
  "/productos-test",
  loggedMiddelware.isLoggedIn,
  userController.productTest
);

routerSession.get("/login", loggedMiddelware.isLoggedIn, (req, res) => {
  res.status(200).json(req.user);
});

routerSession.post("/login", userController.login);

routerSession.get("/logout", userController.logout);

routerSession.post("/register", userController.register);

module.exports = { routerSession };
