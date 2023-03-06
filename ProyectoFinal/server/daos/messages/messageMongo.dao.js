const { MongoDbContainer } = require("../../containers/mongoDbContainer");
const messageModel = require("../../models/message.model");

class messageMongoDAO extends MongoDbContainer {
  constructor(url) {
    super(url, messageModel);
  }

  async save(message) {
    return await super.save(new messageModel(message));
  }

  static getInstance(url) {
    if (!this.instance) {
      this.instance = new messageMongoDAO(url);
    }
    return this.instance;
  }
}

module.exports = { messageMongoDAO };
