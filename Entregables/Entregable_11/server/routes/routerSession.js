const express = require("express");
const { faker } = require("@faker-js/faker");
const passport = require("passport");

const routerSession = express.Router();

const isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  return res
    .status(401)
    .json({ statusCode: 400, message: "not authenticated" });
};

routerSession.get("/productos-test", isLoggedIn, (req, res) => {
  let response = [];
  for (let index = 0; index <= 5; index++) {
    response.push({
      title: faker.commerce.product(),
      price: faker.commerce.price(),
      thumbnail: faker.image.abstract(300, 300, true),
    });
  }
  res.json(response);
});

routerSession.get("/login", isLoggedIn, (req, res) => {
  res.status(200).json(req.user);
});

routerSession.post("/login", async (req, res, next) => {
  try {
    passport.authenticate("login", (error, user) => {
      if (error) {
        next(error);
      }
      if (!user) {
        res
          .status(401)
          .json({ message: "usuario inexistente o password incorrecta" });
      }
      req.logIn(user, (error) => {
        if (error) {
          next(error);
        }
        res.status(200).json({ message: "exito", user });
      });
    })(req, res, next);
  } catch (error) {
    next(error);
  }
});

routerSession.get("/logout", async (req, res) => {
  try {
    await req.session.destroy();
    res.clearCookie("session-id");
    res.status(200).json({
      status: "success",
      message: "Session cerrada",
    });
  } catch (e) {
    res
      .status(500)
      .json({ status: "error", message: "Algo salio mal al hacer logout" });
  }
});

routerSession.post("/register", async (req, res) => {
  try {
    passport.authenticate("register", (error, user) => {
      if (error) {
        res.status(500).json({ message: error });
      }
      if (!user) {
        res.status(401).json({ message: "usuario ya existe" });
      }
      req.logIn(user, (error) => {
        if (error) {
          res.status(401).json({ message: "no se pudo loguear" });
        }
        res.status(200).json({ message: "exito", user });
      });
    })(req, res);
  } catch (error) {
    res.status(500).json({ message: error });
  }
});

module.exports = { routerSession };
