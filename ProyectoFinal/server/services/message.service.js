const messageFactory = require("../daos/messages/message.dao.factory");
const { BaseService } = require("./base.service");

class messageService extends BaseService {
  constructor() {
    super(messageFactory(process.env.DAOTYPE));
  }
}

module.exports = { messageService };
