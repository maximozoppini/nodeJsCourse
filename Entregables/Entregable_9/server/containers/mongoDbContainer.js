const { default: mongoose } = require("mongoose");

class MongoDbContainer {
  constructor(url, model) {
    this.url = url;
    this.mongoDb = mongoose.connect;
    this.mongoDb(this.url);
    this.model = model;
  }

  async save(newModel) {
    try {
      let result = await newModel.save();
      return result;
    } catch (error) {
      throw new Error(error);
    }
  }

  async update(id, newObj) {
    try {
      let result = await this.model.findByIdAndUpdate(id, newObj);
      return result;
    } catch (error) {
      throw new Error(error);
    }
  }

  async findOneAndUpdate(filter, newObj, options = null) {
    try {
      let result = await this.model.findOneAndUpdate(filter, newObj, options);
      return result;
    } catch (error) {
      throw new Error(error);
    }
  }

  async getById(id) {
    try {
      let result = await this.model.findById(id);
      return result ?? null;
    } catch (error) {
      throw new Error(error);
    }
  }

  async getAll() {
    try {
      let result = await this.model.find();
      return result ?? null;
    } catch (error) {
      throw new Error(error);
    }
  }

  async deleteById(id) {
    try {
      let result = await this.model.findByIdAndDelete(id);
      return result ?? null;
    } catch (error) {
      throw new Error(error);
    }
  }

  async deleteAll() {
    try {
      return await this.model.deleteMany({});
    } catch (error) {
      throw new Error(error);
    }
  }
}

module.exports = { MongoDbContainer };
