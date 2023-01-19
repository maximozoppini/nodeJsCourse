const defaultLogger = require("../../config/logger");

const isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    defaultLogger.info("usuario autenticado");
    return next();
  }
  defaultLogger.info("usuario no autenticado");
  defaultLogger.warn("usuario no autenticado");
  return res
    .status(401)
    .json({ statusCode: 400, message: "not authenticated" });
};

module.exports = { isLoggedIn };
