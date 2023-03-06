const { ProductService } = require("../services/product.service");
const service = new ProductService();

const getAll = async (req, res, next) => {
  try {
    const products = await service.getAll(null, ["categoria"]);
    res.status(200).json(products);
  } catch (error) {
    next(error);
  }
};

const getById = async (req, res, next) => {
  try {
    if (req.params.id === undefined || req.params.id === null) {
      res.status(400).json({ error: "parametro incorrecto" });
    }
    const product = await service.getById(req.params.id, ["categoria"]);
    res.status(200).json(product ?? { error: "producto no encontrado" });
  } catch (error) {
    next(error);
  }
};

const getByCategory = async (req, res, next) => {
  try {
    if (req.params.categoria === undefined || req.params.categoria === null) {
      res.status(400).json({ error: "parametro incorrecto" });
    }
    const product = await service.getAll({ categoria: req.params.categoria }, [
      "categoria",
    ]);
    res.status(200).json(product ?? { error: "producto no encontrado" });
  } catch (error) {
    next(error);
  }
};

const save = async (req, res, next) => {
  try {
    if (
      req.body.nombre &&
      !Number.isNaN(req.body.precio) &&
      req.body.codigo &&
      !Number.isNaN(req.body.stock) &&
      req.body.categoria
    ) {
      const product = await service.save(req.body);
      res
        .status(200)
        .json(product ?? { error: "no se pudo registrar el producto" });
    } else {
      res.status(400).json({
        error: "no se pudo registrar el producto, verifique el objeto enviado",
      });
    }
  } catch (error) {
    next(error);
  }
};

const update = async (req, res, next) => {
  try {
    if (
      req.body.nombre &&
      !Number.isNaN(req.body.precio) &&
      req.body.codigo &&
      !Number.isNaN(req.body.stock) &&
      req.body.categoria
    ) {
      let { nombre, descripcion, codigo, url, precio, stock, categoria } =
        req.body;
      const product = await service.update(req.params.id, {
        nombre,
        descripcion,
        codigo,
        url,
        precio,
        stock,
        categoria,
      });
      res
        .status(200)
        .json(product ?? { error: "no se pudo actualizar el producto" });
    } else {
      res.status(400).json({
        error: "no se pudo actualizar el producto, verifique el objeto enviado",
      });
    }
  } catch (error) {
    next(error);
  }
};

const deleteById = async (req, res, next) => {
  try {
    if (req.params.id === undefined || req.params.id === null) {
      res.status(400).json({ error: "parametro incorrecto" });
    }
    const result = await service.deleteById(req.params.id);
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
};

const deleteAll = async (req, res, next) => {
  try {
    const result = await service.deleteAll();
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
};

module.exports = {
  getAll,
  getById,
  getByCategory,
  save,
  update,
  deleteById,
  deleteAll,
};
