const passport = require("passport");
const { generateToken } = require("../config/jwt.config");
const { UserService } = require("../services/user.service");
const userService = new UserService();

const login = async (req, res, next) => {
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
};

const logout = async (req, res, next) => {
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
};

//TODO: ARREGLAR EL LOGIN PORQUE NO DEBERIA EJECUTAR ESO SINO GENERAR UN TOKEN
const register = async (req, res, next) => {
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
};

const getUserProfile = async (req, res, next) => {
  try {
    res.status(200).json(await userService.getById(req.user._id));
  } catch (error) {
    next(error);
  }
};

const facebookAuth = (req, res, next) => {
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
};

const googleAuth = (req, res, next) => {
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
};
module.exports = {
  login,
  logout,
  register,
  getUserProfile,
  facebookAuth,
  googleAuth,
};
