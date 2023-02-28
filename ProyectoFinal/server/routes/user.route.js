const express = require("express");
const passport = require("passport");
const upload = require("../lib/multer.controller");
const userController = require("../controllers/user.controller");

const routerUser = express.Router();

routerUser.get(
  "/login",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    res.status(200).json(req.user);
  }
);

routerUser.post("/login", userController.login);

routerUser.post("/logout", userController.logout);

routerUser.post("/register", upload.single("avatar"), userController.register);

routerUser.get(
  "/user/profile",
  passport.authenticate("jwt", { session: false }),
  userController.getUserProfile
);

routerUser.get(
  "/auth/loginFacebook",
  passport.authenticate("facebook", { scope: ["email"] })
);

routerUser.get("/auth/facebook", userController.facebookAuth);

routerUser.get(
  "/auth/loginGoogle",
  passport.authenticate("google", { scope: ["email"] })
);

routerUser.get("/auth/google", userController.googleAuth);

module.exports = { routerUser };
