const userModel = require("../../models/user.model");
const { UserMongoDAO } = require("./userMongo.dao");

const userFactory = (type = "FS") => {
  if (type === "MONGO") {
    return new UserMongoDAO(process.env.MONGODBURL, userModel);
  }
};

module.exports = userFactory;
