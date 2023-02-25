const express = require("express");
const passport = require("passport");
const upload = require("../lib/multer.controller");
const { generateToken } = require("../config/jwt.config");
const userFactory = require("../daos/users/user.dao.factory");

const routerUsuario = express.Router();
const userDao = userFactory(process.env.DAOTYPE);

routerUsuario.get(
  "/login",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    res.status(200).json(req.user);
  }
);

routerUsuario.post("/login", async (req, res, next) => {
  try {
    passport.authenticate(
      "login",
      { session: false },
      (error, user, message) => {
        if (error) {
          return next(error);
        }
        if (!user) {
          return res.status(401).json(message);
        }
        if (user) {
          res.cookie("auth", generateToken(user), {
            domain: process.env.DOMAIN_NAME,
          });
          return res.status(200).json({ message: "exito" });
        }
      }
    )(req, res, next);
  } catch (error) {
    next(error);
  }
});

routerUsuario.post("/logout", async (req, res, next) => {
  try {
    res.clearCookie("auth");
    res.status(200).json({
      status: "success",
    });
  } catch (e) {
    res
      .status(500)
      .json({ status: "error", message: "Algo salio mal al hacer logout" });
  }
});

routerUsuario.post(
  "/register",
  upload.single("avatar"),
  async (req, res, next) => {
    try {
      passport.authenticate("register", (error, user, message) => {
        if (error) {
          return next(error);
        }
        if (!user) {
          return res.status(401).json(message);
        }
        req.logIn(user, (error) => {
          if (error) {
            return next({ message: error });
          }
          return res.status(200).json({ message: "exito", user });
        });
      })(req, res, next);
    } catch (error) {
      next(error);
    }
  }
);

routerUsuario.get(
  "/user/profile",
  passport.authenticate("jwt"),
  async (req, res) => {
    res.status(200).json(await userDao.getById(req.session.passport.user));
  }
);

routerUsuario.get(
  "/auth/loginFacebook",
  passport.authenticate("facebook", { scope: ["email"] })
);

routerUsuario.get("/auth/facebook", (req, res, next) => {
  try {
    passport.authenticate(
      "facebook",
      { session: false },
      (error, user, message) => {
        if (error) {
          return next(error);
        }
        if (!user) {
          return res.status(401).json(message);
        }
        if (user) {
          res.cookie("auth", generateToken(user), {
            domain: process.env.DOMAIN_NAME,
          });
          return res.status(200).json({ message: "exito" });
        }
      }
    )(req, res, next);
  } catch (error) {
    next(error);
  }
});

routerUsuario.get(
  "/auth/loginGoogle",
  passport.authenticate("google", { scope: ["email"] })
);

routerUsuario.get("/auth/google", (req, res, next) => {
  try {
    passport.authenticate(
      "google",
      { session: false },
      (error, user, message) => {
        if (error) {
          return next(error);
        }
        if (!user) {
          return res.status(401).json(message);
        }
        if (user) {
          res.cookie("auth", generateToken(user), {
            domain: process.env.DOMAIN_NAME,
          });
          return res.status(200).json({ message: "exito" });
        }
      }
    )(req, res, next);
  } catch (error) {
    next(error);
  }
});

module.exports = { routerUsuario };
