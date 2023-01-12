const express = require("express");
const cartFactory = require("../daos/cart/cart.dao.factory");

const routerCart = express.Router();
const cartDao = cartFactory(process.env.DAOTYPE);

const isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  return res
    .status(401)
    .json({ statusCode: 400, message: "not authenticated" });
};

routerCart.get("/", isLoggedIn, async (req, res, next) => {
  try {
    const carrito = await cartDao.getDocument({
      user: req.session.passport.user,
    });
    res
      .status(200)
      .json(carrito?.productos ?? { error: "carrito no encontrado" });
  } catch (error) {
    next(error);
  }
});

routerCart.get("/:id/productos", isLoggedIn, async (req, res, next) => {
  try {
    if (req.params.id === undefined || req.params.id === null) {
      res.status(400).json({ error: "parametro incorrecto" });
    }
    const carrito = await cartDao.getById(req.params.id);
    res
      .status(200)
      .json(carrito?.productos ?? { error: "carrito no encontrado" });
  } catch (error) {
    next(error);
  }
});

routerCart.post("/", isLoggedIn, async (req, res, next) => {
  try {
    const carrito = await cartDao.save(req.session.passport.user);
    res
      .status(200)
      .json(carrito ?? { error: "no se pudo registrar el carrito" });
  } catch (error) {
    next(error);
  }
});

routerCart.delete("/:id", isLoggedIn, async (req, res, next) => {
  try {
    if (req.params.id === undefined || req.params.id === null) {
      res.status(400).json({ error: "parametro incorrecto" });
    }
    const result = await cartDao.deleteById(req.params.id);
    res
      .status(200)
      .json(
        result !== null
          ? { mensaje: `se elimino el carrito con el id: ${result}` }
          : { error: "carrito no encontrado" }
      );
  } catch (error) {
    next(error);
  }
});

routerCart.post("/productos", isLoggedIn, async (req, res, next) => {
  try {
    const result = await cartDao.saveProduct(
      req.session.passport.user,
      null,
      req.body
    );
    res.status(200).json(
      result !== null
        ? {
            mensaje: `se agrego al carrito con el id: ${result.id}, el producto: ${req.body.id}`,
          }
        : { error: "carrito o producto no encontrado" }
    );
  } catch (error) {
    next(error);
  }
});

routerCart.post("/:id/productos", isLoggedIn, async (req, res, next) => {
  try {
    if (req.params.id === undefined || req.params.id === null) {
      res.status(400).json({ error: "parametro incorrecto" });
    }
    const result = await cartDao.saveProduct(null, req.params.id, req.body);
    res.status(200).json(
      result !== null
        ? {
            mensaje: `se agrego al carrito con el id: ${result.id}, el producto: ${req.body.id}`,
          }
        : { error: "carrito o producto no encontrado" }
    );
  } catch (error) {
    next(error);
  }
});

routerCart.post("/buy", isLoggedIn, async (req, res, next) => {
  try {
    const result = await cartDao.buyCart(req.session.passport.user);
    res.status(200).json(
      result !== null
        ? {
            mensaje: `se compro al carrito con el id: ${result.id}`,
          }
        : { error: "carrito o producto no se pudo comprar" }
    );
  } catch (error) {
    next(error);
  }
});

routerCart.delete(
  "/:id/productos/:id_prod",
  isLoggedIn,
  async (req, res, next) => {
    try {
      if (
        req.params.id === undefined ||
        req.params.id === null ||
        req.params.id_prod === undefined ||
        req.params.id_prod === null
      ) {
        res.status(400).json({ error: "parametro incorrecto" });
      }
      const result = await cartDao.deleteProduct(
        req.params.id,
        req.params.id_prod
      );
      res.status(200).json(
        result !== null
          ? {
              mensaje: `se elimino del carrito con el id: ${result.id} el producto`,
            }
          : { error: "carrito o producto no encontrado" }
      );
    } catch (error) {
      next(error);
    }
  }
);

module.exports = { routerCart };
