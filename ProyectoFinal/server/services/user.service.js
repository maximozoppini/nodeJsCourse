const userFactory = require("../daos/users/user.dao.factory");
const { BaseService } = require("./base.service");

// require("dotenv").config();

class UserService extends BaseService {
  constructor() {
    this.dao = userFactory(process.env.DAOTYPE);
  }

  // async save(user) {
  //   let newUser = await this.dao.save(user);
  //   return newUser;
  // }

  // async getDocument(filter) {
  //   return await this.dao.getDocument(filter);
  // }

  // async getById(id) {
  //   return await this.dao.getById(id);
  // }
}

module.exports = { UserService };
