require("dotenv").config();
const { UserMongoDAO } = require("../daos/users/userMongo.dao");

class UserService {
  constructor() {
    this.dao = new UserMongoDAO(process.env.MONGODBURL);
  }

  async save(user) {
    let newUser = await this.dao.save(user);
    return newUser;
  }

  async getDocument(filter) {
    return await this.dao.getDocument(filter);
  }

  async getById(id) {
    return await this.dao.getById(id);
  }
}

module.exports = { UserService };
