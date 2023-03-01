const userFactory = require("../daos/users/user.dao.factory");
const { BaseService } = require("./base.service");

class UserService extends BaseService {
  constructor() {
    super(userFactory(process.env.DAOTYPE));
  }
}

module.exports = { UserService };
