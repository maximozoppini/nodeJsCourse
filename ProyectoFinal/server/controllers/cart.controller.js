const { CartService } = require("../services/cart.service");
const service = new CartService();

const getUserCart = async (req, res, next) => {
  try {
    const cart = await service.getDocument({
      user: req.user._id,
    });
    res.status(200).json(cart?.productos ?? { error: "carrito no encontrado" });
  } catch (error) {
    next(error);
  }
};

const getCartProduct = async (req, res, next) => {
  try {
    if (req.params.id === undefined || req.params.id === null) {
      res.status(400).json({ error: "parametro incorrecto" });
    }
    const cart = await service.getById(req.params.id);
    res.status(200).json(cart?.productos ?? { error: "carrito no encontrado" });
  } catch (error) {
    next(error);
  }
};

const saveCart = async (req, res, next) => {
  try {
    const cart = await service.save(req.user._id);
    res.status(200).json(cart ?? { error: "no se pudo registrar el carrito" });
  } catch (error) {
    next(error);
  }
};

const deleteCart = async (req, res, next) => {
  try {
    if (req.params.id === undefined || req.params.id === null) {
      res.status(400).json({ error: "parametro incorrecto" });
    }
    const result = await service.deleteById(req.params.id);
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
};

const addUserCartProduct = async (req, res, next) => {
  try {
    const result = await service.saveProduct(req.user._id, null, req.body);
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
};

const addCartProduct = async (req, res, next) => {
  try {
    if (req.params.id === undefined || req.params.id === null) {
      res.status(400).json({ error: "parametro incorrecto" });
    }
    const result = await service.saveProduct(null, req.params.id, req.body);
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
};

const buyUserCart = async (req, res, next) => {
  try {
    const result = await service.buyCart(req.user._id);
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
};

const deleteCartProduct = async (req, res, next) => {
  try {
    if (
      req.params.id === undefined ||
      req.params.id === null ||
      req.params.id_prod === undefined ||
      req.params.id_prod === null
    ) {
      res.status(400).json({ error: "parametro incorrecto" });
    }
    const result = await service.deleteProduct(
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
};

module.exports = {
  getUserCart,
  getCartProduct,
  saveCart,
  deleteCart,
  addUserCartProduct,
  addCartProduct,
  buyUserCart,
  deleteCartProduct,
};
