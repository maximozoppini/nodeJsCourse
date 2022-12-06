const { MongoDbContainer } = require("../../containers/mongoDbContainer");
const userModel = require("../../models/user.model");

class UserMongoDAO extends MongoDbContainer {
  constructor(url, model) {
    super(url, model);
  }

  async save(user) {
    let newUser = await super.save(new userModel(user));
    return newUser;
  }
}

module.exports = { UserMongoDAO };
