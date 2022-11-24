const { MongoDbContainer } = require("../../containers/mongoDbContainer");
const userModel = require("../../models/user.model");

class UserMongoDAO extends MongoDbContainer {
  constructor(url, model) {
    super(url, model);
  }

  async save(user) {
    console.log(
      "🚀 ~ file: userMongo.dao.js ~ line 10 ~ UserMongoDAO ~ save ~ user",
      user
    );

    let newUser = await super.save(new userModel(user));
    return newUser;
  }
}

module.exports = { UserMongoDAO };
