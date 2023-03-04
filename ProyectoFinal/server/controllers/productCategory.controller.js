const {
  ProductCategoryService,
} = require("../services/product.category.service");
const service = new ProductCategoryService();

const getAll = async (req, res, next) => {
  try {
    const productCategories = await service.getAll();
    res.status(200).json(productCategories);
  } catch (error) {
    next(error);
  }
};

const getById = async (req, res, next) => {
  try {
    if (req.params.id === undefined || req.params.id === null) {
      res.status(400).json({ error: "parametro incorrecto" });
    }
    const productCategory = await service.getById(req.params.id);
    res
      .status(200)
      .json(
        productCategory ?? { error: "categoria de producto no encontrado" }
      );
  } catch (error) {
    next(error);
  }
};

const save = async (req, res, next) => {
  try {
    if (req.body.nombre) {
      const productCategory = await service.save(req.body);
      res.status(200).json(
        productCategory ?? {
          error: "no se pudo registrar la categoria del producto",
        }
      );
    } else {
      res.status(400).json({
        error:
          "no se pudo registrar la categoria del producto, verifique el objeto enviado",
      });
    }
  } catch (error) {
    next(error);
  }
};

const update = async (req, res, next) => {
  try {
    if (req.body.nombre) {
      let { nombre, descripcion } = req.body;
      const productCategory = await service.update(req.params.id, {
        nombre,
        descripcion,
      });
      res.status(200).json(
        productCategory ?? {
          error: "no se pudo actualizar la categoria de producto",
        }
      );
    } else {
      res.status(400).json({
        error:
          "no se pudo actualizar la categoria de producto, verifique el objeto enviado",
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
          ? { mensaje: `se elimino la categoria con el id: ${result}` }
          : { error: "categoria no encontrada" }
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
          ? { mensaje: `se eliminaron: ${result} categorias` }
          : { error: "no se eliminaron las categorias" }
      );
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAll,
  getById,
  save,
  update,
  deleteById,
  deleteAll,
};
