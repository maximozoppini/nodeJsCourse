const { MongoDbContainer } = require("../../containers/mongoDbContainer");
const userModel = require("../../models/user.model");

class UserMongoDAO extends MongoDbContainer {
  constructor(url) {
    super(url, userModel);
  }

  async save(user) {
    let newUser = await super.save(new userModel(user));
    return newUser;
  }

  static getInstance(url) {
    if (!this.instance) {
      this.instance = new UserMongoDAO(url);
    }
    return this.instance;
  }
}

module.exports = { UserMongoDAO };
