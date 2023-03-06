const { messageMongoDAO } = require("./messageMongo.dao");

const messageFactory = (type = "MONGO") => {
  if (type === "MONGO") {
    return messageMongoDAO.getInstance(process.env.MONGODBURL);
  }
};

module.exports = messageFactory;
