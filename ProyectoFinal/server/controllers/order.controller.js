const { orderService } = require("../services/order.service");
const service = new orderService();

const getUserOrder = async (req, res, next) => {
  try {
    const orden = await service.getAll(
      {
        user: req.user._id,
        _id: req.params.id,
      },
      ["productos"]
    );
    res.status(200).json(orden ?? { error: "orden no encontrada" });
  } catch (error) {
    next(error);
  }
};

const getUserOrders = async (req, res, next) => {
  try {
    const orders = await service.getAll(
      {
        user: req.user._id,
      },
      ["productos"]
    );
    res.status(200).json(orders ?? { error: "no hay ordenes" });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getUserOrder,
  getUserOrders,
};
