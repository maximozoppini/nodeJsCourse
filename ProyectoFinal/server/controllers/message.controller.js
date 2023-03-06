const { messageService } = require("../services/message.service");
const service = new messageService();

const chat = async (req, res, next) => {
  try {
    const chats = await service.getAll();
    res.status(200).json(chats);
  } catch (error) {
    next(error);
  }
};

const chatUser = async (req, res, next) => {
  try {
    if (req.params.email === undefined || req.params.email === null) {
      res.status(400).json({ error: "parametro incorrecto" });
    }
    const product = await service.getAll({ email: req.params.email });
    res.status(200).json(product ?? { error: "usuario no encontrado" });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  chat,
  chatUser,
};
