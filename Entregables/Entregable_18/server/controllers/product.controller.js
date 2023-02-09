const { ProductService } = require("../services/product.service");

const service = new ProductService();

const getAll = async (req, res, next) => {
  try {
    const productos = await service.getAll();
    res.status(200).json(productos);
  } catch (error) {
    next(error);
  }
};

const getById = async (req, res, next) => {
  try {
    if (req.params.id === undefined || req.params.id === null) {
      res.status(400).json({ error: "parametro incorrecto" });
    }
    const producto = await service.getById(req.params.id);
    res.status(200).json(producto ?? { error: "producto no encontrado" });
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
      !Number.isNaN(req.body.stock)
    ) {
      const producto = await service.save(req.body);
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
};

const update = async (req, res, next) => {
  try {
    if (
      req.body.nombre &&
      !Number.isNaN(req.body.precio) &&
      req.body.codigo &&
      !Number.isNaN(req.body.stock)
    ) {
      let { nombre, descripcion, codigo, url, precio, stock } = req.body;
      const producto = await service.update(req.params.id, {
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

const getProductByIdGraph = async ({ id }) => {
  try {
    const producto = await service.getById(id);
    if (!producto) throw new Error("producto no encontrado");
    return {
      id: producto._id,
      title: producto.title,
      price: producto.price,
      thumbnail: producto.thumbnail,
    };
  } catch (error) {
    throw new Error("error producto get by Id");
  }
};

const getProductsGraph = async () => {
  try {
    const productos = await service.getAll();
    if (!productos) throw new Error("no hay productos");

    return productos.map((x) => ({
      id: x._id,
      title: x.title,
      price: x.price,
      thumbnail: x.thumbnail,
    }));
  } catch (error) {
    throw new Error("error producto getAll");
  }
};

const createProductGraph = async ({ data }) => {};

module.exports = {
  getAll,
  getById,
  save,
  update,
  deleteById,
  deleteAll,
  getProductByIdGraph,
  getProductsGraph,
};
