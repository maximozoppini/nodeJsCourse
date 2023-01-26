const express = require("express");
const passport = require("passport");
const upload = require("../lib/multer.controller");
const { generateToken } = require("../config/jwt.config");
const userFactory = require("../daos/users/user.dao.factory");

const routerUsuario = express.Router();
const userDao = userFactory(process.env.DAOTYPE);

const isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  return res
    .status(401)
    .json({ statusCode: 400, message: "not authenticated" });
};

routerUsuario.get(
  "/login",
  //isLoggedIn,
  passport.authenticate("jwt"),
  (req, res) => {
    res.status(200).json(req.user);
  }
);

routerUsuario.post("/login", async (req, res, next) => {
  try {
    passport.authenticate("login", (error, user, message) => {
      if (error) {
        return next(error);
      }
      if (!user) {
        return res.status(401).json(message);
      }
      if (user) {
        req.logIn(user, (error) => {
          if (error) {
            return res.json(500).json({ message: "error en el servidor" });
          }
          return res
            .status(200)
            .json({ message: "exito", token: generateToken(user) });
        });
      }
    })(req, res, next);
  } catch (error) {
    next(error);
  }
});

routerUsuario.post("/logout", async (req, res, next) => {
  try {
    req.session.destroy();
    res.clearCookie("session-id");
    req.logOut();
    req.logout();
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

routerUsuario.get("/user/profile", isLoggedIn, async (req, res) => {
  res.status(200).json(await userDao.getById(req.session.passport.user));
});

routerUsuario.get(
  "/auth/loginFacebook",
  passport.authenticate("facebook", { scope: ["email"] })
);

routerUsuario.get("/auth/facebook", (req, res, next) => {
  try {
    passport.authenticate("facebook", (error, user, message) => {
      if (error) {
        return next(error);
      }
      if (!user) {
        return res.status(401).json(message);
      }
      if (user) {
        req.logIn(user, (error) => {
          if (error) {
            return res.json(500).json({ message: "error en el servidor" });
          }
          return res.status(200).json({ message: "exito" });
        });
      }
    })(req, res, next);
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
    passport.authenticate("google", (error, user, message) => {
      if (error) {
        return next(error);
      }
      if (!user) {
        return res.status(401).json(message);
      }
      if (user) {
        req.logIn(user, (error) => {
          if (error) {
            return res.json(500).json({ message: "error en el servidor" });
          }
          return res.status(200).json({ message: "exito" });
        });
      }
    })(req, res, next);
  } catch (error) {
    next(error);
  }
});

module.exports = { routerUsuario };
