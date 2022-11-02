const { default: mongoose } = require("mongoose");

class MongoDbContainer {
  constructor(url, model) {
    this.url = url;
    this.mongoDb = mongoose.connect;
    this.model = model;
  }

  async save(newModel) {
    try {
      await this.mongoDb(this.url);
      let result = await newModel.save();
      return result;
    } catch (error) {
      throw new Error(error);
    }
  }

  async update(id, newObj) {
    try {
      await this.mongoDb(this.url);
      let result = await this.model.findByIdAndUpdate(id, newObj);
      return result;
    } catch (error) {
      throw new Error(error);
    }
  }

  async findOneAndUpdate(filter, newObj, options = null) {
    try {
      await this.mongoDb(this.url);
      let result = await this.model.findOneAndUpdate(filter, newObj, options);
      return result;
    } catch (error) {
      throw new Error(error);
    }
  }

  async getById(id) {
    try {
      await this.mongoDb(this.url);
      let result = await this.model.findById(id);
      return result ?? null;
    } catch (error) {
      throw new Error(error);
    }
  }

  async getAll() {
    try {
      await this.mongoDb(this.url);
      let result = await this.model.find();
      return result ?? null;
    } catch (error) {
      throw new Error(error);
    }
  }

  async deleteById(id) {
    try {
      await this.mongoDb(this.url);
      let result = await this.model.findByIdAndDelete(id);
      return result ?? null;
    } catch (error) {
      throw new Error(error);
    }
  }

  async deleteAll() {
    try {
      await this.mongoDb(this.url);
      return await this.model.deleteMany({});
    } catch (error) {
      throw new Error(error);
    }
  }
}

module.exports = { MongoDbContainer };
