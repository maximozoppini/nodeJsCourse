const { UserMongoDAO } = require("./userMongo.dao");

const userFactory = (type = "MONGO") => {
  if (type === "MONGO") {
    return UserMongoDAO.getInstance(process.env.MONGODBURL);
  }
};

module.exports = userFactory;
