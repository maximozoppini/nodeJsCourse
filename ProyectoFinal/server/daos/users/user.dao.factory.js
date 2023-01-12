const userModel = require("../../models/user.model");
const { UserMongoDAO } = require("./userMongo.dao");

const userFactory = (type = "FS") => {
  if (type === "MONGO") {
    return new UserMongoDAO(process.env.MONGODBURL, userModel);
  }
  console.log(
    "🚀 ~ file: user.dao.factory.js:8 ~ userFactory ~ process.env.MONGODBURL",
    process.env.MONGODBURL
  );
};

module.exports = userFactory;
