const express = require("express");
const cartFactory = require("../daos/cart/cart.dao.factory");

const routerCart = express.Router();
const cartDao = cartFactory(process.env.DAOTYPE);

routerCart.use(handleErrors);

routerCart.get("/:id/productos", async (req, res, next) => {
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

routerCart.post("/", async (req, res, next) => {
  try {
    const carrito = await cartDao.save();
    res
      .status(200)
      .json(carrito ?? { error: "no se pudo registrar el carrito" });
  } catch (error) {
    next(error);
  }
});

routerCart.delete("/:id", async (req, res, next) => {
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

routerCart.post("/:id/productos", async (req, res, next) => {
  try {
    if (req.params.id === undefined || req.params.id === null) {
      res.status(400).json({ error: "parametro incorrecto" });
    }
    const result = await cartDao.saveProduct(req.params.id, req.body);
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

routerCart.delete("/:id/productos/:id_prod", async (req, res, next) => {
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
});

function handleErrors(err, req, res, next) {
  console.log(err);
  res.status(500).send("An internal server error occurred");
}

module.exports = { routerCart };
