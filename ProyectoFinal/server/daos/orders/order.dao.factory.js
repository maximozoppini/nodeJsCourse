const { orderMongoDAO } = require("./orderMongo.dao");

const orderFactory = (type = "MONGO") => {
  if (type === "MONGO") {
    return orderMongoDAO.getInstance(process.env.MONGODBURL);
  }
};

module.exports = orderFactory;
