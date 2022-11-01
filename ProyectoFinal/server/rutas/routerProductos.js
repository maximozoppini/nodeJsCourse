const express = require("express");
const productFactory = require("../daos/product/product.dao.factory");
var index = require("../index");

const routerProduct = express.Router();
const productDao = productFactory(process.env.DAOTYPE);

routerProduct.use(handleErrors);

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

routerProduct.post("/", checkUser, async (req, res, next) => {
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

routerProduct.put("/:id", checkUser, async (req, res, next) => {
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

routerProduct.delete("/:id", checkUser, async (req, res, next) => {
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

routerProduct.delete("/", checkUser, async (req, res, next) => {
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

function checkUser(req, res, next) {
  if (!index.logged) {
    res.status(401).json({
      error: -1,
      descripcion: `ruta ${req.baseUrl} método ${req.method} no autorizada`,
    });
  }
  next();
}

function handleErrors(err, req, res, next) {
  console.log(err);
  res.status(500).send("An internal server error occurred");
}

module.exports = { routerProduct };
