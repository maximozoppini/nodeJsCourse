const express = require("express");
const productFactory = require("../daos/product/product.dao.factory");

const routerProduct = express.Router();
const productDao = productFactory(process.env.DAOTYPE);

const isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  return res
    .status(401)
    .json({ statusCode: 400, message: "not authenticated" });
};

routerProduct.get("/", async (req, res, next) => {
  try {
    const productos = await productDao.getAll();
    res.status(200).json(productos);
  } catch (error) {
    next(error);
  }
});

routerProduct.get("/:id", async (req, res, next) => {
  try {
    if (req.params.id === undefined || req.params.id === null) {
      res.status(400).json({ error: "parametro incorrecto" });
    }
    const producto = await productDao.getById(req.params.id);
    res.status(200).json(producto ?? { error: "producto no encontrado" });
  } catch (error) {
    next(error);
  }
});

routerProduct.post("/", isLoggedIn, async (req, res, next) => {
  try {
    if (
      req.body.nombre &&
      !Number.isNaN(req.body.precio) &&
      req.body.codigo &&
      !Number.isNaN(req.body.stock)
    ) {
      const producto = await productDao.save(req.body);
      res
        .status(200)
        .json(producto ?? { error: "no se pudo registrar el producto" });
    } else {
      res.status(400).json({
        error: "no se pudo registrar el producto, verifique el objeto enviado",
      });
    }
  } catch (error) {
    next(error);
  }
});

routerProduct.put("/:id", isLoggedIn, async (req, res, next) => {
  try {
    if (
      req.body.nombre &&
      !Number.isNaN(req.body.precio) &&
      req.body.codigo &&
      !Number.isNaN(req.body.stock)
    ) {
      let { nombre, descripcion, codigo, url, precio, stock } = req.body;
      const producto = await productDao.update(req.params.id, {
        nombre,
        descripcion,
        codigo,
        url,
        precio,
        stock,
      });
      res
        .status(200)
        .json(producto ?? { error: "no se pudo actualizar el producto" });
    } else {
      res.status(400).json({
        error: "no se pudo actualizar el producto, verifique el objeto enviado",
      });
    }
  } catch (error) {
    next(error);
  }
});

routerProduct.delete("/:id", isLoggedIn, async (req, res, next) => {
  try {
    if (req.params.id === undefined || req.params.id === null) {
      res.status(400).json({ error: "parametro incorrecto" });
    }
    const result = await productDao.deleteById(req.params.id);
    res
      .status(200)
      .json(
        result !== null
          ? { mensaje: `se elimino el producto con el id: ${result}` }
          : { error: "producto no encontrado" }
      );
  } catch (error) {
    next(error);
  }
});

routerProduct.delete("/", isLoggedIn, async (req, res, next) => {
  try {
    const result = await productDao.deleteAll();
    res
      .status(200)
      .json(
        result !== 0
          ? { mensaje: `se eliminaron: ${result} productos` }
          : { error: "no se eliminaron productos" }
      );
  } catch (error) {
    next(error);
  }
});

module.exports = { routerProduct };
