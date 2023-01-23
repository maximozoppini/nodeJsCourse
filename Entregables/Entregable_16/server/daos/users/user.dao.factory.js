const { UserMongoDAO } = require("./userMongo.dao");

const userFactory = (type = "FS") => {
  if (type === "MONGO") {
    return UserMongoDAO.getInstance(process.env.MONGODBURL);
  }
};

module.exports = userFactory;
